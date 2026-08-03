import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getAnalytics() {
    const [
      revenue,
      orders,
      customers,
      products,
      pending,
      delivered,
      cancelled,
      topProducts,
      recentOrders,
    ] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),

      this.prisma.order.count(),

      this.prisma.user.count({
        where: {
          role: 'CUSTOMER',
        },
      }),

      this.prisma.product.count(),

      this.prisma.order.count({
        where: {
          status: 'PENDING',
        },
      }),

      this.prisma.order.count({
        where: {
          status: 'DELIVERED',
        },
      }),

      this.prisma.order.count({
        where: {
          status: 'CANCELLED',
        },
      }),

      this.prisma.product.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.order.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        summary: {
          revenue: revenue._sum.total ?? 0,
          orders,
          customers,
          products,
          pending,
          delivered,
          cancelled,
        },

        // Placeholder chart data
        revenue: [],

        // Placeholder orders trend
        ordersTrend: [],

        // Placeholder farm performance
        farmPerformance: [],

        // Placeholder category performance
        categoryPerformance: [],

        // Product list
        topProducts,

        // Recent orders
        activities: recentOrders,
      },
    };
  }
}