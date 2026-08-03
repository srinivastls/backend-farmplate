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

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

@Get()
findAll(
  @Query('page') page = '1',
  @Query('limit') limit = '20',
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
}