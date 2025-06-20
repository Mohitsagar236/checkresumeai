import { 
  verifySubscriptionValidity, 
  isCurrentUserSubscriptionOwner 
} from '../context/subscriptionHelpers';

// Test function that can be run directly in the browser console
export function testSubscriptionValidation() {
  // Create a test subscription with 30 days validity
  const startDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  
  const testSubscription = {
    tier: 'premium',
    startDate: startDate.toISOString(),
    expiresAt: expiryDate.toISOString(),
    features: {
      // Minimal features for test
      realtimeAnalysis: true,
      customTemplates: true
    },
    subscriberEmail: 'test@example.com'
  };
  
  console.log('===== SUBSCRIPTION VALIDATION TESTS =====');
  
  // Test 1: Valid subscription with matching email
  const test1 = verifySubscriptionValidity(
    testSubscription, 
    'test@example.com'
  );
  console.log('Test 1 (Valid subscription):', 
    test1.tier === 'premium' ? 'PASSED ✅' : 'FAILED ❌',
    test1);
  
  // Test 2: Valid subscription with different email
  const test2 = verifySubscriptionValidity(
    testSubscription, 
    'different@example.com'
  );
  console.log('Test 2 (Email mismatch):', 
    test2.tier === 'free' ? 'PASSED ✅' : 'FAILED ❌',
    test2);
  
  // Test 3: Expired subscription
  const expiredSubscription = {
    ...testSubscription,
    expiresAt: new Date(2023, 0, 1).toISOString() // expired date
  };
  const test3 = verifySubscriptionValidity(
    expiredSubscription, 
    'test@example.com'
  );
  console.log('Test 3 (Expired subscription):', 
    test3.tier === 'free' ? 'PASSED ✅' : 'FAILED ❌',
    test3);
  
  // Test 4: Missing email
  const noEmailSubscription = {
    ...testSubscription,
    subscriberEmail: null
  };
  const test4 = verifySubscriptionValidity(
    noEmailSubscription, 
    'test@example.com'
  );
  console.log('Test 4 (Missing email):', 
    test4.tier === 'free' ? 'PASSED ✅' : 'FAILED ❌',
    test4);
  
  // Test 5: isCurrentUserSubscriptionOwner function
  const test5 = isCurrentUserSubscriptionOwner('test@example.com', testSubscription);
  console.log('Test 5 (Correct ownership):', 
    test5 === true ? 'PASSED ✅' : 'FAILED ❌');
  
  // Test 6: Case insensitive email comparison
  const caseSubscription = {
    ...testSubscription,
    subscriberEmail: 'TEST@example.com'
  };
  const test6 = isCurrentUserSubscriptionOwner('test@example.com', caseSubscription);
  console.log('Test 6 (Case insensitive email):', 
    test6 === true ? 'PASSED ✅' : 'FAILED ❌');
    
  return {
    test1, test2, test3, test4,
    test5, test6
  };
}
