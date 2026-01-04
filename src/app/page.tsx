'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

const features = [
  {
    title: 'Progressive Muscle Relaxation',
    description:
      'Guided tension-release exercises for every muscle group. Melt away physical stress.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    title: 'Breathing Exercises',
    description:
      'Calming techniques from box breathing to 4-7-8. Instant relief at your fingertips.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
      </svg>
    ),
  },
  {
    title: 'Guided Meditation',
    description:
      'Mindful moments to quiet your thoughts. Find clarity in just a few minutes.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
];

const benefits = [
  'Personalized programs based on your needs',
  'Voice-guided sessions — just listen and follow',
  'Track your progress and build healthy habits',
  'Access anywhere — web-first, no downloads',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-accent-light/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-text-primary font-[family-name:var(--font-dm-serif)]">
            Tranquil
          </Link>
          <nav className="flex items-center">
            <Link href="/quiz">
              <Button size="sm">Help Us Build This</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-lavender/5 rounded-full blur-3xl" />
          <motion.div
            className="absolute top-1/3 right-1/3 w-4 h-4 bg-accent/30 rounded-full"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-lavender/40 rounded-full"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-text-primary leading-tight font-[family-name:var(--font-dm-serif)]">
              Find your
              <span className="block text-accent">calm</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Guided Progressive Muscle Relaxation, breathing exercises, and meditation.
            Release tension and stress in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/quiz">
              <Button size="lg" className="px-10">
                Help Us Build This
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg" className="px-10">
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Breathing circle demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 md:mt-24 flex justify-center"
          >
            <div className="relative">
              <motion.div
                className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-accent/20 to-lavender/20 flex items-center justify-center"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-accent/30 to-lavender/30 flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.span
                    className="text-sm md:text-base text-text-secondary font-light"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    breathe
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-6 bg-bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-text-primary font-[family-name:var(--font-dm-serif)]">
              Three paths to peace
            </h2>
            <p className="mt-4 text-text-secondary max-w-xl mx-auto">
              Choose what works for you — or combine all three for complete relaxation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-bg-primary rounded-2xl p-8 border border-accent-light/30 hover:border-accent/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-light text-text-primary font-[family-name:var(--font-dm-serif)] mb-6">
                Your personal
                <span className="block text-accent">relaxation guide</span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                Take a quick quiz and we&apos;ll create a personalized program just for you.
                Whether you need quick stress relief at work or deep relaxation before bed,
                we&apos;ve got you covered.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-text-primary">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-3xl p-8 border border-accent-light/30">
                {/* Simulated app preview */}
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-accent/40" />
                    <div className="w-3 h-3 rounded-full bg-lavender/40" />
                    <div className="w-3 h-3 rounded-full bg-accent-light" />
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <motion.div
                      className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-6"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div className="w-16 h-16 rounded-full bg-accent/30" />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-text-secondary text-sm mb-2">Day 3 of 7</p>
                      <p className="text-text-primary font-medium">Neck & Shoulders</p>
                    </div>
                    <div className="w-full mt-6">
                      <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-accent rounded-full"
                          initial={{ width: '0%' }}
                          whileInView={{ width: '43%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-20 md:py-32 px-6 bg-gradient-to-br from-accent/5 to-lavender/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-text-primary font-[family-name:var(--font-dm-serif)] mb-6">
              Help us build Tranquil for you
            </h2>
            <p className="text-text-secondary text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
              We&apos;re building Tranquil based on what real people actually need — not assumptions.
              Before we build more, we want to hear from you. What&apos;s not working. What you&apos;ve tried.
              What would actually help.
            </p>
            <p className="text-text-secondary text-lg mb-6">
              9 quick questions. Takes 2 minutes.
            </p>
            <p className="text-text-primary text-lg mb-10">
              <span className="font-medium">Shape the product</span> and get your first{' '}
              <span className="font-medium">2 months free</span> when we launch.
            </p>
            <Link href="/quiz">
              <Button size="lg" className="px-12">
                Help Us Build This
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-accent-light/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-semibold text-text-primary font-[family-name:var(--font-dm-serif)]">
            Tranquil
          </div>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/privacy" className="hover:text-text-secondary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-text-secondary transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-text-secondary transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Tranquil. Find your calm.
          </p>
        </div>
      </footer>
    </div>
  );
}
