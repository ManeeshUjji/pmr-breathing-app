'use client';

import { useRouter } from 'next/navigation';
import { MeditationPlayer } from '@/components/exercises';
import { useUser } from '@/contexts/user-context';
import { createClient } from '@/lib/supabase/client';
import { Exercise } from '@/types';

// Quick 3-minute mindful moment meditation
const quickMeditationExercise: Exercise = {
  id: 'quick-meditation',
  program_id: null,
  title: 'Mindful Moment',
  description: 'A brief meditation to help you reconnect with the present moment.',
  type: 'meditation',
  day_number: null,
  duration_seconds: 180,
  content: {
    steps: [
      {
        instruction: 'Find a comfortable position and gently close your eyes.',
        duration: 15,
        audioScript: 'Find a comfortable position. Let your eyes gently close. Take a moment to arrive fully in this space.',
      },
      {
        instruction: 'Take three deep breaths, letting each exhale release any tension.',
        duration: 20,
        audioScript: 'Take a deep breath in through your nose. And slowly exhale through your mouth. Again, breathe in deeply. And release. One more time, breathe in. And let go completely.',
      },
      {
        instruction: 'Notice the sensations in your body right now.',
        duration: 25,
        audioScript: 'Now, bring your attention to your body. Notice any sensations present right now. Perhaps you feel the weight of your body where you are sitting or standing. Simply observe without judgment.',
      },
      {
        instruction: 'Let your breath return to its natural rhythm.',
        duration: 20,
        audioScript: 'Allow your breath to return to its natural rhythm. No need to control it. Simply observe each breath as it comes and goes.',
      },
      {
        instruction: 'Focus on the present moment. Let thoughts come and go.',
        duration: 40,
        audioScript: 'Rest your attention on this present moment. If thoughts arise, acknowledge them gently and let them drift away like clouds in the sky. Return your focus to your breath, to this moment, to simply being here.',
      },
      {
        instruction: 'Notice the stillness within you.',
        duration: 30,
        audioScript: 'Notice the stillness that exists beneath all your thoughts and feelings. This peaceful awareness is always available to you. You can return to it anytime you need.',
      },
      {
        instruction: 'Slowly bring your awareness back to the room.',
        duration: 20,
        audioScript: 'Now, slowly begin to bring your awareness back to your surroundings. Notice the sounds around you. Feel the surface beneath you.',
      },
      {
        instruction: 'When you are ready, gently open your eyes.',
        duration: 10,
        audioScript: 'When you feel ready, gently open your eyes. Carry this sense of calm with you as you continue your day.',
      },
    ],
  },
  breathing_pattern: null,
  muscle_groups: null,
  audio_script: 'Find a comfortable position and close your eyes. Take three deep breaths, letting each exhale release any tension. Notice the sensations in your body right now. Let your breath return to its natural rhythm. Focus on the present moment, letting thoughts come and go like clouds. Notice the stillness within you. Slowly bring your awareness back to the room. When ready, gently open your eyes.',
  order_index: 0,
  target_areas: ['calm', 'focus'],
  is_featured: false,
  created_at: new Date().toISOString(),
};

export default function QuickMeditationPage() {
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

  return <MeditationPlayer exercise={quickMeditationExercise} onComplete={handleComplete} />;
}

