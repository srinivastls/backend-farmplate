import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
} from '@nestjs/common';

import { InventoryService } from './inventory.service';

import { UpdateStockDto } from './dto/update-stock.dto';

@Controller({
  path: 'admin/inventory',
  version: '1',
})
export class InventoryController {

  constructor(
    private readonly inventoryService: InventoryService,
  ) {}

  @Get()
  getInventory() {
    return this.inventoryService.getInventory();
  }

  @Get('low-stock')
  lowStock() {
    return this.inventoryService.lowStock();
  }

  @Patch(':id')
  updateStock(
    @Param('id') id: string,
    @Body() dto: UpdateStockDto,
  ) {
    return this.inventoryService.updateStock(
      id,
      dto,
    );
  }
}