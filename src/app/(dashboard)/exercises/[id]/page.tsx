'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/contexts/user-context';
import { PMRPlayer, BreathingGuide, MeditationPlayer } from '@/components/exercises';
import { Exercise } from '@/types';

export default function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useUser();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch exercise details
        const { data: exerciseData } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', id)
          .single();

        if (!exerciseData) {
          router.push('/library');
          return;
        }

        setExercise(exerciseData);
      } catch (error) {
        console.error('Error fetching exercise:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, supabase, router]);

  const handleComplete = async (durationSeconds: number) => {
    if (!profile || !exercise) return;

    try {
      // Save session (no program progress tracking)
      await supabase.from('sessions').insert({
        user_id: profile.id,
        exercise_id: exercise.id,
        duration_seconds: durationSeconds,
      });

      // Navigate back to library
      router.push('/library');
      router.refresh();
    } catch (error) {
      console.error('Error saving session:', error);
      router.push('/library');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="w-16 h-16 rounded-full bg-accent/30" />
        </div>
      </div>
    );
  }

  if (!exercise) {
    return null;
  }

  // Render appropriate player based on exercise type
  switch (exercise.type) {
    case 'pmr':
      return <PMRPlayer exercise={exercise} onComplete={handleComplete} />;
    case 'breathing':
      return <BreathingGuide exercise={exercise} onComplete={handleComplete} />;
    case 'meditation':
      return <MeditationPlayer exercise={exercise} onComplete={handleComplete} />;
    default:
      return <PMRPlayer exercise={exercise} onComplete={handleComplete} />;
  }
}
