# Database Migrations for Enhanced RSVP System

## Overview
These migrations enhance the RSVP system by adding a guests table and updating the existing RSVPs table to support multiple events and better guest management.

## Migration Files

### 001_create_guests_table.sql
- Creates the `guests` table with fields for guest information and event invitations
- Adds indexes for efficient name searching
- Sets up Row Level Security policies
- Creates trigger for automatic `updated_at` timestamp

### 002_update_rsvps_table.sql
- Adds new columns to existing `rsvps` table:
  - `guest_id`: Foreign key to guests table
  - `welcome_party_attending`, `rehearsal_dinner_attending`: Event-specific attendance
  - `guest_count_welcome`, `guest_count_ceremony`, `guest_count_rehearsal`: Guest counts per event
- Adds index on `guest_id` for efficient lookups

### 003_populate_guests_from_rsvps.sql
- Creates a migration function to parse existing RSVP names
- Generates guest records from existing RSVPs
- Links RSVPs to their corresponding guest records
- Handles various name formats intelligently

### 004_create_guest_search_function.sql
- Creates a PostgreSQL function for fuzzy name searching
- Uses pg_trgm extension for similarity matching
- Supports searching by first name, last name, or both
- Returns similarity scores for ranking results

## Running Migrations

### Option 1: Using Supabase CLI (Recommended)
```bash
# Apply all migrations
supabase db push

# Or apply specific migration
supabase db push --file supabase/migrations/001_create_guests_table.sql
```

### Option 2: Direct SQL Execution
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file in order
4. Execute each migration

### Option 3: Using psql
```bash
# Connect to your database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run migrations
\i supabase/migrations/001_create_guests_table.sql
\i supabase/migrations/002_update_rsvps_table.sql
\i supabase/migrations/003_populate_guests_from_rsvps.sql
\i supabase/migrations/004_create_guest_search_function.sql
```

## Important Notes

1. **Backup First**: Always backup your database before running migrations
2. **Order Matters**: Run migrations in numerical order
3. **Existing Data**: Migration 003 will automatically create guest records from existing RSVPs
4. **Event Invitations**: By default, migrated guests are NOT invited to welcome party or rehearsal dinner. Update these manually as needed.
5. **Name Parsing**: The migration attempts to intelligently split names, but review results for accuracy

## Post-Migration Steps

1. Verify all existing RSVPs have corresponding guest records:
```sql
SELECT COUNT(*) FROM rsvps WHERE guest_id IS NULL;
```

2. Update guest invitations for welcome party and rehearsal dinner:
```sql
-- Example: Invite specific guests to welcome party
UPDATE guests 
SET is_welcome_party_invited = true 
WHERE email IN ('guest1@email.com', 'guest2@email.com');
```

3. Generate TypeScript types:
```bash
npm run update-types
```

## Rollback

If needed, you can rollback the migrations:

```sql
-- Remove foreign key constraint
ALTER TABLE rsvps DROP COLUMN IF EXISTS guest_id CASCADE;
ALTER TABLE rsvps DROP COLUMN IF EXISTS welcome_party_attending;
ALTER TABLE rsvps DROP COLUMN IF EXISTS rehearsal_dinner_attending;
ALTER TABLE rsvps DROP COLUMN IF EXISTS guest_count_welcome;
ALTER TABLE rsvps DROP COLUMN IF EXISTS guest_count_ceremony;
ALTER TABLE rsvps DROP COLUMN IF EXISTS guest_count_rehearsal;

-- Drop search function
DROP FUNCTION IF EXISTS public.search_guests_by_name;

-- Drop guests table
DROP TABLE IF EXISTS public.guests CASCADE;

-- Drop migration function
DROP FUNCTION IF EXISTS public.migrate_existing_rsvps_to_guests;
```