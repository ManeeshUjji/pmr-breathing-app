'use client';

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <motion.div
            key={index}
            className="relative"
            initial={false}
            animate={{
              backgroundColor: isCompleted || isCurrent 
                ? 'var(--color-accent)' 
                : 'var(--color-accent-light)',
              opacity: isCompleted || isCurrent ? 1 : 0.35,
              width: isCurrent ? 20 : 14,
            }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
            }}
            style={{
              height: 3,
              borderRadius: 2,
            }}
            aria-hidden="true"
          />
        );
      })}
      <span className="sr-only">
        Step {currentStep + 1} of {totalSteps}
      </span>
    </div>
  );
}
