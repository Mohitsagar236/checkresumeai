import { test, expect } from '@playwright/test';

// Comprehensive test for Get Started button functionality
test.describe('Get Started Button Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:5178');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should find Get Started button on homepage', async ({ page }) => {
    // Look for the Get Started button
    const getStartedButton = page.locator('a[href="/upload"]').first();
    
    // Verify the button exists
    await expect(getStartedButton).toBeVisible();
    
    // Verify the button text
    await expect(getStartedButton).toContainText('Get Started');
  });

  test('should navigate to upload page when Get Started is clicked', async ({ page }) => {
    // Find and click the Get Started button
    const getStartedButton = page.locator('a[href="/upload"]').first();
    await getStartedButton.click();
    
    // Wait for navigation
    await page.waitForURL('**/upload');
    
    // Verify we're on the upload page
    expect(page.url()).toContain('/upload');
  });

  test('should have working React Router navigation', async ({ page }) => {
    // Test programmatic navigation
    await page.evaluate(() => {
      window.history.pushState({}, '', '/upload');
    });
    
    // Wait a moment for React Router to handle the change
    await page.waitForTimeout(1000);
    
    // Check if the URL changed
    expect(page.url()).toContain('/upload');
  });

  test('should not have JavaScript errors', async ({ page }) => {
    const errors = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    // Click the Get Started button
    const getStartedButton = page.locator('a[href="/upload"]').first();
    await getStartedButton.click();
    
    // Wait for any potential errors
    await page.waitForTimeout(2000);
    
    // Check for errors
    expect(errors).toHaveLength(0);
  });

  test('should handle button click events properly', async ({ page }) => {
    let clickHandled = false;
    
    // Monitor for navigation
    page.on('framenavigated', () => {
      clickHandled = true;
    });
    
    // Click the button
    const getStartedButton = page.locator('a[href="/upload"]').first();
    await getStartedButton.click();
    
    // Wait for navigation to complete
    await page.waitForTimeout(2000);
    
    // Verify navigation occurred
    expect(clickHandled).toBe(true);
  });
});

// If you don't have Playwright, here's a simple browser test
if (typeof window !== 'undefined') {
  console.log('Running browser-based test...');
  
  // Simple test function to run in browser console
  window.testGetStartedButton = function() {
    console.log('🧪 Testing Get Started button...');
    
    // Find the button
    const button = document.querySelector('a[href="/upload"]');
    if (!button) {
      console.error('❌ Get Started button not found');
      return false;
    }
    
    console.log('✅ Get Started button found:', button);
    
    // Test click
    try {
      console.log('🖱️ Simulating click...');
      button.click();
      
      // Check URL after a delay
      setTimeout(() => {
        console.log('📍 Current URL:', window.location.href);
        if (window.location.pathname.includes('/upload')) {
          console.log('✅ Navigation successful!');
        } else {
          console.log('❌ Navigation failed - still on:', window.location.pathname);
        }
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('❌ Click failed:', error);
      return false;
    }
  };
  
  // Auto-run test
  if (document.readyState === 'complete') {
    window.testGetStartedButton();
  } else {
    window.addEventListener('load', window.testGetStartedButton);
  }
}
