import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getHomeData() {

    const banners = await this.prisma.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        priority: 'asc',
      },
    });

    const categories =
        await this.prisma.category.findMany({

      include: {

        products: {
          take: 5,
        },

      },

    });

    const nearbyFarms =
        await this.prisma.farm.findMany({

      include: {

        farmer: {

          include: {

            user: true,

          },

        },

        products: {

          take: 6,

        },

      },

      take: 5,

    });

    const freshProducts =
        await this.prisma.product.findMany({

      orderBy: {

        harvestTime: 'desc',

      },

      include: {

        farm: {

          include: {

            farmer: {

              include: {

                user: true,

              },

            },

          },

        },

        category: true,

      },

      take: 10,

    });

    const featuredProducts =
        await this.prisma.product.findMany({

      where: {

        organic: true,

      },

      include: {

        farm: {

          include: {

            farmer: {

              include: {

                user: true,

              },

            },

          },

        },

        category: true,

      },

      take: 10,

    });

    return {

      success: true,

      data: {

        banners,

        categories,

        nearbyFarms,

        freshProducts,

        featuredProducts,

      },

    };
  }
}