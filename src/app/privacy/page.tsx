import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicShell } from '@/components/layout/public-shell';

export const metadata: Metadata = {
  title: 'Privacy Policy — Tranquil',
  description:
    'Read Tranquil’s privacy policy: what data we collect, why we collect it, and how you can request access or deletion.',
};

export default function PrivacyPage() {
  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-light text-text-primary font-[family-name:var(--font-dm-serif)]">
          Privacy Policy
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          Tranquil is built to help you feel calmer — not to harvest your data.
          This page explains what we collect and how it’s used.
        </p>

        <div className="mt-10 space-y-8">
          <section className="space-y-2">
            <h2 className="text-xl font-medium text-text-primary">What we collect</h2>
            <p className="text-text-secondary leading-relaxed">
              We collect account information (such as email) and product usage details
              needed to provide the app (for example, quiz completion and preferences).
              Payment details are handled securely by our payment provider; we do not
              store full card information on Tranquil servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-medium text-text-primary">How we use data</h2>
            <p className="text-text-secondary leading-relaxed">
              We use your data to operate Tranquil, improve the experience, and (if you opt in)
              communicate about your account and product updates.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-medium text-text-primary">Your choices</h2>
            <p className="text-text-secondary leading-relaxed">
              You can request access, correction, or deletion of your data. If you need help,
              contact us and we’ll respond promptly.
            </p>
            <p className="text-text-secondary">
              Go to{' '}
              <Link href="/contact" className="text-accent hover:text-accent-hover transition-colors">
                contact
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}


