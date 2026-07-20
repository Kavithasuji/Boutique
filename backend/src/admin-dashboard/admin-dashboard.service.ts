import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getDashboard() {
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
        const [
      revenueResult,
      totalOrders,
      totalCustomers,
      totalProducts,
      inventories,
      recentOrders,
      categories,
      sales,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
    ] = await this.prisma.$transaction([

      this.prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          paymentStatus: 'PAID',
        },
      }),

      this.prisma.order.count(),

      this.prisma.user.count({
        where: {
          role: 'CUSTOMER',
        },
      }),

      this.prisma.product.count({
        where: {
          isActive: true,
        },
      }),

      this.prisma.inventory.findMany(),

      this.prisma.order.findMany({
        take: 5,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          user: {
            select: {
              name: true,
            },
          },

          items: true,
        },
      }),

      this.prisma.category.findMany({
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      }),

      this.prisma.order.findMany({
        where: {
          paymentStatus: 'PAID',

          createdAt: {
            gte: sevenDaysAgo,
          },
        },

        select: {
          totalAmount: true,
          createdAt: true,
        },
      }),

      this.prisma.order.count({
        where: {
          orderStatus: 'PENDING',
        },
      }),

      this.prisma.order.count({
        where: {
          orderStatus: 'PROCESSING',
        },
      }),

      this.prisma.order.count({
        where: {
          orderStatus: 'SHIPPED',
        },
      }),

      this.prisma.order.count({
        where: {
          orderStatus: 'DELIVERED',
        },
      }),

      this.prisma.order.count({
        where: {
          orderStatus: 'CANCELLED',
        },
      }),

    ]);
        const topCategories = [...categories]
      .sort(
        (a, b) =>
          b._count.products -
          a._count.products,
      )
      .slice(0, 5);

    const lowStockCount =
      inventories.filter(
        (inventory) =>
          inventory.stock <=
          inventory.lowStockAlert,
      ).length;

    const salesMap = new Map<
      string,
      number
    >();

    for (let i = 0; i < 7; i++) {
      const date = new Date();

      date.setDate(
        date.getDate() - i,
      );

      const key =
        date.toISOString().split('T')[0];

      salesMap.set(key, 0);
    }

    sales.forEach((order) => {
      const key =
        order.createdAt
          .toISOString()
          .split('T')[0];

      salesMap.set(
        key,
        (salesMap.get(key) ?? 0) +
          Number(order.totalAmount),
      );
    });

    const salesOverview =
      Array.from(salesMap.entries())
        .sort(([a], [b]) =>
          a.localeCompare(b),
        )
        .map(([date, revenue]) => ({
          date,
          revenue,
        }));

    const orderStatus = {
      PENDING: pendingOrders,

      PROCESSING:
        processingOrders,

      SHIPPED: shippedOrders,

      DELIVERED:
        deliveredOrders,

      CANCELLED:
        cancelledOrders,
    };
        return {
      success: true,

      stats: {
        revenue: Number(
          revenueResult._sum.amount ?? 0,
        ),

        orders: totalOrders,

        customers:
          totalCustomers,

        products: totalProducts,

        lowStockProducts:
          lowStockCount,
      },

      salesOverview,

      orderStatus,

      topCategories:
        topCategories.map(
          (category) => ({
            id: category.id,

            name: category.name,

            products:
              category._count.products,
          }),
        ),

      recentOrders:
        recentOrders.map(
          (order) => ({
            id: order.id,

            customer:
              order.user.name,

            status:
              order.orderStatus,

            items:
              order.items.length,

            total: Number(
              order.totalAmount,
            ),

            createdAt:
              order.createdAt,
          }),
        ),
    };
  }
}