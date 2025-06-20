import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, CreditCard, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { usePayment } from '../../hooks/usePayment';
import { useAuth } from '../../hooks/useAuth';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { 
  RAZORPAY_PLANS, 
  loadRazorpayScript 
} from '../../utils/razorpayService';
import { FormData } from '../../types/payment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  planType?: 'monthly' | 'yearly';
}

export function PaymentModal({ isOpen, onClose, onSuccess, planType = 'monthly' }: PaymentModalProps) {  
  const { user } = useAuth();
  const currentUserEmail = user?.email || '';
  
  const [formData, setFormData] = useState<FormData>({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    country: 'US',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'razorpay'>('razorpay');
  
  const {
    paymentStep,
    setPaymentStep,
    promoCode,
    setPromoCode,
    promoDiscount,
    promoError,
    errorMessage,
    planPrice,
    planPeriod,
    handlePromoCodeValidation,
    handlePayment,
  } = usePayment(planType, onSuccess);

  // Get plan details
  const plan = RAZORPAY_PLANS[planType];
  // Calculate discounted total for display on the pay button
  const discountedTotal = ((plan.amount * (1 - promoDiscount / 100)) / 100).toFixed(2);
  const payPrice = promoDiscount > 0 ? `${plan.currency} ${discountedTotal}` : planPrice;

  // Load Razorpay SDK when modal opens
  useEffect(() => {
    if (isOpen && paymentMethod === 'razorpay') {
      const loadScript = async () => {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setPaymentStep('error');
        }
      };
      loadScript();
    }
  }, [isOpen, paymentMethod, setPaymentStep]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handlePromoCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);
  }, [setPromoCode]);

  // Function to validate promo codes
  const validatePromoCode = useCallback((code: string) => {
    handlePromoCodeValidation(code);
  }, [handlePromoCodeValidation]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'razorpay') {
      await handlePayment();
    } else {
      setPaymentStep('processing');
      // Simulate processing for demo
      setTimeout(() => setPaymentStep('success'), 2000);
    }
  }, [paymentMethod, handlePayment, setPaymentStep]);
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
          className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-none sm:my-8 sm:w-full sm:max-w-lg stable-modal"
        ><div className="absolute top-0 right-0 pt-4 pr-4">            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-none"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="px-6 pt-5 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <h3 className="text-center text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {paymentStep === 'details' && 'Upgrade to Premium'}
              {paymentStep === 'processing' && 'Processing Payment'}
              {paymentStep === 'success' && 'Payment Successful!'}
            </h3>
            
            <div className="mt-2">              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                {paymentStep === 'details' && (
                  <>
                    You're upgrading to Premium (${planPrice}/${planPeriod})
                    <span className="block mt-2 text-xs">
                      Your subscription will be linked to {currentUserEmail} and will be valid immediately upon purchase.
                      {planType === 'monthly' 
                        ? ' Access expires in 30 days.'
                        : ' Access expires in 365 days.'}
                    </span>
                  </>
                )}
                {paymentStep === 'processing' && 'Please wait while we process your payment...'}
                {paymentStep === 'success' && (
                  <>
                    Your account has been upgraded to Premium!
                    <span className="block mt-2 text-xs">
                      Premium features are now active and can only be accessed using {currentUserEmail}.
                    </span>
                  </>
                )}
              </p>
              {paymentStep === 'details' && (
                <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <p className="ml-2 text-sm text-yellow-700 dark:text-yellow-400">
                      Note: Premium features will only be available when using the email address used for purchase.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
            <div className="px-6 pb-6">
            {paymentStep === 'details' && (
              <form onSubmit={handleSubmit} className="space-y-4">                {/* Payment Method Selector */}
                <PaymentMethodSelector 
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
                
                <div className={`grid grid-cols-1 gap-y-4 ${paymentMethod === 'razorpay' ? 'opacity-50 pointer-events-none' : ''}`}><div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name on card
                    </label>                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-none"
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Country/Region
                    </label>                    <select
                      id="country"
                      name="country"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-none"
                      defaultValue="US"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="IN">India</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Card number
                    </label>                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-none"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Expiry date
                      </label>
                      <input                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-none"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        CVV
                      </label>
                      <input                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-none"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
                  <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Secure payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-5 bg-blue-600 rounded"></div>
                    <div className="w-8 h-5 bg-red-500 rounded"></div>
                    <div className="w-8 h-5 bg-yellow-400 rounded"></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-700/40 px-4 py-3 rounded-md mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Subtotal:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{planPrice}</span>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Promo code
                      </label>
                      <div className="mt-1 flex space-x-2">
                        <input                          type="text"
                          id="promoCode"
                          name="promoCode"
                          value={promoCode}
                          onChange={handlePromoCodeChange}
                          placeholder="WELCOME20"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-none"
                        />                        <button
                          type="button"
                          onClick={() => validatePromoCode(promoCode)}
                          className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-none"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{promoError}</p>
                      )}
                      {promoDiscount > 0 && (
                        <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                          {promoDiscount}% discount applied!
                        </p>
                      )}
                    </div>

                    {promoDiscount > 0 && (
                      <div className="flex justify-between mb-2 text-green-600 dark:text-green-400">
                        <span className="text-sm">Discount:</span>
                        <span className="text-sm font-medium">-{promoDiscount}%</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Total:</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {plan.currency} {((plan.amount * (1 - promoDiscount / 100)) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">                  <Button
                    type="submit"
                    variant="premium"
                    className="w-full transition-none"
                  >
                    Pay {payPrice}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    By clicking "Pay", you agree to our <a href="/terms" className="text-blue-600 hover:underline">Terms</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>. 
                    {planType === 'monthly' ? 'Monthly subscription will auto-renew.' : 'Annual subscription will auto-renew after 1 year.'} You may cancel anytime.
                  </p>
                </div>
              </form>
            )}            {paymentStep === 'processing' && (
              <div className="flex flex-col items-center py-10">
                <div className="relative">
                  <div className="h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">This will just take a moment...</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Processing payment securely...</p>
              </div>
            )}
            
            {paymentStep === 'error' && (
              <div className="flex flex-col items-center py-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center mb-4 shadow-lg shadow-red-200 dark:shadow-red-900/20">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Payment Failed
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-xs">
                  {errorMessage || 'There was a problem processing your payment. Please try again.'}
                </p>
                  <div className="w-full space-y-3">                  <Button
                    variant="outline"
                    className="w-full transition-none"
                    onClick={() => setPaymentStep('details')}
                  >
                    Try Again
                  </Button>
                  <button 
                    className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 py-2 transition-none"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {paymentStep === 'success' && (              <div className="flex flex-col items-center py-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-green-200 dark:shadow-green-900/20">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Welcome to Premium!
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-xs">
                  You now have full access to all premium features including real-time analysis and advanced insights.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg mb-4 w-full">
                  <h5 className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">Premium Features Unlocked</h5>
                  <ul className="space-y-1">
                    <li className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" /> Real-time resume analysis
                    </li>
                    <li className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" /> Live keyword matching
                    </li>
                    <li className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" /> Advanced ATS optimization
                    </li>
                    <li className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" /> Priority support
                    </li>
                  </ul>
                </div>
                  <div className="w-full space-y-3">                  <Button
                    variant="premium"
                    className="w-full transition-none"
                    onClick={handleSuccess}
                  >
                    Start Using Premium Features
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    Premium features are now activated on your account
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
