// This script checks if the SignupModal component is being properly initialized
// Run this in the browser console when on the /signup page

console.log('== Testing SignupModal Component ==');
console.log('Current URL:', window.location.href);

// Check if the dialog/modal element exists
const dialogElement = document.querySelector('[role="dialog"]');
console.log('Modal dialog element found:', !!dialogElement);

if (dialogElement) {
  console.log('Modal dialog properties:', {
    className: dialogElement.className,
    style: dialogElement.getAttribute('style'),
    ariaHidden: dialogElement.getAttribute('aria-hidden'),
    display: window.getComputedStyle(dialogElement).display
  });
}

// Check if any Dialog-related components are rendered
const overlayElement = document.querySelector('[data-radix-dialog-overlay]');
console.log('Dialog overlay element found:', !!overlayElement);

const contentElement = document.querySelector('[data-radix-dialog-content]');
console.log('Dialog content element found:', !!contentElement);

// Check for other expected elements in the form
const titleElement = document.querySelector('.text-gradient-luxury');
console.log('Title element found:', !!titleElement);

const emailInput = document.querySelector('input[type="email"]');
console.log('Email input found:', !!emailInput);

const passwordInputs = document.querySelectorAll('input[type="password"]');
console.log('Password inputs found:', passwordInputs.length);

const submitButton = document.querySelector('button[type="submit"]');
console.log('Submit button found:', !!submitButton);

// Check if React is loaded and rendering properly
console.log('React loaded:', typeof React !== 'undefined');

// Check if any error messages are displayed on the page
const errorElements = Array.from(document.querySelectorAll('.text-red-500, .error-message'));
if (errorElements.length > 0) {
  console.log('Error messages found:', errorElements.map(el => el.textContent));
}
