import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getDashboard() {

  const [
    products,
    customers,
    orders,
    revenue,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    recentCustomers,
  ] = await Promise.all([

    // Counts

    this.prisma.product.count(),

    this.prisma.user.count({
      where:{
        role:"CUSTOMER"
      }
    }),

    this.prisma.order.count(),

    this.prisma.order.aggregate({
      _sum:{
        total:true
      }
    }),

    this.prisma.order.count({
      where:{
        status:"PENDING"
      }
    }),

    this.prisma.product.findMany({
      where:{
        quantity:{
          lte:10
        }
      },
      take:5
    }),

    this.prisma.order.findMany({
      take:5,
      orderBy:{
        createdAt:"desc"
      },
      include:{
        user:true
      }
    }),

    this.prisma.user.findMany({
      where:{
        role:"CUSTOMER"
      },
      take:5,
      orderBy:{
        createdAt:"desc"
      }
    }),

  ]);

  return {
    success:true,

    data:{
      summary:{
        revenue: revenue._sum.total ?? 0,
        orders,
        customers,
        products,
        pendingOrders,
        lowStock: lowStockProducts.length,
      },

      recentOrders,

      recentCustomers,

      lowStockProducts,

      topProducts:[],
    }
  };

}
}