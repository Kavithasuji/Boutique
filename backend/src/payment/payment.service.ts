


import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import * as crypto from 'crypto';

import { VerifyPaymentDto } from './dto/verify-payment.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { CheckoutService } from 'src/checkout/checkout.service';

import Razorpay from 'razorpay';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(
    private readonly prisma: PrismaService,
    private readonly checkoutService: CheckoutService,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }


async createOrder(userId: string) {
  const checkout = await this.checkoutService.getSummary(userId);

  if (!checkout.items.length) {
    throw new BadRequestException("Cart is empty.");
  }

  if (!checkout.address) {
    throw new BadRequestException(
      "Please add a delivery address.",
    );
  }

  const amount = Number(checkout.total);

  const razorpayOrder = await this.razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  // Remove any unfinished session for this user
  await this.prisma.paymentSession.deleteMany({
    where: {
      userId,
      status: "CREATED",
    },
  });

  // Save checkout snapshot
  await this.prisma.paymentSession.create({
    data: {
      userId,
      razorpayOrderId: razorpayOrder.id,
      amount: checkout.total,
      checkoutData: checkout,
      status: "CREATED",
    },
  });

  return {
    key: process.env.RAZORPAY_KEY_ID,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  };
}

private async getPaymentSession(
  razorpayOrderId: string,
) {
  const session =
    await this.prisma.paymentSession.findUnique({
      where: {
        razorpayOrderId,
      },
    });

  if (!session) {
    throw new BadRequestException(
      "Payment session not found.",
    );
  }

  return session;
}

