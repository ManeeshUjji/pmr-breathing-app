'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  type?: 'single' | 'multi';
}

export function OptionButton({ 
  label, 
  selected, 
  onClick, 
  type = 'single' 
}: OptionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        selected
          ? 'border-accent bg-accent/10 text-text-primary'
          : 'border-accent-light bg-bg-secondary text-text-secondary hover:border-accent/50 hover:bg-bg-tertiary'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex-shrink-0 w-5 h-5 border-2 transition-all duration-200',
            type === 'multi' ? 'rounded-md' : 'rounded-full',
            selected
              ? 'border-accent bg-accent'
              : 'border-accent-light bg-transparent'
          )}
        >
          {selected && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full text-white p-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          )}
        </div>
        <span className="text-base md:text-lg">{label}</span>
      </div>
    </motion.button>
  );
}
