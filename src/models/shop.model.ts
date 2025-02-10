import { v4 as uuidv4 } from 'uuid';

export class ShopsModel {
  private shops = new Map<
    string,
    { id: string; name: string; commissionC: number; balance: number }
  >();

  async create(name: string, commissionC: number): Promise<string> {
    const id = uuidv4();
    this.shops.set(id, { id, name, commissionC, balance: 0 });
    return id;
  }

  async getById(id: string) {
    return this.shops.get(id);
  }

  async updateAmountById(shopId: string, amount: number) {
    const shop = await this.getById(shopId);
    if (shop) {
      shop.balance += amount;
    }
  }
}
