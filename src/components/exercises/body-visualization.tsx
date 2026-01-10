'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface BodyVisualizationProps {
  activeMuscleGroups: string[];
  phase: 'tense' | 'hold' | 'release' | 'rest';
}

// SVG body outline with muscle group regions
const muscleGroups: Record<string, { path: string; position: string }> = {
  forehead: {
    path: 'M50,8 Q55,5 60,8 L60,14 Q55,12 50,14 Z',
    position: 'top-[8%] left-1/2 -translate-x-1/2',
  },
  eyes: {
    path: 'M45,16 Q50,14 55,16 Q50,18 45,16 M55,16 Q60,14 65,16 Q60,18 55,16',
    position: 'top-[14%] left-1/2 -translate-x-1/2',
  },
  jaw: {
    path: 'M42,25 Q55,35 68,25 L65,22 Q55,28 45,22 Z',
    position: 'top-[22%] left-1/2 -translate-x-1/2',
  },
  neck: {
    path: 'M48,35 L52,35 L54,45 L46,45 Z',
    position: 'top-[32%] left-1/2 -translate-x-1/2',
  },
  shoulders: {
    path: 'M30,48 Q40,42 55,42 Q70,42 80,48 L78,52 Q70,48 55,48 Q40,48 32,52 Z',
    position: 'top-[42%] left-1/2 -translate-x-1/2',
  },
  chest: {
    path: 'M40,50 Q55,48 70,50 L68,65 Q55,68 42,65 Z',
    position: 'top-[50%] left-1/2 -translate-x-1/2',
  },
  back: {
    path: 'M42,52 Q55,50 68,52 L66,72 Q55,74 44,72 Z',
    position: 'top-[52%] left-1/2 -translate-x-1/2',
  },
  biceps: {
    path: 'M28,52 L32,52 L34,65 L26,65 Z M78,52 L82,52 L84,65 L76,65 Z',
    position: 'top-[52%] left-1/2 -translate-x-1/2',
  },
  forearms: {
    path: 'M26,68 L30,68 L28,82 L24,82 Z M80,68 L84,68 L86,82 L82,82 Z',
    position: 'top-[68%] left-1/2 -translate-x-1/2',
  },
  hands: {
    path: 'M22,84 Q26,82 30,84 L28,92 Q26,94 24,92 Z M80,84 Q84,82 88,84 L86,92 Q84,94 82,92 Z',
    position: 'top-[84%] left-1/2 -translate-x-1/2',
  },
  abdomen: {
    path: 'M44,68 Q55,66 66,68 L64,80 Q55,82 46,80 Z',
    position: 'top-[68%] left-1/2 -translate-x-1/2',
  },
  glutes: {
    path: 'M44,82 Q55,80 66,82 L64,90 Q55,92 46,90 Z',
    position: 'top-[82%] left-1/2 -translate-x-1/2',
  },
  thighs: {
    path: 'M42,92 L48,92 L50,115 L40,115 Z M62,92 L68,92 L70,115 L60,115 Z',
    position: 'top-[92%] left-1/2 -translate-x-1/2',
  },
  calves: {
    path: 'M42,118 L48,118 L47,138 L43,138 Z M62,118 L68,118 L67,138 L63,138 Z',
    position: 'top-[118%] left-1/2 -translate-x-1/2',
  },
  feet: {
    path: 'M40,140 L50,140 L52,148 L38,148 Z M60,140 L70,140 L72,148 L58,148 Z',
    position: 'top-[140%] left-1/2 -translate-x-1/2',
  },
  fullBody: {
    path: '',
    position: '',
  },
};

