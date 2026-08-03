import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { FarmsService } from './farms.service';

import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Controller({
  path: 'admin/farms',
  version: '1',
})
export class FarmsController {
  constructor(
    private readonly farmsService: FarmsService,
  ) {}

  @Get()
  findAll() {
    return this.farmsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.farmsService.findOne(id);
  }

  @Post()
  create(
    @Body() dto: CreateFarmDto,
  ) {
    return this.farmsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFarmDto,
  ) {
    return this.farmsService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.farmsService.remove(id);
  }
}