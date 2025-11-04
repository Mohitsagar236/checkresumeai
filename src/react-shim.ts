/**
 * React Shim - Ensures React loads FIRST before any other dependencies
 * This file MUST be imported at the very top of main.tsx
 */

// Import and immediately export React to force it to load first
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

// Force these to be included in the bundle
export { React, ReactDOM };

// Set as global to ensure all chunks can access it
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
}
