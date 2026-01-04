'use client';

import { useEffect } from 'react';
import { clearAllCaches } from '@/lib/utils/cache-utils';

// Version to force cache invalidation on updates
// This will be set at build time via NEXT_PUBLIC_APP_VERSION
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || new Date().getTime().toString();
const VERSION_KEY = 'tranquil_app_version';
const CACHE_CLEAR_KEY = 'tranquil_clear_cache';

export function ServiceWorkerRegister() {
  useEffect(() => {
    const cleanup = async () => {
      try {
        // Check if manual cache clear was requested (via localStorage flag)
        const shouldClearCache = localStorage.getItem(CACHE_CLEAR_KEY) === 'true';
        
        // Check if version changed - if so, force cache clear
        const storedVersion = localStorage.getItem(VERSION_KEY);
        const versionChanged = storedVersion !== APP_VERSION;

        if (shouldClearCache || versionChanged) {
          console.log('Cache clear requested:', { shouldClearCache, versionChanged });

          if (versionChanged) {
            console.log('App version changed, clearing all caches...');
            
            // Clear localStorage (except auth tokens)
            const authKeys = ['supabase.auth.token', 'sb-'];
            const keysToKeep: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && !authKeys.some(authKey => key.startsWith(authKey))) {
                const value = localStorage.getItem(key);
                if (value) keysToKeep.push(key);
              }
            }
            localStorage.clear();
            keysToKeep.forEach(key => {
              const value = localStorage.getItem(key);
              if (value) localStorage.setItem(key, value);
            });

            // Clear sessionStorage
            sessionStorage.clear();
          }

        // Unregister all service workers
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log('SW unregistered:', registration.scope);
          }
        }

        // Clear all caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
            console.log('Cache deleted:', cacheName);
          }
        }

        // Update stored version
        if (versionChanged) {
          localStorage.setItem(VERSION_KEY, APP_VERSION);
          console.log('Cache cleared due to version change');
        }

        // Clear the manual cache clear flag
        if (shouldClearCache) {
          localStorage.removeItem(CACHE_CLEAR_KEY);
          console.log('Cache cleared manually');
        }

          // Force reload if version changed or manual clear (only once)
          if ((versionChanged || shouldClearCache) && !sessionStorage.getItem('version_reload_done')) {
            sessionStorage.setItem('version_reload_done', 'true');
            window.location.reload();
            return;
          }
        }
      } catch (error) {
        console.error('Error during cache cleanup:', error);
      }
    };

    cleanup();
  }, []);

  return null;
}

