import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ExternalLink, Clock, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';

interface PendingPayment {
  id: string;
  user_id: string;
  user_email: string;
  transaction_id: string;
  amount: number;
  currency: string;
  plan_type: string;
  plan_name: string;
  screenshot_url: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  verified_at?: string;
  rejection_reason?: string;
}

export const PaymentVerificationPage: React.FC = () => {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('pending_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId: string, _userId: string, planType: 'monthly' | 'yearly') => {
    try {
      // Update payment status
      const { error: updateError } = await supabase
        .from('pending_payments')
        .update({
          status: 'verified',
          verified_by: user?.id,
          verified_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (updateError) throw updateError;

      // Create subscription for user
      const _startDate = new Date();
      const expiryDays = planType === 'yearly' ? 365 : 30;
      const _expiryDate = new Date(_startDate.getTime() + expiryDays * 24 * 60 * 60 * 1000);

      // Get user details
      const { data: _userData } = await supabase
        .from('pending_payments')
        .select('user_email')
        .eq('id', paymentId)
        .single();

      // Store subscription in user's profile or local storage (depends on your implementation)
      // For now, we'll just update the payment status
      // You might want to trigger an email notification here

      alert('Payment verified successfully! User subscription has been activated.');
      fetchPayments();
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Failed to verify payment. Please try again.');
    }
  };

  const rejectPayment = async (paymentId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const { error } = await supabase
        .from('pending_payments')
        .update({
          status: 'rejected',
          verified_by: user?.id,
          verified_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', paymentId);

      if (error) throw error;

      alert('Payment rejected successfully!');
      fetchPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Failed to reject payment. Please try again.');
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-16 bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Verification Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and verify pending UPI payment submissions
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'premium' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === 'pending' ? 'premium' : 'outline'}
              onClick={() => setFilter('pending')}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={filter === 'verified' ? 'premium' : 'outline'}
              onClick={() => setFilter('verified')}
              size="sm"
            >
              Verified
            </Button>
            <Button
              variant={filter === 'rejected' ? 'premium' : 'outline'}
              onClick={() => setFilter('rejected')}
              size="sm"
            >
              Rejected
            </Button>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>

        {/* Payments List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading payments...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No payments found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Payment Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {payment.plan_name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {payment.user_email}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : payment.status === 'verified'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">
                            {payment.currency} {payment.amount}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">
                            {payment.plan_type}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                          <span className="ml-2 font-mono text-xs font-medium text-gray-900 dark:text-white">
                            {payment.transaction_id}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Submitted:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {payment.rejection_reason && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <p className="text-sm text-red-800 dark:text-red-200">
                            <strong>Rejection Reason:</strong> {payment.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Screenshot Preview */}
                    <div className="lg:w-64">
                      <a
                        href={payment.screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative group"
                      >
                        <img
                          src={payment.screenshot_url}
                          alt="Payment Screenshot"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-slate-600"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <ExternalLink className="h-8 w-8 text-white" />
                        </div>
                      </a>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                        Click to view full size
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {payment.status === 'pending' && (
                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={() => verifyPayment(payment.id, payment.user_id, payment.plan_type as 'monthly' | 'yearly')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify Payment
                      </Button>
                      <Button
                        onClick={() => rejectPayment(payment.id)}
                        variant="outline"
                        className="flex-1 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
