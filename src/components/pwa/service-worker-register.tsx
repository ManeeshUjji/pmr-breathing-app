'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Only unregister service workers silently in the background
    // No automatic cache clearing, no reloads
    const cleanup = async () => {
      try {
        // Silently unregister any existing service workers (one-time cleanup)
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
        }
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.error('Service worker cleanup error:', error);
      }
    };

    // Only run once on mount, don't interfere with normal browsing
    cleanup();
  }, []);

  return null;
}

