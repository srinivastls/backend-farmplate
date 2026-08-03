import { Injectable } from '@nestjs/common';

import { ProductsService } from '../../products/products.service';

import { CreateProductDto } from '../../products/dto/create-product.dto';
import { UpdateProductDto } from '../../products/dto/update-product.dto';

@Injectable()
export class AdminProductsService {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  async findAll(filters: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    organic?: string;
  }) {
    return this.productsService.findAll(filters);
  }

  async findOne(id: string) {
    return this.productsService.findOne(id);
  }

  async create(dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  async update(
    id: string,
    dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  async remove(id: string) {
    return this.productsService.remove(id);
  }
}