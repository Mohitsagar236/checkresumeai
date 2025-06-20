// Immediate fix for styling issues
(function() {
  function applyStyleFixes() {
    // Check if header exists
    const header = document.querySelector('header');
    if (header) {
      // Apply essential styles to header
      header.style.backgroundColor = '#ffffff';
      header.style.position = 'fixed';
      header.style.top = '0';
      header.style.left = '0';
      header.style.right = '0';
      header.style.width = '100%';
      header.style.zIndex = '1000';
      header.style.padding = '0.75rem 0';
      header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      
      // Check for dark mode
      if (document.documentElement.classList.contains('dark')) {
        header.style.backgroundColor = '#0f172a';
      }
    }
    
    // Fix navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.style.display = 'inline-block';
      link.style.padding = '0.5rem';
      link.style.color = document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937';
    });
    
    // Fix main content padding
    const main = document.querySelector('main');
    if (main) {
      main.style.paddingTop = '5rem';
    }
    
    // Fix mobile navigation menu
    const mobileMenu = document.querySelector('[aria-label="Toggle menu"]');
    if (mobileMenu) {
      mobileMenu.style.display = 'block';
      mobileMenu.style.padding = '0.5rem';
    }
    
    // Add body margin to prevent content being hidden under header
    document.body.style.marginTop = '60px';
  }
  
  // Apply fixes immediately
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    applyStyleFixes();
  } else {
    document.addEventListener('DOMContentLoaded', applyStyleFixes);
  }
  
  // Also apply after a delay to catch dynamic content
  setTimeout(applyStyleFixes, 500);
  setTimeout(applyStyleFixes, 1500);  // Try again after more time
  
  // Make the fix function available globally
  window.applyHeaderFix = applyStyleFixes;
  
  // Watch for DOM changes and reapply fixes
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
      let shouldFix = false;
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || 
            (mutation.type === 'attributes' && 
             (mutation.target.nodeName === 'HEADER' || 
              mutation.target.closest('header')))) {
          shouldFix = true;
        }
      });
      
      if (shouldFix) {
        applyStyleFixes();
      }
    });
    
    // Start observing once the DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    });
  }
})();
