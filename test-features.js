// Quick application feature test
console.log('🧪 Starting ResumeAI Feature Test...');

// Test 1: Check if main dependencies are loaded
console.log('📦 Checking dependencies...');
console.log('React version:', React.version);
console.log('Router location:', window.location.pathname);

// Test 2: Check API configuration
console.log('🔗 API Configuration:');
console.log('OpenAI Key:', !!import.meta.env.VITE_OPENAI_API_KEY);
console.log('Groq Key:', !!import.meta.env.VITE_GROQ_API_KEY);
console.log('Supabase URL:', !!import.meta.env.VITE_SUPABASE_URL);

// Test 3: Check PDF.js worker
console.log('📄 PDF.js Status:');
console.log('PDF.js version:', window.pdfjsLib?.version || 'Not loaded');
console.log('Worker source:', window.pdfjsLib?.GlobalWorkerOptions?.workerSrc || 'Not set');

// Test 4: Check Supabase connection
console.log('🔐 Authentication Status:');
console.log('Supabase client available:', !!window.supabase);

// Test 5: Check theme system
console.log('🎨 Theme System:');
console.log('Current theme:', document.documentElement.className.includes('dark') ? 'dark' : 'light');
console.log('Theme toggle available:', !!document.querySelector('[data-theme-toggle]'));

// Test 6: Check navigation
console.log('🧭 Navigation:');
const navLinks = document.querySelectorAll('nav a, header a');
console.log('Navigation links found:', navLinks.length);

// Test 7: Test form validation
console.log('📝 Form Systems:');
const forms = document.querySelectorAll('form');
console.log('Forms found:', forms.length);

// Test 8: Check error boundaries
console.log('🛡️ Error Handling:');
console.log('Error boundary components active:', !!window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__);

console.log('✅ Feature test complete. Check results above.');
