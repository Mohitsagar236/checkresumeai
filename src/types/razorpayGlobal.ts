// Declare Razorpay global type for TypeScript
export interface RazorpayInstanceOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  method?: string | string[];
  readonly?: boolean;
  [key: string]: unknown;
}

export interface RazorpayInstance {
  on: (event: string, handler: Function) => void;
  open: () => void;
  close: () => void;
}

export interface RazorpayStatic {
  new(options: RazorpayInstanceOptions): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay: RazorpayStatic;
  }
}
