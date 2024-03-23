// create-payment.dto.ts
export class CreatePaymentDto {
    userId: string;
    amount: number;
    status: 'pending'
    transactionId: string;
    paymentMethod: string;
    description?: string;
    callbackUrlSuccess?: string;
    callbackUrlFailure?: string;
    planId?: string;
    articleId?: string;
    boostId?: string;
    isYearlyBilling?: boolean;
    adsBannerId?: string;

  }
  