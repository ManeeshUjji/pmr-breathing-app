'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Input, Card } from '@/components/ui';
import { ProgressBar } from '@/components/quiz';
import { OptionButton } from '@/components/quiz/option-button';
import { cn } from '@/lib/utils/cn';

type PresellQuestionId =
  | 'q1_brings_you_here'
  | 'q2_time_daily'
  | 'q3_severity'
  | 'q4_biggest_challenge'
  | 'q5_tried'
  | 'q6_did_it_help'
  | 'q7_why_not_work'
  | 'q8_fair_price'
  | 'q9_pay_pref'
  | 'q10_feedback';

type PresellAnswerValue = string | string[];

type Question = {
  id: PresellQuestionId;
  question: string;
  type: 'single' | 'multiple' | 'textarea';
  options?: Array<{ label: string; value: string }>;
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
    question: 'How much time can you spend daily on these exercises?',
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
  {
    id: 'q10_feedback',
    question:
      "Is there anything you'd like us to implement or any feedback you'd like to share?",
    type: 'textarea',
  },
];

const transition = { duration: 0.45, ease: 'easeInOut' } as const;

function includesOther(value: PresellAnswerValue | undefined) {
  if (!value) return false;
  return Array.isArray(value) ? value.includes('other') : value === 'other';
}

