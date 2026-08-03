import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CheckoutDto } from './dto/checkout.dto';

import {
  OrderStatus,
  PaymentStatus,
} from '@prisma/client';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async checkout(
    userId: string,
    dto: CheckoutDto,
  ) {
    // Validate Address

    const address =
      await this.prisma.address.findFirst({
        where: {
          id: dto.addressId,
          userId,
        },
      });

    if (!address) {
      throw new NotFoundException(
        'Address not found',
      );
    }

    // Get Cart

    const cart =
      await this.prisma.cart.findUnique({
        where: {
          userId,
        },
        include: {
          items: true,
        },
      });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException(
        'Cart is empty',
      );
    }

    // Calculate totals

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

    // Create Order

    const order =
      await this.prisma.order.create({
        data: {
          userId,

          status: OrderStatus.PENDING,

          paymentStatus:
              PaymentStatus.PENDING,


          subtotal,

          deliveryFee,

          platformFee,

          total,
          customerName: address.name,
          phone: address.phone,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,

          items: {
            create:
              cart.items.map((item) => ({
                productId: item.productId,

                productName:
                    item.productName,

                unit: item.unit,

                price: item.price,

                quantity: item.quantity,
              })),
          },
        },

        include: {
          items: true,
        },
      });

    // Clear Cart

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return {
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order.id,
        subtotal,
        deliveryFee,
        platformFee,
        total,
      },
    };
  }
}