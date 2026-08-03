import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Get()
  getOrders(
    @CurrentUser() user: any,
  ) {
    return this.ordersService.getOrders(user.id);
  }

  @Get(':id')
  getOrder(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.ordersService.getOrder(
      user.id,
      id,
    );
  }
}