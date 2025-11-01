import React, { useState } from 'react';
import { QrCode, Copy, CheckCircle, AlertCircle, Upload, Smartphone } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

interface UpiPaymentProps {
  amount: number;
  currency: string;
  planType: 'monthly' | 'yearly';
  planName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UpiPayment: React.FC<UpiPaymentProps> = ({ 
  amount, 
  currency, 
  planType,
  planName,
  onSuccess,
  onCancel 
}) => {
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const { showToast } = useToast();
  const { user } = useAuth();

  // Replace with your actual UPI ID
  const UPI_ID = import.meta.env.VITE_UPI_ID || 'your-upi-id@paytm';
  
  // Generate UPI payment URL for quick payment
  const upiPaymentUrl = `upi://pay?pa=${UPI_ID}&pn=ResumeAI&am=${amount}&cu=${currency}&tn=Premium Subscription ${planType}`;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    showToast('UPI ID copied to clipboard!', 'success');
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amount.toString());
    showToast('Amount copied to clipboard!', 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }
      setScreenshot(file);
      setUploadError('');
    }
  };

  const handleSubmitPayment = async () => {
    if (!transactionId.trim()) {
      showToast('Please enter your transaction ID', 'error');
      return;
    }

    if (!screenshot) {
      showToast('Please upload payment screenshot', 'error');
      return;
    }

    if (!user) {
      showToast('Please login to continue', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload screenshot to Supabase Storage
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `payment-proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(filePath, screenshot);

      if (uploadError) {
        throw new Error('Failed to upload screenshot');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(filePath);

      // Create pending payment record
      const { error: insertError } = await supabase
        .from('pending_payments')
        .insert({
          user_id: user.id,
          user_email: user.email,
          transaction_id: transactionId,
          amount: amount,
          currency: currency,
          plan_type: planType,
          plan_name: planName,
          screenshot_url: publicUrl,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error('Failed to submit payment details');
      }

      showToast(
        'Payment submitted successfully! Your subscription will be activated within 24 hours after verification.',
        'success'
      );

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      showToast('Failed to submit payment details. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Payment Instructions
            </h4>
            <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Pay the exact amount using any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
              <li>Enter the Transaction ID from your payment app</li>
              <li>Upload a screenshot of the successful transaction</li>
              <li>Submit the details for verification</li>
              <li>Your subscription will be activated within 24 hours</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Payment Details Card */}
      <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Payment Details
        </h3>
        
        {/* Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount to Pay
          </label>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-600 rounded-lg">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {currency} {amount}
            </span>
            <button
              onClick={handleCopyAmount}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* UPI ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            UPI ID
          </label>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-600 rounded-lg">
            <span className="text-sm font-mono text-gray-900 dark:text-white">
              {UPI_ID}
            </span>
            <button
              onClick={handleCopyUpiId}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Pay Button */}
        <div className="mb-4">
          <a
            href={upiPaymentUrl}
            className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            <Smartphone className="h-5 w-5 mr-2" />
            Pay with UPI App
          </a>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            This will open your UPI app with pre-filled details
          </p>
        </div>
      </div>

      {/* Transaction Details Form */}
      <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Submit Payment Proof
        </h3>

        {/* Transaction ID Input */}
        <div className="mb-4">
          <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction ID / UTR Number *
          </label>
          <input
            type="text"
            id="transactionId"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter your UPI transaction ID"
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-600 dark:text-white"
            required
          />
        </div>

        {/* Screenshot Upload */}
        <div className="mb-4">
          <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Screenshot *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="screenshot"
                  className="relative cursor-pointer bg-white dark:bg-slate-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="screenshot"
                    name="screenshot"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF up to 5MB
              </p>
              {screenshot && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {screenshot.name}
                </p>
              )}
              {uploadError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {uploadError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSubmitPayment}
            disabled={isSubmitting || !transactionId || !screenshot}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Payment'}
          </Button>
        </div>
      </div>
    </div>
  );
};
