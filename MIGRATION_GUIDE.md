# Database Migration Guide

## Quick Steps to Apply Migration

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the entire contents of `supabase/migrations/003_library_model.sql`
5. Click **Run** (or press Ctrl+Enter)
6. Verify success - you should see "Success. No rows returned"

### Option 2: Via Supabase CLI (If you have access token)

```bash
# Set your access token
$env:SUPABASE_ACCESS_TOKEN="your_token_here"

# Link project (if not already linked)
npx supabase link --project-ref your-project-ref

# Push migration
npx supabase db push
```

## What This Migration Does

- ✅ Adds `target_areas TEXT[]` column to exercises table
- ✅ Adds `is_featured BOOLEAN` column to exercises table  
- ✅ Makes `program_id` and `day_number` nullable (exercises can be standalone)
- ✅ Creates indexes for better query performance
- ✅ Populates `target_areas` based on existing exercise data
- ✅ Marks 5 exercises as featured

## Verify Migration Success

After running the migration, check:

```sql
-- Check new columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'exercises' 
AND column_name IN ('target_areas', 'is_featured');

-- Check some exercises have target_areas populated
SELECT id, title, target_areas, is_featured 
FROM exercises 
LIMIT 5;

-- Check featured exercises
SELECT id, title, is_featured 
FROM exercises 
WHERE is_featured = TRUE;
```

