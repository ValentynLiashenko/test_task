import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payment.service';
import { PaymentConfigService } from '../payment-config/payment-config.service';
import { ShopsService } from '../shops/shops.service';
import { PaymentsModel } from '../models';
import { PaymentStatus } from '../interfaces';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let configService: PaymentConfigService;
  let shopsService: ShopsService;
  let paymentModel: PaymentsModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PaymentConfigService,
          useValue: {
            getConfig: jest.fn(),
          },
        },
        {
          provide: ShopsService,
          useValue: {
            getShop: jest.fn(),
            updateBalance: jest.fn(),
          },
        },
        {
          provide: PaymentsModel,
          useValue: {
            create: jest.fn(),
            updatePaymentStatus: jest.fn(),
            getPaymentsByShop: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    configService = module.get<PaymentConfigService>(PaymentConfigService);
    shopsService = module.get<ShopsService>(ShopsService);
    paymentModel = module.get<PaymentsModel>(PaymentsModel);
  });

  it('should create a payment and calculate commissions correctly', async () => {
    jest.spyOn(configService, 'getConfig').mockResolvedValue({
      commissionA: 10,
      commissionB: 5,
      blockPercentageD: 10,
    });
    jest.spyOn(paymentModel, 'create').mockResolvedValue('payment-id');

    const paymentId = await service.createPayment('shop1', 1000);

    expect(configService.getConfig).toHaveBeenCalledTimes(1);
    expect(paymentModel.create).toHaveBeenCalledWith({
      shopId: 'shop1',
      amount: 1000,
      status: PaymentStatus.Pending,
      availableAmount: 840,
      blockedAmount: 100,
    });
    expect(paymentId).toBe('payment-id');
  });

  it('should update payment statuses', async () => {
    jest
      .spyOn(paymentModel, 'updatePaymentStatus')
      .mockResolvedValue(undefined);

    await service.updatePaymentStatus(
      ['payment1', 'payment2'],
      PaymentStatus.Processed
    );

    expect(paymentModel.updatePaymentStatus).toHaveBeenCalledWith(
      ['payment1', 'payment2'],
      PaymentStatus.Processed
    );
  });

  it('should process payments and update shop balance', async () => {
    jest.spyOn(paymentModel, 'getPaymentsByShop').mockResolvedValue([
      {
        id: 'payment1',
        shopId: 'shop1',
        amount: 1000,
        availableAmount: 850,
        blockedAmount: 100,
        status: PaymentStatus.Completed,
      },
      {
        id: 'payment2',
        shopId: 'shop1',
        amount: 500,
        availableAmount: 500,
        blockedAmount: 50,
        status: PaymentStatus.Completed,
      },
    ]);

    jest.spyOn(shopsService, 'getShop').mockResolvedValue({
      id: 'shop1',
      name: 'Test Shop',
      commissionC: 3,
      balance: 0,
    });

    jest.spyOn(shopsService, 'updateBalance').mockImplementation();

    const result = await service.payPayments('shop1');

    expect(paymentModel.getPaymentsByShop).toHaveBeenCalledWith(
      'shop1',
      PaymentStatus.Completed
    );
    expect(shopsService.getShop).toHaveBeenCalledWith('shop1');
    expect(shopsService.updateBalance).toHaveBeenCalledTimes(2);
    expect(shopsService.updateBalance).toHaveBeenCalledWith('shop1', 850);
    expect(shopsService.updateBalance).toHaveBeenCalledWith('shop1', 500);

    expect(result).toEqual({
      totalPaid: 1350,
      payments: [
        { id: 'payment1', amount: 850 },
        { id: 'payment2', amount: 500 },
      ],
    });
  });

  it('should return no payments if shop is not found or balance is zero', async () => {
    jest.spyOn(paymentModel, 'getPaymentsByShop').mockResolvedValue([]);
    jest.spyOn(shopsService, 'getShop').mockResolvedValue(null);

    const result = await service.payPayments('shop1');

    expect(paymentModel.getPaymentsByShop).toHaveBeenCalledWith(
      'shop1',
      PaymentStatus.Completed
    );
    expect(shopsService.getShop).toHaveBeenCalledWith('shop1');
    expect(result).toEqual({ totalPaid: 0, payments: [] });
  });
});
