export type PaymentStep = 'details' | 'processing' | 'success' | 'error';

export type ValidPromoCode = 'WELCOME20' | 'SPECIAL50' | 'NEWUSER10' | 'FLASH25' | 'STUDENT15';

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface FormData {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  country: string;
}

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';

export interface UpiPaymentMethod {
  type: 'upi';
  app?: 'google_pay' | 'phonepe' | 'paytm' | 'bhim';
  vpa?: string;
}
