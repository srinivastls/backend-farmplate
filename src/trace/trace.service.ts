import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTraceDto } from './dto/create-trace.dto';

@Injectable()
export class TraceService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateTraceDto) {

    return this.prisma.traceEvent.create({
      data: dto,
    });

  }

  async getTimeline(lotId: string) {

    const product =
      await this.prisma.product.findUnique({

      where: {
        lotId,
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

        traceEvents: {

          orderBy: {

            createdAt: 'asc',

          },

        },

      },

    });

    if (!product) {

      throw new NotFoundException(
        'Product not found',
      );

    }

    return product;

  }

  async getTrace(productId: string) {
  const events =
      await this.prisma.traceEvent.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return {
    success: true,
    data: events,
  };
}

}