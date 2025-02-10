import { Controller, Post, Body, Patch } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { PaymentStatus } from '../interfaces';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Body() body: { shopId: string; amount: number }) {
    const paymentId = await this.paymentsService.createPayment(
      body.shopId,
      body.amount
    );
    return { paymentId };
  }

  @Patch('process')
  processPayments(@Body() body: { paymentIds: string[] }) {
    this.paymentsService.updatePaymentStatus(
      body.paymentIds,
      PaymentStatus.Processed
    );
    return { message: 'Payments processed' };
  }

  @Patch('complete')
  completePayments(@Body() body: { paymentIds: string[] }) {
    this.paymentsService.updatePaymentStatus(
      body.paymentIds,
      PaymentStatus.Completed
    );
    return { message: 'Payments completed' };
  }

  @Patch('pay')
  payPayments(@Body() body: { shopId: string }) {
    return this.paymentsService.payPayments(body.shopId);
  }
}
