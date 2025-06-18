# Migration Fix Instructions

The error occurs because the `update_updated_at_column()` trigger function tries to set `NEW.updated_at` but the `rsvps` table doesn't have an `updated_at` column yet.

## Quick Fix

Run these SQL commands in order:

### Step 1: Add updated_at column to rsvps table first
```sql
ALTER TABLE public.rsvps 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

### Step 2: Then run the population script
Now you can run `003_populate_guests_from_rsvps.sql` successfully.

## Alternative: Clean Migration

If you want to start over completely:

1. **Rollback existing changes** (if any):
```sql
-- Run the rollback script
\i supabase/migrations/000_rollback_if_needed.sql
```

2. **Run migrations in corrected order**:
```sql
\i supabase/migrations/001_create_guests_table.sql
\i supabase/migrations/002_fix_rsvps_table.sql
\i supabase/migrations/003_populate_guests_from_rsvps.sql
\i supabase/migrations/004_create_guest_search_function.sql
```

## Manual Fix for Current Situation

If you've already run the first two migrations and got the error on the third:

```sql
-- Add the missing updated_at column
ALTER TABLE public.rsvps 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Now run the population script again
SELECT public.migrate_existing_rsvps_to_guests();
```

## Verify Migration Success

After running the migrations, verify with:

```sql
-- Check that guests table exists and has data
SELECT COUNT(*) FROM public.guests;

-- Check that rsvps table has the new columns
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'rsvps' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check that existing RSVPs are linked to guests
SELECT 
    COUNT(*) as total_rsvps,
    COUNT(guest_id) as linked_rsvps
FROM public.rsvps;
```

The `linked_rsvps` should equal `total_rsvps` after successful migration.