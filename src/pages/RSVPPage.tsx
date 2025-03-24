import { useState } from "react";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { RSVPForm } from "../components/rsvp-form";
import { ConfirmationMessage } from "../components/confirmation-message";
import { supabase } from "@/supabaseClient";

// Define schema for RSVP form validation
export const rsvpSchema = z.object({
  fullName: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  attending: z.enum(["yes", "no"], {
    required_error: "Please select whether you'll be attending",
  }),
  dietaryRestrictions: z.string().optional(),
  songRequest: z.string().optional(),
  message: z.string().optional(),
});

export type RSVPFormType = z.infer<typeof rsvpSchema>;

export default function RSVPPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<RSVPFormType | null>(null);

  const handleSubmit = async (formData: RSVPFormType) => {
    try {
      // Convert attending value to boolean for database
      const attendingBool = formData.attending === "yes";

      // Insert data into Supabase
      const { error } = await supabase.from("rsvps").insert([
        {
          name: formData.fullName,
          email: formData.email,
          attending: attendingBool,
          dietary_restrictions: formData.dietaryRestrictions || null,
          message: formData.message || null,
        },
      ]);

      if (error) throw error;

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
        <img
          src="/legare_green.webp"
          alt="Wedding Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
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
              We request Semi-Formal/Cocktail attire for our celebration.
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
              We'll provide shuttle service between the ceremony and reception
              venues. Details will be shared closer to the wedding date.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
