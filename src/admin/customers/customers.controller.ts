import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { CustomersService } from './customers.service';

@Controller({
  path: 'admin/customers',
  version: '1',
})
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
  ) {}

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.customersService.findOne(id);
  }
}