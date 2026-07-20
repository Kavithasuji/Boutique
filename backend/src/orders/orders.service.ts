import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: 'desc',
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
      },
    });
  }
}