import { RSVPFormType } from "@/lib/rsvpSchema";
import { CheckCircle2 } from "lucide-react";

export function ConfirmationMessage({ data }: { data: RSVPFormType | null }) {
  if (!data) return null;

  const isAttending = data.attending === "yes";

  return (
    <div className="bg-ivory-100 p-8 rounded-lg border border-sage-200 shadow-md">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-sage-100 p-4">
            <CheckCircle2 className="h-16 w-16 text-sage-600" />
          </div>
        </div>

        <h3 className="text-3xl font-semibold mb-4 font-display text-sage-800">
          {isAttending ? "Thank You for Your RSVP!" : "We'll Miss You!"}
        </h3>

        <p className="text-lg text-sage-700 mb-8">
          {isAttending
            ? "We're thrilled that you'll be joining us on our special day!"
            : "Thank you for letting us know. We'll miss having you there but appreciate your response."}
        </p>

        {isAttending && (
          <div className="bg-white rounded-lg p-6 mb-8 border border-sage-200 max-w-md mx-auto">
            <h4 className="text-xl font-semibold mb-4 font-display text-sage-800">
              Your Details
            </h4>

            <div className="space-y-3 text-left">
              <p className="text-sage-700">
                <span className="font-medium text-sage-800">Name:</span> {data.fullName}
              </p>
              {data.dietaryRestrictions && (
                <p className="text-sage-700">
                  <span className="font-medium text-sage-800">Dietary Notes:</span>{" "}
                  {data.dietaryRestrictions}
                </p>
              )}
            </div>
          </div>
        )}

        <p className="text-sage-700 text-lg">
          {isAttending
            ? "We've sent a confirmation to your email with all the details you'll need for the day."
            : "We hope to celebrate with you another time soon."}
        </p>
      </div>
    </div>
  );
}
