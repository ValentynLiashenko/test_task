export interface IPayment {
  id?: string;
  shopId: string;
  amount: number;
  status: PaymentStatus;
  availableAmount: number;
  blockedAmount: number;
}

export enum PaymentStatus {
  Pending = 'pending',
  Processed = 'processed',
  Completed = 'completed',
  Paid = 'paid',
}

export interface IHandlePayPaymentReturn {
  id: string;
  amount: number;
}
