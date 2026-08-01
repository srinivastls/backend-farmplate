import {
  IsEnum,
  IsString,
} from 'class-validator';

import { PaymentMethod } from '@prisma/client';

export class CheckoutDto {
  @IsString()
  addressId!: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;
}