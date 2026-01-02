-- Seed initial programs

INSERT INTO programs (id, title, description, category, difficulty, duration_days, is_premium, order_index) VALUES
-- Free programs
('550e8400-e29b-41d4-a716-446655440001', 
 'Introduction to PMR', 
 'Learn the fundamentals of Progressive Muscle Relaxation. Perfect for beginners looking to reduce tension and stress.',
 'pmr', 'beginner', 7, FALSE, 1),

('550e8400-e29b-41d4-a716-446655440002', 
 'Breathing Basics', 
 'Master essential breathing techniques for instant calm. Includes box breathing, 4-7-8, and deep diaphragmatic breathing.',
 'breathing', 'beginner', 5, FALSE, 2),

-- Premium programs
('550e8400-e29b-41d4-a716-446655440003', 
 'Full Body PMR Journey', 
 'A comprehensive 14-day program covering every major muscle group. Deep relaxation for your entire body.',
 'pmr', 'intermediate', 14, TRUE, 3),

('550e8400-e29b-41d4-a716-446655440004', 
 'Office-Friendly Relief', 
 'Quick exercises you can do at your desk. Perfect for work breaks to release tension without drawing attention.',
 'mixed', 'beginner', 10, TRUE, 4),

('550e8400-e29b-41d4-a716-446655440005', 
 'Sleep Well Tonight', 
 'Wind-down routines combining PMR and breathing for better sleep. Practice before bed for deeper rest.',
 'mixed', 'beginner', 7, TRUE, 5),

('550e8400-e29b-41d4-a716-446655440006', 
 'Jaw & Face Tension Release', 
 'Targeted relief for jaw clenching, facial tension, and headaches. Great for those who grind their teeth.',
 'pmr', 'intermediate', 7, TRUE, 6),

('550e8400-e29b-41d4-a716-446655440007', 
 'Neck & Shoulders Focus', 
 'Deep relief for the most common tension areas. Perfect for desk workers and those with chronic neck pain.',
 'pmr', 'intermediate', 10, TRUE, 7),

('550e8400-e29b-41d4-a716-446655440008', 
 'Anxiety Relief Toolkit', 
 'Powerful techniques for acute anxiety. Breathing and PMR exercises designed for quick calming.',
 'mixed', 'beginner', 7, TRUE, 8),

('550e8400-e29b-41d4-a716-446655440009', 
 'Mindful Moments', 
 'Short guided meditations combined with gentle body awareness. Build a daily mindfulness habit.',
 'meditation', 'beginner', 14, TRUE, 9),

('550e8400-e29b-41d4-a716-446655440010', 
 'Advanced Relaxation Mastery', 
 'For experienced practitioners. Combines all techniques for the deepest relaxation possible.',
 'mixed', 'advanced', 21, TRUE, 10);

-- Seed exercises for the Introduction to PMR program
INSERT INTO exercises (program_id, title, description, type, duration_seconds, day_number, order_index, content, audio_script, muscle_groups) VALUES
-- Day 1: Introduction
('550e8400-e29b-41d4-a716-446655440001',
 'Welcome to PMR',
 'Learn what Progressive Muscle Relaxation is and how it can help you reduce stress and tension.',
 'pmr', 300, 1, 1,
 '{"steps": [
   {"muscleGroup": "introduction", "instruction": "Find a comfortable position and close your eyes", "duration": 30, "phase": "rest"},
   {"muscleGroup": "hands", "instruction": "Make fists with both hands, squeezing tightly", "duration": 5, "phase": "tense"},
   {"muscleGroup": "hands", "instruction": "Hold the tension, notice the feeling", "duration": 5, "phase": "hold"},
   {"muscleGroup": "hands", "instruction": "Release and let your hands go completely limp", "duration": 15, "phase": "release"},
   {"muscleGroup": "hands", "instruction": "Notice the difference between tension and relaxation", "duration": 10, "phase": "rest"}
 ]}',
 'Welcome to your first Progressive Muscle Relaxation session. Find a comfortable position, either sitting or lying down. Close your eyes and take a few deep breaths. Today we will learn the basic technique by focusing on your hands. When I say tense, make fists with both hands and squeeze tightly. Hold that tension. And now, release. Let your hands go completely limp. Notice the warm, relaxed feeling flowing into your hands.',
 ARRAY['hands']),

