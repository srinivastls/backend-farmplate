import { Module } from '@nestjs/common';

import { DashboardModule } from './dashboard/dashboard.module';
import { AdminProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { AdminOrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { CategoriesModule } from './categories/categories.module';
import { FarmsModule } from './farms/farms.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    DashboardModule,
    AdminProductsModule,
    InventoryModule,
    AdminOrdersModule,
    CustomersModule,
    CategoriesModule,
    FarmsModule,
    AnalyticsModule,
  ],
})
export class AdminModule {}