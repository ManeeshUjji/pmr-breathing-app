/**
 * Cache utility functions
 * Can be called from browser console: window.clearCache()
 * 
 * NOTE: This is for manual use only. No automatic cache clearing is performed.
 */

export async function clearAllCaches() {
  try {
    console.log('🧹 Clearing caches...');
    
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('✓ Service worker unregistered:', registration.scope);
      }
    }

    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log('✓ Cache deleted:', cacheName);
      }
    }

    // Clear localStorage (except auth tokens)
    const authKeys = ['supabase.auth.token', 'sb-'];
    const keysToKeep: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !authKeys.some(authKey => key.startsWith(authKey))) {
        const value = localStorage.getItem(key);
        if (value) {
          keysToKeep.push(key);
        }
      }
    }
    localStorage.clear();
    keysToKeep.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) localStorage.setItem(key, value);
    });

    // Clear sessionStorage
    sessionStorage.clear();

    console.log('✅ All caches cleared!');
    console.log('💡 You may need to refresh the page to see changes.');
    // Don't auto-reload - let user decide when to refresh
  } catch (error) {
    console.error('❌ Error clearing caches:', error);
  }
}

// Make it available globally for browser console access
if (typeof window !== 'undefined') {
  (window as any).clearCache = clearAllCaches;
}

