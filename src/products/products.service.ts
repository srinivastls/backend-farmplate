import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateProductDto) {

    return this.prisma.product.create({

      data: {

        ...dto,

        lotId: crypto.randomUUID(),

        harvestTime: new Date(dto.harvestTime),

      },

    });

  }

  async findAll() {

    return this.prisma.product.findMany({

      include: {

        farm: true,

        category: true,

      },

    });

  }

  async findOne(id: string) {

    const product =
        await this.prisma.product.findUnique({

      where: {

        id,

      },

      include: {

        farm: true,

        category: true,

        traceEvents: true,

      },

    });

    if (!product) {

      throw new NotFoundException(
        'Product not found',
      );

    }

    return product;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
  ) {

    return this.prisma.product.update({

      where: {

        id,

      },

      data: dto,

    });

  }

  async remove(id: string) {

    return this.prisma.product.delete({

      where: {

        id,

      },

    });

  }

}