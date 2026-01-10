import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { ThankYouCheck } from '@/components/quiz';

export const metadata: Metadata = {
  title: "You're In — Tranquil Waitlist",
  description:
    "Thanks for joining the Tranquil waitlist. We'll email you when early access opens.",
};

export default function QuizThankYouPage({
}: {
  searchParams?: { status?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        <Card className="text-center" variant="glass" padding="lg">
          <ThankYouCheck />
          <h1 className="text-3xl md:text-4xl font-light text-text-primary font-[family-name:var(--font-dm-serif)] mb-4">
            You&apos;re in.
          </h1>
          <p className="text-text-secondary text-lg mb-3">
            Thank you for joining! We&apos;re excited to have you on this journey.
          </p>
          <p className="text-text-muted mb-10">
            We&apos;ll email you when early access opens. Your answers are already shaping what gets built.
          </p>

          <Link href="/">
            <Button variant="secondary">Back to home</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}


