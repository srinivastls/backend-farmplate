import { Body, Controller, Post } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller({
    path: 'payments',
    version: '1',
})
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post('create-order')
  createOrder(
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.createOrder(
      dto.amount,
    );
  }

  @Post('verify')
verifyPayment(
  @Body() dto: VerifyPaymentDto,
) {
  return this.paymentsService.verifyPayment(
    dto.razorpayOrderId,
    dto.razorpayPaymentId,
    dto.razorpaySignature,
  );
}
}