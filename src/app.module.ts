import { Module } from '@nestjs/common';
import { PaymentConfigModule } from './payment-config/payment-config.module';
import { ShopsModule } from './shops/shops.module';
import { PaymentsModule } from './payment/payment.module';

@Module({
  imports: [PaymentConfigModule, ShopsModule, PaymentsModule],
})
export class AppModule {}
