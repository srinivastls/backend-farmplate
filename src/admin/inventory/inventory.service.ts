import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class InventoryService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getInventory() {

    const products =
        await this.prisma.product.findMany({

      include: {

        category: true,

        farm: true,

      },

      orderBy: {

        name: 'asc',

      },
    });

    return {

      success: true,

      data: products,

    };
  }

  async updateStock(
    id: string,
    dto: UpdateStockDto,
  ) {

    const product =
        await this.prisma.product.findUnique({

      where: {

        id,

      },
    });

    if (!product) {

      throw new NotFoundException(
        'Product not found',
      );

    }

    const updated =
        await this.prisma.product.update({

      where: {

        id,

      },

      data: {

        quantity: dto.quantity,

      },
    });

    return {

      success: true,

      message:
          'Stock updated successfully',

      data: updated,

    };
  }

  async lowStock() {

    const products =
        await this.prisma.product.findMany({

      where: {

        quantity: {

          lte: 10,

        },
      },

      include: {

        category: true,

        farm: true,

      },
    });

    return {

      success: true,

      data: products,

    };
  }
}