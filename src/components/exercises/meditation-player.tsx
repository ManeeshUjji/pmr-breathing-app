'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getSpeechService } from '@/lib/tts/speech';
import { Button } from '@/components/ui';
import { Exercise, MeditationStep } from '@/types';

interface MeditationPlayerProps {
  exercise: Exercise;
  onComplete: (durationSeconds: number) => void;
}

export function MeditationPlayer({ exercise, onComplete }: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimeRemaining, setStepTimeRemaining] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSpeechReady, setIsSpeechReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechService = useRef<ReturnType<typeof getSpeechService> | null>(null);
  const router = useRouter();

  // Parse meditation steps from content
  const content = exercise.content as unknown as { steps?: MeditationStep[] };
  const steps: MeditationStep[] = content.steps || [
    {
      instruction: exercise.description,
      duration: exercise.duration_seconds,
      audioScript: exercise.audio_script,
    },
  ];
  const currentStep = steps[currentStepIndex];

  // Initialize speech service
  useEffect(() => {
    speechService.current = getSpeechService();
    const checkReady = setInterval(() => {
      if (speechService.current?.isAvailable()) {
        setIsSpeechReady(true);
        clearInterval(checkReady);
      }
    }, 100);

    return () => {
      clearInterval(checkReady);
      speechService.current?.stop();
    };
  }, []);

  // Speak current instruction
  const speakInstruction = useCallback((script: string) => {
    if (speechService.current && isSpeechReady) {
      // Split long scripts into sentences for more natural delivery
      speechService.current.speak(script);
    }
  }, [isSpeechReady]);

  // Timer logic
  useEffect(() => {
    if (!isPlaying || isComplete || !currentStep) return;

    // Start timer for current step
    if (stepTimeRemaining === 0) {
      setStepTimeRemaining(currentStep.duration);
      speakInstruction(currentStep.audioScript);
    }

    timerRef.current = setInterval(() => {
      setStepTimeRemaining((prev) => {
        if (prev <= 1) {
          // Move to next step
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex((i) => i + 1);
            return 0; // Will trigger new step
          } else {
            // Exercise complete
            setIsPlaying(false);
            setIsComplete(true);
            return 0;
          }
        }
        return prev - 1;
      });
      setTotalElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isComplete, currentStep, stepTimeRemaining, currentStepIndex, steps.length, speakInstruction]);

  const handlePlayPause = () => {
    if (isComplete) return;
    
    if (isPlaying) {
      speechService.current?.pause();
    } else {
      if (stepTimeRemaining === 0 && currentStep) {
        setStepTimeRemaining(currentStep.duration);
        speakInstruction(currentStep.audioScript);
      } else {
        speechService.current?.resume();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleComplete = () => {
    onComplete(totalElapsed);
  };

  const handleExit = () => {
    speechService.current?.stop();
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
  const progress = (totalElapsed / totalDuration) * 100;

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-calm flex flex-col items-center justify-center px-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-md"
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-lavender/30 to-accent/30 flex items-center justify-center mx-auto mb-6"
            animate={{ 
              boxShadow: [
                '0 0 40px rgba(168, 164, 206, 0.3)',
                '0 0 60px rgba(168, 164, 206, 0.4)',
                '0 0 40px rgba(168, 164, 206, 0.3)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <svg
              className="w-12 h-12 text-lavender"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </motion.div>

          <h1 className="text-2xl md:text-3xl font-light text-text-primary font-[family-name:var(--font-dm-serif)] mb-4">
            Peaceful
          </h1>
          <p className="text-text-secondary mb-2">
            {formatTime(totalElapsed)} of mindful presence
          </p>
          <p className="text-text-muted text-sm mb-8">
            Carry this stillness with you
          </p>

          <div className="space-y-3">
            <Button onClick={handleComplete} fullWidth size="lg">
              Save & Continue
            </Button>
            <Button onClick={handleExit} variant="ghost" fullWidth>
              Exit
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 relative z-10">
        <button
          onClick={handleExit}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-text-secondary text-sm">
          {formatTime(totalElapsed)} / {formatTime(totalDuration)}
        </span>
        <div className="w-6" />
      </header>

      {/* Progress bar */}
      <div className="px-6 relative z-10">
        <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-lavender"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10">
        {/* Ambient visual */}
        <div className="relative mb-12">
          {/* Multiple layered circles for depth */}
          <motion.div
            className="absolute inset-0 rounded-full bg-lavender/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 300, height: 300, left: -50, top: -50 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-accent/5 blur-2xl"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ width: 250, height: 250, left: -25, top: -25 }}
          />
          
          {/* Central orb */}
          <motion.div
            className="relative w-48 h-48 rounded-full bg-gradient-to-br from-lavender/20 to-accent/20 flex items-center justify-center"
            animate={{
              boxShadow: isPlaying
                ? [
                    '0 0 40px rgba(168, 164, 206, 0.2)',
                    '0 0 80px rgba(168, 164, 206, 0.3)',
                    '0 0 40px rgba(168, 164, 206, 0.2)',
                  ]
                : '0 0 40px rgba(168, 164, 206, 0.1)',
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-lavender/30 to-accent/30 flex items-center justify-center"
              animate={
                isPlaying
                  ? {
                      scale: [1, 1.05, 1],
                    }
                  : { scale: 1 }
              }
              transition={{ duration: 4, repeat: Infinity }}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-bg-primary/70 backdrop-blur-sm flex items-center justify-center"
                animate={
                  isPlaying
                    ? {
                        scale: [1, 1.1, 1],
                      }
                    : { scale: 1 }
                }
                transition={{ duration: 4, repeat: Infinity }}
              >
                <svg
                  className="w-8 h-8 text-lavender"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Current instruction */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center max-w-md px-4"
          >
            <p className="text-lg md:text-xl font-light text-text-primary leading-relaxed">
              {currentStep?.instruction}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Time remaining */}
        <motion.p
          className="mt-8 text-3xl font-light text-text-muted tabular-nums"
          animate={{ opacity: isPlaying ? 1 : 0.5 }}
        >
          {formatTime(stepTimeRemaining)}
        </motion.p>
      </main>

      {/* Controls */}
      <footer className="px-6 pb-8 relative z-10">
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-lavender flex items-center justify-center text-white shadow-lg"
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>
        </div>
      </footer>

      {/* Full-screen ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-lavender/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Large background orbs */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-lavender/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>
    </div>
  );
}

