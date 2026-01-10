'use client';

import { motion } from 'framer-motion';

export function ThankYouCheck() {
  return (
    <motion.div
      className="mx-auto mb-6 w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        opacity: 1,
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 3.2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 0.6,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-accent"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.25 }}
        />
      </svg>
    </motion.div>
  );
}

