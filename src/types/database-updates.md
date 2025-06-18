# Database Types Update Instructions

After running the database migrations, you'll need to regenerate the TypeScript types:

```bash
npm run update-types
```

This will update the `database.types.ts` file in the root directory with the new schema.

## Expected Changes

The generated types should include:

### New `guests` table type:
```typescript
guests: {
  Row: {
    id: string
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
    party_size: number
    is_welcome_party_invited: boolean
    is_rehearsal_dinner_invited: boolean
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    first_name: string
    last_name: string
    email?: string | null
    phone?: string | null
    party_size?: number
    is_welcome_party_invited?: boolean
    is_rehearsal_dinner_invited?: boolean
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    first_name?: string
    last_name?: string
    email?: string | null
    phone?: string | null
    party_size?: number
    is_welcome_party_invited?: boolean
    is_rehearsal_dinner_invited?: boolean
    created_at?: string
    updated_at?: string
  }
}
```

### Updated `rsvps` table type:
```typescript
rsvps: {
  Row: {
    id: string
    name: string
    email: string
    attending: boolean
    dietary_restrictions: string | null
    message: string | null
    created_at: string
    guest_id: string | null
    welcome_party_attending: boolean | null
    rehearsal_dinner_attending: boolean | null
    guest_count_welcome: number
    guest_count_ceremony: number
    guest_count_rehearsal: number
  }
  // Insert and Update types will be similar with optional fields
}
```

### New function type:
```typescript
search_guests_by_name: {
  Args: {
    search_first_name?: string | null
    search_last_name?: string | null
  }
  Returns: {
    id: string
    first_name: string
    last_name: string
    email: string | null
    party_size: number
    is_welcome_party_invited: boolean
    is_rehearsal_dinner_invited: boolean
    similarity_score: number
  }[]
}
```

## Integration with Existing Code

The custom types in `src/types/database.types.ts` are designed to work alongside the generated types and provide additional utility types for the application.