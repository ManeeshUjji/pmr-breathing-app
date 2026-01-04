# Cache Management Guide

## Cache Strategy

The app uses Next.js default caching behavior, which automatically handles cache invalidation on deployments. No automatic cache clearing is performed to avoid disrupting user experience.

## Manual Cache Clearing (If Needed)

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

### Option 2: Browser Settings
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage → Clear site data
4. Or use browser's "Clear browsing data" option

## Cache Strategy

The app uses Next.js default caching:
- **Pages**: Cached with automatic invalidation on deployments
- **Static assets**: Cached with long-term storage
- **API routes**: No caching by default

Next.js automatically handles cache invalidation when you deploy new versions, so users will get updates without needing to clear cache manually.

## Troubleshooting

If you're still seeing stale content:

1. **Hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Use console**: Run `window.clearCache()` in browser console
3. **Clear browser data**: Settings → Privacy → Clear browsing data
4. **Incognito mode**: Test in incognito/private window to bypass cache

## For Developers

To force cache clear on deployment, update `NEXT_PUBLIC_APP_VERSION` in your environment variables or set it in Vercel project settings.

