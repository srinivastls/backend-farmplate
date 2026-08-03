import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';

import { ProductsModule } from '../../products/products.module';

import { AdminProductsController } from './products.controller';
import { AdminProductsService } from './products.service';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
  ],

  controllers: [
    AdminProductsController,
  ],

  providers: [
    AdminProductsService,
  ],
})
export class AdminProductsModule {}