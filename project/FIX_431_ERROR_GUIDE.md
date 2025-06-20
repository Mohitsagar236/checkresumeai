# Fix for 431 Request Header Fields Too Large Error

## Problem
The application was experiencing a **431 Request Header Fields Too Large** error, which occurs when HTTP request headers exceed the server's limit (typically 8KB by default).

## Root Cause
This error was likely caused by:
1. Large authentication tokens stored in localStorage/sessionStorage
2. Large cookies being sent with requests
3. Multiple custom headers accumulating to exceed the size limit
4. Supabase session data being too large

## Solution Applied

### 1. Increased Node.js Header Size Limit
- Updated the development server to use `--max-http-header-size=32768` (32KB instead of default 8KB)
- Added new npm scripts:
  - `npm run dev:safe` - Uses cross-env to set NODE_OPTIONS with increased header size
  - `npm run dev` - Direct node command with increased header size

### 2. Optimized Supabase Client Configuration
- **Shortened storage keys**: Changed from `resume-analyzer-auth` to `ra-auth`
- **Added size limits**: Auth data over 4KB is not stored to prevent oversized localStorage
- **Truncated large headers**: Custom fetch wrapper removes headers over 1KB
- **Optimized global headers**: Shortened `x-application-name` to `x-app`

### 3. Improved Profile Caching
- Shortened cache key from `resume-analyzer-profile` to `ra-profile`
- Added size limits for cached profile data (max 2KB)
- Auto-cleanup of oversized cached data

### 4. Browser Cache Management
- Added instructions to clear localStorage/sessionStorage
- Included cache clearing in troubleshooting steps

## How to Use

### Start Development Server
```powershell
# Option 1: Use the safe dev script
npm run dev:safe

# Option 2: Use the PowerShell fix script
./fix-431-error.ps1

# Option 3: Manual start with environment variable
$env:NODE_OPTIONS = "--max-http-header-size=32768"
npm run dev
```

### If Error Persists
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear Local Storage for your localhost domain
4. Clear Session Storage
5. Clear all cookies for localhost
6. Hard refresh the page (Ctrl+Shift+R)

## Files Modified
- `package.json` - Added new dev scripts with header size limit
- `vite.config.ts` - Enhanced middleware for header cleanup
- `src/utils/supabaseClient.ts` - Optimized storage and header management
- `fix-431-error.ps1` - PowerShell script for automated fix
- `start-dev-server.ps1` - Alternative PowerShell startup script

## Technical Details
- **Default Node.js header limit**: 8KB (8192 bytes)
- **New header limit**: 32KB (32768 bytes)
- **Max auth data size**: 4KB
- **Max profile cache size**: 2KB
- **Individual header limit**: 1KB

This solution maintains application functionality while preventing the 431 error by managing header sizes proactively.
