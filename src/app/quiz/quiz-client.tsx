'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Input, Card } from '@/components/ui';
import { ProgressDashes } from '@/components/quiz/progress-dashes';

type PresellQuestionId =
  | 'q1_brings_you_here'
  | 'q2_time_daily'
  | 'q3_severity'
  | 'q4_biggest_challenge'
  | 'q5_tried'
  | 'q6_did_it_help'
  | 'q7_why_not_work'
  | 'q8_fair_price'
  | 'q9_pay_pref';

type PresellAnswerValue = string | string[];

type Question = {
  id: PresellQuestionId;
  question: string;
  type: 'single' | 'multiple';
  options: Array<{ label: string; value: string }>;
  hasOther?: boolean;
  otherLabel?: string;
};

const questions: Question[] = [
  {
    id: 'q1_brings_you_here',
    question: 'What brings you here?',
    type: 'single',
    options: [
      { label: 'Work stress', value: 'work_stress' },
      { label: 'Anxiety / panic', value: 'anxiety_panic' },
      { label: 'Sleep problems', value: 'sleep_problems' },
      { label: 'Physical tension / pain', value: 'physical_tension_pain' },
      { label: 'Just exploring', value: 'just_exploring' },
      { label: 'Other', value: 'other' },
    ],
    hasOther: true,
    otherLabel: 'Other (optional)',
  },
  {
    id: 'q2_time_daily',
    question: 'How much time could you spend daily?',
    type: 'single',
    options: [
      { label: '2-5 minutes', value: '2_5' },
      { label: '5-10 minutes', value: '5_10' },
      { label: '10-20 minutes', value: '10_20' },
      { label: '20+ minutes', value: '20_plus' },
    ],
  },
  {
    id: 'q3_severity',
    question: 'How much does this affect your daily life?',
    type: 'single',
    options: [
      { label: "It's seriously affecting my life", value: 'serious' },
      { label: "It's a constant struggle", value: 'constant_struggle' },
      { label: "It's annoying but manageable", value: 'manageable' },
      { label: 'Minor issue', value: 'minor' },
    ],
  },
  {
    id: 'q4_biggest_challenge',
    question: "What's your biggest challenge?",
    type: 'single',
    options: [
      { label: "Mind won't stop racing", value: 'racing_mind' },
      { label: "Can't fall asleep", value: 'cant_sleep' },
      { label: "Physical tension I can't release", value: 'cant_release_tension' },
      { label: 'Panic or anxiety attacks', value: 'panic_attacks' },
      { label: "Don't have time to relax", value: 'no_time' },
      { label: 'Other', value: 'other' },
    ],
    hasOther: true,
    otherLabel: 'Other (optional)',
  },
  {
    id: 'q5_tried',
    question: "What have you already tried?",
    type: 'multiple',
    options: [
      { label: 'Meditation apps (Calm, Headspace, etc.)', value: 'meditation_apps' },
      { label: 'Breathing exercises / YouTube videos', value: 'breathing_youtube' },
      { label: 'Therapy / counseling', value: 'therapy' },
      { label: 'Medication', value: 'medication' },
      { label: 'Exercise / yoga', value: 'exercise_yoga' },
      { label: 'Nothing yet', value: 'nothing_yet' },
      { label: 'Other', value: 'other' },
    ],
    hasOther: true,
    otherLabel: 'Other (optional)',
  },
  {
    id: 'q6_did_it_help',
    question: 'Did it help?',
    type: 'single',
    options: [
      { label: 'Yes, but I stopped using it', value: 'yes_stopped' },
      { label: 'Somewhat, but not enough', value: 'somewhat' },
      { label: "No, didn't work for me", value: 'no' },
      { label: "Haven't tried anything yet", value: 'not_tried' },
    ],
  },
  {
    id: 'q7_why_not_work',
    question: "Why didn't it work?",
    type: 'single',
    options: [
      { label: 'Too time-consuming', value: 'too_time_consuming' },
      { label: 'Hard to stay consistent', value: 'inconsistent' },
      { label: "Didn't feel any difference", value: 'no_difference' },
      { label: 'Too expensive', value: 'too_expensive' },
      { label: 'Felt awkward or silly', value: 'awkward' },
      { label: 'Other', value: 'other' },
    ],
    hasOther: true,
    otherLabel: 'Other (optional)',
  },
  {
    id: 'q8_fair_price',
    question: 'What would feel like a fair monthly price?',
    type: 'single',
    options: [
      { label: '$5-10/month', value: '5_10' },
      { label: '$10-15/month', value: '10_15' },
      { label: '$15-20/month', value: '15_20' },
      { label: '$20+/month', value: '20_plus' },
    ],
  },
  {
    id: 'q9_pay_pref',
    question: 'How would you prefer to pay?',
    type: 'single',
    options: [
      { label: 'Monthly subscription', value: 'monthly' },
      { label: 'Annual subscription (lower price)', value: 'annual' },
      { label: 'Free trial, then subscription', value: 'trial_then_sub' },
    ],
  },
];

const transition = { duration: 0.45, ease: 'easeInOut' } as const;

function includesOther(value: PresellAnswerValue | undefined) {
  if (!value) return false;
  return Array.isArray(value) ? value.includes('other') : value === 'other';
}

