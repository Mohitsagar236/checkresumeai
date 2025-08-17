import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that automatically scrolls to the top of the page
 * whenever the route changes. This fixes the issue where new pages
 * open at the previous scroll position instead of the top.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // You can change this to 'auto' for instant scrolling
    });
  }, [pathname]);

  useEffect(() => {
    // Also handle initial page load and window focus
    // This ensures that when a new window is opened, it starts at the top
    const handleWindowFocus = () => {
      // Small delay to ensure the page is fully loaded
      setTimeout(() => {
        if (window.scrollY > 100) { // Only scroll if not already near top
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }
      }, 100);
    };

    // Handle initial page load
    window.addEventListener('focus', handleWindowFocus);
    
    // Scroll to top immediately on component mount for new windows
    if (document.readyState === 'complete') {
      window.scrollTo(0, 0);
    } else {
      // If page is still loading, wait for it to complete
      window.addEventListener('load', () => {
        window.scrollTo(0, 0);
      }, { once: true });
    }

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  return null; // This component doesn't render anything
}