-- Day 2: Arms
('550e8400-e29b-41d4-a716-446655440001',
 'Arms Relaxation',
 'Focus on releasing tension from your forearms and upper arms.',
 'pmr', 420, 2, 1,
 '{"steps": [
   {"muscleGroup": "forearms", "instruction": "Bend your wrists back toward your forearms", "duration": 5, "phase": "tense"},
   {"muscleGroup": "forearms", "instruction": "Hold the tension", "duration": 5, "phase": "hold"},
   {"muscleGroup": "forearms", "instruction": "Release and relax", "duration": 20, "phase": "release"},
   {"muscleGroup": "biceps", "instruction": "Bend your elbows and flex your biceps", "duration": 5, "phase": "tense"},
   {"muscleGroup": "biceps", "instruction": "Hold", "duration": 5, "phase": "hold"},
   {"muscleGroup": "biceps", "instruction": "Release completely", "duration": 20, "phase": "release"}
 ]}',
 'Today we focus on your arms. Start with your forearms. Bend your wrists back toward your forearms, feeling the tension. Hold it there. And release, letting your arms hang loose and heavy. Now flex your biceps by bending your elbows. Feel the power in your upper arms. Hold. And release. Let your arms become completely relaxed, like wet noodles.',
 ARRAY['forearms', 'biceps']),

-- Day 3: Face
('550e8400-e29b-41d4-a716-446655440001',
 'Face & Jaw Release',
 'Release tension from your forehead, eyes, and jaw - common stress areas.',
 'pmr', 480, 3, 1,
 '{"steps": [
   {"muscleGroup": "forehead", "instruction": "Raise your eyebrows as high as possible", "duration": 5, "phase": "tense"},
   {"muscleGroup": "forehead", "instruction": "Hold", "duration": 5, "phase": "hold"},
   {"muscleGroup": "forehead", "instruction": "Release and smooth your forehead", "duration": 20, "phase": "release"},
   {"muscleGroup": "eyes", "instruction": "Squeeze your eyes tightly shut", "duration": 5, "phase": "tense"},
   {"muscleGroup": "eyes", "instruction": "Hold", "duration": 5, "phase": "hold"},
   {"muscleGroup": "eyes", "instruction": "Release, keeping eyes gently closed", "duration": 20, "phase": "release"},
   {"muscleGroup": "jaw", "instruction": "Clench your jaw firmly", "duration": 5, "phase": "tense"},
   {"muscleGroup": "jaw", "instruction": "Hold", "duration": 5, "phase": "hold"},
   {"muscleGroup": "jaw", "instruction": "Release, letting your mouth fall slightly open", "duration": 20, "phase": "release"}
 ]}',
 'We carry so much tension in our faces without realizing it. Start by raising your eyebrows high, wrinkling your forehead. Hold that tension. And release, smoothing out your forehead. Now squeeze your eyes shut tightly. Hold. And release, keeping your eyes gently closed. Finally, clench your jaw firmly. Feel the tension in your jaw muscles. Hold. And release, letting your mouth fall slightly open. Feel the relief.',
 ARRAY['forehead', 'eyes', 'jaw']),

-- Day 4: Neck & Shoulders
('550e8400-e29b-41d4-a716-446655440001',
 'Neck & Shoulders Relief',
 'Target the most common areas where stress accumulates.',
 'pmr', 540, 4, 1,
 '{"steps": [
   {"muscleGroup": "neck", "instruction": "Gently tilt your head back", "duration": 5, "phase": "tense"},
   {"muscleGroup": "neck", "instruction": "Hold", "duration": 5, "phase": "hold"},
   {"muscleGroup": "neck", "instruction": "Return to neutral and relax", "duration": 20, "phase": "release"},
   {"muscleGroup": "shoulders", "instruction": "Raise your shoulders up toward your ears", "duration": 5, "phase": "tense"},
   {"muscleGroup": "shoulders", "instruction": "Hold the shrug", "duration": 5, "phase": "hold"},
   {"muscleGroup": "shoulders", "instruction": "Drop your shoulders and let them sink", "duration": 30, "phase": "release"}
 ]}',
 'Your neck and shoulders carry the weight of your stress. Begin by gently tilting your head back, feeling a slight stretch. Hold. And return to center, letting your neck relax. Now raise your shoulders up toward your ears in a big shrug. Higher. Hold that tension. And drop them. Let your shoulders sink down, feeling the weight release. The tension flows away.',
 ARRAY['neck', 'shoulders']),

