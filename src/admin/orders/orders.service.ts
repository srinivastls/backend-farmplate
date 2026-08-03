import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class AdminOrdersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    const orders = await this.prisma.order.findMany({
      include: {
        user: true,
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: orders,
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    return {
      success: true,
      data: order,
    };
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    const updated =
        await this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });

    return {
      success: true,
      message: 'Order updated successfully',
      data: updated,
    };
  }
}