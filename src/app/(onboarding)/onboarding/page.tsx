'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui';
import { QuizQuestion, QuizResults } from '@/types';

const questions: QuizQuestion[] = [
  {
    id: 'stress-sources',
    question: 'What causes you the most stress?',
    type: 'multiple',
    options: [
      { id: 'work', label: 'Work or career', value: 'work', icon: '💼' },
      { id: 'relationships', label: 'Relationships', value: 'relationships', icon: '💬' },
      { id: 'health', label: 'Health concerns', value: 'health', icon: '🏥' },
      { id: 'sleep', label: 'Sleep problems', value: 'sleep', icon: '😴' },
      { id: 'general', label: 'General anxiety', value: 'general', icon: '😰' },
      { id: 'physical', label: 'Physical tension', value: 'physical', icon: '💪' },
    ],
  },
  {
    id: 'goals',
    question: 'What would you like to achieve?',
    type: 'multiple',
    options: [
      { id: 'reduce-stress', label: 'Reduce daily stress', value: 'reduce-stress', icon: '🧘' },
      { id: 'better-sleep', label: 'Sleep better', value: 'better-sleep', icon: '🌙' },
      { id: 'release-tension', label: 'Release muscle tension', value: 'release-tension', icon: '✨' },
      { id: 'calm-anxiety', label: 'Calm anxiety', value: 'calm-anxiety', icon: '🌊' },
      { id: 'focus', label: 'Improve focus', value: 'focus', icon: '🎯' },
      { id: 'build-habit', label: 'Build a relaxation habit', value: 'build-habit', icon: '📅' },
    ],
  },
  {
    id: 'experience',
    question: 'Have you tried relaxation techniques before?',
    type: 'single',
    options: [
      { id: 'beginner', label: 'I\'m completely new to this', value: 'beginner', icon: '🌱' },
      { id: 'some', label: 'I\'ve tried a few things', value: 'intermediate', icon: '🌿' },
      { id: 'experienced', label: 'I practice regularly', value: 'advanced', icon: '🌳' },
    ],
  },
  {
    id: 'duration',
    question: 'How much time can you dedicate daily?',
    type: 'single',
    options: [
      { id: '5min', label: '5 minutes or less', value: '5', icon: '⚡' },
      { id: '10min', label: 'About 10 minutes', value: '10', icon: '⏱️' },
      { id: '15min', label: '15-20 minutes', value: '15', icon: '🕐' },
      { id: '30min', label: '30+ minutes', value: '30', icon: '🧘‍♀️' },
    ],
  },
  {
    id: 'focus-areas',
    question: 'Where do you hold the most tension?',
    type: 'multiple',
    options: [
      { id: 'jaw', label: 'Jaw & face', value: 'jaw', icon: '😬' },
      { id: 'neck', label: 'Neck', value: 'neck', icon: '🦒' },
      { id: 'shoulders', label: 'Shoulders', value: 'shoulders', icon: '💆' },
      { id: 'back', label: 'Back', value: 'back', icon: '🔙' },
      { id: 'hands', label: 'Hands & arms', value: 'hands', icon: '🤲' },
      { id: 'all', label: 'All over', value: 'all', icon: '🧍' },
    ],
  },
];

