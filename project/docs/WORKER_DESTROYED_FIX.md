# Fixing the "Worker was destroyed" Error in PDF.js

## Problem Description

The "Worker was destroyed" error occurs when using PDF.js to render multiple PDF files in a React application. This typically happens when:

1. The worker is initialized multiple times
2. Worker is created but then destroyed while still being used
3. Race conditions between component unmounting and PDF loading
4. Multiple components trying to use or initialize the same worker

## Key Error Message

```
Error loading PDF: Error: Worker was destroyed
    at terminateEarly (pdfjs-dist.js?v=f1995f55:12264:40)
```

## Root Causes and Solutions

### 1. Multiple Worker Initialization

**Problem:** In React's development mode with StrictMode, components mount, unmount, and remount, causing multiple worker initializations.

**Solution:**
- Use a singleton pattern for worker initialization
- Set `pdfjsLib.GlobalWorkerOptions.workerPort = null` before setting workerSrc
- Only set workerSrc once, never change it after initialization

### 2. Component Unmounting During PDF Loading

**Problem:** When a component unmounts while loading a PDF, it may destroy the worker that's still being used.

**Solution:**
- Don't actually destroy the worker, just mark it as destroyed
- Use `loadingTask.destroyed = true` instead of actually calling destroy()
- Use `pdfDocument.cleanup()` instead of just destroy()

### 3. Race Conditions in Worker Initialization

**Problem:** Async operations can cause race conditions where worker initialization is overwritten.

**Solution:**
- Use a promise-based initialization system with caching
- Validate worker availability before using it
- Check if worker is already available before trying to initialize again

### 4. Multiple Component Instances

**Problem:** Multiple instances of PDF viewers on the same page can conflict.

**Solution:**
- Share the same worker instance across all components
- Use a context provider for the PDF worker state
- Ensure worker initialization happens at the app level, not component level

## Implementation Details

Our solution involved:

1. **Single Worker Initialization:** 
   - Initialize worker once at the app level
   - Preserve the worker port across PDF loading operations

2. **Proper Cleanup:**
   - Avoid destroying the worker when unmounting components
   - Use careful loading task management

3. **Error Handling:**
   - Automatically retry initialization with backoff
   - Show user-friendly error messages

4. **Multiple Fallback Sources:**
   - Try local worker files first
   - Fall back to CDN sources if needed

## Testing Verification

After implementing these fixes:
1. PDF rendering works consistently across multiple file uploads
2. No more "Worker was destroyed" errors in the console
3. Components can unmount and remount without losing worker functionality
4. Better error recovery and resilience in poor network conditions
