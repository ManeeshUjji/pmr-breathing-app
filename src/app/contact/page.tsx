import type { Metadata } from 'next';
import { PublicShell } from '@/components/layout/public-shell';

export const metadata: Metadata = {
  title: 'Contact — Tranquil',
  description:
    'Contact Tranquil for support, privacy requests, or feedback. We respond quickly and thoughtfully.',
};

export default function ContactPage() {
  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-light text-text-primary font-[family-name:var(--font-dm-serif)]">
          Contact
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          Have a question, feedback, or a privacy request? Reach out and we’ll respond as quickly as possible.
        </p>

        <div className="mt-10 rounded-2xl border border-accent-light/30 bg-bg-primary/55 shadow-[var(--shadow-card)] p-6">
          <p className="text-text-secondary leading-relaxed">
            Email us at:{' '}
            <a
              href="mailto:support@tranquil.app"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              support@tranquil.app
            </a>
          </p>
          <p className="mt-3 text-sm text-text-muted">
            If you’re contacting us about account access or deletion, please include the email you used to sign in.
          </p>
        </div>
      </div>
    </PublicShell>
  );
}


