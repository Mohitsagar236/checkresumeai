import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { UpiPayment } from './UpiPayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  planType?: 'monthly' | 'yearly';
}

export function PaymentModal({ isOpen, onClose, onSuccess, planType = 'monthly' }: PaymentModalProps) {  
  const { user } = useAuth();
  const currentUserEmail = user?.email || '';
  
  const [paymentStep, setPaymentStep] = useState<'details' | 'success'>('details');

  // Plan details
  const plans = {
    monthly: { name: 'Premium Monthly', amount: 99, currency: 'INR' },
    yearly: { name: 'Premium Yearly', amount: 499, currency: 'INR' }
  };

  const plan = plans[planType];
  const planPrice = `${plan.currency} ${plan.amount}`;
  const planPeriod = planType === 'monthly' ? 'month' : 'year';

  const handlePaymentSuccess = useCallback(() => {
    setPaymentStep('success');
  }, []);
  
  const handleSuccess = useCallback(() => {
    // Broadcast subscription change event
    window.dispatchEvent(new CustomEvent('subscriptionUpdated'));
    
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  }, [onSuccess, onClose]);

  if (!isOpen) return null;
  
  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-slate-900 dark:bg-opacity-90 transition-none backdrop-blur-sm"></div>
        <div 
          className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-none sm:my-8 sm:w-full sm:max-w-2xl stable-modal"
        >
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-none"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="px-6 pt-5 pb-6">
            <h3 className="text-center text-lg font-medium leading-6 text-gray-900 dark:text-white mb-2">
              {paymentStep === 'details' && 'Upgrade to Premium'}
              {paymentStep === 'success' && 'Payment Submitted!'}
            </h3>
            
            <div className="mt-2">
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                {paymentStep === 'details' && (
                  <>
                    You're upgrading to Premium ({planPrice}/{planPeriod})
                    <span className="block mt-2 text-xs">
                      Your subscription will be linked to {currentUserEmail} and will be activated within 24 hours after payment verification.
                    </span>
                  </>
                )}
                {paymentStep === 'success' && (
                  <>
                    Thank you for your payment submission!
                    <span className="block mt-2 text-xs">
                      We'll verify your payment and activate your premium subscription within 24 hours. You'll receive a confirmation email at {currentUserEmail}.
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
            
          <div className="px-6 pb-6">
            {paymentStep === 'details' && (
              <UpiPayment
                amount={plan.amount}
                currency={plan.currency}
                planType={planType}
                planName={plan.name}
                onSuccess={handlePaymentSuccess}
                onCancel={onClose}
              />
            )}
            
            {paymentStep === 'success' && (
              <div className="flex flex-col items-center py-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-green-200 dark:shadow-green-900/20">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Payment Submitted Successfully!
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                  Your payment details have been submitted. Our team will verify your payment and activate your premium subscription within 24 hours.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg mb-6 w-full">
                  <h5 className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-3">What's Next?</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" /> 
                      <span>We'll verify your payment details within 24 hours</span>
                    </li>
                    <li className="flex items-start text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" /> 
                      <span>You'll receive a confirmation email once your subscription is activated</span>
                    </li>
                    <li className="flex items-start text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" /> 
                      <span>All premium features will be unlocked automatically</span>
                    </li>
                  </ul>
                </div>
                  
                <div className="w-full space-y-3">
                  <Button
                    variant="premium"
                    className="w-full transition-none"
                    onClick={handleSuccess}
                  >
                    Got It
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    Check your email for payment confirmation
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Create portal while preserving context
  return createPortal(modalContent, document.body);
}
