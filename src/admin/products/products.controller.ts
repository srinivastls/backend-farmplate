import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { AdminProductsService } from './products.service';

import { CreateProductDto } from '../../products/dto/create-product.dto';
import { UpdateProductDto } from '../../products/dto/update-product.dto';

@Controller({
  path: 'admin/products',
  version: '1',
})
export class AdminProductsController {
  constructor(
    private readonly productsService: AdminProductsService,
  ) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('organic') organic?: string,
  ) {
    return this.productsService.findAll({
      page: Number(page),
      limit: Number(limit),
      search,
      category,
      organic,
    });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.productsService.remove(id);
  }
}