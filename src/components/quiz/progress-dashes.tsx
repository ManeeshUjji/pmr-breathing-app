'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

type ProgressDashesProps = {
  total: number;
  currentIndex: number; // 0-based index among the question steps
  completedCount: number; // 0..total
  className?: string;
};

export function ProgressDashes({
  total,
  currentIndex,
  completedCount,
  className,
}: ProgressDashesProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = i < completedCount;
        const isCurrent = i === currentIndex && !isCompleted;
        const isUpcoming = !isCompleted && !isCurrent;

        return (
          <motion.div
            key={i}
            className={cn(
              'h-[2px] rounded-full',
              isCompleted && 'bg-accent',
              isCurrent && 'bg-accent',
              isUpcoming && 'bg-text-muted/30'
            )}
            animate={{
              width: isCurrent ? 18 : 14,
              opacity: isUpcoming ? 0.35 : isCurrent ? 0.85 : 1,
            }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
}


