import { useEffect } from 'react';

/**
 * Component to fix UI issues at runtime
 * This gets mounted in the app and runs fixes when needed
 */
export const UIStylingFix = () => {
  useEffect(() => {
    // Function to fix common UI issues
    const applyUiFixes = () => {
      console.log('Applying UI fixes...');

      // Fix header styling
      const header = document.querySelector('header');
      if (header) {
        if (!header.classList.contains('fixed')) {
          header.classList.add('fixed', 'w-full', 'z-50');
        }
      }

      // Fix navigation menu in desktop view
      const desktopNav = document.querySelector('header nav');
      if (desktopNav) {
        if (desktopNav.classList.contains('opacity-0')) {
          desktopNav.classList.remove('opacity-0');
          desktopNav.classList.add('opacity-100');
        }
      }

      // Fix mobile menu button
      const mobileButton = document.querySelector('header button[aria-label="Toggle menu"]');
      if (mobileButton) {
        if (!mobileButton.classList.contains('z-50')) {
          mobileButton.classList.add('z-50');
        }
      }
    };

    // Apply fixes immediately
    applyUiFixes();

    // Apply fixes after a delay to catch dynamic content
    const fixTimerId = setTimeout(applyUiFixes, 500);

    // Set up mutation observer to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        applyUiFixes();
      });
    });

    // Start observing the document body for changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Cleanup function
    return () => {
      clearTimeout(fixTimerId);
      observer.disconnect();
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default UIStylingFix;
