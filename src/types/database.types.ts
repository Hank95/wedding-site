export interface Guest {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  party_size: number
  is_welcome_party_invited: boolean
  is_rehearsal_dinner_invited: boolean
  created_at: string | null
  updated_at: string | null
  plus_one_first_name: string | null
  plus_one_last_name: string | null
}

export interface RSVP {
  id: string
  name: string
  email: string
  attending: boolean
  dietary_restrictions: string | null
  message: string | null
  guest_id: string | null
  welcome_party_attending: boolean | null
  rehearsal_dinner_attending: boolean | null
  guest_count_welcome: number | null
  guest_count_ceremony: number | null
  guest_count_rehearsal: number | null
  created_at: string
  plus_one_first_name: string | null
  plus_one_last_name: string | null
}

export interface RSVPWithGuest extends RSVP {
  guest: Guest | null
}

export interface GuestSearchResult extends Guest {
  similarity_score: number
}

export interface RSVPFormData {
  guest_id: string
  email: string
  ceremony_reception_attending: boolean
  welcome_party_attending?: boolean
  rehearsal_dinner_attending?: boolean
  guest_count_welcome?: number
  guest_count_ceremony: number
  guest_count_rehearsal?: number
  dietary_restrictions?: string
  message?: string
}

export interface EventAttendance {
  event: 'welcome_party' | 'ceremony_reception' | 'rehearsal_dinner'
  attending: boolean
  guest_count: number
}