import { useState } from "react"
import { supabase } from "@/supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, User } from "lucide-react"
import { GuestSearchResult } from "@/types/database.types"

interface GuestLookupProps {
  onGuestSelected: (guest: GuestSearchResult) => void
}

export function GuestLookup({ onGuestSelected }: GuestLookupProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<GuestSearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showNoResults, setShowNoResults] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!firstName.trim() && !lastName.trim()) {
      setError("Please enter at least a first or last name")
      return
    }

    setSearching(true)
    setError(null)
    setShowNoResults(false)
    setSearchResults([])

    try {
      const { data, error: searchError } = await supabase.rpc("search_guests_by_name", {
        search_first_name: firstName.trim() || null,
        search_last_name: lastName.trim() || null,
      })

      if (searchError) throw searchError

      if (data && data.length > 0) {
        setSearchResults(data)
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

  const handleGuestSelect = (guest: GuestSearchResult) => {
    onGuestSelected(guest)
  }

  const getEventInvitations = (guest: GuestSearchResult) => {
    const events = []
    if (guest.is_welcome_party_invited) events.push("Welcome Party")
    events.push("Wedding Ceremony & Reception") // Always invited
    if (guest.is_rehearsal_dinner_invited) events.push("Rehearsal Dinner")
    return events
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Your Invitation</CardTitle>
          <CardDescription>
            Enter your name as it appears on your wedding invitation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={searching}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={searching}
                />
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" disabled={searching} className="w-full">
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
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Your Invitation</CardTitle>
            <CardDescription>
              {searchResults.length === 1 
                ? "We found your invitation!" 
                : `We found ${searchResults.length} invitations. Please select yours:`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {searchResults.map((guest) => (
              <Card 
                key={guest.id} 
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleGuestSelect(guest)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">
                          {guest.first_name} {guest.last_name}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Party of {guest.party_size}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium">Invited to:</p>
                        <ul className="list-disc list-inside mt-1">
                          {getEventInvitations(guest).map((event) => (
                            <li key={event}>{event}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {showNoResults && (
        <Alert>
          <AlertDescription>
            <p className="font-medium mb-2">We couldn't find your invitation.</p>
            <p className="text-sm mb-3">
              Please try the following:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Check the spelling of your name</li>
              <li>Try using your full legal name as it appears on the invitation</li>
              <li>Try searching with just your first or last name</li>
              <li>If you have a hyphenated name, try with and without the hyphen</li>
            </ul>
            <p className="text-sm mt-3">
              Still having trouble? Please{" "}
              <a href="/contact" className="underline text-sage-dark hover:text-sage">
                contact us
              </a>{" "}
              for assistance.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}