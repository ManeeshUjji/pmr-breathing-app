import type { Metadata } from 'next';
import { PublicShell } from '@/components/layout/public-shell';

export const metadata: Metadata = {
  title: 'Terms of Service — Tranquil',
  description:
    'Read the Tranquil terms of service: acceptable use, subscriptions, and important legal information.',
};

export default function TermsPage() {
  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-light text-text-primary font-[family-name:var(--font-dm-serif)]">
          Terms of Service
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          By using Tranquil, you agree to these terms. We aim to keep them simple and fair.
        </p>

        <div className="mt-10 space-y-8">
          <section className="space-y-2">
            <h2 className="text-xl font-medium text-text-primary">Using Tranquil</h2>
            <p className="text-text-secondary leading-relaxed">
              Tranquil provides guided relaxation content. It is not medical advice and does not
              replace professional care. If you’re experiencing severe symptoms, please seek help
              from a qualified professional.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-medium text-text-primary">Subscriptions & billing</h2>
            <p className="text-text-secondary leading-relaxed">
              Premium subscriptions (if offered) are billed through our payment provider. You can
              cancel anytime; access continues through the end of your billing period unless stated
              otherwise at checkout.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-medium text-text-primary">Fair use</h2>
            <p className="text-text-secondary leading-relaxed">
              Please don’t abuse the service, attempt to break security, or use Tranquil in ways
              that disrupt other users.
            </p>
          </section>
        </div>
      </div>
    </PublicShell>
  );
}


