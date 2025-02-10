import { v4 as uuidv4 } from 'uuid';
import { IPayment, PaymentStatus } from '../interfaces';

export class PaymentsModel {
  private payments: Map<string, IPayment> = new Map<string, IPayment>();

  async create(data: IPayment): Promise<string> {
    const id = uuidv4();
    const { shopId, amount, status, availableAmount, blockedAmount } = data;

    this.payments.set(id, {
      id,
      shopId,
      amount,
      status,
      availableAmount,
      blockedAmount,
    });

    return id;
  }

  async getById(id: string) {
    return this.payments.get(id);
  }

  async updatePaymentStatus(paymentIds: string[], status: PaymentStatus) {
    paymentIds.forEach(async (id) => {
      const payment = await this.getById(id);
      if (payment) {
        payment.status = status;
        if (status === PaymentStatus.Completed) {
          payment.availableAmount += payment.blockedAmount;
        }
      }
    });

    return paymentIds;
  }

  async getPaymentsByShop(shopId: string, status: PaymentStatus) {
    return [...this.payments.values()].filter(
      (payment) => payment.shopId === shopId && payment.status === status
    );
  }
}
