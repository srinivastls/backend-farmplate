import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CheckoutService } from './checkout.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { CheckoutDto } from './dto/checkout.dto';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'checkout',
  version: '1',
})
export class CheckoutController {
  constructor(
    private readonly checkoutService: CheckoutService,
  ) {}

  @Post()
  checkout(
    @CurrentUser() user: any,
    @Body() dto: CheckoutDto,
  ) {
    return this.checkoutService.checkout(
      user.id,
      dto,
    );
  }
}