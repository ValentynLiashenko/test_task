import { Controller, Post, Body } from '@nestjs/common';
import { ShopsService } from './shops.service';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  async addShop(@Body() body: { name: string; commissionC: number }) {
    const id = await this.shopsService.addShop(body.name, body.commissionC);
    return { shopId: id };
  }
}
