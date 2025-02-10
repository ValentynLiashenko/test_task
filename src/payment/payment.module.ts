import { Module } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { PaymentsController } from './payment.controller';
import { PaymentConfigModule } from '../payment-config/payment-config.module';
import { ShopsModule } from '../shops/shops.module';
import { PaymentsModel } from '../models';

@Module({
  imports: [PaymentConfigModule, ShopsModule],
  providers: [PaymentsService, PaymentsModel],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
