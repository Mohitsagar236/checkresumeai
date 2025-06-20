// Apply styling fixes at runtime
document.addEventListener('DOMContentLoaded', function() {
  // Wait a moment for React to initialize
  setTimeout(function() {
    // Fix header styles
    const header = document.querySelector('header');
    if (header) {
      header.style.backgroundColor = 'white';
      header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      header.style.padding = '10px 0';
      header.style.position = 'relative';
      header.style.display = 'block';
      header.style.width = '100%';
      header.style.zIndex = '1000';
      header.style.top = '0';
    }

    // Fix navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.style.color = '#333';
      link.style.textDecoration = 'none';
      link.style.margin = '0 10px';
      link.style.padding = '5px';
      link.style.display = 'inline-block';
      link.style.fontWeight = '500';
    });

    // Fix buttons
    const buttons = document.querySelectorAll('button:not([role="switch"]');
    buttons.forEach(button => {
      if (button.classList.contains('outline') || 
          button.textContent.includes('Log In') ||
          button.textContent.includes('Sign In')) {
        button.style.backgroundColor = 'white';
        button.style.color = '#0069ff';
        button.style.border = '1px solid #0069ff';
      } else {
        button.style.backgroundColor = '#0069ff';
        button.style.color = 'white';
        button.style.border = 'none';
      }
      button.style.padding = '8px 16px';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.fontWeight = '500';
    });

    // Fix theme toggle button
    const themeToggle = document.querySelector('button[aria-label*="mode" i]');
    if (themeToggle) {
      themeToggle.style.backgroundColor = 'transparent';
      themeToggle.style.border = 'none';
      themeToggle.style.padding = '5px';
    }

    // Fix navigation menu
    const navigation = document.querySelector('nav');
    if (navigation) {
      navigation.style.display = 'block';
    }

    // Fix premium banner if it exists
    const premiumBanner = document.querySelector('.bg-gradient-premium, .bg-gradient-brand');
    if (premiumBanner) {
      premiumBanner.style.background = 'linear-gradient(90deg, #4f46e5, #0ea5e9)';
      premiumBanner.style.color = 'white';
      premiumBanner.style.padding = '8px';
      premiumBanner.style.textAlign = 'center';
      premiumBanner.style.fontWeight = '500';
    }

    // Fix mobile menu
    const mobileMenu = document.querySelector('header button:not([role="switch"])');
    if (mobileMenu) {
      mobileMenu.style.backgroundColor = 'transparent';
      mobileMenu.style.border = 'none';
      mobileMenu.style.padding = '5px';
    }

    console.log('✅ Basic styling fixes applied');
  }, 500);
});
