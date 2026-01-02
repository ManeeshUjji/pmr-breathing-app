'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/contexts/user-context';
import { Card, Button } from '@/components/ui';
import { Program, Exercise, UserProgram } from '@/types';
import { cn } from '@/lib/utils/cn';

const typeLabels: Record<string, string> = {
  pmr: 'PMR',
  breathing: 'Breathing',
  meditation: 'Meditation',
};

const typeColors: Record<string, string> = {
  pmr: 'bg-accent/20 text-accent',
  breathing: 'bg-lavender/20 text-lavender',
  meditation: 'bg-lavender-light/30 text-lavender',
};

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [program, setProgram] = useState<Program | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { profile, isPremium } = useUser();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch program details
        const { data: programData } = await supabase
          .from('programs')
          .select('*')
          .eq('id', id)
          .single();

        if (!programData) {
          router.push('/programs');
          return;
        }

        setProgram(programData);

        // Fetch exercises for this program
        const { data: exercisesData } = await supabase
          .from('exercises')
          .select('*')
          .eq('program_id', id)
          .order('day_number', { ascending: true })
          .order('order_index', { ascending: true });

        setExercises(exercisesData || []);

        // Fetch user's progress if logged in
        if (profile) {
          const { data: userProgramData } = await supabase
            .from('user_programs')
            .select('*')
            .eq('user_id', profile.id)
            .eq('program_id', id)
            .single();

          setUserProgram(userProgramData);
        }
      } catch (error) {
        console.error('Error fetching program:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, profile, supabase, router]);

  const handleEnroll = async () => {
    if (!profile) {
      router.push('/login');
      return;
    }

    setIsEnrolling(true);
    try {
      const { data, error } = await supabase
        .from('user_programs')
        .insert({
          user_id: profile.id,
          program_id: id,
          current_day: 1,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      setUserProgram(data);
    } catch (error) {
      console.error('Error enrolling in program:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  // Group exercises by day
  const exercisesByDay = exercises.reduce((acc, exercise) => {
    const dayNum = exercise.day_number ?? 0;
    if (!acc[dayNum]) {
      acc[dayNum] = [];
    }
    acc[dayNum].push(exercise);
    return acc;
  }, {} as Record<number, Exercise[]>);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="w-12 h-12 rounded-full bg-accent/30" />
        </div>
      </div>
    );
  }

  if (!program) {
    return null;
  }

  const isLocked = program.is_premium && !isPremium;
  const currentDay = userProgram?.current_day || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Programs
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className={cn('px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide', typeColors[program.category])}>
            {typeLabels[program.category] || program.category}
          </span>
          {program.is_premium && (
            <span className="px-3 py-1 bg-lavender/20 text-lavender text-xs font-medium rounded-full">
              Premium
            </span>
          )}
          <span className="text-text-muted text-sm capitalize">
            {program.difficulty}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary font-[family-name:var(--font-dm-serif)] mb-3">
          {program.title}
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          {program.description}
        </p>

        <div className="flex items-center gap-6 mt-4 text-sm text-text-muted">
          <span>{program.duration_days} days</span>
          <span>{exercises.length} exercises</span>
        </div>
      </motion.div>

      {/* Progress / Enroll section */}
      {!isLocked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {userProgram ? (
            <Card className="bg-gradient-to-br from-accent/5 to-lavender/5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Your Progress</p>
                  <p className="text-lg font-medium text-text-primary">
                    Day {userProgram.current_day} of {program.duration_days}
                  </p>
                  <div className="mt-2 w-48 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{
                        width: `${(userProgram.current_day / program.duration_days) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                {exercisesByDay[userProgram.current_day]?.[0] && (
                  <Link href={`/exercises/${exercisesByDay[userProgram.current_day][0].id}`}>
                    <Button size="lg">Continue Today&apos;s Session</Button>
                  </Link>
                )}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-text-primary font-medium">
                    Ready to start this program?
                  </p>
                  <p className="text-text-secondary text-sm">
                    Commit to {program.duration_days} days of guided relaxation
                  </p>
                </div>
                <Button onClick={handleEnroll} isLoading={isEnrolling} size="lg">
                  Start Program
                </Button>
              </div>
            </Card>
          )}
        </motion.div>
      )}

      {/* Locked state */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="text-center py-8">
            <svg
              className="w-12 h-12 text-text-muted mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-text-primary font-medium mb-2">
              This is a Premium program
            </p>
            <p className="text-text-secondary text-sm mb-6">
              Unlock access to all premium programs with a subscription
            </p>
            <Link href="/pricing">
              <Button size="lg">View Plans</Button>
            </Link>
          </Card>
        </motion.div>
      )}

      {/* Exercise list by day */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Program Schedule
        </h2>

        <div className="space-y-4">
          {Object.entries(exercisesByDay).map(([day, dayExercises]) => {
            const dayNum = parseInt(day);
            const isCurrentDay = dayNum === currentDay;
            const isCompleted = dayNum < currentDay;
            const isAvailable = dayNum <= currentDay || !userProgram;

            return (
              <Card
                key={day}
                className={cn(
                  'transition-all',
                  isCurrentDay && 'ring-2 ring-accent',
                  isLocked && 'opacity-50'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Day indicator */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-medium',
                      isCompleted
                        ? 'bg-success/20 text-success'
                        : isCurrentDay
                        ? 'bg-accent text-white'
                        : 'bg-bg-tertiary text-text-muted'
                    )}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      dayNum
                    )}
                  </div>

                  {/* Day content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-text-primary">
                        Day {dayNum}
                      </h3>
                      {isCurrentDay && (
                        <span className="text-xs font-medium text-accent uppercase tracking-wide">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {dayExercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded text-xs',
                                typeColors[exercise.type]
                              )}
                            >
                              {typeLabels[exercise.type]}
                            </span>
                            <span className="text-text-secondary text-sm">
                              {exercise.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-text-muted text-sm">
                              {formatDuration(exercise.duration_seconds)}
                            </span>
                            {isAvailable && !isLocked && (
                              <Link href={`/exercises/${exercise.id}`}>
                                <Button variant="ghost" size="sm">
                                  {isCompleted ? 'Redo' : 'Start'}
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

