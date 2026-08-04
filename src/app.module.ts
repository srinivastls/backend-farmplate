import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FarmersModule } from './farmers/farmers.module';
import { FarmsModule } from './farms/farms.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { TraceModule } from './trace/trace.module';
import { ImpactModule } from './impact/impact.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import {FavoritesModule} from './favorites/favorites.module';

import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
import { ConfigModule } from '@nestjs/config';
import { CheckoutModule } from './checkout/checkout.module';
import { AddressModule } from './address/address.module';
import { AdminModule } from './admin/admin.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule, UsersModule, FarmersModule, FarmsModule, ProductsModule, CartModule, OrdersModule, TraceModule, ImpactModule, NotificationsModule, PaymentsModule, PrismaModule, HomeModule, CheckoutModule, AddressModule, AdminModule, InvoiceModule, FavoritesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
