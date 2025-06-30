export interface Guest {
  id: string
  guest_1_first_name: string
  guest_1_last_name: string
  guest_2_first_name: string | null
  guest_2_last_name: string | null
  guest_3_first_name: string | null
  guest_3_last_name: string | null
  guest_4_first_name: string | null
  guest_4_last_name: string | null
  party_size: number
  is_welcome_party_invited: boolean
  is_rehearsal_dinner_invited: boolean
  email: string | null
  phone: string | null
  created_at: string | null
  updated_at: string | null
}

export interface RSVP {
  id: string
  guest_id: string
  guest_first_name: string
  guest_last_name: string
  attending: boolean
  dietary_restrictions: string | null
  message: string | null
  welcome_party_attending: boolean | null
  rehearsal_dinner_attending: boolean | null
  email: string | null
  created_at: string
}

export interface RSVPWithGuest extends RSVP {
  guest: Guest | null
}

export interface GuestSearchResult extends Guest {
  similarity_score: number
}

// Helper interface for individual guests within an invitation
export interface IndividualGuest {
  firstName: string
  lastName: string
  position: 1 | 2 | 3 | 4
}

// Interface for the invitation with all guests
export interface Invitation {
  id: string
  guests: IndividualGuest[]
  party_size: number
  is_welcome_party_invited: boolean
  is_rehearsal_dinner_invited: boolean
  email: string | null
  phone: string | null
}

export interface RSVPFormData {
  invitation_id: string
  email: string
  guest_responses: {
    firstName: string
    lastName: string
    ceremony_reception_attending: boolean
    welcome_party_attending?: boolean
    rehearsal_dinner_attending?: boolean
    dietary_restrictions?: string
    message?: string
  }[]
}

export interface EventAttendance {
  event: 'welcome_party' | 'ceremony_reception' | 'rehearsal_dinner'
  attending: boolean
  guest_count: number
}