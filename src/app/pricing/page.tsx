'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Card } from '@/components/ui';

const features = {
  free: [
    'Introduction to PMR (7-day program)',
    'Breathing Basics (5-day program)',
    'Limited quick sessions',
    'Progress tracking',
  ],
  premium: [
    'All 10+ programs included',
    'Full Body PMR Journey',
    'Office-Friendly Relief',
    'Sleep Well Tonight',
    'Targeted tension relief',
    'Unlimited sessions',
    'Priority new content',
    'Cancel anytime',
  ],
};

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoading, setIsLoading] = useState<'monthly' | 'yearly' | null>(null);
  const router = useRouter();

  const handleCheckout = async (planType: 'monthly' | 'yearly') => {
    setIsLoading(planType);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === 'Unauthorized') {
        router.push('/login?redirect=/pricing');
      } else {
        console.error('Checkout error:', data.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      {/* Header */}
      <header className="border-b border-accent-light/20 bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold text-text-primary font-[family-name:var(--font-dm-serif)]"
          >
            Tranquil
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-light text-text-primary font-[family-name:var(--font-dm-serif)] mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Start with free programs, or unlock everything with Premium.
            Cancel anytime.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center bg-bg-secondary rounded-full p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isAnnual
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isAnnual
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Annual
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isAnnual ? 'bg-white/20' : 'bg-accent/20 text-accent'
                }`}
              >
                Save 40%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <div className="mb-6">
                <h2 className="text-xl font-medium text-text-primary mb-1">
                  Free
                </h2>
                <p className="text-text-secondary text-sm">
                  Perfect for getting started
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-light text-text-primary">$0</span>
                <span className="text-text-muted">/forever</span>
              </div>

              <ul className="space-y-3 mb-8">
                {features.free.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-text-secondary text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/signup">
                <Button variant="secondary" fullWidth>
                  Get Started Free
                </Button>
              </Link>
            </Card>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full relative border-2 border-accent">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-medium text-text-primary mb-1">
                  Premium
                </h2>
                <p className="text-text-secondary text-sm">
                  Full access to everything
                </p>
              </div>

              <div className="mb-6">
                {isAnnual ? (
                  <>
                    <span className="text-4xl font-light text-text-primary">
                      $4.99
                    </span>
                    <span className="text-text-muted">/month</span>
                    <p className="text-text-muted text-sm mt-1">
                      Billed annually ($59.88/year)
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-light text-text-primary">
                      $7.99
                    </span>
                    <span className="text-text-muted">/month</span>
                    <p className="text-text-muted text-sm mt-1">
                      Billed monthly
                    </p>
                  </>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {features.premium.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-text-secondary text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                fullWidth
                onClick={() => handleCheckout(isAnnual ? 'yearly' : 'monthly')}
                isLoading={isLoading !== null}
              >
                {isLoading
                  ? 'Processing...'
                  : `Start Premium ${isAnnual ? 'Annual' : 'Monthly'}`}
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* FAQ / Trust */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-text-muted text-sm">
            7-day free trial for new Premium subscribers. Cancel anytime.
          </p>
          <p className="text-text-muted text-sm mt-2">
            Secure payment powered by Stripe. Your data is always protected.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