// Map quiz results to exercise recommendations
// Returns an array of target areas and types to filter exercises
function getRecommendedFilters(results: QuizResults): { types: string[]; targetAreas: string[] } {
  const { goals, focusAreas, stressSources } = results;
  
  const types: string[] = [];
  const targetAreas: string[] = [];
  
  // Add breathing for anxiety/stress
  if (goals.includes('calm-anxiety') || stressSources.includes('general')) {
    types.push('breathing');
    targetAreas.push('anxiety');
  }
  
  // Add PMR for physical tension
  if (goals.includes('release-tension') || stressSources.includes('physical')) {
    types.push('pmr');
  }
  
  // Add specific areas
  if (focusAreas.includes('jaw')) {
    targetAreas.push('jaw', 'face');
  }
  if (focusAreas.includes('neck')) {
    targetAreas.push('neck');
  }
  if (focusAreas.includes('shoulders')) {
    targetAreas.push('shoulders');
  }
  if (focusAreas.includes('back')) {
    targetAreas.push('back');
  }
  if (focusAreas.includes('hands')) {
    targetAreas.push('arms');
  }
  if (focusAreas.includes('all')) {
    targetAreas.push('full_body');
  }
  
  // Sleep focus
  if (goals.includes('better-sleep') || stressSources.includes('sleep')) {
    types.push('breathing');
    targetAreas.push('sleep');
  }
  
  // Focus/work stress
  if (goals.includes('focus') || stressSources.includes('work')) {
    types.push('breathing', 'meditation');
    targetAreas.push('focus', 'calm');
  }
  
  // Default to all types if none selected
  if (types.length === 0) {
    types.push('pmr', 'breathing');
  }
  
  // Default target areas
  if (targetAreas.length === 0) {
    targetAreas.push('calm', 'full_body');
  }
  
  return {
    types: [...new Set(types)],
    targetAreas: [...new Set(targetAreas)],
  };
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelect = (optionValue: string) => {
    const currentAnswers = answers[currentQuestion.id] || [];
    
    if (currentQuestion.type === 'single') {
      setAnswers({ ...answers, [currentQuestion.id]: [optionValue] });
    } else {
      if (currentAnswers.includes(optionValue)) {
        setAnswers({
          ...answers,
          [currentQuestion.id]: currentAnswers.filter((v) => v !== optionValue),
        });
      } else {
        setAnswers({
          ...answers,
          [currentQuestion.id]: [...currentAnswers, optionValue],
        });
      }
    }
  };

  const isSelected = (optionValue: string) => {
    return (answers[currentQuestion.id] || []).includes(optionValue);
  };

  const canProceed = (answers[currentQuestion.id] || []).length > 0;

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit quiz results
      setIsSubmitting(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        const quizData: Omit<QuizResults, 'recommendedExerciseIds'> = {
          stressSources: answers['stress-sources'] || [],
          goals: answers['goals'] || [],
          experienceLevel: (answers['experience']?.[0] as QuizResults['experienceLevel']) || 'beginner',
          preferredDuration: parseInt(answers['duration']?.[0] || '10'),
          focusAreas: answers['focus-areas'] || [],
        };
        
        // Get recommended filters based on quiz answers
        const filters = getRecommendedFilters(quizData as QuizResults);
        
        // Fetch exercises matching the filters
        let query = supabase
          .from('exercises')
          .select('id, type, target_areas, duration_seconds')
          .order('is_featured', { ascending: false })
          .order('duration_seconds', { ascending: true });
        
        // Filter by preferred duration
        const maxSeconds = quizData.preferredDuration * 60 + 120; // Add 2 min buffer
        query = query.lte('duration_seconds', maxSeconds);
        
        const { data: exercises } = await query;
        
        // Score and rank exercises based on matches
        const scoredExercises = (exercises || []).map(exercise => {
          let score = 0;
          
          // Type match
          if (filters.types.includes(exercise.type)) {
            score += 2;
          }
          
          // Target area matches
          const exerciseAreas = exercise.target_areas || [];
          for (const area of filters.targetAreas) {
            if (exerciseAreas.includes(area)) {
              score += 1;
            }
          }
          
          return { id: exercise.id, score };
        });
        
        // Sort by score and take top 5
        scoredExercises.sort((a, b) => b.score - a.score);
        const recommendedExerciseIds = scoredExercises.slice(0, 5).map(e => e.id);

        const results: QuizResults = {
          ...quizData,
          recommendedExerciseIds,
        };

        // Update profile with quiz results (no program enrollment!)
        await supabase
          .from('profiles')
          .update({
            quiz_completed: true,
            quiz_results: results,
            experience_level: results.experienceLevel,
            preferred_duration: results.preferredDuration,
            goals: results.goals,
          })
          .eq('id', user.id);

        // Redirect to library (not a program page)
        router.push('/library');
        router.refresh();
      } catch (error) {
        console.error('Error saving quiz results:', error);
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-bg-tertiary z-50">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <header className="pt-8 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm text-text-muted">
            {currentStep + 1} of {questions.length}
          </span>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-text-muted hover:text-text-secondary text-sm transition-colors"
          >
            Skip
          </button>
        </div>
      </header>

      {/* Question content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl md:text-3xl font-light text-text-primary text-center mb-2 font-[family-name:var(--font-dm-serif)]">
                {currentQuestion.question}
              </h1>
              <p className="text-text-muted text-center mb-10">
                {currentQuestion.type === 'multiple'
                  ? 'Select all that apply'
                  : 'Choose one'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentQuestion.options.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleSelect(option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 md:p-6 rounded-2xl border-2 transition-all text-left ${
                      isSelected(option.value)
                        ? 'border-accent bg-accent/10'
                        : 'border-accent-light/30 bg-bg-secondary hover:border-accent/50'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{option.icon}</span>
                    <span className="text-text-primary font-medium">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 px-6">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            isLoading={isSubmitting}
            fullWidth
            size="lg"
          >
            {currentStep === questions.length - 1 ? 'See My Recommendations' : 'Continue'}
          </Button>
        </div>
      </footer>

      {/* Decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-lavender/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
