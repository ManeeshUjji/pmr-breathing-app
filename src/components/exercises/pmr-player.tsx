'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getSpeechService } from '@/lib/tts/speech';
import { BodyVisualization } from './body-visualization';
import { Button } from '@/components/ui';
import { PMRStep, Exercise } from '@/types';
import { cn } from '@/lib/utils/cn';

interface PMRPlayerProps {
  exercise: Exercise;
  onComplete: (durationSeconds: number) => void;
}

export function PMRPlayer({ exercise, onComplete }: PMRPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimeRemaining, setStepTimeRemaining] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSpeechReady, setIsSpeechReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechService = useRef<ReturnType<typeof getSpeechService> | null>(null);
  const router = useRouter();

  const content = exercise.content as unknown as { steps: PMRStep[] };
  const steps = content.steps || [];
  const currentStep = steps[currentStepIndex];

  // Initialize speech service
  useEffect(() => {
    speechService.current = getSpeechService();
    // Wait for voices to load
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
  const speakInstruction = useCallback((instruction: string) => {
    if (speechService.current && isSpeechReady) {
      speechService.current.speak(instruction);
    }
  }, [isSpeechReady]);

  // Timer logic
  useEffect(() => {
    if (!isPlaying || isComplete || !currentStep) return;

    // Start timer for current step
    if (stepTimeRemaining === 0) {
      setStepTimeRemaining(currentStep.duration);
      speakInstruction(currentStep.instruction);
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
        speakInstruction(currentStep.instruction);
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

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'tense':
        return 'Tense';
      case 'hold':
        return 'Hold';
      case 'release':
        return 'Release';
      case 'rest':
        return 'Rest';
      default:
        return '';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'tense':
      case 'hold':
        return 'text-warning';
      case 'release':
      case 'rest':
        return 'text-accent';
      default:
        return 'text-text-primary';
    }
  };

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
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-light text-text-primary font-[family-name:var(--font-dm-serif)] mb-4">
            Well done
          </h1>
          <p className="text-text-secondary mb-2">
            You completed {formatTime(totalElapsed)} of relaxation
          </p>
          <p className="text-text-muted text-sm mb-8">
            Take a moment to notice how your body feels now
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
    <div className="min-h-screen bg-gradient-calm flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
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
      <div className="px-6">
        <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Body visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <BodyVisualization
            activeMuscleGroups={currentStep ? [currentStep.muscleGroup] : []}
            phase={currentStep?.phase || 'rest'}
          />
        </motion.div>

        {/* Current step info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center max-w-md"
          >
            {currentStep && (
              <>
                <p className={cn('text-sm font-medium uppercase tracking-wide mb-2', getPhaseColor(currentStep.phase))}>
                  {getPhaseLabel(currentStep.phase)}
                </p>
                <h2 className="text-xl md:text-2xl font-light text-text-primary mb-4">
                  {currentStep.instruction}
                </h2>
                <p className="text-4xl font-light text-text-primary tabular-nums">
                  {stepTimeRemaining}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mt-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === currentStepIndex
                  ? 'bg-accent'
                  : index < currentStepIndex
                  ? 'bg-accent/50'
                  : 'bg-bg-tertiary'
              )}
            />
          ))}
        </div>
      </main>

      {/* Controls */}
      <footer className="px-6 pb-8">
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white shadow-lg"
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

      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full"
          animate={{
            background: currentStep?.phase === 'tense' || currentStep?.phase === 'hold'
              ? 'rgba(212, 165, 116, 0.1)'
              : 'rgba(127, 169, 155, 0.1)',
          }}
          style={{ filter: 'blur(80px)' }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full"
          animate={{
            background: currentStep?.phase === 'tense' || currentStep?.phase === 'hold'
              ? 'rgba(212, 165, 116, 0.08)'
              : 'rgba(168, 164, 206, 0.1)',
          }}
          style={{ filter: 'blur(80px)' }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}

