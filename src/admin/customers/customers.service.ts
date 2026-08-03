import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {

      const customers = await this.prisma.user.findMany({
  where: {
    role: 'CUSTOMER',
  },
  include: {
    orders: true,
    addresses: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
});

const data = customers.map((customer) => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  phone: null,
  totalOrders: customer.orders.length,
  totalSpent: customer.orders.reduce(
    (sum, order) => sum + order.total,
    0,
  ),
  totalSaved: 0,
  favoriteFarm: null,
}));

return {
  success: true,
  data,
};
  }

  async findOne(id: string) {

    const customer =
      await this.prisma.user.findUnique({

        where: {
          id,
        },

        include: {

          orders: {
            include: {
              items: true,
            },
          },

          addresses: true,

          cart: true,

          favorites: true,

        },
      });

    if (!customer) {

      throw new NotFoundException(
        'Customer not found',
      );

    }

    return {
      success: true,
      data: customer,
    };
  }
}