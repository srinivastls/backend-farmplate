import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { TraceService } from './trace.service';
import { CreateTraceDto } from './dto/create-trace.dto';
import path from 'path';

@Controller({
  path: 'trace',
  version: '1',
})
export class TraceController {

  constructor(
    private readonly traceService: TraceService,
  ) {}

  @Post()
create(
  @Body() dto: CreateTraceDto,
) {
  return this.traceService.create(dto);
}

@Get('lot/:lotId')
timeline(
  @Param('lotId') lotId: string,
) {
  return this.traceService.getTimeline(lotId);
}

@Get('product/:productId')
getTrace(
  @Param('productId') productId: string,
) {
  return this.traceService.getTrace(productId);
}


}