// Fix styling issues on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Running styling fix script...');
  
  // Fix header styling
  setTimeout(function() {
    const fixHeaderStyles = () => {
      // Fix header styling
      const header = document.querySelector('header');
      if (header) {
        console.log('Fixing header styles');
        header.style.backgroundColor = '#ffffff';
        header.style.zIndex = '1000';
        header.style.position = 'fixed';
        header.style.width = '100%';
        header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        header.style.padding = '0.75rem 0';
      }
      
      // Fix navigation menu
      const navLinks = document.querySelectorAll('header nav a');
      if (navLinks.length) {
        console.log('Fixing navigation links');
        navLinks.forEach(link => {
          link.style.color = '#1f2937';
          link.style.fontWeight = '500';
          link.style.display = 'block';
          link.style.padding = '0.5rem';
        });
      }
      
      // Fix mobile menu toggle
      const mobileMenuButton = document.querySelector('header button[aria-label="Toggle menu"]');
      if (mobileMenuButton) {
        console.log('Fixing mobile menu toggle');
        mobileMenuButton.style.padding = '0.5rem';
        mobileMenuButton.style.marginLeft = 'auto';
      }
      
      // Fix main content padding
      const mainContent = document.querySelector('main');
      if (mainContent) {
        console.log('Fixing main content padding');
        mainContent.style.paddingTop = '5rem';
      }
    };
    
    // Run style fixes
    fixHeaderStyles();
    
    // Set up a mutation observer to handle dynamic changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          fixHeaderStyles();
        }
      });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    
    console.log('Style fixes applied');
  }, 500);
});

// Function to manually apply fixes if needed
window.fixStyles = function() {
  console.log('Manually applying style fixes...');
  
  // Fix theme mode specific issues
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  // Fix the navigation menu
  const navigationMenu = document.querySelector('nav');
  if (navigationMenu) {
    navigationMenu.style.display = 'flex';
    navigationMenu.style.visibility = 'visible';
  }
  
  // Fix mobile navigation
  const mobileNav = document.querySelector('header div[class*="md:hidden"]');
  if (mobileNav) {
    mobileNav.style.position = 'absolute';
    mobileNav.style.top = '100%';
    mobileNav.style.left = '0';
    mobileNav.style.width = '100%';
    mobileNav.style.zIndex = '50';
    mobileNav.style.backgroundColor = isDarkMode ? '#1e293b' : '#ffffff';
  }
  
  // Apply specific fixes for the hero section
  const heroSection = document.querySelector('section.pt-20');
  if (heroSection) {
    heroSection.style.paddingTop = '6rem';
  }
  
  console.log('Manual style fixes completed');
  
  return 'Style fixes applied successfully';
};

// Log that the script is loaded
console.log('Fix styling script loaded successfully. Call window.fixStyles() to manually apply fixes.');
