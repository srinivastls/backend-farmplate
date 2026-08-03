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


async findAll(filters: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  organic?: string;
}) {

  const where: any = {};

  //----------------------------------
  // Search
  //----------------------------------

  if (filters.search?.trim()) {
    where.OR = [
      {
        name: {
          contains: filters.search,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: filters.search,
          mode: 'insensitive',
        },
      },
    ];
  }

  //----------------------------------
  // Category
  //----------------------------------

  if (filters.category?.trim()) {
    where.category = {
      name: {
        equals: filters.category,
        mode: 'insensitive',
      },
    };
  }

  //----------------------------------
  // Organic
  //----------------------------------

  if (filters.organic != null) {
    where.organic =
        filters.organic == "true";
  }

  return this.prisma.product.findMany({
    where,

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

    orderBy: {
      createdAt: "desc",
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