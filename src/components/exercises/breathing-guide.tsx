'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getSpeechService } from '@/lib/tts/speech';
import { Button } from '@/components/ui';
import { BreathingPattern, Exercise } from '@/types';
import { cn } from '@/lib/utils/cn';

interface BreathingGuideProps {
  exercise: Exercise;
  onComplete: (durationSeconds: number) => void;
}

type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'complete';

export function BreathingGuide({ exercise, onComplete }: BreathingGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSpeechReady, setIsSpeechReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechService = useRef<ReturnType<typeof getSpeechService> | null>(null);
  const circleControls = useAnimation();
  const router = useRouter();

  const pattern = exercise.breathing_pattern as unknown as BreathingPattern;
  const totalCycles = pattern?.cycles || 8;

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

  // Get phase duration
  const getPhaseDuration = useCallback((phase: BreathPhase): number => {
    if (!pattern) return 4;
    switch (phase) {
      case 'inhale':
        return pattern.inhale || 4;
      case 'holdIn':
        return pattern.hold || 0;
      case 'exhale':
        return pattern.exhale || 4;
      case 'holdOut':
        return pattern.holdAfterExhale || 0;
      default:
        return 0;
    }
  }, [pattern]);

  // Get next phase
  const getNextPhase = useCallback((current: BreathPhase): BreathPhase => {
    switch (current) {
      case 'inhale':
        return getPhaseDuration('holdIn') > 0 ? 'holdIn' : 'exhale';
      case 'holdIn':
        return 'exhale';
      case 'exhale':
        return getPhaseDuration('holdOut') > 0 ? 'holdOut' : 'inhale';
      case 'holdOut':
        return 'inhale';
      default:
        return 'inhale';
    }
  }, [getPhaseDuration]);

  // Speak phase
  const speakPhase = useCallback((phase: BreathPhase) => {
    if (!speechService.current || !isSpeechReady) return;
    
    switch (phase) {
      case 'inhale':
        speechService.current.speak('Breathe in');
        break;
      case 'holdIn':
      case 'holdOut':
        speechService.current.speak('Hold');
        break;
      case 'exhale':
        speechService.current.speak('Breathe out');
        break;
    }
  }, [isSpeechReady]);

  // Animate circle based on phase
  const animateCircle = useCallback((phase: BreathPhase, duration: number) => {
    switch (phase) {
      case 'inhale':
        circleControls.start({
          scale: 1.4,
          transition: { duration, ease: 'easeInOut' },
        });
        break;
      case 'holdIn':
        circleControls.start({
          scale: 1.4,
          transition: { duration },
        });
        break;
      case 'exhale':
        circleControls.start({
          scale: 1,
          transition: { duration, ease: 'easeInOut' },
        });
        break;
      case 'holdOut':
        circleControls.start({
          scale: 1,
          transition: { duration },
        });
        break;
    }
  }, [circleControls]);

  // Timer logic
  useEffect(() => {
    if (!isPlaying || isComplete) return;

    // Initialize first phase
    if (phaseTimeRemaining === 0) {
      const duration = getPhaseDuration(currentPhase);
      if (duration > 0) {
        setPhaseTimeRemaining(duration);
        speakPhase(currentPhase);
        animateCircle(currentPhase, duration);
      } else {
        // Skip phases with 0 duration
        setCurrentPhase(getNextPhase(currentPhase));
      }
    }

    timerRef.current = setInterval(() => {
      setPhaseTimeRemaining((prev) => {
        if (prev <= 1) {
          const nextPhase = getNextPhase(currentPhase);
          
          // Check if we completed a full cycle (back to inhale)
          if (nextPhase === 'inhale') {
            if (currentCycle >= totalCycles - 1) {
              setIsPlaying(false);
              setIsComplete(true);
              return 0;
            }
            setCurrentCycle((c) => c + 1);
          }
          
          setCurrentPhase(nextPhase);
          return 0; // Will trigger new phase setup
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
  }, [
    isPlaying,
    isComplete,
    currentPhase,
    phaseTimeRemaining,
    currentCycle,
    totalCycles,
    getPhaseDuration,
    getNextPhase,
    speakPhase,
    animateCircle,
  ]);

  const handlePlayPause = () => {
    if (isComplete) return;
    
    if (!isPlaying && phaseTimeRemaining === 0) {
      // Starting fresh
      const duration = getPhaseDuration(currentPhase);
      setPhaseTimeRemaining(duration);
      speakPhase(currentPhase);
      animateCircle(currentPhase, duration);
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

  const getPhaseLabel = (phase: BreathPhase) => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'holdIn':
      case 'holdOut':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return '';
    }
  };

  const getPhaseColor = (phase: BreathPhase) => {
    switch (phase) {
      case 'inhale':
        return 'from-accent/40 to-accent/20';
      case 'holdIn':
      case 'holdOut':
        return 'from-lavender/40 to-lavender/20';
      case 'exhale':
        return 'from-accent/30 to-accent/10';
      default:
        return 'from-accent/20 to-accent/10';
    }
  };

  // Estimate total duration
  const cycleDuration =
    getPhaseDuration('inhale') +
    getPhaseDuration('holdIn') +
    getPhaseDuration('exhale') +
    getPhaseDuration('holdOut');
  const totalDuration = cycleDuration * totalCycles;
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
            className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 to-lavender/30 flex items-center justify-center mx-auto mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg
              className="w-12 h-12 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          <h1 className="text-2xl md:text-3xl font-light text-text-primary font-[family-name:var(--font-dm-serif)] mb-4">
            Beautifully done
          </h1>
          <p className="text-text-secondary mb-2">
            {totalCycles} breathing cycles completed
          </p>
          <p className="text-text-muted text-sm mb-8">
            Notice the calm spreading through your body
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
          Cycle {currentCycle + 1} of {totalCycles}
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
        {/* Breathing circle */}
        <div className="relative mb-12">
          {/* Outer glow */}
          <motion.div
            className={cn(
              'absolute inset-0 rounded-full bg-gradient-radial blur-2xl',
              getPhaseColor(currentPhase)
            )}
            animate={circleControls}
            style={{ width: 200, height: 200 }}
          />
          
          {/* Main circle */}
          <motion.div
            className={cn(
              'relative w-48 h-48 rounded-full bg-gradient-to-br flex items-center justify-center',
              getPhaseColor(currentPhase)
            )}
            animate={circleControls}
            initial={{ scale: 1 }}
          >
            {/* Inner circle */}
            <motion.div
              className="w-32 h-32 rounded-full bg-bg-primary/50 backdrop-blur-sm flex items-center justify-center"
              animate={circleControls}
            >
              <span className="text-4xl font-light text-text-primary tabular-nums">
                {phaseTimeRemaining}
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Phase label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-light text-text-primary">
              {getPhaseLabel(currentPhase)}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Pattern info */}
        {pattern && (
          <div className="mt-8 flex items-center gap-4 text-text-muted text-sm">
            <span>In: {pattern.inhale}s</span>
            {pattern.hold && pattern.hold > 0 && <span>Hold: {pattern.hold}s</span>}
            <span>Out: {pattern.exhale}s</span>
            {pattern.holdAfterExhale && pattern.holdAfterExhale > 0 && (
              <span>Hold: {pattern.holdAfterExhale}s</span>
            )}
          </div>
        )}
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
          className="absolute top-1/3 -left-32 w-96 h-96 rounded-full blur-3xl"
          animate={{
            background:
              currentPhase === 'inhale' || currentPhase === 'holdIn'
                ? 'rgba(127, 169, 155, 0.15)'
                : 'rgba(168, 164, 206, 0.1)',
          }}
          transition={{ duration: 2 }}
        />
        <motion.div
          className="absolute bottom-1/3 -right-32 w-80 h-80 rounded-full blur-3xl"
          animate={{
            background:
              currentPhase === 'exhale' || currentPhase === 'holdOut'
                ? 'rgba(127, 169, 155, 0.1)'
                : 'rgba(168, 164, 206, 0.15)',
          }}
          transition={{ duration: 2 }}
        />
      </div>
    </div>
  );
}

