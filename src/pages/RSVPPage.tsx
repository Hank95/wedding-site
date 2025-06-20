import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { RSVPForm } from "../components/rsvp-form";
import { ConfirmationMessage } from "../components/confirmation-message";
import { LazyImage } from "../components/LazyImage";
import { supabase } from "@/supabaseClient";
import { RSVPFormType } from "@/lib/rsvpSchema";

export default function RSVPPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<RSVPFormType | null>(null);

  const handleSubmit = async (formData: RSVPFormType) => {
    try {
      // Convert attending value to boolean for database
      const attendingBool = formData.attending === "yes";

      // Prepare the record data for both database and email - using dummy values for new required fields
      const recordData = {
        guest_id: "00000000-0000-0000-0000-000000000000", // Dummy UUID for legacy form
        guest_first_name: formData.fullName.split(' ')[0] || formData.fullName,
        guest_last_name: formData.fullName.split(' ').slice(1).join(' ') || "",
        attending: attendingBool,
        dietary_restrictions: formData.dietaryRestrictions || null,
        message: formData.message || null,
        welcome_party_attending: null,
        rehearsal_dinner_attending: null,
      };

      // Insert data into Supabase
      const { error } = await supabase.from("rsvps").insert([recordData]);

      if (error) throw error;

      // Send email notification via edge function
      try {
        const { error: functionError } = await supabase.functions.invoke('send-rsvp-notification', {
          body: { record: recordData }
        });
        
        if (functionError) {
          console.error('Email notification failed:', functionError);
          // Don't throw here - we still want to show success for the RSVP submission
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Don't throw here - we still want to show success for the RSVP submission
      }

      // Update state on success
      setSubmittedData(formData);
      setIsSubmitted(true);
      toast.success("RSVP submitted successfully!");
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="font-formal text-sage-900 min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative h-64 md:h-96">
        <LazyImage
          src="/legare_green.webp"
          alt="Beautiful wedding venue with oak trees"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          loading="eager"
        />
        <div className="absolute inset-0 flex items-center justify-center background-sage-900 bg-opacity-70">
          <div className="text-center z-10">
            <h1 className="text-5xl font-bold text-sage-900 mb-4 font-script">
              RSVP
            </h1>
            <p className="text-xl text-sage-900 font-light">
              We can't wait to celebrate with you!
            </p>
          </div>
        </div>
      </section>

      {/* RSVP Form Section */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <Card className="p-8 bg-ivory-100 shadow-xl rounded-xl border-sage-200 border">
          <div className="mb-8 text-center">
            <img
              src="/NH-Logo.webp"
              alt="Wedding Logo"
              width={150}
              height={150}
              className="mx-auto mb-6"
            />
            <h2 className="text-3xl font-bold mb-3 font-display text-sage-800">
              Please RSVP by September 5, 2025
            </h2>
            <p className="text-sage-700">
              We're excited to have you join us for our special day. Please let
              us know if you'll be able to attend.
            </p>
          </div>

          {isSubmitted ? (
            <ConfirmationMessage data={submittedData} />
          ) : (
            <RSVPForm onSubmit={handleSubmit} />
          )}
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center font-display text-sage-800">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-sage-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 font-display text-sage-800">
              What's the dress code?
            </h3>
            <p className="text-sage-700">
              The dress code for the wedding ceremony and reception is Black Tie
              Optional. For the Welcome Party, it's Cocktail Attire.
            </p>
          </div>
          <div className="bg-sage-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 font-display text-sage-800">
              Can I bring my children?
            </h3>
            <p className="text-sage-700">
              While we love your little ones, our celebration is adults-only.
              Thank you for understanding.
            </p>
          </div>
          <div className="bg-sage-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 font-display text-sage-800">
              What if I have dietary restrictions?
            </h3>
            <p className="text-sage-700">
              Please indicate any dietary restrictions in the RSVP form, and
              we'll do our best to accommodate your needs.
            </p>
          </div>
          <div className="bg-sage-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 font-display text-sage-800">
              Will there be transportation?
            </h3>
            <p className="text-sage-700">
              Please stay tuned for more information on transportation options!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
