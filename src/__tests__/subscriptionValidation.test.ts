// Test script for subscription validation
import { 
  getSubscriptionData, 
  saveSubscriptionData, 
  verifySubscriptionValidity,
  isCurrentUserSubscriptionOwner
} from '../context/subscriptionHelpers';
import { SubscriptionData, TIER_FEATURES } from '../types/subscription';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    }
  };
})();

// Replace the global localStorage with our mock
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Helper function to create a test subscription
function createTestSubscription(options: Partial<SubscriptionData> = {}): SubscriptionData {
  const startDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now

  return {
    tier: 'premium',
    startDate: startDate.toISOString(),
    expiresAt: expiryDate.toISOString(),
    features: TIER_FEATURES.premium,
    subscriberEmail: 'test@example.com',
    ...options
  };
}

// Test suite
console.log('Running subscription validation tests...');

// Test 1: Valid subscription
const validSubscription = createTestSubscription();
saveSubscriptionData(validSubscription);
const test1Result = verifySubscriptionValidity(getSubscriptionData(), 'test@example.com');
console.log('Test 1 - Valid subscription:', 
  test1Result.tier === 'premium' ? 'PASSED ✅' : 'FAILED ❌');

// Test 2: Email mismatch
const emailMismatchSubscription = createTestSubscription();
saveSubscriptionData(emailMismatchSubscription);
const test2Result = verifySubscriptionValidity(getSubscriptionData(), 'different@example.com');
console.log('Test 2 - Email mismatch:', 
  test2Result.tier === 'free' ? 'PASSED ✅' : 'FAILED ❌');

// Test 3: Expired subscription
const expiredDate = new Date();
expiredDate.setDate(expiredDate.getDate() - 10); // 10 days ago
const expiredSubscription = createTestSubscription({ expiresAt: expiredDate.toISOString() });
saveSubscriptionData(expiredSubscription);
const test3Result = verifySubscriptionValidity(getSubscriptionData(), 'test@example.com');
console.log('Test 3 - Expired subscription:', 
  test3Result.tier === 'free' ? 'PASSED ✅' : 'FAILED ❌');

// Test 4: Missing email
const noEmailSubscription = createTestSubscription({ subscriberEmail: null });
saveSubscriptionData(noEmailSubscription);
const test4Result = verifySubscriptionValidity(getSubscriptionData(), 'test@example.com');
console.log('Test 4 - Missing email:', 
  test4Result.tier === 'free' ? 'PASSED ✅' : 'FAILED ❌');

// Test 5: isCurrentUserSubscriptionOwner function
const ownershipSubscription = createTestSubscription();
saveSubscriptionData(ownershipSubscription);
const test5Result = isCurrentUserSubscriptionOwner('test@example.com', getSubscriptionData());
console.log('Test 5 - Correct ownership:', 
  test5Result === true ? 'PASSED ✅' : 'FAILED ❌');

// Test 6: Case insensitive email comparison
const caseSubscription = createTestSubscription({ subscriberEmail: 'TEST@example.com' });
saveSubscriptionData(caseSubscription);
const test6Result = isCurrentUserSubscriptionOwner('test@example.com', getSubscriptionData());
console.log('Test 6 - Case insensitive email:', 
  test6Result === true ? 'PASSED ✅' : 'FAILED ❌');

console.log('Subscription validation tests complete!');
