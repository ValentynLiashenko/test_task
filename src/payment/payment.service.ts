import { Injectable } from '@nestjs/common';
import { PaymentConfigService } from '../payment-config/payment-config.service';
import { ShopsService } from '../shops/shops.service';
import { PaymentsModel } from '../models';
import {
  IHandlePayPaymentReturn,
  IPayment,
  PaymentStatus,
} from '../interfaces';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: PaymentConfigService,
    private readonly shopsService: ShopsService,
    private readonly paymentModel: PaymentsModel
  ) {}

  async createPayment(shopId: string, amount: number): Promise<string> {
    const { commissionA, commissionB, blockPercentageD } =
      await this.configService.getConfig();
    const commission = commissionA + (commissionB / 100) * amount;
    const blockedAmount = (blockPercentageD / 100) * amount;
    const availableAmount = amount - commission - blockedAmount;
    return this.paymentModel.create({
      shopId,
      amount,
      status: PaymentStatus.Pending,
      availableAmount,
      blockedAmount,
    });
  }

  async updatePaymentStatus(paymentIds: string[], status: PaymentStatus) {
    return this.paymentModel.updatePaymentStatus(paymentIds, status);
  }

  async payPayments(shopId: string) {
    const payments = await this.paymentModel.getPaymentsByShop(
      shopId,
      PaymentStatus.Completed
    );
    const totalAvailable: number = payments.reduce(
      (sum, payment) => sum + payment.availableAmount,
      0
    );
    const shop = await this.shopsService.getShop(shopId);
    if (!shop || totalAvailable === 0) {
      return { totalPaid: 0, payments: [] };
    }

    const paidPayments = await this.handlePayPayments(
      totalAvailable,
      payments,
      shopId
    );
    return {
      totalPaid: paidPayments.reduce((sum, p) => sum + p.amount, 0),
      payments: paidPayments,
    };
  }

  async handlePayPayments(
    totalAvailable: number,
    payments: IPayment[],
    shopId: string
  ): Promise<IHandlePayPaymentReturn[]> {
    let balance = totalAvailable;
    const paidPayments = [];
    for (const payment of payments) {
      if (balance >= payment.availableAmount) {
        balance -= payment.availableAmount;
        payment.status = PaymentStatus.Paid;
        paidPayments.push({ id: payment.id, amount: payment.availableAmount });
        this.shopsService.updateBalance(shopId, payment.availableAmount);
      }
    }
    return paidPayments;
  }
}
