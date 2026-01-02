'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/contexts/user-context';
import { Card, CardHeader, CardTitle, CardDescription, Button } from '@/components/ui';
import { Program, UserProgram } from '@/types';
import { cn } from '@/lib/utils/cn';

const categoryIcons: Record<string, React.ReactNode> = {
  pmr: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  breathing: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  ),
  meditation: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  mixed: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
};

const categoryLabels: Record<string, string> = {
  pmr: 'Muscle Relaxation',
  breathing: 'Breathing',
  meditation: 'Meditation',
  mixed: 'Mixed',
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [userPrograms, setUserPrograms] = useState<UserProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { profile, isPremium } = useUser();
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all programs
        const { data: programsData } = await supabase
          .from('programs')
          .select('*')
          .order('order_index', { ascending: true });

        setPrograms(programsData || []);

        // Fetch user's enrolled programs
        if (profile) {
          const { data: userProgramsData } = await supabase
            .from('user_programs')
            .select('*')
            .eq('user_id', profile.id);

          setUserPrograms(userProgramsData || []);
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [profile, supabase]);

  const filteredPrograms = programs.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'free') return !p.is_premium;
    return p.category === filter;
  });

  const getUserProgress = (programId: string) => {
    return userPrograms.find((up) => up.program_id === programId);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="w-12 h-12 rounded-full bg-accent/30" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary font-[family-name:var(--font-dm-serif)]">
          Programs
        </h1>
        <p className="text-text-secondary mt-1">
          Choose a program to start your relaxation journey
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {[
          { value: 'all', label: 'All' },
          { value: 'free', label: 'Free' },
          { value: 'pmr', label: 'PMR' },
          { value: 'breathing', label: 'Breathing' },
          { value: 'meditation', label: 'Meditation' },
          { value: 'mixed', label: 'Mixed' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              filter === f.value
                ? 'bg-accent text-white'
                : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            )}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Programs grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program, index) => {
          const progress = getUserProgress(program.id);
          const isLocked = program.is_premium && !isPremium;

          return (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link
                href={isLocked ? '/pricing' : `/programs/${program.id}`}
                className="block h-full"
              >
                <Card
                  hoverable
                  className={cn(
                    'h-full relative',
                    isLocked && 'opacity-75'
                  )}
                >
                  {/* Category badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-accent">
                      {categoryIcons[program.category]}
                      <span className="text-xs font-medium uppercase tracking-wide">
                        {categoryLabels[program.category]}
                      </span>
                    </div>
                    {program.is_premium && (
                      <span className="px-2 py-1 bg-lavender/20 text-lavender text-xs font-medium rounded-full">
                        Premium
                      </span>
                    )}
                  </div>

                  <CardHeader className="p-0">
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {program.description}
                    </CardDescription>
                  </CardHeader>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-text-muted">
                      {program.duration_days} days
                    </span>
                    <span className="text-text-muted capitalize">
                      {program.difficulty}
                    </span>
                  </div>

                  {/* Progress indicator */}
                  {progress && !progress.completed_at && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-accent font-medium">In Progress</span>
                        <span className="text-text-muted">
                          Day {progress.current_day} / {program.duration_days}
                        </span>
                      </div>
                      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all"
                          style={{
                            width: `${(progress.current_day / program.duration_days) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {progress?.completed_at && (
                    <div className="mt-4 flex items-center gap-2 text-success">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}

                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/50 rounded-2xl">
                      <div className="text-center">
                        <svg
                          className="w-8 h-8 text-text-muted mx-auto mb-2"
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
                        <p className="text-sm text-text-muted">Unlock with Premium</p>
                      </div>
                    </div>
                  )}
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted">No programs found for this filter.</p>
        </div>
      )}
    </div>
  );
}

