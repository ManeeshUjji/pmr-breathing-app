'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/contexts/user-context';
import { PMRPlayer, BreathingGuide, MeditationPlayer } from '@/components/exercises';
import { Exercise, UserProgram } from '@/types';

export default function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null);
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
          router.push('/programs');
          return;
        }

        setExercise(exerciseData);

        // Fetch user program for this exercise if exists
        if (profile && exerciseData.program_id) {
          const { data: userProgramData } = await supabase
            .from('user_programs')
            .select('*')
            .eq('user_id', profile.id)
            .eq('program_id', exerciseData.program_id)
            .single();

          setUserProgram(userProgramData);
        }
      } catch (error) {
        console.error('Error fetching exercise:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, profile, supabase, router]);

  const handleComplete = async (durationSeconds: number) => {
    if (!profile || !exercise) return;

    try {
      // Save session
      await supabase.from('sessions').insert({
        user_id: profile.id,
        exercise_id: exercise.id,
        user_program_id: userProgram?.id,
        duration_seconds: durationSeconds,
      });

      // Update user program progress if this was the current day's exercise
      if (userProgram && exercise.day_number === userProgram.current_day) {
        const { data: programData } = await supabase
          .from('programs')
          .select('duration_days')
          .eq('id', exercise.program_id)
          .single();

        if (programData) {
          const isComplete = userProgram.current_day >= programData.duration_days;

          await supabase
            .from('user_programs')
            .update({
              current_day: isComplete
                ? userProgram.current_day
                : userProgram.current_day + 1,
              completed_at: isComplete ? new Date().toISOString() : null,
            })
            .eq('id', userProgram.id);
        }
      }

      // Navigate back to program or dashboard
      if (exercise.program_id) {
        router.push(`/programs/${exercise.program_id}`);
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (error) {
      console.error('Error saving session:', error);
      router.push('/dashboard');
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

