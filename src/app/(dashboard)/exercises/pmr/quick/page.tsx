'use client';

import { useRouter } from 'next/navigation';
import { PMRPlayer } from '@/components/exercises';
import { useUser } from '@/contexts/user-context';
import { createClient } from '@/lib/supabase/client';
import { Exercise } from '@/types';

// Quick 5-minute shoulder release PMR exercise
const quickPMRExercise: Exercise = {
  id: 'quick-pmr',
  program_id: null,
  title: 'Shoulder Release',
  description: 'A quick tension release for your neck and shoulders - perfect for desk workers.',
  type: 'pmr',
  day_number: null,
  duration_seconds: 300,
  content: {
    steps: [
      {
        muscleGroup: 'neck',
        phase: 'tense',
        instruction: 'Gently tilt your head forward, chin toward chest. Feel the stretch in the back of your neck.',
        duration: 10,
      },
      {
        muscleGroup: 'neck',
        phase: 'hold',
        instruction: 'Hold this position. Notice the gentle tension.',
        duration: 5,
      },
      {
        muscleGroup: 'neck',
        phase: 'release',
        instruction: 'Slowly release, bringing your head back to center.',
        duration: 10,
      },
      {
        muscleGroup: 'neck',
        phase: 'rest',
        instruction: 'Rest and feel the relaxation spreading through your neck.',
        duration: 15,
      },
      {
        muscleGroup: 'shoulders',
        phase: 'tense',
        instruction: 'Raise your shoulders up toward your ears. Hold them there tightly.',
        duration: 10,
      },
      {
        muscleGroup: 'shoulders',
        phase: 'hold',
        instruction: 'Keep your shoulders raised. Feel the tension building.',
        duration: 5,
      },
      {
        muscleGroup: 'shoulders',
        phase: 'release',
        instruction: 'Let your shoulders drop completely. Let all the tension melt away.',
        duration: 10,
      },
      {
        muscleGroup: 'shoulders',
        phase: 'rest',
        instruction: 'Rest and notice the warmth and relaxation in your shoulders.',
        duration: 15,
      },
      {
        muscleGroup: 'shoulders',
        phase: 'tense',
        instruction: 'Roll your shoulders back and squeeze your shoulder blades together.',
        duration: 10,
      },
      {
        muscleGroup: 'shoulders',
        phase: 'hold',
        instruction: 'Hold this squeeze. Feel the muscles between your shoulder blades.',
        duration: 5,
      },
      {
        muscleGroup: 'shoulders',
        phase: 'release',
        instruction: 'Release and let your shoulders return to a natural position.',
        duration: 10,
      },
      {
        muscleGroup: 'shoulders',
        phase: 'rest',
        instruction: 'Rest. Notice how much lighter your shoulders feel now.',
        duration: 20,
      },
      {
        muscleGroup: 'neck',
        phase: 'tense',
        instruction: 'Gently tilt your head to the right, ear toward shoulder.',
        duration: 10,
      },
      {
        muscleGroup: 'neck',
        phase: 'release',
        instruction: 'Return to center, then tilt to the left.',
        duration: 10,
      },
      {
        muscleGroup: 'neck',
        phase: 'rest',
        instruction: 'Return to center. Take a deep breath and enjoy the relaxation.',
        duration: 20,
      },
    ],
  },
  breathing_pattern: null,
  muscle_groups: ['neck', 'shoulders'],
  audio_script: null,
  order_index: 0,
  target_areas: ['neck', 'shoulders'],
  is_featured: false,
  created_at: new Date().toISOString(),
};

export default function QuickPMRPage() {
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

  return <PMRPlayer exercise={quickPMRExercise} onComplete={handleComplete} />;
}

