// Utility to check subscription status from the browser console
export function checkSubscriptionStatus() {
  console.log('Checking subscription status...');
  
  // Import necessary functions
  import('../context/subscriptionHelpers.ts')
    .then(({ getSubscriptionData, verifySubscriptionValidity }) => {
      // Get current user email (attempt to get from localStorage)
      let currentUserEmail = null;
      try {
        const storedUserData = localStorage.getItem('user_data');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          currentUserEmail = userData.email || null;
        }
      } catch (error) {
        console.error('Error getting user email:', error);
      }
      
      // Get current subscription from local storage
      const subscriptionData = getSubscriptionData();
      
      console.log('Current user email:', currentUserEmail);
      console.log('Current subscription data:', subscriptionData);
      
      // Validate the subscription
      const validatedSubscription = verifySubscriptionValidity(
        subscriptionData, 
        currentUserEmail
      );
      
      console.log('Validated subscription:', validatedSubscription);
      
      // Check if the subscription is valid
      const isPremium = validatedSubscription.tier !== 'free';
      const isOwner = currentUserEmail && 
                      validatedSubscription.subscriberEmail && 
                      validatedSubscription.subscriberEmail.toLowerCase() === currentUserEmail.toLowerCase();
      
      console.log('Is premium tier:', isPremium);
      console.log('Is subscription owner:', isOwner);
      
      // Check expiration status
      if (validatedSubscription.expiresAt) {
        const expiryDate = new Date(validatedSubscription.expiresAt);
        const now = new Date();
        const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        console.log('Expiry date:', expiryDate.toLocaleDateString());
        console.log('Days remaining:', daysRemaining);
      }
      
      return {
        currentUserEmail,
        subscriptionData,
        validatedSubscription,
        isPremium,
        isOwner
      };
    })
    .catch(error => {
      console.error('Error checking subscription status:', error);
    });
}
