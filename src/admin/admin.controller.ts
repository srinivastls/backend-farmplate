import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Roles('ADMIN')
@Controller({
  path: 'admin',
  version: '1',
})
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  //-------------------------
  // Dashboard
  //-------------------------

  @Get('dashboard')
  dashboard() {
    return this.adminService.dashboard();
  }

  //-------------------------
  // Products
  //-------------------------

  @Get('products')
  getProducts() {
    return this.adminService.getProducts();
  }

  @Get('products/:id')
  getProduct(
    @Param('id') id: string,
  ) {
    return this.adminService.getProduct(id);
  }

  @Post('products')
  createProduct(
    @Body() dto: CreateProductDto,
  ) {
    return this.adminService.createProduct(dto);
  }

  @Patch('products/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.adminService.updateProduct(
      id,
      dto,
    );
  }

  @Delete('products/:id')
  deleteProduct(
    @Param('id') id: string,
  ) {
    return this.adminService.deleteProduct(id);
  }
}