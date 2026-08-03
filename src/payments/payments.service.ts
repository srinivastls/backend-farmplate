import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly razorpay: Razorpay;

  constructor(
    private readonly config: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.config.get<string>(
        'RAZORPAY_KEY_ID',
      )!,
      key_secret: this.config.get<string>(
        'RAZORPAY_KEY_SECRET',
      )!,
    });
  }
  
async createOrder(amount: number) {
  const order = await this.razorpay.orders.create({
    amount: Math.round(amount * 100), // Convert ₹ to paise
    currency: 'INR',
    receipt: `FP_${Date.now()}`,
  });

  return {
    razorpayOrderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: this.config.get<string>('RAZORPAY_KEY_ID'),
  };
}
async verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
) {
  const generatedSignature = crypto
    .createHmac(
      'sha256',
      this.config.get<string>('RAZORPAY_KEY_SECRET')!,
    )
    .update(
      `${razorpayOrderId}|${razorpayPaymentId}`,
    )
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    throw new Error('Payment verification failed');
  }

  return {
    verified: true,
  };
}
}