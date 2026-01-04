'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Exercise } from '@/types';
import { cn } from '@/lib/utils/cn';
import { useUser } from '@/contexts/user-context';

const typeIcons: Record<string, React.ReactNode> = {
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
};

const typeLabels: Record<string, string> = {
  pmr: 'Muscle Relaxation',
  breathing: 'Breathing',
  meditation: 'Meditation',
};

const typeColors: Record<string, string> = {
  pmr: 'bg-accent/20 text-accent',
  breathing: 'bg-lavender/20 text-lavender',
  meditation: 'bg-lavender-light/30 text-lavender',
};

const durationFilters = [
  { value: 'all', label: 'Any duration' },
  { value: '5', label: '5 min or less' },
  { value: '10', label: '10 min or less' },
  { value: '15', label: '15 min or less' },
  { value: '20', label: '20 min or less' },
];

const targetAreaLabels: Record<string, string> = {
  jaw: 'Jaw & Face',
  face: 'Face',
  neck: 'Neck',
  shoulders: 'Shoulders',
  back: 'Back',
  arms: 'Arms',
  core: 'Core',
  full_body: 'Full Body',
  anxiety: 'Anxiety',
  sleep: 'Sleep',
  focus: 'Focus',
  calm: 'Calm',
};

// Fetch timeout (10 seconds)
const FETCH_TIMEOUT = 10000;

export default function LibraryPage() {
  const { user, isLoading: userLoading } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [targetFilter, setTargetFilter] = useState<string>('all');
  
  // Use ref to prevent duplicate fetches
  const fetchAttempted = useRef(false);
  
  // Get singleton client - memoized
  const supabase = useMemo(() => getSupabaseClient(), []);

  // Get unique target areas from exercises
  const allTargetAreas = useMemo(() => 
    [...new Set(exercises.flatMap(e => e.target_areas || []))],
    [exercises]
  );

  const fetchExercises = useCallback(async () => {
    if (fetchAttempted.current) {
      return;
    }
    fetchAttempted.current = true;

    try {
      setError(null);
      
      // Add timeout
      const timeoutId = setTimeout(() => {
        throw new Error('Request timed out');
      }, FETCH_TIMEOUT);

      const { data, error: fetchError } = await supabase
        .from('exercises')
        .select('*')
        .order('type', { ascending: true })
        .order('duration_seconds', { ascending: true });

      clearTimeout(timeoutId);

      if (fetchError) {
        console.error('Error fetching exercises:', fetchError);
        setError(`Failed to load exercises: ${fetchError.message}`);
        setExercises([]);
        return;
      }

      console.log('Fetched exercises:', data?.length || 0);
      setExercises(data || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(`Failed to load exercises: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setExercises([]);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    // Reset fetch attempted when user changes
    fetchAttempted.current = false;

    // Wait for user authentication before fetching
    if (userLoading) {
      return;
    }

    if (!user) {
      setIsLoading(false);
      setError('Please log in to view exercises');
      return;
    }

    fetchExercises();
  }, [user, userLoading, fetchExercises]);

  // Handle retry
  const handleRetry = useCallback(() => {
    fetchAttempted.current = false;
    setIsLoading(true);
    setError(null);
    fetchExercises();
  }, [fetchExercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      // Category filter
      if (categoryFilter !== 'all' && exercise.type !== categoryFilter) {
        return false;
      }

      // Duration filter
      if (durationFilter !== 'all') {
        const maxMinutes = parseInt(durationFilter);
        const exerciseMinutes = exercise.duration_seconds / 60;
        if (exerciseMinutes > maxMinutes) {
          return false;
        }
      }

      // Target area filter
      if (targetFilter !== 'all') {
        if (!exercise.target_areas?.includes(targetFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [exercises, categoryFilter, durationFilter, targetFilter]);

  const formatDuration = (seconds: number) => {
    const mins = Math.round(seconds / 60);
    return `${mins} min`;
  };

  if (isLoading || userLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="w-12 h-12 rounded-full bg-accent/30" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-400 mb-2">Error Loading Exercises</h2>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Retry
          </button>
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
          Exercise Library
        </h1>
        <p className="text-text-secondary mt-1">
          Browse and start any exercise. Use them as many times as you like.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Category filter */}
        <div>
          <p className="text-sm text-text-muted mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'pmr', label: 'PMR' },
              { value: 'breathing', label: 'Breathing' },
              { value: 'meditation', label: 'Meditation' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setCategoryFilter(filter.value)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  categoryFilter === filter.value
                    ? 'bg-accent text-white'
                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration filter */}
        <div>
          <p className="text-sm text-text-muted mb-2">Duration</p>
          <div className="flex flex-wrap gap-2">
            {durationFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setDurationFilter(filter.value)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  durationFilter === filter.value
                    ? 'bg-accent text-white'
                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target area filter */}
        {allTargetAreas.length > 0 && (
          <div>
            <p className="text-sm text-text-muted mb-2">Target Area</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTargetFilter('all')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  targetFilter === 'all'
                    ? 'bg-accent text-white'
                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                )}
              >
                All
              </button>
              {allTargetAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setTargetFilter(area)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    targetFilter === area
                      ? 'bg-accent text-white'
                      : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                  )}
                >
                  {targetAreaLabels[area] || area}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Exercise count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-sm text-text-muted mb-4"
      >
        {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
      </motion.p>

      {/* Exercise grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.03 }}
          >
            <Link href={`/exercises/${exercise.id}`} className="block h-full">
              <Card hoverable className="h-full">
                {/* Type badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-accent">
                    {typeIcons[exercise.type]}
                    <span className="text-xs font-medium uppercase tracking-wide">
                      {typeLabels[exercise.type]}
                    </span>
                  </div>
                  <span className="text-sm text-text-muted">
                    {formatDuration(exercise.duration_seconds)}
                  </span>
                </div>

                <CardHeader className="p-0">
                  <CardTitle className="text-lg">{exercise.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {exercise.description}
                  </CardDescription>
                </CardHeader>

                {/* Target areas */}
                {exercise.target_areas && exercise.target_areas.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exercise.target_areas.slice(0, 3).map((area) => (
                      <span
                        key={area}
                        className={cn(
                          'px-2 py-0.5 rounded text-xs',
                          typeColors[exercise.type]
                        )}
                      >
                        {targetAreaLabels[area] || area}
                      </span>
                    ))}
                    {exercise.target_areas.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-text-muted">
                        +{exercise.target_areas.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Featured badge */}
                {exercise.is_featured && (
                  <div className="mt-3 flex items-center gap-1.5 text-warning">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-medium">Featured</span>
                  </div>
                )}
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-text-muted">No exercises match your filters.</p>
          <button
            onClick={() => {
              setCategoryFilter('all');
              setDurationFilter('all');
              setTargetFilter('all');
            }}
            className="mt-4 text-accent hover:underline"
          >
            Clear all filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
