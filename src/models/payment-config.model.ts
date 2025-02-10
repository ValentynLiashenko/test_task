export class PaymentConfigModel {
  private commissionA = 0;
  private commissionB = 0;
  private blockPercentageD = 0;

  async create(
    commissionA: number,
    commissionB: number,
    blockPercentageD: number
  ) {
    this.commissionA = commissionA;
    this.commissionB = commissionB;
    this.blockPercentageD = blockPercentageD;
  }

  async get() {
    return {
      commissionA: this.commissionA,
      commissionB: this.commissionB,
      blockPercentageD: this.blockPercentageD,
    };
  }
}