export function BodyVisualization({ activeMuscleGroups, phase }: BodyVisualizationProps) {
  const isFullBody = activeMuscleGroups.includes('fullBody');
  
  const getColor = (muscleGroup: string) => {
    const isActive = activeMuscleGroups.includes(muscleGroup) || isFullBody;
    if (!isActive) return 'fill-accent-light/30 stroke-accent-light/50';
    
    switch (phase) {
      case 'tense':
        return 'fill-warning/60 stroke-warning';
      case 'hold':
        return 'fill-warning/80 stroke-warning';
      case 'release':
        return 'fill-accent/60 stroke-accent';
      case 'rest':
        return 'fill-accent/40 stroke-accent';
      default:
        return 'fill-accent-light/30 stroke-accent-light/50';
    }
  };

  return (
    <div className="relative w-full max-w-xs mx-auto aspect-[1/2]">
      <svg
        viewBox="0 0 110 160"
        className="w-full h-full"
        fill="none"
        strokeWidth="1"
      >
        {/* Head outline */}
        <motion.ellipse
          cx="55"
          cy="15"
          rx="15"
          ry="18"
          className={cn(
            'transition-colors duration-500',
            getColor(
              activeMuscleGroups.some((g) => ['forehead', 'eyes', 'jaw'].includes(g))
                ? activeMuscleGroups.find((g) => ['forehead', 'eyes', 'jaw'].includes(g))!
                : ''
            )
          )}
        />

        {/* Neck */}
        <motion.rect
          x="48"
          y="32"
          width="14"
          height="12"
          rx="3"
          className={cn('transition-colors duration-500', getColor('neck'))}
        />

        {/* Shoulders & upper body */}
        <motion.path
          d="M30,45 Q38,40 55,40 Q72,40 80,45 L82,55 Q72,50 55,50 Q38,50 28,55 Z"
          className={cn('transition-colors duration-500', getColor('shoulders'))}
        />

        {/* Torso */}
        <motion.path
          d="M35,55 Q55,50 75,55 L72,95 Q55,100 38,95 Z"
          className={cn(
            'transition-colors duration-500',
            getColor(
              activeMuscleGroups.includes('chest')
                ? 'chest'
                : activeMuscleGroups.includes('abdomen')
                ? 'abdomen'
                : activeMuscleGroups.includes('back')
                ? 'back'
                : ''
            )
          )}
        />

        {/* Left arm */}
        <motion.path
          d="M30,48 L22,48 Q16,50 15,58 L18,75 Q18,78 15,82 L12,95 Q14,98 18,96 L22,82 Q24,78 22,72 L20,58 Q22,54 28,52 Z"
          className={cn(
            'transition-colors duration-500',
            getColor(
              activeMuscleGroups.includes('biceps')
                ? 'biceps'
                : activeMuscleGroups.includes('forearms')
                ? 'forearms'
                : activeMuscleGroups.includes('hands')
                ? 'hands'
                : ''
            )
          )}
        />

        {/* Right arm */}
        <motion.path
          d="M80,48 L88,48 Q94,50 95,58 L92,75 Q92,78 95,82 L98,95 Q96,98 92,96 L88,82 Q86,78 88,72 L90,58 Q88,54 82,52 Z"
          className={cn(
            'transition-colors duration-500',
            getColor(
              activeMuscleGroups.includes('biceps')
                ? 'biceps'
                : activeMuscleGroups.includes('forearms')
                ? 'forearms'
                : activeMuscleGroups.includes('hands')
                ? 'hands'
                : ''
            )
          )}
        />

        {/* Hips/Glutes */}
        <motion.path
          d="M38,95 Q55,92 72,95 L70,105 Q55,108 40,105 Z"
          className={cn('transition-colors duration-500', getColor('glutes'))}
        />

        {/* Left leg */}
        <motion.path
          d="M40,105 L48,105 L50,140 Q48,145 45,148 L42,148 Q40,145 40,140 Z"
          className={cn(
            'transition-colors duration-500',
            getColor(
              activeMuscleGroups.includes('thighs')
                ? 'thighs'
                : activeMuscleGroups.includes('calves')
                ? 'calves'
                : activeMuscleGroups.includes('feet')
                ? 'feet'
                : ''
            )
          )}
        />

        {/* Right leg */}
        <motion.path
          d="M62,105 L70,105 L70,140 Q68,145 65,148 L62,148 Q60,145 60,140 Z"
          className={cn(
            'transition-colors duration-500',
            getColor(
              activeMuscleGroups.includes('thighs')
                ? 'thighs'
                : activeMuscleGroups.includes('calves')
                ? 'calves'
                : activeMuscleGroups.includes('feet')
                ? 'feet'
                : ''
            )
          )}
        />
      </svg>

      {/* Pulse animation for active areas */}
      {(phase === 'tense' || phase === 'hold') && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-warning/10 rounded-full blur-3xl" />
        </motion.div>
      )}

      {phase === 'release' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl" />
        </motion.div>
      )}
    </div>
  );
}






