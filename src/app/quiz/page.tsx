import type { Metadata } from 'next';
import { QuizClient } from './quiz-client';

export const metadata: Metadata = {
  title: 'Tranquil Waitlist Quiz — Early Access',
  description:
    'Help us build Tranquil. Answer 9 quick questions (2 minutes) and join the waitlist for early access and 2 months free when we launch.',
};

export default function QuizPage() {
  return <QuizClient />;
}

