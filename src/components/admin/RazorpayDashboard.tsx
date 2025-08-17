// RazorpayDashboard.tsx - A component for administrators to monitor Razorpay payments
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

interface Payment {
  id: number;
  payment_id: string;
  order_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  user_email?: string;
}

interface Order {
  id: number;
  order_id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  user_email?: string;
}

export function RazorpayDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'payments' | 'orders'>('payments');
  const [filter, setFilter] = useState<'all' | 'successful' | 'failed'>('all');
  
  const { user, isAdmin } = useAuth();
  
  useEffect(() => {
    if (!user || !isAdmin) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select(`
            *,
            profiles:user_id (email)
          `)
          .order('created_at', { ascending: false });
          
        if (paymentsError) throw paymentsError;
        
        const processedPayments = paymentsData.map((payment) => ({
          ...payment,
          user_email: payment.profiles?.email,
        }));
        
        setPayments(processedPayments);
        
        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('payment_orders')
          .select(`
            *,
            profiles:user_id (email)
          `)
          .order('created_at', { ascending: false });
          
        if (ordersError) throw ordersError;
        
        const processedOrders = ordersData.map((order) => ({
          ...order,
          user_email: order.profiles?.email,
        }));
        
        setOrders(processedOrders);
        
      } catch (err) {
        console.error('Error fetching payment data:', err);
        setError('Failed to load payment data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, isAdmin]);
  
  const filteredPayments = payments.filter((payment) => {
    if (filter === 'all') return true;
    if (filter === 'successful') return payment.status === 'captured' || payment.status === 'authorized';
    if (filter === 'failed') return payment.status === 'failed';
    return true;
  });
  
  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'successful') return order.status === 'paid';
    if (filter === 'failed') return order.status === 'failed';
    return true;
  });
  
  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Access Denied</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Error</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Razorpay Payment Dashboard</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'payments' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('payments')}
          >
            Payments ({payments.length})
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'orders' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Orders ({orders.length})
          </button>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${
              filter === 'all' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === 'successful' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setFilter('successful')}
          >
            Successful
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === 'failed' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setFilter('failed')}
          >
            Failed
          </button>
        </div>
      </div>
      
      {activeTab === 'payments' && (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex flex-col">
                        <span className="font-medium">{payment.payment_id}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Order: {payment.order_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">ID: {payment.user_id}</span>
                        <span className="font-medium">{payment.user_email || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {(payment.amount / 100).toFixed(2)} {payment.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'captured' || payment.status === 'authorized' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : payment.status === 'failed'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(payment.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'orders' && (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">ID: {order.user_id}</span>
                        <span className="font-medium">{order.user_email || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {order.plan_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {(order.amount / 100).toFixed(2)} {order.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'paid' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : order.status === 'failed'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Payment Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Total Revenue</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {(payments
                .filter(p => p.status === 'captured' || p.status === 'authorized')
                .reduce((sum, p) => sum + p.amount, 0) / 100
              ).toFixed(2)} INR
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Successful Payments</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {payments.filter(p => p.status === 'captured' || p.status === 'authorized').length}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Failed Payments</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {payments.filter(p => p.status === 'failed').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
