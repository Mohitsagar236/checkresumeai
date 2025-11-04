// Auth OAuth State Reset Tool
// Run this script to clean up any OAuth state and restart the app properly

// Clear all supabase and OAuth related storage
function clearOAuthStorage() {
  // Clear from localStorage
  const localStorageKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('supabase') || key.includes('oauth') || key.includes('auth'))) {
      localStorageKeys.push(key);
    }
  }
  
  console.log('Clearing localStorage keys:', localStorageKeys);
  localStorageKeys.forEach(key => localStorage.removeItem(key));
  
  // Clear from sessionStorage
  const sessionStorageKeys = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.includes('supabase') || key.includes('oauth') || key.includes('auth'))) {
      sessionStorageKeys.push(key);
    }
  }
  
  console.log('Clearing sessionStorage keys:', sessionStorageKeys);
  sessionStorageKeys.forEach(key => sessionStorage.removeItem(key));
  
  console.log('OAuth storage cleared');
  return { localStorageKeys, sessionStorageKeys };
}

// Run the cleanup
const cleared = clearOAuthStorage();
console.log('Successfully cleared OAuth state data:', cleared);
console.log('You can now sign in again without OAuth state conflicts');

// If running from the browser console, you can reload the page with:
// window.location.href = '/login';
