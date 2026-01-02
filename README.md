# Tranquil - PMR & Breathing Relaxation App

A web-first Progressive Muscle Relaxation (PMR), breathing exercises, and meditation app built with Next.js, Supabase, and Stripe.

## Current Development Status

**Phase: Initial Build Complete - Needs Build Fixes**

All major features have been implemented. The app needs minor build fixes before it can run.

### What's Been Built

| Feature | Status | Location |
|---------|--------|----------|
| Project Setup | ✅ Complete | Next.js 16, TypeScript, Tailwind CSS |
| Supabase Client | ✅ Complete | `src/lib/supabase/` |
| Auth System | ✅ Complete | Login, Signup, Middleware, User Context |
| Landing Page | ✅ Complete | `src/app/page.tsx` |
| Quiz Onboarding | ✅ Complete | `src/app/(onboarding)/onboarding/` |
| Dashboard | ✅ Complete | `src/app/(dashboard)/dashboard/` |
| PMR Player | ✅ Complete | `src/components/exercises/pmr-player.tsx` |
| Breathing Guide | ✅ Complete | `src/components/exercises/breathing-guide.tsx` |
| Meditation Player | ✅ Complete | `src/components/exercises/meditation-player.tsx` |
| Program System | ✅ Complete | `src/app/(dashboard)/programs/` |
| Stripe Integration | ✅ Complete | `src/app/api/stripe/`, `src/lib/stripe/` |
| PWA Setup | ✅ Complete | `public/sw.js`, `public/manifest.json` |
| Database Schema | ✅ Complete | `supabase/migrations/` |
| Seed Data | ✅ Complete | `supabase/migrations/002_seed_data.sql` |

### Known Build Issues to Fix

1. **Supabase Admin Client Initialization** - The webhook route creates Supabase admin client at module level, failing at build time when env vars aren't available:
   - File: `src/app/api/stripe/webhook/route.ts`
   - Fix: Lazily initialize the Supabase admin client similar to how Stripe was fixed

2. **Middleware Deprecation Warning** - Next.js 16 shows warning about middleware convention:
   - File: `src/middleware.ts`
   - The app still works, but may need to migrate to "proxy" convention in future

### Environment Variables Required

Create `.env.local` with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_MONTHLY_PRICE_ID=your_monthly_price_id
STRIPE_YEARLY_PRICE_ID=your_yearly_price_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/                 # Auth pages (login, signup)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── dashboard/page.tsx  # Main dashboard
│   │   ├── programs/           # Program listing & details
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── exercises/[id]/page.tsx  # Exercise player router
│   │   ├── profile/page.tsx
│   │   └── layout.tsx          # Dashboard layout with nav
│   ├── (onboarding)/           # Quiz onboarding
│   │   ├── onboarding/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/callback/route.ts
│   │   └── stripe/
│   │       ├── checkout/route.ts
│   │       ├── webhook/route.ts   # ⚠️ Needs fix
│   │       └── portal/route.ts
│   ├── pricing/page.tsx
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Tailwind + custom CSS
├── components/
│   ├── exercises/
│   │   ├── pmr-player.tsx      # PMR with body visualization + TTS
│   │   ├── breathing-guide.tsx # Breathing with circle animation
│   │   ├── meditation-player.tsx
│   │   ├── body-visualization.tsx
│   │   └── index.ts
│   ├── layout/
│   │   └── dashboard-nav.tsx   # Top/bottom navigation
│   ├── pwa/
│   │   ├── install-prompt.tsx
│   │   └── service-worker-register.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── index.ts
├── contexts/
│   └── user-context.tsx        # User, profile, subscription state
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts       # Auth middleware helper
│   ├── stripe/
│   │   ├── client.ts           # loadStripe
│   │   └── server.ts           # Stripe server (lazy init)
│   ├── tts/
│   │   └── speech.ts           # Web Speech API wrapper
│   └── utils/
│       └── cn.ts               # classnames utility
├── types/
│   ├── database.ts             # Supabase table types
│   └── index.ts                # App-wide types
└── middleware.ts               # Auth route protection
```

## Database Schema

Tables in `supabase/migrations/001_initial_schema.sql`:

- **profiles** - User data, quiz results, preferences
- **programs** - Relaxation programs (PMR, breathing, meditation, mixed)
- **exercises** - Individual exercises with content, audio scripts
- **user_programs** - User enrollment and progress tracking
- **sessions** - Completed exercise sessions
- **subscriptions** - Stripe subscription status

## Features Implemented

### 1. Authentication
- Email/password signup and login
- Protected routes via middleware
- User profile management
- Session persistence

### 2. Quiz Onboarding
- 5-question personalization quiz
- Questions: stress sources, goals, experience, duration, tension areas
- Auto-enrolls user in recommended program

### 3. Exercise Players
- **PMR Player**: Body visualization SVG, muscle group highlighting, TTS guidance, phase-based timing (tense/hold/release/rest)
- **Breathing Guide**: Animated circle, phase labels, pattern display (inhale/hold/exhale), multiple patterns supported
- **Meditation Player**: Ambient orb visuals, floating particles, TTS for guidance

### 4. Program System
- Program listing with filters (category, free/premium)
- Program detail view with day-by-day schedule
- Progress tracking (current day, completion)
- Session logging

### 5. Subscription (Stripe)
- Pricing page with monthly/annual toggle
- Checkout session creation
- Webhook handling for subscription lifecycle
- Billing portal access

### 6. PWA
- Service worker for caching
- Install prompt
- Manifest for homescreen install

## Design System

### Colors (CSS Variables in globals.css)
- `--color-accent`: #7fa99b (sage green)
- `--color-lavender`: #a8a4ce
- `--color-bg-primary/secondary/tertiary`: Light grays
- Dark mode supported

### Typography
- DM Sans (body)
- DM Serif Display (headings)

### Animations
- Framer Motion for page transitions
- CSS keyframes for breathing animations
- Gentle pulse effects

## Next Steps to Complete

1. **Fix the build error** in `src/app/api/stripe/webhook/route.ts`:
   - Change `createClient()` to lazy initialization
   
2. **Test the app** by running `npm run dev`

3. **Set up Supabase project**:
   - Create project at supabase.com
   - Run migrations in SQL Editor
   - Copy API keys to .env.local

4. **Set up Stripe**:
   - Create products/prices
   - Set up webhook endpoint
   - Copy keys to .env.local

5. **Create PWA icons**:
   - Add `public/icons/icon-192.png`
   - Add `public/icons/icon-512.png`

6. **Deploy to Vercel**

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | Framework |
| React | 19.2.3 | UI |
| TypeScript | 5.x | Types |
| Tailwind CSS | 4.x | Styling |
| Supabase | 2.89 | Auth, Database |
| Stripe | 20.1 | Payments |
| Framer Motion | 12.x | Animations |

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## License

MIT
