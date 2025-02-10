import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ShopsModel } from '../models';

@Injectable()
export class ShopsService {
  constructor(private readonly shopsModel: ShopsModel) {}

  async addShop(name: string, commissionC: number): Promise<string> {
    return this.shopsModel.create(name, commissionC);
  }

  async getShop(id: string) {
    return this.shopsModel.getById(id);
  }

  async updateBalance(shopId: string, amount: number) {
    return this.shopsModel.updateAmountById(shopId, amount);
  }
}
