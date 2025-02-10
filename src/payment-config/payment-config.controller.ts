import { Controller, Post, Body } from '@nestjs/common';
import { PaymentConfigService } from './payment-config.service';

@Controller('payment-config')
export class PaymentConfigController {
  constructor(private readonly paymentConfigService: PaymentConfigService) {}

  @Post()
  setConfig(
    @Body()
    paymentConfig: {
      commissionA: number;
      commissionB: number;
      blockPercentageD: number;
    }
  ) {
    this.paymentConfigService.setConfig(
      paymentConfig.commissionA,
      paymentConfig.commissionB,
      paymentConfig.blockPercentageD
    );
    return { message: 'Configuration updated successfully' };
  }
}
