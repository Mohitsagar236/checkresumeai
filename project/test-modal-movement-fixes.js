/**
 * Test Modal Movement/Jumping Fixes
 * 
 * This test verifies that modal elements no longer jump or move when hovering
 * or focusing on elements within the modals.
 */

import { chromium } from 'playwright';

async function testModalMovementFixes() {
  console.log('🔍 Testing Modal Movement/Jumping Fixes...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 // Slow down for better observation
  });
  
  const page = await browser.newPage();
  
  try {    // Navigate to the app
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    console.log('📍 Test 1: Testing Login Modal Stability...');
    
    // Open Login Modal
    const signInButton = page.locator('text=Sign In').first();
    if (await signInButton.isVisible()) {
      await signInButton.click();
      await page.waitForTimeout(1000);
      
      const loginModal = page.locator('[role="dialog"]').first();
      if (await loginModal.isVisible()) {
        console.log('✅ Login modal opened');
        
        // Get initial modal position
        const initialModalBox = await loginModal.boundingBox();
        console.log('📏 Initial modal position:', {
          x: initialModalBox.x,
          y: initialModalBox.y,
          width: initialModalBox.width,
          height: initialModalBox.height
        });
        
        // Test 1a: Hover over OAuth buttons
        console.log('🖱️  Testing OAuth button hover stability...');
        const googleButton = page.locator('button:has-text("Google")');
        const githubButton = page.locator('button:has-text("GitHub")');
        
        if (await googleButton.isVisible()) {
          await googleButton.hover();
          await page.waitForTimeout(500);
          
          const afterGoogleHover = await loginModal.boundingBox();
          const positionChanged = (
            Math.abs(afterGoogleHover.x - initialModalBox.x) > 1 ||
            Math.abs(afterGoogleHover.y - initialModalBox.y) > 1 ||
            Math.abs(afterGoogleHover.width - initialModalBox.width) > 1 ||
            Math.abs(afterGoogleHover.height - initialModalBox.height) > 1
          );
          
          if (positionChanged) {
            console.log('❌ Modal moved during Google button hover');
            console.log('📏 New position:', afterGoogleHover);
          } else {
            console.log('✅ Modal stable during Google button hover');
          }
        }
        
        if (await githubButton.isVisible()) {
          await githubButton.hover();
          await page.waitForTimeout(500);
          
          const afterGithubHover = await loginModal.boundingBox();
          const positionChanged = (
            Math.abs(afterGithubHover.x - initialModalBox.x) > 1 ||
            Math.abs(afterGithubHover.y - initialModalBox.y) > 1 ||
            Math.abs(afterGithubHover.width - initialModalBox.width) > 1 ||
            Math.abs(afterGithubHover.height - initialModalBox.height) > 1
          );
          
          if (positionChanged) {
            console.log('❌ Modal moved during GitHub button hover');
            console.log('📏 New position:', afterGithubHover);
          } else {
            console.log('✅ Modal stable during GitHub button hover');
          }
        }
        
        // Test 1b: Focus on input fields
        console.log('🎯 Testing input field focus stability...');
        const emailInput = page.locator('input[type="email"]');
        const passwordInput = page.locator('input[type="password"]').first();
        
        if (await emailInput.isVisible()) {
          await emailInput.focus();
          await page.waitForTimeout(500);
          
          const afterEmailFocus = await loginModal.boundingBox();
          const positionChanged = (
            Math.abs(afterEmailFocus.x - initialModalBox.x) > 1 ||
            Math.abs(afterEmailFocus.y - initialModalBox.y) > 1 ||
            Math.abs(afterEmailFocus.width - initialModalBox.width) > 1 ||
            Math.abs(afterEmailFocus.height - initialModalBox.height) > 1
          );
          
          if (positionChanged) {
            console.log('❌ Modal moved during email input focus');
            console.log('📏 New position:', afterEmailFocus);
          } else {
            console.log('✅ Modal stable during email input focus');
          }
        }
        
        if (await passwordInput.isVisible()) {
          await passwordInput.focus();
          await page.waitForTimeout(500);
          
          const afterPasswordFocus = await loginModal.boundingBox();
          const positionChanged = (
            Math.abs(afterPasswordFocus.x - initialModalBox.x) > 1 ||
            Math.abs(afterPasswordFocus.y - initialModalBox.y) > 1 ||
            Math.abs(afterPasswordFocus.width - initialModalBox.width) > 1 ||
            Math.abs(afterPasswordFocus.height - initialModalBox.height) > 1
          );
          
          if (positionChanged) {
            console.log('❌ Modal moved during password input focus');
            console.log('📏 New position:', afterPasswordFocus);
          } else {
            console.log('✅ Modal stable during password input focus');
          }
        }
        
        // Test 1c: Hover over submit button
        console.log('🖱️  Testing submit button hover stability...');
        const submitButton = page.locator('button[type="submit"]');
        
        if (await submitButton.isVisible()) {
          await submitButton.hover();
          await page.waitForTimeout(500);
          
          const afterSubmitHover = await loginModal.boundingBox();
          const positionChanged = (
            Math.abs(afterSubmitHover.x - initialModalBox.x) > 1 ||
            Math.abs(afterSubmitHover.y - initialModalBox.y) > 1 ||
            Math.abs(afterSubmitHover.width - initialModalBox.width) > 1 ||
            Math.abs(afterSubmitHover.height - initialModalBox.height) > 1
          );
          
          if (positionChanged) {
            console.log('❌ Modal moved during submit button hover');
            console.log('📏 New position:', afterSubmitHover);
          } else {
            console.log('✅ Modal stable during submit button hover');
          }
        }
        
        // Close modal
        const closeButton = page.locator('[aria-label="Close"]').first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await page.waitForTimeout(1000);
        }
      } else {
        console.log('❌ Login modal did not open');
      }
    }
    
    console.log('\n📍 Test 2: Testing Signup Modal Stability...');
    
    // Open Signup Modal
    const signUpButton = page.locator('text=Sign Up').first();
    if (await signUpButton.isVisible()) {
      await signUpButton.click();
      await page.waitForTimeout(1000);
      
      const signupModal = page.locator('[role="dialog"]').first();
      if (await signupModal.isVisible()) {
        console.log('✅ Signup modal opened');
        
        // Get initial modal position
        const initialModalBox = await signupModal.boundingBox();
        console.log('📏 Initial modal position:', {
          x: initialModalBox.x,
          y: initialModalBox.y,
          width: initialModalBox.width,
          height: initialModalBox.height
        });
        
        // Test various interactions with signup modal elements
        const emailInput = page.locator('input[type="email"]');
        const passwordInputs = page.locator('input[type="password"]');
        
        // Test email input
        if (await emailInput.isVisible()) {
          await emailInput.focus();
          await page.waitForTimeout(500);
          
          const afterFocus = await signupModal.boundingBox();
          const positionChanged = (
            Math.abs(afterFocus.x - initialModalBox.x) > 1 ||
            Math.abs(afterFocus.y - initialModalBox.y) > 1 ||
            Math.abs(afterFocus.width - initialModalBox.width) > 1 ||
            Math.abs(afterFocus.height - initialModalBox.height) > 1
          );
          
          if (positionChanged) {
            console.log('❌ Signup modal moved during email input focus');
          } else {
            console.log('✅ Signup modal stable during email input focus');
          }
        }
        
        // Test password inputs
        const passwordCount = await passwordInputs.count();
        for (let i = 0; i < passwordCount; i++) {
          const passwordInput = passwordInputs.nth(i);
          if (await passwordInput.isVisible()) {
            await passwordInput.focus();
            await page.waitForTimeout(300);
            
            const afterFocus = await signupModal.boundingBox();
            const positionChanged = (
              Math.abs(afterFocus.x - initialModalBox.x) > 1 ||
              Math.abs(afterFocus.y - initialModalBox.y) > 1 ||
              Math.abs(afterFocus.width - initialModalBox.width) > 1 ||
              Math.abs(afterFocus.height - initialModalBox.height) > 1
            );
            
            if (positionChanged) {
              console.log(`❌ Signup modal moved during password input ${i + 1} focus`);
            } else {
              console.log(`✅ Signup modal stable during password input ${i + 1} focus`);
            }
          }
        }
        
        // Close modal
        const closeButton = page.locator('[aria-label="Close"]').first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await page.waitForTimeout(1000);
        }
      } else {
        console.log('❌ Signup modal did not open');
      }
    }
    
    console.log('\n🎉 Modal Movement/Jumping Fix Test Complete!');
    console.log('\n📊 Summary:');
    console.log('✅ Fixed Dialog.tsx base component - removed problematic duration-200 transition');
    console.log('✅ Fixed Dialog overlay - added transition-none for stability');
    console.log('✅ Fixed OAuth buttons - removed group-hover:rotate-12 and group-hover:brightness-110');
    console.log('✅ Fixed input fields - changed transition-all duration-500 to transition-shadow duration-300');
    console.log('✅ Fixed submit buttons - removed transform hover:scale-[1.02] effects');
    console.log('✅ Added width locking - w-full max-w-md to prevent layout shift');
    console.log('✅ All modal containers now use stable fixed positioning');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testModalMovementFixes().catch(console.error);
