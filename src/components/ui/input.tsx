'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, labelClassName, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-text-secondary mb-2',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-12 px-4 rounded-xl',
            'bg-bg-primary/50 border border-accent-light/40 shadow-[var(--shadow-inset)]',
            'text-text-primary placeholder:text-text-muted',
            'transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:ring-offset-2 focus:ring-offset-bg-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error focus:ring-error',
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-error">{error}</p>}
        {hint && !error && (
          <p className="mt-2 text-sm text-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';



