import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { InvoiceService } from './invoice.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'invoice',
  version: '1',
})
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
  ) {}

  @Get(':orderId')
  getInvoice(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
  ) {
    return this.invoiceService.getInvoice(
      user.id,
      orderId,
    );
  }
}