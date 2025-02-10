import { Module } from '@nestjs/common';
import { PaymentConfigService } from './payment-config.service';
import { PaymentConfigController } from './payment-config.controller';
import { PaymentConfigModel } from '../models';

@Module({
  providers: [PaymentConfigService, PaymentConfigModel],
  controllers: [PaymentConfigController],
  exports: [PaymentConfigService], // Exporting to make it available to other modules
})
export class PaymentConfigModule {}
