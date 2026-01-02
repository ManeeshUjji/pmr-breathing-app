'use client';

import { useRouter } from 'next/navigation';
import { BreathingGuide } from '@/components/exercises';
import { useUser } from '@/contexts/user-context';
import { createClient } from '@/lib/supabase/client';
import { Exercise } from '@/types';

// Quick 2-minute breathing exercise (4-4-4-4 box breathing pattern)
const quickBreathingExercise: Exercise = {
  id: 'quick-breathing',
  program_id: null,
  title: '2-Minute Calm',
  description: 'A quick box breathing exercise to help you find calm in any moment.',
  type: 'breathing',
  day_number: null,
  duration_seconds: 120,
  content: {},
  breathing_pattern: {
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
    cycles: 8,
  },
  audio_script: null,
  order_index: 0,
  created_at: new Date().toISOString(),
};

export default function QuickBreathingPage() {
  const router = useRouter();
  const { profile } = useUser();
  const supabase = createClient();

  const handleComplete = async (durationSeconds: number) => {
    // Save session if user is logged in
    if (profile) {
      try {
        await supabase.from('sessions').insert({
          user_id: profile.id,
          exercise_id: null,
          user_program_id: null,
          duration_seconds: durationSeconds,
        });
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }
    router.push('/dashboard');
  };

  return <BreathingGuide exercise={quickBreathingExercise} onComplete={handleComplete} />;
}

