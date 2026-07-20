import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getSummary(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new BadRequestException("User not found.");
    }

    // Default Address
    const address = await this.prisma.address.findFirst({
      where: {
        userId,
        isDefault: true,
      },
    });

    // Cart
    const cart = await this.prisma.cart.findMany({
      where: {
        userId,
      },
      include: {
        variant: {
          include: {
            color: true,
            inventory: true,
            product: true,
          },
        },
      },
    });

    let subtotal = 0;

    cart.forEach((item) => {
      const price = Number(
        item.variant.product.discountPrice ??
          item.variant.product.price,
      );

      subtotal += price * item.quantity;
    });

    return {
      customer: user,

      address,

      items: cart,

      subtotal,

      shipping: 0,

      total: subtotal,
    };
  }
}