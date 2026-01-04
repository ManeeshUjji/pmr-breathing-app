import type { PresellQuestion } from '@/types/quiz';

export const PRESELL_QUESTIONS: PresellQuestion[] = [
  {
    id: 'whatBringsYou',
    text: 'What brings you here?',
    type: 'single',
    hasOther: true,
    options: [
      { value: 'work_stress', label: 'Work stress' },
      { value: 'anxiety_panic', label: 'Anxiety / panic' },
      { value: 'sleep_problems', label: 'Sleep problems' },
      { value: 'physical_tension', label: 'Physical tension / pain' },
      { value: 'just_exploring', label: 'Just exploring' },
    ],
  },
  {
    id: 'timeAvailable',
    text: 'How much time could you spend daily?',
    type: 'single',
    options: [
      { value: '2_5_min', label: '2-5 minutes' },
      { value: '5_10_min', label: '5-10 minutes' },
      { value: '10_20_min', label: '10-20 minutes' },
      { value: '20_plus_min', label: '20+ minutes' },
    ],
  },
  {
    id: 'lifeImpact',
    text: 'How much does this affect your daily life?',
    type: 'single',
    options: [
      { value: 'seriously_affecting', label: "It's seriously affecting my life" },
      { value: 'constant_struggle', label: "It's a constant struggle" },
      { value: 'annoying_manageable', label: "It's annoying but manageable" },
      { value: 'minor_issue', label: 'Minor issue' },
    ],
  },
  {
    id: 'biggestChallenge',
    text: "What's your biggest challenge?",
    type: 'single',
    hasOther: true,
    options: [
      { value: 'racing_mind', label: "Mind won't stop racing" },
      { value: 'cant_sleep', label: "Can't fall asleep" },
      { value: 'physical_tension', label: "Physical tension I can't release" },
      { value: 'panic_attacks', label: 'Panic or anxiety attacks' },
      { value: 'no_time', label: "Don't have time to relax" },
    ],
  },
  {
    id: 'whatTried',
    text: 'What have you already tried?',
    type: 'multi',
    hasOther: true,
    options: [
      { value: 'meditation_apps', label: 'Meditation apps (Calm, Headspace, etc.)' },
      { value: 'breathing_youtube', label: 'Breathing exercises / YouTube videos' },
      { value: 'therapy', label: 'Therapy / counseling' },
      { value: 'medication', label: 'Medication' },
      { value: 'exercise_yoga', label: 'Exercise / yoga' },
      { value: 'nothing_yet', label: 'Nothing yet' },
    ],
  },
  {
    id: 'didItHelp',
    text: 'Did any of that help?',
    type: 'single',
    options: [
      { value: 'yes_stopped', label: 'Yes, but I stopped using it' },
      { value: 'somewhat', label: 'Somewhat, but not enough' },
      { value: 'no', label: "No, didn't work for me" },
      { value: 'havent_tried', label: "Haven't tried anything yet" },
    ],
  },
  {
    id: 'whyDidntWork',
    text: "Why didn't it work?",
    type: 'single',
    hasOther: true,
    options: [
      { value: 'time_consuming', label: 'Too time-consuming' },
      { value: 'inconsistent', label: 'Hard to stay consistent' },
      { value: 'no_difference', label: "Didn't feel any difference" },
      { value: 'too_expensive', label: 'Too expensive' },
      { value: 'felt_awkward', label: 'Felt awkward or silly' },
    ],
  },
  {
    id: 'fairPrice',
    text: 'What would feel like a fair monthly price?',
    type: 'single',
    options: [
      { value: '5_10', label: '`$5-10/month' },
      { value: '10_15', label: '`$10-15/month' },
      { value: '15_20', label: '`$15-20/month' },
      { value: '20_plus', label: '`$20+/month' },
    ],
  },
  {
    id: 'paymentPreference',
    text: 'How would you prefer to pay?',
    type: 'single',
    options: [
      { value: 'monthly', label: 'Monthly subscription' },
      { value: 'annual', label: 'Annual subscription (lower price)' },
      { value: 'free_trial', label: 'Free trial, then subscription' },
    ],
  },
];
