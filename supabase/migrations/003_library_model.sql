-- Migration: Transform from program-based model to exercise library model
-- This migration makes exercises standalone (not tied to programs)

-- 1. Add new columns to exercises table
ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS target_areas TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- 2. Make program_id nullable (was NOT NULL)
ALTER TABLE exercises
ALTER COLUMN program_id DROP NOT NULL;

-- 3. Make day_number nullable (was NOT NULL)
ALTER TABLE exercises
ALTER COLUMN day_number DROP NOT NULL;

-- 4. Create index for filtering by target_areas
CREATE INDEX IF NOT EXISTS idx_exercises_target_areas ON exercises USING GIN (target_areas);

-- 5. Create index for featured exercises
CREATE INDEX IF NOT EXISTS idx_exercises_is_featured ON exercises(is_featured) WHERE is_featured = TRUE;

-- 6. Create index for exercise type (category filtering)
CREATE INDEX IF NOT EXISTS idx_exercises_type ON exercises(type);

-- 7. Populate target_areas based on existing muscle_groups and exercise content
-- PMR exercises: map muscle_groups to target_areas
UPDATE exercises
SET target_areas = ARRAY(
  SELECT DISTINCT unnest(
    CASE
      WHEN 'jaw' = ANY(muscle_groups) OR 'forehead' = ANY(muscle_groups) OR 'eyes' = ANY(muscle_groups) THEN ARRAY['jaw', 'face']
      WHEN 'neck' = ANY(muscle_groups) THEN ARRAY['neck']
      WHEN 'shoulders' = ANY(muscle_groups) THEN ARRAY['shoulders']
      WHEN 'back' = ANY(muscle_groups) OR 'chest' = ANY(muscle_groups) THEN ARRAY['back']
      WHEN 'hands' = ANY(muscle_groups) OR 'forearms' = ANY(muscle_groups) OR 'biceps' = ANY(muscle_groups) THEN ARRAY['arms']
      WHEN 'fullBody' = ANY(muscle_groups) OR 'thighs' = ANY(muscle_groups) OR 'calves' = ANY(muscle_groups) OR 'feet' = ANY(muscle_groups) THEN ARRAY['full_body']
      WHEN 'abdomen' = ANY(muscle_groups) OR 'glutes' = ANY(muscle_groups) THEN ARRAY['core']
      ELSE ARRAY['full_body']
    END
  )
)
WHERE type = 'pmr' AND muscle_groups IS NOT NULL AND array_length(muscle_groups, 1) > 0;

-- Breathing exercises: set based on common use cases
UPDATE exercises
SET target_areas = ARRAY['anxiety', 'focus']
WHERE type = 'breathing' AND title ILIKE '%box%';

UPDATE exercises
SET target_areas = ARRAY['sleep', 'anxiety']
WHERE type = 'breathing' AND (title ILIKE '%4-7-8%' OR title ILIKE '%relaxation%');

UPDATE exercises
SET target_areas = ARRAY['focus', 'calm']
WHERE type = 'breathing' AND title ILIKE '%coherent%';

UPDATE exercises
SET target_areas = ARRAY['calm', 'focus']
WHERE type = 'breathing' AND title ILIKE '%belly%';

UPDATE exercises
SET target_areas = ARRAY['calm', 'focus', 'anxiety']
WHERE type = 'breathing' AND title ILIKE '%integration%';

-- Set remaining exercises with empty target_areas to have a default
UPDATE exercises
SET target_areas = ARRAY['calm']
WHERE target_areas = '{}' OR target_areas IS NULL;

-- 8. Mark some exercises as featured for the homepage
-- Feature the introductory exercises
UPDATE exercises
SET is_featured = TRUE
WHERE title IN (
  'Welcome to PMR',
  'Deep Belly Breathing',
  'Box Breathing',
  '4-7-8 Relaxation Breath',
  'Neck & Shoulders Relief'
);

-- 9. Make sessions.user_program_id truly optional (remove FK constraint issues)
-- The column is already nullable, but we want to ensure it stays that way
-- No action needed as it's already nullable with ON DELETE SET NULL

-- Note: We're NOT deleting the programs or user_programs tables
-- They remain in the database but are simply unused by the new UI

