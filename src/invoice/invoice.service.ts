import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getInvoice(
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
        items: true,
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException(
        "Order not found",
      );
    }

    return {
      success: true,

      data: {

        invoiceNumber:
            "INV-" +
            order.createdAt.getFullYear() +
            "-" +
            order.id.substring(0, 6),

        orderId: order.id,

        date: order.createdAt,

        customer: {
          name: order.customerName,
          phone: order.phone,

          address: `${order.addressLine1 ?? ''} ${order.addressLine2 ?? ''}`.trim(),

          city: order.city,

          state: order.state,

          pincode: order.pincode,
        },

        items: order.items,

        subtotal: order.subtotal,

        deliveryFee: order.deliveryFee,

        platformFee: order.platformFee,

        total: order.total,

        paymentStatus:
            order.paymentStatus,

      },
    };
  }
}