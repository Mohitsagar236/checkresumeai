import { useContext } from 'react';
import { SubscriptionContext } from '../context/SubscriptionContextDefs';

/**
 * Custom hook to use the subscription context
 */
export function useSubscription() {
  return useContext(SubscriptionContext);
}
