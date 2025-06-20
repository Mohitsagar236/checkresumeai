import { CreditCard, Wallet } from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethod: 'card' | 'razorpay';
  setPaymentMethod: (method: 'card' | 'razorpay') => void;
}

export function PaymentMethodSelector({ paymentMethod, setPaymentMethod }: PaymentMethodSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Payment Method
      </label>
      <div className="grid grid-cols-2 gap-3">        <button
          type="button"
          className={`flex items-center justify-center p-3 border rounded-md transition-none ${
            paymentMethod === 'card'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-gray-300 dark:border-gray-700'
          }`}
          onClick={() => setPaymentMethod('card')}
        >
          <CreditCard className="h-5 w-5 mr-2" />
          <span>Credit Card</span>
        </button>
        <button
          type="button"
          className={`flex items-center justify-center p-3 border rounded-md transition-none ${
            paymentMethod === 'razorpay'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'border-gray-300 dark:border-gray-700'
          }`}
          onClick={() => setPaymentMethod('razorpay')}
        >
          <Wallet className="h-5 w-5 mr-2" />
          <span>Razorpay</span>
        </button>
      </div>
    </div>
  );
}
