import { Injectable } from '@nestjs/common';
import { PaymentConfigModel } from '../models';

@Injectable()
export class PaymentConfigService {
  constructor(private readonly paymentConfigModel: PaymentConfigModel) {}

  setConfig(
    commissionA: number,
    commissionB: number,
    blockPercentageD: number
  ) {
    this.paymentConfigModel.create(commissionA, commissionB, blockPercentageD);
  }

  getConfig() {
    return this.paymentConfigModel.get();
  }
}
