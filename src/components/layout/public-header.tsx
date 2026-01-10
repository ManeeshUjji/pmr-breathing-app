'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type PublicHeaderProps = {
  right?: ReactNode;
  variant?: 'fixed' | 'sticky' | 'static';
  className?: string;
};

export function PublicHeader({
  right,
  variant = 'fixed',
  className,
}: PublicHeaderProps) {
  const variantClass =
    variant === 'fixed'
      ? 'fixed top-0 left-0 right-0'
      : variant === 'sticky'
        ? 'sticky top-0'
        : 'relative';

  return (
    <header
      className={cn(
        variantClass,
        'z-50 border-b border-accent-light/20',
        'bg-bg-primary/80 backdrop-blur-md',
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold text-text-primary font-[family-name:var(--font-dm-serif)]"
        >
          Tranquil
        </Link>

        <div className="flex items-center gap-4">{right}</div>
      </div>
    </header>
  );
}


