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

import { AddressService } from './address.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'addresses',
  version: '1',
})
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
  ) {}

  @Get()
  getAddresses(
    @CurrentUser() user: any,
  ) {
    return this.addressService.getAddresses(
      user.id,
    );
  }

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() dto: CreateAddressDto,
  ) {
    return this.addressService.create(
      user.id,
      dto,
    );
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressService.update(
      user.id,
      id,
      dto,
    );
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.addressService.remove(
      user.id,
      id,
    );
  }
}