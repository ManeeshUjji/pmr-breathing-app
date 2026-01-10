'use client';

import { cn } from '@/lib/utils/cn';

type AmbientBackgroundProps = {
  className?: string;
};

export function AmbientBackground({ className }: AmbientBackgroundProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 -z-10 overflow-hidden pointer-events-none',
        className
      )}
      aria-hidden="true"
    >
      {/* Soft ambient blobs (subtle by design) */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-accent/8 blur-3xl animate-pulse-gentle" />
      <div className="absolute -bottom-32 -right-32 w-[38rem] h-[38rem] rounded-full bg-lavender/10 blur-3xl animate-pulse-gentle" />
      <div className="absolute top-1/3 -left-40 w-[32rem] h-[32rem] rounded-full bg-accent/6 blur-3xl" />
    </div>
  );
}


