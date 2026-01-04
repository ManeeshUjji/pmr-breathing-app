import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';

export const metadata: Metadata = {
  title: "You're In — Tranquil Waitlist",
  description:
    "Thanks for joining the Tranquil waitlist. We'll email you when early access opens.",
};

export default function QuizThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        <Card className="bg-bg-primary/70 border border-accent-light/30 text-center">
          <h1 className="text-3xl md:text-4xl font-light text-text-primary font-[family-name:var(--font-dm-serif)] mb-4">
            You&apos;re in.
          </h1>
          <p className="text-text-secondary text-lg mb-3">
            We&apos;ll email you when early access opens.
          </p>
          <p className="text-text-muted mb-10">
            Your answers are already shaping what gets built.
          </p>

          <Link href="/">
            <Button variant="secondary">Back to home</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}


