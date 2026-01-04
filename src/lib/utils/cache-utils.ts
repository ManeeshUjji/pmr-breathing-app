/**
 * Cache utility functions
 * Can be called from browser console: window.clearCache()
 * 
 * NOTE: This is for manual use only. No automatic cache clearing is performed.
 */

export async function clearAllCaches() {
  try {
    console.log('Clearing caches...');
    
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Service worker unregistered:', registration.scope);
      }
    }

    // Clear all browser caches (not localStorage)
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log('Cache deleted:', cacheName);
      }
    }

    // Clear sessionStorage only (not localStorage to preserve auth)
    sessionStorage.clear();

    console.log('Caches cleared! Auth session preserved.');
    console.log('You may need to refresh the page to see changes.');
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
}

// Clear everything including auth (for complete reset)
export async function clearAllCachesAndAuth() {
  try {
    console.log('Clearing all caches including auth...');
    
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }

    // Clear all browser caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
      }
    }

    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    console.log('All caches and auth cleared!');
    console.log('You will need to log in again.');
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
}

// Make it available globally for browser console access
if (typeof window !== 'undefined') {
  (window as typeof window & { clearCache: typeof clearAllCaches; clearAll: typeof clearAllCachesAndAuth }) = window as typeof window & { clearCache: typeof clearAllCaches; clearAll: typeof clearAllCachesAndAuth };
  (window as typeof window & { clearCache: typeof clearAllCaches }).clearCache = clearAllCaches;
  (window as typeof window & { clearAll: typeof clearAllCachesAndAuth }).clearAll = clearAllCachesAndAuth;
}
