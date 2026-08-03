import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getFavorites(userId: string) {
    const favorites =
        await this.prisma.favorite.findMany({
      where: {
        userId,
      },

      include: {
        product: {
          include: {
            farm: true,
            category: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: favorites,
    };
  }

  async add(
    userId: string,
    productId: string,
  ) {
    const exists =
        await this.prisma.favorite.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (exists) {
      throw new BadRequestException(
        "Already added",
      );
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async remove(
    userId: string,
    id: string,
  ) {
    await this.prisma.favorite.deleteMany({
      where: {
        id,
        userId,
      },
    });

    return {
      success: true,
    };
  }
}