private async processCapturedPayment(
  session: any,
  razorpayPayment: any,
) {
  // -------------------------
  // Already Processed
  // -------------------------

  if (session.status === "PROCESSED") {
    const existingPayment =
      await this.prisma.payment.findFirst({
        where: {
          transactionId: razorpayPayment.id,
        },
      });

    return {
      success: true,
      orderId: existingPayment?.orderId,
    };
  }

  // -------------------------
  // Already Processing
  // -------------------------

  if (session.status === "PROCESSING") {
    return {
      success: true,
      message: "Payment is already being processed.",
    };
  }

  // -------------------------
  // Failed Earlier
  // -------------------------

  if (session.status === "FAILED") {
    throw new BadRequestException(
      "Payment processing previously failed.",
    );
  }

  // -------------------------
  // Checkout Snapshot
  // -------------------------

  const checkout: any = session.checkoutData;

  if (!checkout.address) {
    throw new BadRequestException(
      "Delivery address not found.",
    );
  }

  if (!checkout.items.length) {
    throw new BadRequestException(
      "Cart is empty.",
    );
  }

  const address = checkout.address;

  // -------------------------
  // Validate Inventory
  // -------------------------

  for (const item of checkout.items) {
    const inventory =
      await this.prisma.inventory.findUnique({
        where: {
          variantId: item.variantId,
        },
      });

    if (!inventory) {
      throw new BadRequestException(
        `Inventory not found for ${item.variant.product.name}`,
      );
    }

    if (inventory.stock < item.quantity) {
      throw new BadRequestException(
        `${item.variant.product.name} is out of stock.`,
      );
    }
  }

  // -------------------------
  // Mark as PROCESSING
  // -------------------------

  const updated =
    await this.prisma.paymentSession.updateMany({
      where: {
        id: session.id,
        status: "CREATED",
      },
      data: {
        status: "PROCESSING",
      },
    });

  if (updated.count === 0) {
    throw new BadRequestException(
      "Payment session is already being processed.",
    );
  }

  try {

    const order =
      await this.prisma.$transaction(async (tx) => {

        // -------------------------
        // Create Order
        // -------------------------

        const createdOrder =
          await tx.order.create({
            data: {
              userId: session.userId,

              shippingName: address.fullName,
              shippingPhone: address.phone,

              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,

              city: address.city,
              state: address.state,
              country: address.country,
              postalCode: address.postalCode,

              totalAmount: checkout.total,

              orderStatus: "PENDING",
              paymentStatus: "PAID",
            },
          });

        // -------------------------
        // Order Items
        // -------------------------

        for (const item of checkout.items) {

          const price = Number(
            item.variant.product.discountPrice ??
            item.variant.product.price,
          );

          await tx.orderItem.create({
            data: {
              orderId: createdOrder.id,
              variantId: item.variantId,
              quantity: item.quantity,
              price,
            },
          });

          await tx.inventory.update({
            where: {
              variantId: item.variantId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // -------------------------
        // Payment
        // -------------------------

        await tx.payment.create({
          data: {
            orderId: createdOrder.id,
            transactionId: razorpayPayment.id,
            paymentMethod: razorpayPayment.method,
            amount: checkout.total,
            paymentStatus: "PAID",
          },
        });

        // -------------------------
        // Clear Cart
        // -------------------------

        await tx.cart.deleteMany({
          where: {
            userId: session.userId,
          },
        });

        // -------------------------
        // Payment Session
        // -------------------------

        await tx.paymentSession.update({
          where: {
            id: session.id,
          },
          data: {
            status: "PROCESSED",
          },
        });

        return createdOrder;
      });

    return {
      success: true,
      orderId: order.id,
    };

  } catch (error) {

    const latestSession =
      await this.prisma.paymentSession.findUnique({
        where: {
          id: session.id,
        },
      });

    if (latestSession?.status !== "PROCESSED") {
      await this.prisma.paymentSession.update({
        where: {
          id: session.id,
        },
        data: {
          status: "FAILED",
        },
      });
    }

    throw error;
  }
}
async verifyPayment(
  userId: string,
  dto: VerifyPaymentDto,
) {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  } = dto;

  // -----------------------------
  // Verify Signature
  // -----------------------------


  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET!,
    )
    .update(
      `${razorpay_order_id}|${razorpay_payment_id}`,
    )
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new UnauthorizedException(
      "Invalid payment signature.",
    );
  }

  // -----------------------------
  // Fetch Razorpay Payment
  // -----------------------------

  const razorpayPayment =
    await this.razorpay.payments.fetch(
      razorpay_payment_id,
    );

  if (razorpayPayment.status !== "captured") {
    throw new BadRequestException(
      "Payment not captured.",
    );
  }

  // -----------------------------
  // Get Payment Session
  // -----------------------------

  const session =
    await this.getPaymentSession(
      razorpay_order_id,
    );

  // Security check
  if (session.userId !== userId) {
    throw new UnauthorizedException(
      "Unauthorized payment session.",
    );
  }

  // -----------------------------
  // Process Payment
  // -----------------------------

  return this.processCapturedPayment(
    session,
    razorpayPayment,
  );
}
// async verifyPayment(
//   userId: string,
//   dto: VerifyPaymentDto,
// ) {
//   const {
//     razorpay_payment_id,
//     razorpay_order_id,
//     razorpay_signature,
//   } = dto;

//   // -----------------------------
//   // Verify Razorpay Signature
//   // -----------------------------
//   const expectedSignature = crypto
//     .createHmac(
//       "sha256",
//       process.env.RAZORPAY_KEY_SECRET!,
//     )
//     .update(
//       `${razorpay_order_id}|${razorpay_payment_id}`,
//     )
//     .digest("hex");

//   if (expectedSignature !== razorpay_signature) {
//     throw new UnauthorizedException(
//       "Invalid payment signature.",
//     );
//   }

//   // -----------------------------
//   // Fetch Payment
//   // -----------------------------
//   const razorpayPayment =
//     await this.razorpay.payments.fetch(
//       razorpay_payment_id,
//     );

//   if (razorpayPayment.status !== "captured") {
//     throw new BadRequestException(
//       "Payment not captured.",
//     );
//   }

//   // -----------------------------
//   // Prevent Duplicate Payment
//   // -----------------------------
//   const existingPayment =
//     await this.prisma.payment.findFirst({
//       where: {
//         transactionId: razorpay_payment_id,
//       },
//     });

//   if (existingPayment) {
//     throw new BadRequestException(
//       "Payment already verified."
//     );
//   }

//   // -----------------------------
//   // Checkout Summary
//   // -----------------------------
//   const checkout =
//     await this.checkoutService.getSummary(userId);

//   if (!checkout.address) {
//     throw new BadRequestException(
//       "Delivery address not found."
//     );
//   }

//   if (!checkout.items.length) {
//     throw new BadRequestException(
//       "Cart is empty."
//     );
//   }

//   const address = checkout.address;

//   // -----------------------------
//   // Database Transaction
//   // -----------------------------
//   const order =
//     await this.prisma.$transaction(
//       async (tx) => {

//         // Validate Inventory
//         for (const item of checkout.items) {

//           const inventory =
//             await tx.inventory.findUnique({
//               where: {
//                 variantId: item.variantId,
//               },
//             });

//           if (!inventory) {
//             throw new BadRequestException(
//               `Inventory not found for ${item.variant.product.name}`
//             );
//           }

//           if (
//             inventory.stock <
//             item.quantity
//           ) {
//             throw new BadRequestException(
//               `${item.variant.product.name} is out of stock.`
//             );
//           }
//         }

//         // -----------------
//         // Create Order
//         // -----------------

//         const createdOrder =
//           await tx.order.create({
//             data: {

//               userId,

//               shippingName:
//                 address.fullName,

//               shippingPhone:
//                 address.phone,

//               addressLine1:
//                 address.addressLine1,

//               addressLine2:
//                 address.addressLine2,

//               city: address.city,

//               state: address.state,

//               country: address.country,

//               postalCode:
//                 address.postalCode,

//               totalAmount:
//                 checkout.total,

//               orderStatus:
//                 "PENDING",

//               paymentStatus:
//                 "PAID",
//             },
//           });

//         // -----------------
//         // Order Items
//         // -----------------

//         for (const item of checkout.items) {

//           const price = Number(
//             item.variant.product.discountPrice ??
//             item.variant.product.price
//           );

//           await tx.orderItem.create({
//             data: {

//               orderId:
//                 createdOrder.id,

//               variantId:
//                 item.variantId,

//               quantity:
//                 item.quantity,

//               price,
//             },
//           });

//           // -----------------
//           // Reduce Inventory
//           // -----------------

//           await tx.inventory.update({
//             where: {
//               variantId:
//                 item.variantId,
//             },
//             data: {
//               stock: {
//                 decrement:
//                   item.quantity,
//               },
//             },
//           });
//         }

//         // -----------------
//         // Payment
//         // -----------------

//         await tx.payment.create({
//           data: {

//             orderId:
//               createdOrder.id,

//             transactionId:
//               razorpay_payment_id,

//             paymentMethod:
//               razorpayPayment.method,

//             amount:
//               checkout.total,

//             paymentStatus:
//               "PAID",
//           },
//         });

//         // -----------------
//         // Clear Purchased Cart
//         // -----------------

//         await tx.cart.deleteMany({
//           where: {
//             userId,
//           },
//         });

//         return createdOrder;
//       },
//     );

//   return {
//     success: true,
//     message:
//       "Payment verified successfully.",
//     orderId: order.id,
//   };
// }

async handleWebhook(
  rawBody: Buffer,
  signature: string,
) {
  // -----------------------------
  // Verify Webhook Signature
  // -----------------------------

  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_WEBHOOK_SECRET!,
    )
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new UnauthorizedException(
      "Invalid webhook signature.",
    );
  }

  const payload = JSON.parse(rawBody.toString());

  // -----------------------------
  // Handle only captured payments
  // -----------------------------

  if (payload.event !== "payment.captured") {
    return {
      received: true,
    };
  }

  const payment = payload.payload.payment.entity;

  const session =
    await this.prisma.paymentSession.findUnique({
      where: {
        razorpayOrderId: payment.order_id,
      },
    });

  if (!session) {
    return {
      received: true,
    };
  }

  await this.processCapturedPayment(
    session,
    payment,
  );

  return {
    received: true,
  };
}
}