'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui';

interface OtherInputProps {
  visible: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function OtherInput({ 
  visible, 
  value, 
  onChange, 
  placeholder = 'Please specify (optional)' 
}: OtherInputProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
