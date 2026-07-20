import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminOrderService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getOrders(
    page = 1,
    limit = 10,
    search = '',
    status = '',
  ) {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const where: any = {};

    // -----------------------------
    // Search
    // -----------------------------

    if (search.trim()) {
      where.OR = [
        {
          id: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          shippingName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          shippingPhone: {
            contains: search,
          },
        },
      ];
    }

    // -----------------------------
    // Status Filter
    // -----------------------------

    if (
      status &&
      Object.values(OrderStatus).includes(
        status as OrderStatus,
      )
    ) {
      where.orderStatus = status;
    }

    // -----------------------------
    // Total Count
    // -----------------------------

    const totalOrders =
      await this.prisma.order.count({
        where,
      });

    // -----------------------------
    // Orders
    // -----------------------------

    const orders =
      await this.prisma.order.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        select: {
          id: true,

          shippingName: true,

          shippingPhone: true,

          totalAmount: true,

          paymentStatus: true,

          orderStatus: true,

          createdAt: true,

          items: {
            select: {
              quantity: true,

              variant: {
                select: {
                  size: true,

                  color: {
                    select: {
                      color: true,
                      imageUrl: true,
                    },
                  },

                  product: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

    return {
      success: true,

      orders,

      pagination: {
        page,

        limit,

        totalOrders,

        totalPages: Math.ceil(
          totalOrders / limit,
        ),

        hasNext:
          page <
          Math.ceil(totalOrders / limit),

        hasPrevious: page > 1,
      },
    };
  }
  async getOrderById(id: string) {
  const order = await this.prisma.order.findUnique({
    where: {
      id,
    },

    include: {
      payment: true,

      items: {
        include: {
          variant: {
            include: {
              color: true,

              product: true,
            },
          },
        },
      },

      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    throw new BadRequestException(
      'Order not found.',
    );
  }

  return {
    success: true,
    order,
  };
}

async updateOrderStatus(
  id: string,
  status: OrderStatus,
) {
  const order =
    await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

  if (!order) {
    throw new BadRequestException(
      'Order not found.',
    );
  }

  // -----------------------------
  // Validate Status
  // -----------------------------

  if (
    !Object.values(OrderStatus).includes(status)
  ) {
    throw new BadRequestException(
      'Invalid order status.',
    );
  }

  // -----------------------------
  // Prevent Updating Delivered
  // -----------------------------

  if (
    order.orderStatus === 'DELIVERED'
  ) {
    throw new BadRequestException(
      'Delivered orders cannot be updated.',
    );
  }

  // -----------------------------
  // Update
  // -----------------------------

  const updatedOrder =
    await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        orderStatus: status,
      },
    });

  return {
    success: true,
    message: 'Order status updated successfully.',
    order: updatedOrder,
  };
}

}

  