export * from './database';
export * from './quiz';

// Quiz types
export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  type: 'single' | 'multiple';
}

export interface QuizOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface QuizResults {
  stressSources: string[];
  goals: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredDuration: number;
  focusAreas: string[];
  recommendedExerciseIds: string[];
}

// Exercise player types
export interface PMRStep {
  muscleGroup: string;
  instruction: string;
  duration: number;
  phase: 'tense' | 'hold' | 'release' | 'rest';
}

export interface BreathingPattern {
  name: string;
  inhale: number;
  hold?: number;
  exhale: number;
  holdAfterExhale?: number;
  cycles: number;
}

export interface MeditationStep {
  instruction: string;
  duration: number;
  audioScript: string | null;
}

// TTS types
export interface TTSSettings {
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
}

// User context
export interface UserContextType {
  user: import('@supabase/supabase-js').User | null;
  profile: import('./database').Profile | null;
  subscription: import('./database').Subscription | null;
  isLoading: boolean;
  isPremium: boolean;
  refreshProfile: () => Promise<void>;
}

