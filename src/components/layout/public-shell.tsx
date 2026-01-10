'use client';

import { ReactNode } from 'react';
import { AmbientBackground } from '@/components/layout/ambient-background';
import { PublicFooter } from '@/components/layout/public-footer';
import { PublicHeader } from '@/components/layout/public-header';
import { cn } from '@/lib/utils/cn';

type PublicShellProps = {
  children: ReactNode;
  showHeader?: boolean;
  headerRight?: ReactNode;
  headerVariant?: 'fixed' | 'sticky' | 'static';
  showFooter?: boolean;
  className?: string;
  mainClassName?: string;
};

export function PublicShell({
  children,
  showHeader = true,
  headerRight,
  headerVariant = 'fixed',
  showFooter = true,
  className,
  mainClassName,
}: PublicShellProps) {
  const hasFixedHeader = showHeader && headerVariant === 'fixed';

  return (
    <div className={cn('min-h-screen bg-gradient-calm text-text-primary', className)}>
      <AmbientBackground />
      {showHeader && <PublicHeader variant={headerVariant} right={headerRight} />}

      <main
        className={cn(
          hasFixedHeader ? 'pt-24' : showHeader ? 'pt-10' : 'pt-0',
          'pb-16',
          mainClassName
        )}
      >
        {children}
      </main>

      {showFooter && <PublicFooter />}
    </div>
  );
}


