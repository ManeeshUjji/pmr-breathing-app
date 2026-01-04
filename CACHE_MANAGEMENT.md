# Cache Management Guide

## Automatic Cache Clearing

The app now automatically clears caches when:
1. **App version changes** - Detects new deployments and clears all caches
2. **Manual cache clear requested** - Via localStorage flag (see below)

## Manual Cache Clearing

### Option 1: Browser Console (Easiest)
Open browser console (F12) and run:
```javascript
window.clearCache()
```
This will:
- Clear all service workers
- Clear all browser caches
- Clear localStorage (except auth tokens)
- Clear sessionStorage
- Reload the page

### Option 2: localStorage Flag
In browser console:
```javascript
localStorage.setItem('tranquil_clear_cache', 'true');
location.reload();
```

### Option 3: Browser Settings
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage → Clear site data
4. Or use browser's "Clear browsing data" option

## Cache Headers

The app uses aggressive cache-busting headers:
- **All pages**: `Cache-Control: public, max-age=0, must-revalidate`
- **Static assets**: `Cache-Control: public, max-age=31536000, immutable`

This ensures pages always check for updates while static assets can be cached.

## Version Detection

The app tracks version changes using:
- `NEXT_PUBLIC_APP_VERSION` environment variable (set at build time)
- Stored in localStorage as `tranquil_app_version`

When version changes, all caches are automatically cleared on next page load.

## Troubleshooting

If you're still seeing stale content:

1. **Hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Use console**: Run `window.clearCache()` in browser console
3. **Clear browser data**: Settings → Privacy → Clear browsing data
4. **Incognito mode**: Test in incognito/private window to bypass cache

## For Developers

To force cache clear on deployment, update `NEXT_PUBLIC_APP_VERSION` in your environment variables or set it in Vercel project settings.

