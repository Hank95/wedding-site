import { useState } from "react";
import { GuestLookup } from "@/components/rsvp/guest-lookup";
import { MultiStepRSVPForm } from "@/components/rsvp/multi-step-rsvp-form";
import { ConfirmationMessage } from "@/components/confirmation-message";
import { GuestSearchResult } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type RSVPState = "lookup" | "form" | "success";

export default function EnhancedRSVPPage() {
  const [state, setState] = useState<RSVPState>("lookup");
  const [selectedGuest, setSelectedGuest] = useState<GuestSearchResult | null>(
    null
  );
  const [isAttending, setIsAttending] = useState(true);

  const handleGuestSelected = (guest: GuestSearchResult) => {
    setSelectedGuest(guest);
    setState("form");
  };

  const handleRSVPSuccess = (attendingAny: boolean = true) => {
    setIsAttending(attendingAny);
    setState("success");
  };

  const handleBackToSearch = () => {
    setState("lookup");
    setSelectedGuest(null);
  };

  const handleNewRSVP = () => {
    setState("lookup");
    setSelectedGuest(null);
    setIsAttending(true);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 mt-24">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-display text-sage-800 mb-4">RSVP</h1>
        <p className="text-xl text-sage-700 font-medium">Please respond by May 1st, 2025</p>
      </div>

      {state === "lookup" && (
        <>
          <GuestLookup onGuestSelected={handleGuestSelected} />

          <div className="mt-8">
            <div className="bg-ivory-100 p-6 rounded-lg border border-sage-200 shadow-md">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-sage-800 font-display mb-2">
                  Can't find your invitation?
                </h3>
                <p className="text-sage-700">
                  If you're having trouble finding your invitation or have questions about the RSVP process
                </p>
              </div>
              <Link to="/contact">
                <Button className="w-full bg-white border-2 border-sage-300 text-sage-700 hover:bg-sage-50 hover:border-sage-400 font-medium py-3 px-4 rounded-md transition duration-300 h-12">
                  Contact Us for Assistance
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}

      {state === "form" && selectedGuest && (
        <MultiStepRSVPForm
          guest={selectedGuest}
          onSuccess={handleRSVPSuccess}
          onBack={handleBackToSearch}
        />
      )}

      {state === "success" && (
        <div className="space-y-6">
          <ConfirmationMessage
            data={
              selectedGuest
                ? {
                    fullName:
                      selectedGuest.first_name + " " + selectedGuest.last_name,
                    email: selectedGuest.email ?? "",
                    attending: isAttending ? "yes" : "no",
                  }
                : null
            }
          />

          <div className="bg-ivory-100 p-6 rounded-lg border border-sage-200 shadow-md text-center">
            <Button 
              onClick={handleNewRSVP} 
              className="w-full bg-sage-700 hover:bg-sage-800 text-white font-medium py-3 px-4 rounded-md transition duration-300 h-12"
            >
              Submit Another RSVP
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
