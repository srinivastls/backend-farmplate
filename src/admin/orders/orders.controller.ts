import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
} from '@nestjs/common';

import { AdminOrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller({
  path: 'admin/orders',
  version: '1',
})
export class AdminOrdersController {
  constructor(
    private readonly ordersService: AdminOrdersService,
  ) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(
      id,
      dto,
    );
  }
}