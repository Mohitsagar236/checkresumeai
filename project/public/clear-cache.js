// Clear browser cache and localStorage to fix Supabase URL issues
(function() {
    console.log('Clearing browser cache and localStorage...');
    
    try {
        // Clear localStorage
        localStorage.clear();
        console.log('✅ localStorage cleared');
        
        // Clear sessionStorage
        sessionStorage.clear();
        console.log('✅ sessionStorage cleared');
        
        // Clear IndexedDB if available
        if ('indexedDB' in window) {
            indexedDB.databases().then(databases => {
                databases.forEach(db => {
                    if (db.name) {
                        console.log(`Clearing IndexedDB: ${db.name}`);
                        indexedDB.deleteDatabase(db.name);
                    }
                });
            }).catch(err => {
                console.warn('Could not clear IndexedDB:', err);
            });
        }
        
        // Clear any Supabase-related cache keys
        const cacheKeys = [
            'ra-auth',
            'ra-profile',
            'supabase.auth.token',
            'sb-auth-token',
            'sb-refresh-token'
        ];
        
        cacheKeys.forEach(key => {
            try {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            } catch (e) {
                console.warn(`Could not remove cache key: ${key}`, e);
            }
        });
        
        console.log('✅ Cache cleared successfully');
        console.log('🔄 Please reload the page to apply changes');
        
        // Show notification to user
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        notification.innerHTML = `
            <strong>✅ Cache Cleared!</strong><br>
            Please reload the page to apply changes.
        `;
        document.body.appendChild(notification);
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
})();
