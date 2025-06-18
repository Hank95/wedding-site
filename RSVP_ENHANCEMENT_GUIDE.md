# RSVP Enhancement Implementation Guide

This guide outlines the enhanced RSVP system implementation for your wedding website.

## Overview

The enhanced RSVP system provides:
- Guest lookup by name with fuzzy matching
- Multi-event RSVP support (Welcome Party, Ceremony/Reception, Rehearsal Dinner)
- Guest count tracking per event
- Enhanced email notifications
- Backward compatibility with existing RSVPs

## Implementation Steps

### 1. Database Migration

Run the migration scripts in order:

```bash
# Using Supabase CLI
supabase db push --file supabase/migrations/001_create_guests_table.sql
supabase db push --file supabase/migrations/002_update_rsvps_table.sql
supabase db push --file supabase/migrations/003_populate_guests_from_rsvps.sql
supabase db push --file supabase/migrations/004_create_guest_search_function.sql
```

### 2. Update TypeScript Types

After running migrations:

```bash
npm run update-types
```

This will update `database.types.ts` with the new schema.

### 3. Deploy Enhanced Email Function

```bash
supabase functions deploy send-enhanced-rsvp-notification
```

### 4. Update Routes

To use the enhanced RSVP page, update your router in the main app:

```typescript
// In your router configuration
import EnhancedRSVPPage from "@/pages/EnhancedRSVPPage"

// Replace the existing RSVP route
<Route path="/rsvp" element={<EnhancedRSVPPage />} />
```

### 5. Populate Guest Data

After migration, you'll need to:

1. Update guest invitations for special events:
```sql
-- Example: Invite specific guests to welcome party
UPDATE guests 
SET is_welcome_party_invited = true 
WHERE email IN ('guest1@email.com', 'guest2@email.com');

-- Example: Invite wedding party to rehearsal dinner
UPDATE guests 
SET is_rehearsal_dinner_invited = true 
WHERE email IN ('bridesmaid@email.com', 'groomsman@email.com');
```

2. Verify party sizes are correct:
```sql
-- Update party size for couples/families
UPDATE guests 
SET party_size = 2 
WHERE first_name = 'John' AND last_name = 'Doe';
```

## Features Breakdown

### Guest Lookup Component (`guest-lookup.tsx`)
- Fuzzy name matching using PostgreSQL's pg_trgm extension
- Handles partial names, misspellings, and variations
- Shows which events each guest is invited to
- Provides helpful error messages and fallback options

### Multi-Step RSVP Form (`multi-step-rsvp-form.tsx`)
- Dynamic form based on guest's event invitations
- Step-by-step process for each event
- Guest count validation per event
- Progress indicator
- Form state preservation

### API Helper (`rsvp-api.ts`)
- Centralized API functions for all RSVP operations
- Type-safe database interactions
- Error handling and logging
- Admin functions for stats and export

### Enhanced Email Notifications
- Event-specific RSVP summaries
- Beautiful HTML templates
- Calendar links for each event
- Different content based on which events guest is attending

## Testing the System

1. **Test Guest Lookup**:
   - Try searching with partial names
   - Test with misspellings
   - Verify multiple matches are shown

2. **Test RSVP Flow**:
   - Submit RSVP for different event combinations
   - Verify guest counts are validated
   - Check that emails are sent correctly

3. **Test Edge Cases**:
   - Guest not found
   - Already submitted RSVP
   - Network errors

## Admin Features (To Be Implemented)

The system is prepared for admin features:

```typescript
// Get all RSVPs with stats
const stats = await rsvpApi.getRSVPStats()

// Export RSVPs to CSV
const csv = await rsvpApi.exportRSVPs()
```

## Maintenance

### Adding New Guests

```sql
INSERT INTO guests (first_name, last_name, email, party_size, is_welcome_party_invited, is_rehearsal_dinner_invited)
VALUES ('Jane', 'Smith', 'jane@email.com', 2, true, false);
```

### Updating Event Invitations

```sql
-- Add someone to welcome party
UPDATE guests 
SET is_welcome_party_invited = true 
WHERE id = 'guest-uuid';
```

### Checking RSVP Status

```sql
-- View all RSVPs with guest info
SELECT 
  r.*,
  g.first_name,
  g.last_name,
  g.party_size
FROM rsvps r
JOIN guests g ON r.guest_id = g.id
ORDER BY r.created_at DESC;
```

## Troubleshooting

### Common Issues

1. **Guest can't find their name**:
   - Check exact spelling in guests table
   - Verify first_name and last_name are separated correctly
   - Try searching with just first or last name

2. **Email not sending**:
   - Verify RESEND_API_KEY is set in Supabase dashboard
   - Check email function logs in Supabase dashboard
   - Ensure email addresses are valid

3. **Form validation errors**:
   - Guest count must not exceed party_size
   - Email must be valid format
   - At least one event must have a response

## Next Steps

1. Deploy the enhanced RSVP system
2. Test with a few guests before full rollout
3. Consider adding admin dashboard for easy RSVP management
4. Add ability to update existing RSVPs
5. Implement guest seating assignments (future enhancement)