export function QuizClient() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..visibleQuestions.length (email step at end)
  const [answers, setAnswers] = useState<
    Partial<Record<PresellQuestionId, PresellAnswerValue>>
  >({});
  const [others, setOthers] = useState<Partial<Record<PresellQuestionId, string>>>(
    {}
  );
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [submitNotice, setSubmitNotice] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const lastQuestionIdRef = useRef<PresellQuestionId | null>(null);

  const visibleQuestions = useMemo(() => {
    const tried = answers.q5_tried;
    const triedArr = Array.isArray(tried) ? tried : [];
    const triedNothingYet =
      triedArr.length === 1 && triedArr.includes('nothing_yet');

    const showQ6 = triedArr.length > 0 && !triedNothingYet;
    const didItHelp = (answers.q6_did_it_help || '') as string;
    const showQ7 =
      showQ6 && (didItHelp === 'somewhat' || didItHelp === 'no');

    return questions.filter((q) => {
      if (q.id === 'q6_did_it_help') return showQ6;
      if (q.id === 'q7_why_not_work') return showQ7;
      return true;
    });
  }, [answers]);

  const isEmailStep = step === visibleQuestions.length;
  const currentQuestion = !isEmailStep ? visibleQuestions[step] : null;

  useEffect(() => {
    if (!isEmailStep && currentQuestion) {
      lastQuestionIdRef.current = currentQuestion.id;
    } else {
      lastQuestionIdRef.current = null;
    }
  }, [currentQuestion?.id, isEmailStep, currentQuestion]);

  useEffect(() => {
    // Keep the user on the same question as conditional questions appear/disappear.
    setStep((s) => {
      const lastId = lastQuestionIdRef.current;
      if (!lastId) return Math.min(s, visibleQuestions.length);
      const idx = visibleQuestions.findIndex((q) => q.id === lastId);
      if (idx === -1) return Math.min(s, visibleQuestions.length);
      return idx;
    });
  }, [visibleQuestions, visibleQuestions.length]);

  const totalSteps = visibleQuestions.length + 1; // +1 for email
  const progressValue = useMemo(() => {
    const current = Math.min(step, visibleQuestions.length) + 1;
    return totalSteps <= 0 ? 0 : current / totalSteps;
  }, [step, totalSteps, visibleQuestions.length]);

  const canProceed = useMemo(() => {
    if (isEmailStep) return true;
    if (!currentQuestion) return false;
    if (currentQuestion.type === 'textarea') return true;
    const value = answers[currentQuestion.id];
    if (!value) return false;
    if (Array.isArray(value)) return value.length > 0;
    return value.length > 0;
  }, [answers, currentQuestion, isEmailStep]);

  const handleSelect = (qid: PresellQuestionId, option: string) => {
    setSubmitError(undefined);
    setSubmitNotice(undefined);

    const q = questions.find((x) => x.id === qid);
    if (!q) return;

    if (q.type === 'single') {
      setAnswers((prev) => {
        // If Q6 changes away from a "didn't help" answer, clear Q7.
        if (
          qid === 'q6_did_it_help' &&
          option !== 'somewhat' &&
          option !== 'no'
        ) {
          // Remove dependent answer if Q7 becomes hidden
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { q7_why_not_work, ...rest } = prev;
          return { ...rest, [qid]: option };
        }
        return { ...prev, [qid]: option };
      });
      return;
    }

    setAnswers((prev) => {
      const prevArr = Array.isArray(prev[qid]) ? (prev[qid] as string[]) : [];
      const isTriedQuestion = qid === 'q5_tried';

      // Special-case "Nothing yet" to avoid conflicting answers.
      if (isTriedQuestion) {
        if (option === 'nothing_yet') {
          // Selecting "Nothing yet" clears other selections and dependent answers.
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { q6_did_it_help, q7_why_not_work, ...rest } = prev;
          return { ...rest, [qid]: ['nothing_yet'] };
        }

        // Selecting anything else removes "Nothing yet".
        const cleaned = prevArr.filter((v) => v !== 'nothing_yet');
        if (cleaned.includes(option)) {
          return { ...prev, [qid]: cleaned.filter((v) => v !== option) };
        }
        return { ...prev, [qid]: [...cleaned, option] };
      }

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
    setStep((s) => Math.min(s + 1, visibleQuestions.length));
  };

  const handleBack = () => {
    setSubmitError(undefined);
    setSubmitNotice(undefined);
    setEmailError(undefined);
    setStep((s) => Math.max(0, s - 1));
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Please enter your email.';
    // Basic validation; server is source of truth
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email.';
    return undefined;
  };

  const handleSubmit = async () => {
    setSubmitError(undefined);
    setSubmitNotice(undefined);
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
        feedback: feedback.trim(),
        source: 'presell_quiz',
        website: honeypot, // honeypot spam field
      };

      const res = await fetch('/api/loops/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        alreadyOnWaitlist?: boolean;
        error?: string;
      };

      if (!res.ok) {
        const raw =
          data?.error || 'Something went wrong. Please try again.';
        const friendly =
          raw.toLowerCase().includes('waitlist not configured') ||
          raw.toLowerCase().includes('not configured')
            ? 'Waitlist is temporarily unavailable. Please try again later.'
            : raw;
        setSubmitError(friendly);
        setIsSubmitting(false);
        return;
      }

      if (data?.alreadyOnWaitlist) {
        setSubmitNotice("You're already on the waitlist — thank you!");
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
    <div className="min-h-screen flex flex-col">
      <header className="pt-10 px-6">
        <div className="max-w-2xl mx-auto">
          <ProgressBar value={progressValue} className="mb-10" />
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
                    : currentQuestion.type === 'single'
                      ? 'Choose one'
                      : 'Optional — share anything that would make Tranquil better.'}
                </p>

                {currentQuestion.type !== 'textarea' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
                    {(currentQuestion.options || []).map((option, idx) => {
                      const isOddLastTile =
                        (currentQuestion.options || []).length % 2 === 1 &&
                        idx === (currentQuestion.options || []).length - 1;

                      return (
                        <div
                          key={option.value}
                          className={cn('h-full', isOddLastTile && 'sm:col-span-2')}
                        >
                          <OptionButton
                            label={option.label}
                            selected={isSelected(currentQuestion.id, option.value)}
                            onClick={() =>
                              handleSelect(currentQuestion.id, option.value)
                            }
                            type={
                              currentQuestion.type === 'multiple' ? 'multi' : 'single'
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="max-w-xl mx-auto text-left">
                    <label className="block text-sm font-medium text-text-secondary mb-2 pl-4">
                      Your message (optional)
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => {
                        setFeedback(e.target.value);
                      }}
                      placeholder="Anything you’d love us to implement, improve, or add…"
                      maxLength={800}
                      rows={5}
                      className={cn(
                        'w-full px-4 py-3 rounded-2xl',
                        'bg-bg-primary/50 border border-accent-light/40 shadow-[var(--shadow-inset)]',
                        'text-text-primary placeholder:text-text-muted',
                        'transition-all duration-300',
                        'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:ring-offset-2 focus:ring-offset-bg-primary',
                        'resize-none'
                      )}
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-text-muted px-1">
                      <span>Optional — you can skip this.</span>
                      <span>{feedback.length}/800</span>
                    </div>
                  </div>
                )}

                {currentQuestion.hasOther &&
                  includesOther(answers[currentQuestion.id]) && (
                    <div className="mt-6">
                      <Input
                        label={currentQuestion.otherLabel || 'Other (optional)'}
                        labelClassName="pl-4"
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

                <div className="mt-10 flex items-center justify-between gap-4">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm underline text-text-muted hover:text-text-primary transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <span />
                  )}

                  <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="flex-1"
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
                <Card variant="glass" padding="lg">
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

                  <div className="max-w-md mx-auto space-y-5 text-left">
                    <Input
                      label="Email"
                      labelClassName="pl-4"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      error={emailError}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(undefined);
                        if (submitError) setSubmitError(undefined);
                        if (submitNotice) setSubmitNotice(undefined);
                      }}
                    />

                    {submitNotice && (
                      <p className="text-sm text-text-secondary text-center">
                        {submitNotice}
                      </p>
                    )}

                    {submitError && (
                      <p className="text-sm text-error text-center">{submitError}</p>
                    )}

                    <div className="flex items-center justify-between gap-4">
                      {step > 0 ? (
                        <button
                          type="button"
                          onClick={handleBack}
                          className="text-sm underline text-text-muted hover:text-text-primary transition-colors"
                        >
                          Back
                        </button>
                      ) : (
                        <span />
                      )}

                      <Button
                        type="submit"
                        size="lg"
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        className="flex-1"
                      >
                        Join the Waitlist
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}


