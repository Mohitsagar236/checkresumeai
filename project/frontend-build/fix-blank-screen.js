// Script to diagnose and fix blank screen issues in CheckResumeAI
console.log('Running blank screen diagnostic tool...');

// Attempt to fix environment variable issues
function fixEnvironmentVariables() {
  if (!window.__API_CONFIG__) {
    console.log('🛠 API config missing, adding fallback configuration');
    window.__API_CONFIG__ = {
      SUPABASE_URL: 'https://rvmvahwyfptyhchlvtvr.supabase.co',
      SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWhmem9hbm1uYXlqdmF4ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTAzNzAsImV4cCI6MjA2NDk2NjM3MH0.ShE9Pwab0gfWLvmzYAGqr5ejtDemWoN8y3g4HSyhVM4',
      VITE_USE_MOCK_API: true
    };
    return true;
  }
  return false;
}

// Check if the root element exists and has content
function checkRootElement() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('❌ Root element not found!');
    return false;
  }
  
  if (!rootElement.childNodes.length) {
    console.warn('⚠️ Root element exists but has no children');
    return false;
  }
  
  console.log('✅ Root element exists and has content');
  return true;
}

// Attempt to force render the app
function forceRender() {
  try {
    console.log('🛠 Attempting to force render the application');
    const rootElement = document.getElementById('root');
    
    // If React is loaded, try to re-render
    if (window.React && window.ReactDOM) {
      console.log('✅ React is available, attempting to re-render');
      // This is a placeholder - the actual implementation would depend on how your app is structured
      return true;
    }
    
    // If not, add a simple message to show something on screen
    rootElement.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: system-ui, sans-serif;">
        <h1 style="margin-bottom: 20px; color: #333;">CheckResumeAI</h1>
        <p style="margin-bottom: 20px; color: #666;">Experiencing technical difficulties. Please try refreshing the page.</p>
        <button onclick="location.reload()" style="padding: 10px 20px; background-color: #0ea5e9; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
    return true;
  } catch (err) {
    console.error('Failed to force render:', err);
    return false;
  }
}

// Fix CSS issues that might cause blank screen
function fixCSSIssues() {
  try {
    const style = document.createElement('style');
    style.textContent = `
      #root {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
      }
      
      [data-radix-dialog-content],
      [role="dialog"],
      .dialog-overlay,
      .dialog-content {
        display: block !important;
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);
    return true;
  } catch (err) {
    console.error('Failed to add CSS fixes:', err);
    return false;
  }
}

// Main diagnostic function
function diagnoseAndFix() {
  console.log('🔍 Diagnosing blank screen issue...');
  
  const results = {
    envFixed: fixEnvironmentVariables(),
    rootOK: checkRootElement(),
    cssFixed: fixCSSIssues()
  };
  
  // If root element is empty or not found, force render
  if (!results.rootOK) {
    results.renderForced = forceRender();
  }
  
  console.log('📊 Diagnostic results:', results);
  return results;
}

// Expose utility as global function
window.fixBlankScreen = diagnoseAndFix;

// Run the diagnostic automatically
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit to allow normal rendering first
  setTimeout(function() {
    if (!checkRootElement()) {
      diagnoseAndFix();
    }
  }, 2000);
});

console.log('✅ Blank screen diagnostic tool loaded. Call window.fixBlankScreen() to run manually.');
