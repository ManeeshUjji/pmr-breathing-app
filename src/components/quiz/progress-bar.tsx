'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

type ProgressBarProps = {
  /** 0..1 */
  value: number;
  className?: string;
};

export function ProgressBar({ value, className }: ProgressBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clamped = Math.max(0, Math.min(1, value));
  const width = `${Math.round(clamped * 1000) / 10}%`;
  const targetWidth = mounted ? width : '0%';

  return (
    <div
      className={cn(
        'w-full h-[3px] rounded-full bg-text-muted/20 overflow-hidden',
        className
      )}
      aria-hidden="true"
    >
      <motion.div
        className="h-full rounded-full bg-accent/80"
        initial={false}
        animate={{ width: targetWidth }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      />
    </div>
  );
}

