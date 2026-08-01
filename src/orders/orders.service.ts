import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // -------------------------
  // Get All Orders
  // -------------------------
  async getOrder(
  userId: string,
  orderId: string,
) {
  const order =
    await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },

      include: {
        items: {
          include: {
            product: {
              include: {
                farm: true,
              },
            },
          },
        },
      },
    });

  if (!order) {
    throw new NotFoundException(
      "Order not found",
    );
  }

  return {
    success: true,
    data: order,
  };
}

  async getOrders(userId: string) {
    const orders =
      await this.prisma.order.findMany({
        where: {
          userId,
        },

        include: {
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

  async createOrder(
  userId: string,
) {

  const cart =
    await this.prisma.cart.findUnique({
      where: { userId },

      include: {
        items: true,
      },
    });

  if (!cart || cart.items.length == 0) {
    throw new BadRequestException(
      "Cart is empty",
    );
  }

  const subtotal =
      cart.items.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0,
      );

  const deliveryFee = 40;
  const platformFee = 5;

  const total =
      subtotal +
      deliveryFee +
      platformFee;

  const order =
      await this.prisma.order.create({

    data: {

      userId,

      status: "PENDING",

      paymentStatus: "PENDING",

      paymentMethod: "COD",

      subtotal,

      deliveryFee,

      platformFee,

      total,

      items: {

        create: cart.items.map(
          (item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            unit: item.unit,
          }),
        ),
      },
    },

    include: {
      items: true,
    },
  });

  await this.prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  return {
    success: true,
    data: order,
  };
}
  
}