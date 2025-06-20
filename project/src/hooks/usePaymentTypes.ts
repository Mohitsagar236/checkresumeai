import { PaymentStep } from '../types/payment';

export interface PaymentHookState {
  paymentStep: PaymentStep;
  promoCode: string;
  promoDiscount: number;
  promoError: string;
  errorMessage: string;
  planPrice: string;
  planPeriod: string;
}

export interface PaymentHookActions {
  setPaymentStep: (step: PaymentStep) => void;
  setPromoCode: (code: string) => void;
  handlePromoCodeValidation: (code: string) => Promise<void>;
  handlePayment: () => Promise<void>;
  resetPayment: () => void;
}