export function QuizClient() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..questions.length (email step at end)
  const [answers, setAnswers] = useState<Record<PresellQuestionId, PresellAnswerValue>>(
    {} as Record<PresellQuestionId, PresellAnswerValue>
  );
  const [others, setOthers] = useState<Partial<Record<PresellQuestionId, string>>>(
    {}
  );
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const isEmailStep = step === questions.length;
  const currentQuestion = !isEmailStep ? questions[step] : null;

  const canProceed = useMemo(() => {
    if (isEmailStep) return true;
    if (!currentQuestion) return false;
    const value = answers[currentQuestion.id];
    if (!value) return false;
    if (Array.isArray(value)) return value.length > 0;
    return value.length > 0;
  }, [answers, currentQuestion, isEmailStep]);

  const completedCount = Math.min(step, questions.length);
  const currentDashIndex = Math.min(step, questions.length - 1);

  const handleSelect = (qid: PresellQuestionId, option: string) => {
    setSubmitError(undefined);

    const q = questions.find((x) => x.id === qid);
    if (!q) return;

    if (q.type === 'single') {
      setAnswers((prev) => ({ ...prev, [qid]: option }));
      return;
    }

    setAnswers((prev) => {
      const prevArr = Array.isArray(prev[qid]) ? (prev[qid] as string[]) : [];
      if (prevArr.includes(option)) {
        return { ...prev, [qid]: prevArr.filter((v) => v !== option) };
      }
      return { ...prev, [qid]: [...prevArr, option] };
    });
  };

  const isSelected = (qid: PresellQuestionId, option: string) => {
    const value = answers[qid];
    if (!value) return false;
    return Array.isArray(value) ? value.includes(option) : value === option;
  };

  const handleNext = () => {
    if (isEmailStep) return;
    if (!canProceed) return;
    setStep((s) => Math.min(s + 1, questions.length));
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Please enter your email.';
    // Basic validation; server is source of truth
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email.';
    return undefined;
  };

  const handleSubmit = async () => {
    setSubmitError(undefined);
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setIsSubmitting(true);
    try {
      const payload = {
        email: email.trim(),
        answers: Object.fromEntries(
          questions.map((q) => [q.id, answers[q.id]])
        ) as Record<PresellQuestionId, PresellAnswerValue>,
        otherText: others,
        source: 'presell_quiz',
        website: honeypot, // honeypot spam field
      };

      const res = await fetch('/api/loops/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setSubmitError(
          data?.error || 'Something went wrong. Please try again.'
        );
        setIsSubmitting(false);
        return;
      }

      router.push('/quiz/thank-you');
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col">
      <header className="pt-10 px-6">
        <div className="max-w-2xl mx-auto">
          <ProgressDashes
            total={questions.length}
            currentIndex={currentDashIndex}
            completedCount={completedCount}
            className="mb-8"
          />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {!isEmailStep && currentQuestion ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={transition}
              >
                <h1 className="text-2xl md:text-3xl font-light text-text-primary text-center mb-3 font-[family-name:var(--font-dm-serif)]">
                  {currentQuestion.question}
                </h1>
                <p className="text-text-muted text-center mb-10">
                  {currentQuestion.type === 'multiple'
                    ? 'Select all that apply'
                    : 'Choose one'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(currentQuestion.id, option.value)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.2 }}
                      className={[
                        'w-full text-left px-5 py-4 rounded-2xl border-2 transition-all',
                        'min-h-[56px]',
                        isSelected(currentQuestion.id, option.value)
                          ? 'border-accent bg-accent/10'
                          : 'border-accent-light/30 bg-bg-secondary hover:border-accent/50',
                      ].join(' ')}
                      aria-pressed={isSelected(currentQuestion.id, option.value)}
                    >
                      <span className="text-text-primary font-medium">{option.label}</span>
                    </motion.button>
                  ))}
                </div>

                {currentQuestion.hasOther &&
                  includesOther(answers[currentQuestion.id]) && (
                    <div className="mt-6">
                      <Input
                        label={currentQuestion.otherLabel || 'Other (optional)'}
                        value={others[currentQuestion.id] || ''}
                        onChange={(e) =>
                          setOthers((prev) => ({
                            ...prev,
                            [currentQuestion.id]: e.target.value,
                          }))
                        }
                        placeholder="Type here (optional)"
                      />
                    </div>
                  )}

                <div className="mt-10">
                  <Button
                    fullWidth
                    size="lg"
                    onClick={handleNext}
                    disabled={!canProceed}
                  >
                    Continue
                  </Button>
                </div>

                {/* Mobile-friendly spacing without encouraging scroll */}
                <div className="h-2" />
              </motion.div>
            ) : (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={transition}
              >
                <Card className="bg-bg-primary/70 border border-accent-light/30">
                  <h1 className="text-2xl md:text-3xl font-light text-text-primary text-center mb-4 font-[family-name:var(--font-dm-serif)]">
                    Last step — you&apos;re in.
                  </h1>
                  <p className="text-text-secondary text-center mb-8">
                    Enter your email to get early access + 2 months free.
                  </p>

                  {/* Honeypot (hidden) */}
                  <input
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="space-y-5">
                    <Input
                      label="Email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      error={emailError}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(undefined);
                      }}
                    />

                    {submitError && (
                      <p className="text-sm text-error text-center">{submitError}</p>
                    )}

                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      onClick={handleSubmit}
                      isLoading={isSubmitting}
                    >
                      Join the Waitlist
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="pb-8 px-6">
        <div className="max-w-2xl mx-auto text-center text-sm text-text-muted">
          Step {Math.min(step + 1, questions.length + 1)} of {questions.length + 1}
        </div>
      </footer>
    </div>
  );
}


