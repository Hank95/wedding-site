import { supabase } from "@/supabaseClient"
import { Guest, RSVP, RSVPWithGuest, GuestSearchResult } from "@/types/database.types"

export const rsvpApi = {
  /**
   * Search for guests by name with fuzzy matching
   */
  async searchGuests(searchTerm?: string): Promise<GuestSearchResult[]> {
    const { data, error } = await supabase.rpc("search_guests_by_name", {
      search_term: searchTerm || undefined,
    })

    if (error) {
      console.error("Error searching guests:", error)
      throw error
    }

    return (data || []) as GuestSearchResult[]
  },

  /**
   * Get a single guest by ID
   */
  async getGuest(guestId: string): Promise<Guest | null> {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("id", guestId)
      .single()

    if (error) {
      console.error("Error fetching guest:", error)
      return null
    }

    return data as Guest
  },

  /**
   * Check if a guest has already submitted an RSVP
   */
  async checkExistingRSVP(guestId: string): Promise<RSVP | null> {
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .eq("guest_id", guestId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      // No existing RSVP is not an error
      if (error.code === "PGRST116") {
        return null
      }
      console.error("Error checking existing RSVP:", error)
      return null
    }

    return data as RSVP
  },

  /**
   * Submit a new RSVP
   */
  async submitRSVP(rsvpData: Omit<RSVP, 'id' | 'created_at'>): Promise<RSVP> {
    const { data, error } = await supabase
      .from("rsvps")
      .insert(rsvpData)
      .select()
      .single()

    if (error) {
      console.error("Error submitting RSVP:", error)
      throw error
    }

    return data as unknown as RSVP
  },

  /**
   * Update an existing RSVP
   */
  async updateRSVP(rsvpId: string, updates: Partial<RSVP>): Promise<RSVP> {
    const { data, error } = await supabase
      .from("rsvps")
      .update(updates)
      .eq("id", rsvpId)
      .select()
      .single()

    if (error) {
      console.error("Error updating RSVP:", error)
      throw error
    }

    return data as unknown as RSVP
  },

  /**
   * Get all RSVPs with guest information (for admin)
   */
  async getAllRSVPs(): Promise<RSVPWithGuest[]> {
    const { data, error } = await supabase
      .from("rsvps")
      .select(`
        *,
        guest:guests(*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all RSVPs:", error)
      throw error
    }

    return (data || []) as RSVPWithGuest[]
  },

  /**
   * Get RSVP statistics (for admin)
   */
  async getRSVPStats() {
    const { data: rsvps, error } = await supabase
      .from("rsvps")
      .select("*")

    if (error) {
      console.error("Error fetching RSVP stats:", error)
      throw error
    }

    const stats = {
      total: rsvps.length,
      ceremony: {
        attending: rsvps.filter((r) => r.attending).length,
        notAttending: rsvps.filter((r) => !r.attending).length,
        totalGuests: rsvps.filter((r) => r.attending).length, // Individual guests now
      },
      welcomeParty: {
        attending: rsvps.filter((r) => r.welcome_party_attending).length,
        notAttending: rsvps.filter((r) => r.welcome_party_attending === false).length,
        totalGuests: rsvps.filter((r) => r.welcome_party_attending).length,
      },
      rehearsalDinner: {
        attending: rsvps.filter((r) => r.rehearsal_dinner_attending).length,
        notAttending: rsvps.filter((r) => r.rehearsal_dinner_attending === false).length,
        totalGuests: rsvps.filter((r) => r.rehearsal_dinner_attending).length,
      },
      dietaryRestrictions: rsvps.filter((r) => r.dietary_restrictions).length,
    }

    return stats
  },

  /**
   * Export RSVPs to CSV format (for admin)
   */
  async exportRSVPs(): Promise<string> {
    const rsvps = await this.getAllRSVPs()
    
    const headers = [
      "Guest Name",
      "Email",
      "Party Size",
      "Ceremony Attending",
      "Ceremony Guests",
      "Welcome Party Attending",
      "Welcome Party Guests",
      "Rehearsal Dinner Attending",
      "Rehearsal Dinner Guests",
      "Dietary Restrictions",
      "Message",
      "Submitted At",
    ]

    const rows = rsvps.map((rsvp: RSVPWithGuest) => [
      `${rsvp.guest_first_name} ${rsvp.guest_last_name}`,
      rsvp.guest?.email || "",
      rsvp.guest?.party_size || "1",
      rsvp.attending ? "Yes" : "No",
      "1", // Individual guests now
      rsvp.welcome_party_attending === null ? "N/A" : rsvp.welcome_party_attending ? "Yes" : "No",
      rsvp.welcome_party_attending ? "1" : "0",
      rsvp.rehearsal_dinner_attending === null ? "N/A" : rsvp.rehearsal_dinner_attending ? "Yes" : "No",
      rsvp.rehearsal_dinner_attending ? "1" : "0",
      rsvp.dietary_restrictions || "",
      rsvp.message || "",
      new Date(rsvp.created_at).toLocaleString(),
    ])

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n")

    return csv
  },
}