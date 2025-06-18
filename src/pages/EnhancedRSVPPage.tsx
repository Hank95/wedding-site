import { useState } from "react";
import { GuestLookup } from "@/components/rsvp/guest-lookup";
import { MultiStepRSVPForm } from "@/components/rsvp/multi-step-rsvp-form";
import { ConfirmationMessage } from "@/components/confirmation-message";
import { GuestSearchResult } from "@/types/database.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="container max-w-2xl mx-auto px-4 py-8 mt-24">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display text-sage-dark mb-2">RSVP</h1>
        <p className="text-gray-600">Please respond by May 1st, 2025</p>
      </div>

      {state === "lookup" && (
        <>
          <GuestLookup onGuestSelected={handleGuestSelected} />

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Can't find your invitation?</CardTitle>
                <CardDescription>
                  If you're having trouble finding your invitation or have
                  questions about the RSVP process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Us for Assistance
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
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

          <Card>
            <CardContent className="pt-6">
              <Button onClick={handleNewRSVP} className="w-full">
                Submit Another RSVP
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