-- Day 5: Chest & Back
('550e8400-e29b-41d4-a716-446655440001',
 'Chest & Back Opening',
 'Open up your chest and release back tension for better posture and breathing.',
 'pmr', 480, 5, 1,
 '{"steps": [
   {"muscleGroup": "chest", "instruction": "Take a deep breath and hold, expanding your chest", "duration": 8, "phase": "tense"},
   {"muscleGroup": "chest", "instruction": "Exhale slowly and completely", "duration": 15, "phase": "release"},
   {"muscleGroup": "back", "instruction": "Arch your back slightly, pushing chest forward", "duration": 5, "phase": "tense"},
   {"muscleGroup": "back", "instruction": "Hold", "duration": 5, "phase": "hold"},
   {"muscleGroup": "back", "instruction": "Return to neutral and relax", "duration": 25, "phase": "release"}
 ]}',
 'Breathe deeply into your chest, filling your lungs completely. Feel your chest expand. Hold that breath and the expansion. Now exhale slowly, letting your chest relax. Next, gently arch your back, pushing your chest forward like you are proud. Hold this posture. And release, returning to a neutral, relaxed position. Your torso feels open and free.',
 ARRAY['chest', 'back']),

-- Day 6: Core & Hips
('550e8400-e29b-41d4-a716-446655440001',
 'Core & Hip Release',
 'Release deep tension in your abdomen, lower back, and hip area.',
 'pmr', 480, 6, 1,
 '{"steps": [
   {"muscleGroup": "abdomen", "instruction": "Pull your belly button toward your spine, tightening abs", "duration": 5, "phase": "tense"},
   {"muscleGroup": "abdomen", "instruction": "Hold", "duration": 5, "phase": "hold"},
   {"muscleGroup": "abdomen", "instruction": "Release and let your belly soften", "duration": 20, "phase": "release"},
   {"muscleGroup": "glutes", "instruction": "Squeeze your buttocks together", "duration": 5, "phase": "tense"},
   {"muscleGroup": "glutes", "instruction": "Hold", "duration": 5, "phase": "hold"},
   {"muscleGroup": "glutes", "instruction": "Release completely", "duration": 25, "phase": "release"}
 ]}',
 'Now we move to your core. Pull your belly button toward your spine, tightening your abdominal muscles. Hold this tension. And release, letting your belly soften completely. Breathe naturally. Next, squeeze your buttocks together tightly. Hold. And release. Feel the tension drain from your lower body.',
 ARRAY['abdomen', 'glutes']),

-- Day 7: Legs & Full Body
('550e8400-e29b-41d4-a716-446655440001',
 'Complete Body Scan',
 'Finish with your legs and do a complete body relaxation sequence.',
 'pmr', 600, 7, 1,
 '{"steps": [
   {"muscleGroup": "thighs", "instruction": "Straighten your legs and tense your thigh muscles", "duration": 5, "phase": "tense"},
   {"muscleGroup": "thighs", "instruction": "Hold", "duration": 5, "phase": "hold"},
   {"muscleGroup": "thighs", "instruction": "Release", "duration": 20, "phase": "release"},
   {"muscleGroup": "calves", "instruction": "Point your toes down, tensing your calves", "duration": 5, "phase": "tense"},
   {"muscleGroup": "calves", "instruction": "Hold", "duration": 5, "phase": "hold"},
   {"muscleGroup": "calves", "instruction": "Release", "duration": 20, "phase": "release"},
   {"muscleGroup": "feet", "instruction": "Curl your toes tightly", "duration": 5, "phase": "tense"},
   {"muscleGroup": "feet", "instruction": "Hold", "duration": 5, "phase": "hold"},
   {"muscleGroup": "feet", "instruction": "Release", "duration": 20, "phase": "release"},
   {"muscleGroup": "fullBody", "instruction": "Scan your entire body, enjoying complete relaxation", "duration": 60, "phase": "rest"}
 ]}',
 'For our final day, we complete your body. Straighten your legs and tense your thigh muscles firmly. Hold. And release. Now point your toes down, feeling your calves tighten. Hold. And release. Finally, curl your toes tightly. Hold. And release. Now take a moment to scan your entire body from head to toe. Notice the deep relaxation in every muscle group. You have completed your introduction to PMR. Congratulations.',
 ARRAY['thighs', 'calves', 'feet', 'fullBody']);

