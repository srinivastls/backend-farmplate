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
          farm: {
            include: {
              farmer: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  },
}
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
){

//   const payment =
//   await this.prisma.payment.findUnique({
//     where: {
//       razorpayPaymentId: paymentId,
//     },
//   });

// if (!payment) {
//   throw new BadRequestException(
//     'Payment not found',
//   );
// }

// if (payment.status !== 'SUCCESS') {
//   throw new BadRequestException(
//     'Payment not completed',
//   );
// }

  return this.prisma.$transaction(async (tx) => {

    //---------------------------------
    // Get Cart
    //---------------------------------

    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException(
        "Cart is empty",
      );
    }

    //---------------------------------
    // Check Inventory
    //---------------------------------

    for (const item of cart.items) {

      const product =
          await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) {
        throw new NotFoundException(
          `${item.productName} not found`,
        );
      }

      if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Only ${product.quantity} ${product.unit} of ${product.name} available.`,
        );
      }
    }

    //---------------------------------
    // Reduce Inventory
    //---------------------------------

    for (const item of cart.items) {

      await tx.product.update({

        where: {
          id: item.productId,
        },

        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    //---------------------------------
    // Calculate Total
    //---------------------------------

    const subtotal = cart.items.reduce(
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

    //---------------------------------
    // Create Order
    //---------------------------------

    const order =
        await tx.order.create({

      data: {

        userId,

        status: "PENDING",

        paymentStatus: "SUCCESS",

        


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

    //---------------------------------
    // Clear Cart
    //---------------------------------

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return {
      success: true,
      data: order,
    };

  });

}
  
}