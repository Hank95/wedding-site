import { useState } from "react"
import { supabase } from "@/supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Search, Users } from "lucide-react"
import { GuestSearchResult, Invitation, IndividualGuest } from "@/types/database.types"

interface GuestLookupProps {
  onInvitationSelected: (invitation: Invitation) => void
}

export function GuestLookup({ onInvitationSelected }: GuestLookupProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<GuestSearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showNoResults, setShowNoResults] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchTerm.trim()) {
      setError("Please enter a name to search for")
      return
    }

    setSearching(true)
    setError(null)
    setShowNoResults(false)
    setSearchResults([])

    try {
      const { data, error: searchError } = await supabase.rpc("search_guests_by_name", {
        search_term: searchTerm.trim(),
      })

      if (searchError) throw searchError

      if (data && data.length > 0) {
        // Type assertion since our database function returns the correct structure
        setSearchResults(data as unknown as GuestSearchResult[])
      } else {
        setShowNoResults(true)
      }
    } catch (err) {
      console.error("Search error:", err)
      setError("An error occurred while searching. Please try again.")
    } finally {
      setSearching(false)
    }
  }

  const convertToInvitation = (guest: GuestSearchResult): Invitation => {
    const guests: IndividualGuest[] = []
    
    // Add guest 1 (always exists)
    guests.push({
      firstName: guest.guest_1_first_name,
      lastName: guest.guest_1_last_name,
      position: 1
    })

    // Add guest 2 if exists
    if (guest.guest_2_first_name && guest.guest_2_last_name) {
      guests.push({
        firstName: guest.guest_2_first_name,
        lastName: guest.guest_2_last_name,
        position: 2
      })
    }

    // Add guest 3 if exists
    if (guest.guest_3_first_name && guest.guest_3_last_name) {
      guests.push({
        firstName: guest.guest_3_first_name,
        lastName: guest.guest_3_last_name,
        position: 3
      })
    }

    // Add guest 4 if exists
    if (guest.guest_4_first_name && guest.guest_4_last_name) {
      guests.push({
        firstName: guest.guest_4_first_name,
        lastName: guest.guest_4_last_name,
        position: 4
      })
    }

    return {
      id: guest.id,
      guests,
      party_size: guest.party_size,
      is_welcome_party_invited: guest.is_welcome_party_invited,
      is_rehearsal_dinner_invited: guest.is_rehearsal_dinner_invited,
      email: guest.email,
      phone: guest.phone
    }
  }

  const handleInvitationSelect = (guest: GuestSearchResult) => {
    const invitation = convertToInvitation(guest)
    onInvitationSelected(invitation)
  }

  const getEventInvitations = (guest: GuestSearchResult) => {
    const events = []
    if (guest.is_rehearsal_dinner_invited) events.push("Rehearsal Dinner")
    if (guest.is_welcome_party_invited) events.push("Welcome Party")
    events.push("Wedding Ceremony & Reception") // Always invited
    return events
  }

  const formatGuestNames = (guest: GuestSearchResult) => {
    const names = [guest.guest_1_first_name + " " + guest.guest_1_last_name]
    
    if (guest.guest_2_first_name && guest.guest_2_last_name) {
      names.push(guest.guest_2_first_name + " " + guest.guest_2_last_name)
    }
    
    if (guest.guest_3_first_name && guest.guest_3_last_name) {
      names.push(guest.guest_3_first_name + " " + guest.guest_3_last_name)
    }
    
    if (guest.guest_4_first_name && guest.guest_4_last_name) {
      names.push(guest.guest_4_first_name + " " + guest.guest_4_last_name)
    }
    
    if (names.length === 1) return names[0]
    if (names.length === 2) return names.join(" & ")
    if (names.length > 2) {
      return names.slice(0, -1).join(", ") + " & " + names[names.length - 1]
    }
    
    return names[0]
  }

  return (
    <div className="space-y-6">
      <div className="bg-ivory-100 p-6 rounded-lg border border-sage-200 shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-2 text-sage-800 font-display">
            Find Your Invitation
          </h2>
          <p className="text-sage-700">
            Enter any name from your wedding invitation
          </p>
        </div>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="searchTerm" className="text-sage-800 font-medium">
              Name
            </Label>
            <Input
              id="searchTerm"
              type="text"
              placeholder="Enter any name from your invitation"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={searching}
              className="bg-white border-sage-300 focus:border-sage-500 text-sage-900 h-12 text-base"
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={searching} 
            className="w-full bg-sage-700 hover:bg-sage-800 text-white font-medium py-3 px-4 rounded-md transition duration-300 h-12"
          >
            {searching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search for Invitation
              </>
            )}
          </Button>
        </form>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-ivory-100 p-6 rounded-lg border border-sage-200 shadow-md">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold mb-2 text-sage-800 font-display">
              Select Your Invitation
            </h3>
            <p className="text-sage-700">
              {searchResults.length === 1 
                ? "We found your invitation!" 
                : `We found ${searchResults.length} invitations. Please select yours:`}
            </p>
          </div>
          <div className="space-y-3">
            {searchResults.map((guest) => (
              <div 
                key={guest.id} 
                className="bg-white border border-sage-200 rounded-lg p-4 cursor-pointer hover:border-sage-400 hover:bg-sage-50 transition-all duration-200 shadow-sm"
                onClick={() => handleInvitationSelect(guest)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-sage-600" />
                      <p className="font-semibold text-sage-800 text-lg">
                        {formatGuestNames(guest)}
                      </p>
                    </div>
                    <p className="text-sage-600">
                      Party of {guest.party_size}
                    </p>
                    <div className="text-sage-600">
                      <p className="font-medium text-sage-700 mb-1">Invited to:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {getEventInvitations(guest).map((event) => (
                          <li key={event} className="text-sm">{event}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Button 
                    className="bg-sage-700 hover:bg-sage-800 text-white font-medium px-4 py-2 rounded-md transition duration-300"
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showNoResults && (
        <div className="bg-ivory-100 p-6 rounded-lg border border-sage-200 shadow-md">
          <div className="text-center">
            <h3 className="text-xl font-medium mb-3 text-sage-800">
              We couldn't find your invitation
            </h3>
            <div className="text-left max-w-md mx-auto">
              <p className="text-sage-700 mb-3">
                Please try the following:
              </p>
              <ul className="list-disc list-inside text-sage-600 space-y-2 mb-4">
                <li>Check the spelling of your name</li>
                <li>Try using your full legal name as it appears on the invitation</li>
                <li>Try searching with just your first or last name</li>
                <li>Try searching with any other name from your invitation</li>
                <li>If you have a hyphenated name, try with and without the hyphen</li>
              </ul>
              <p className="text-sage-700 text-center">
                Still having trouble? Please{" "}
                <a href="/contact" className="text-sage-800 hover:text-sage-900 underline font-medium">
                  contact us
                </a>{" "}
                for assistance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}