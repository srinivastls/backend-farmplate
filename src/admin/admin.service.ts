import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';

import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly products: ProductsService,
  ) {}

  //-------------------------
  // Dashboard
  //-------------------------

  async dashboard() {
    const products =
      await this.prisma.product.count();

    const orders =
      await this.prisma.order.count();

    const customers =
      await this.prisma.user.count({
        where: {
          role: 'CUSTOMER',
        },
      });

    const revenue =
      await this.prisma.order.aggregate({
        _sum: {
          total: true,
        },
      });

    return {
      success: true,

      data: {
        products,
        orders,
        customers,
        revenue:
            revenue._sum.total ?? 0,
      },
    };
  }

  //-------------------------
  // Products
  //-------------------------

  async getProducts() {
    return this.products.findAll({
      page: 1,
      limit: 100,
    });
  }

  async getProduct(id: string) {
    return this.products.findOne(id);
  }

  async createProduct(
    dto: CreateProductDto,
  ) {
    return this.products.create(dto);
  }

  async updateProduct(
    id: string,
    dto: UpdateProductDto,
  ) {
    return this.products.update(
      id,
      dto,
    );
  }

  async deleteProduct(id: string) {
    return this.products.remove(id);
  }
}