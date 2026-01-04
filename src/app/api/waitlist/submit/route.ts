// Backwards-compatible endpoint (older clients may still POST here).
// Delegate to the current Loops-backed waitlist handler.
export { POST } from '@/app/api/loops/waitlist/route';


