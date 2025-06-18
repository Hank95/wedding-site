# Fix for pg_trgm Extension Error

The error occurs because the search function tries to create the `pg_trgm` extension but lacks the necessary privileges.

## Quick Solutions

### Option 1: Enable pg_trgm in Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **Database** > **Extensions** 
3. Search for "pg_trgm"
4. Click "Enable" next to the pg_trgm extension
5. Run the original search function migration

### Option 2: Use the No-Extension Search Function
Replace the current search function with one that doesn't require pg_trgm:

```sql
-- Run this migration instead
\i supabase/migrations/004_create_guest_search_function_no_extension.sql
```

### Option 3: Use the Adaptive Search Function
This function automatically detects if pg_trgm is available and adapts:

```sql
-- Run this migration
\i supabase/migrations/006_adaptive_search_function.sql
```

## Testing the Fix

After applying one of the solutions, test the search function:

```sql
-- Test the search function
SELECT * FROM search_guests_by_name('John', 'Doe');

-- Test with partial name
SELECT * FROM search_guests_by_name('John', NULL);
```

## If You Already Have Guests in the Database

If you've already populated guests and just need to fix the search function:

```sql
-- Just replace the search function (choose one option above)
-- No need to re-run other migrations
```

## Verification

After the fix, the guest lookup component should work without errors. The search will:
- Find exact name matches
- Find partial matches (names starting with search term)
- Find substring matches
- Rank results by relevance
- Handle both first name only and last name only searches

The function will work with basic pattern matching even without pg_trgm, though pg_trgm provides better fuzzy matching if available.