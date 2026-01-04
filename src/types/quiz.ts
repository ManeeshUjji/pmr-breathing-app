// Presell Quiz Types
// Separate from onboarding quiz - used for waitlist capture

export type PresellQuestionType = 'single' | 'multi' | 'email';

export interface PresellQuestionOption {
  value: string;
  label: string;
}

export interface PresellQuestion {
  id: string;
  text: string;
  type: PresellQuestionType;
  options?: PresellQuestionOption[];
  hasOther?: boolean;
}

export interface PresellQuizAnswers {
  whatBringsYou: string;
  whatBringsYouOther?: string;
  timeAvailable: string;
  lifeImpact: string;
  biggestChallenge: string;
  biggestChallengeOther?: string;
  whatTried: string[];
  whatTriedOther?: string;
  didItHelp: string;
  whyDidntWork: string;
  whyDidntWorkOther?: string;
  fairPrice: string;
  paymentPreference: string;
  email: string;
}

// Loops API Types
export interface LoopsContactProperties {
  email: string;
  source: 'presell_quiz';
  whatBringsYou: string;
  whatBringsYouOther?: string;
  timeAvailable: string;
  lifeImpact: string;
  biggestChallenge: string;
  biggestChallengeOther?: string;
  whatTried: string;
  whatTriedOther?: string;
  didItHelp: string;
  whyDidntWork: string;
  whyDidntWorkOther?: string;
  fairPrice: string;
  paymentPreference: string;
}

export interface WaitlistSubmission {
  email: string;
  answers: Omit<PresellQuizAnswers, 'email'>;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
}


