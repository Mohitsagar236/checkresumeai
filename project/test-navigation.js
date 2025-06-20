// Simple navigation test for React Router
// Run this in the browser console when on the homepage

console.log('🧪 Testing React Router Navigation...');

// Test 1: Check if React Router is loaded
try {
  const reactRouterDom = window.__REACT_ROUTER_DOM__;
  if (reactRouterDom) {
    console.log('✅ React Router detected');
  } else {
    console.log('⚠️ React Router not detected in global scope');
  }
} catch (e) {
  console.log('⚠️ Error checking React Router:', e.message);
}

// Test 2: Check if there are any Links on the page
const links = document.querySelectorAll('a[href="/upload"]');
console.log(`🔗 Found ${links.length} links to /upload`);

if (links.length > 0) {
  const firstLink = links[0];
  console.log('📍 First Get Started link found:', firstLink);
  console.log('   - Text content:', firstLink.textContent?.trim());
  console.log('   - href attribute:', firstLink.href);
  console.log('   - className:', firstLink.className);
  
  // Test 3: Check if the link has click event listeners
  const events = getEventListeners ? getEventListeners(firstLink) : null;
  console.log('🎯 Event listeners:', events);
  
  // Test 4: Simulate a click
  console.log('🖱️ Simulating click on Get Started button...');
  try {
    firstLink.click();
    console.log('✅ Click event triggered');
  } catch (e) {
    console.log('❌ Click failed:', e.message);
  }
  
  // Test 5: Try manual navigation
  console.log('🧭 Testing manual navigation...');
  try {
    window.history.pushState({}, '', '/upload');
    console.log('✅ Manual navigation attempted');
    
    // Check current URL
    setTimeout(() => {
      console.log('📍 Current URL after navigation:', window.location.href);
      console.log('📍 Current pathname:', window.location.pathname);
    }, 100);
  } catch (e) {
    console.log('❌ Manual navigation failed:', e.message);
  }
} else {
  console.log('❌ No Get Started links found on the page');
}

// Test 6: Check for any JavaScript errors
console.log('🚨 Checking for console errors...');
const originalError = console.error;
const errors = [];

console.error = function(...args) {
  errors.push(args.join(' '));
  originalError.apply(console, args);
};

setTimeout(() => {
  console.log('📋 JavaScript errors detected:', errors.length > 0 ? errors : 'None');
}, 2000);

// Test 7: Check if the page is fully loaded
console.log('📄 Document ready state:', document.readyState);
console.log('🎭 React root element:', document.getElementById('root') ? 'Found' : 'Not found');

// Test 8: Check for any blocking elements
const overlays = document.querySelectorAll('[style*="position: fixed"], [style*="position: absolute"], .modal, .overlay');
console.log(`🔒 Potential blocking elements found: ${overlays.length}`);
overlays.forEach((el, i) => {
  console.log(`   ${i + 1}. ${el.tagName} - ${el.className || 'no class'}`);
});

console.log('🏁 Navigation test complete. Check results above.');
