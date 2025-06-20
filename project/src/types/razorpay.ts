export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
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
  // Support for specifying payment methods (card, UPI, etc.)
  payment?: {
    capture?: string | number;
    methods?: {
      card?: boolean;
      netbanking?: boolean;
      wallet?: boolean;
      emi?: boolean;
      upi?: boolean;
    }
  };
  // Support for preferred payment methods
  config?: {
    display?: {
      blocks?: {
        banks?: {
          name?: string;
          instruments?: any[];
        };
        upi?: {
          name?: string;
          instruments?: any[];
        };
      };
      sequence?: string[];
      preferences?: {
        show_default_blocks?: boolean;
      };
    };
  };
  [key: string]: unknown;
};
