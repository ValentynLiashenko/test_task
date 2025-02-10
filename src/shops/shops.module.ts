import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { ShopsModel } from '../models';

@Module({
  providers: [ShopsService, ShopsModel],
  controllers: [ShopsController],
  exports: [ShopsService],
})
export class ShopsModule {}