-- Seed exercises for Breathing Basics program
INSERT INTO exercises (program_id, title, description, type, duration_seconds, day_number, order_index, content, audio_script, breathing_pattern) VALUES
-- Day 1: Deep Breathing
('550e8400-e29b-41d4-a716-446655440002',
 'Deep Belly Breathing',
 'Learn diaphragmatic breathing - the foundation of all relaxation breathing.',
 'breathing', 300, 1, 1,
 '{"instructions": "Breathe deeply into your belly, not your chest. Place one hand on chest, one on belly. Only the belly hand should rise."}',
 'Welcome to breathing basics. Place one hand on your chest and one on your belly. As you breathe in through your nose, only your belly should rise. Your chest stays relatively still. Breathe in slowly through your nose. Feel your belly expand like a balloon. Now exhale slowly through your mouth. Feel your belly deflate. This is diaphragmatic breathing, the most calming breath you can take.',
 '{"name": "deep_belly", "inhale": 4, "exhale": 6, "cycles": 10}'),

-- Day 2: Box Breathing
('550e8400-e29b-41d4-a716-446655440002',
 'Box Breathing',
 'A powerful technique used by Navy SEALs for calm under pressure.',
 'breathing', 360, 2, 1,
 '{"instructions": "Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat."}',
 'Box breathing is used by elite performers to stay calm under pressure. Imagine tracing a square. Inhale for four counts, going up one side. Hold your breath for four counts, going across the top. Exhale for four counts, going down the other side. Hold empty for four counts, going across the bottom. Let us begin. Inhale, two, three, four. Hold, two, three, four. Exhale, two, three, four. Hold, two, three, four.',
 '{"name": "box_breathing", "inhale": 4, "hold": 4, "exhale": 4, "holdAfterExhale": 4, "cycles": 8}'),

-- Day 3: 4-7-8 Breathing
('550e8400-e29b-41d4-a716-446655440002',
 '4-7-8 Relaxation Breath',
 'Dr. Andrew Weil''s famous technique for instant calm and better sleep.',
 'breathing', 300, 3, 1,
 '{"instructions": "Inhale for 4 counts, hold for 7, exhale for 8. The long exhale activates your relaxation response."}',
 'The 4-7-8 breath is often called a natural tranquilizer for the nervous system. Place the tip of your tongue behind your upper front teeth. Inhale quietly through your nose for 4 counts. Hold your breath for 7 counts. Exhale completely through your mouth making a whoosh sound for 8 counts. The key is the long exhale. Let us practice together.',
 '{"name": "4-7-8", "inhale": 4, "hold": 7, "exhale": 8, "cycles": 6}'),

-- Day 4: Coherent Breathing
('550e8400-e29b-41d4-a716-446655440002',
 'Coherent Breathing',
 'Breathe at the optimal rate for heart-brain coherence.',
 'breathing', 360, 4, 1,
 '{"instructions": "Breathe at a rate of 5 breaths per minute - 6 seconds in, 6 seconds out."}',
 'Coherent breathing synchronizes your heart and brain for optimal calm. We breathe at five breaths per minute - six seconds in, six seconds out. This rate creates coherence in your heart rhythm variability. Find a comfortable position. Breathe in slowly for six seconds. And out for six seconds. There is no holding. Just smooth, even breathing in and out.',
 '{"name": "coherent", "inhale": 6, "exhale": 6, "cycles": 10}'),

-- Day 5: Calming Breath Integration
('550e8400-e29b-41d4-a716-446655440002',
 'Breath Integration',
 'Combine all techniques in a complete calming session.',
 'breathing', 480, 5, 1,
 '{"instructions": "Practice each technique briefly, then settle into your favorite."}',
 'Today we integrate everything you have learned. We will briefly practice each technique, then you will settle into whichever feels most natural. Start with deep belly breathing. Feel your abdomen rise and fall. Now transition to box breathing - four counts each side. Next, try the 4-7-8 breath for deep relaxation. Finally, settle into coherent breathing. Find your rhythm. You now have a complete toolkit for calm.',
 '{"name": "integration", "inhale": 5, "exhale": 5, "cycles": 12}');

