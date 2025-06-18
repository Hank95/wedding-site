import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronLeft, ChevronRight, Check, User } from "lucide-react";
import { Invitation, RSVP } from "@/types/database.types";
import { trackEvent } from "@/lib/analytics";
import { Database } from "database.types";

type rsvpData = Database["public"]["Tables"]["rsvps"]["Row"];

interface MultiStepRSVPFormProps {
  invitation: Invitation;
  onSuccess: (attendingAny: boolean) => void;
  onBack: () => void;
}

// Create a schema for the individual guest response
const createGuestResponseSchema = (invitation: Invitation) => {
  return z.object({
    email: z.string().email("Please enter a valid email address"),
    guestResponses: z.array(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        ceremony_reception_attending: z.boolean(),
        welcome_party_attending: invitation.is_welcome_party_invited
          ? z.boolean()
          : z.boolean().optional(),
        rehearsal_dinner_attending: invitation.is_rehearsal_dinner_invited
          ? z.boolean()
          : z.boolean().optional(),
        dietary_restrictions: z.string().optional(),
        message: z.string().optional(),
      })
    ),
  });
};

export function MultiStepRSVPForm({
  invitation,
  onSuccess,
  onBack,
}: MultiStepRSVPFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = createGuestResponseSchema(invitation);
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: invitation.email || "",
      guestResponses: invitation.guests.map((guest) => ({
        firstName: guest.firstName,
        lastName: guest.lastName,
        ceremony_reception_attending: true,
        welcome_party_attending: true,
        rehearsal_dinner_attending: true,
        dietary_restrictions: "",
        message: "",
      })),
    },
    mode: "onChange",
  });

  // Reset form when invitation changes
  useEffect(() => {
    const defaultValues = {
      email: invitation.email || "",
      guestResponses: invitation.guests.map((guest) => ({
        firstName: guest.firstName,
        lastName: guest.lastName,
        ceremony_reception_attending: true,
        welcome_party_attending: true,
        rehearsal_dinner_attending: true,
        dietary_restrictions: "",
        message: "",
      })),
    };

    form.reset(defaultValues);
    setCurrentStep(0);
    setError(null);
  }, [invitation.id, invitation.email, invitation.guests, form]);

  // Determine the steps based on invitations
  interface Step {
    title: string;
    description: string;
    type: "event" | "details";
    event?: "ceremony" | "welcome_party" | "rehearsal_dinner";
  }

  const steps: Step[] = [];

  // Add event steps based on what they're invited to
  // Rehearsal dinner first if invited
  if (invitation.is_rehearsal_dinner_invited) {
    steps.push({
      title: "Rehearsal Dinner",
      description: "Friday, October 25th, 2025 at 5:00 PM - The Oyster House",
      type: "event",
      event: "rehearsal_dinner",
    });
  }

  // Welcome party if invited
  if (invitation.is_welcome_party_invited) {
    steps.push({
      title: "Welcome Party",
      description: "Friday, October 25th, 2025 at 8:00 PM - The Oyster House",
      type: "event",
      event: "welcome_party",
    });
  }

  // Ceremony (always invited)
  steps.push({
    title: "Wedding Ceremony & Reception",
    description: "Saturday, October 26th, 2025 at 5:00 PM - Legare Waring House",
    type: "event",
    event: "ceremony",
  });

  // Add details step
  steps.push({
    title: "Contact Information & Details",
    description: "Please provide your email and any special requirements",
    type: "details",
  });

  const handleNext = async () => {
    const step = steps[currentStep];
    let fieldsToValidate: string[] = [];

    if (step.type === "event" && step.event) {
      // Validate all guest responses for this event
      fieldsToValidate = invitation.guests.map((_, index) => 
        `guestResponses.${index}.${step.event === "ceremony" ? "ceremony_reception" : step.event}_attending`
      );
    } else if (step.type === "details") {
      fieldsToValidate = ["email"];
    }

    const isValid = await form.trigger(fieldsToValidate as (keyof FormData)[]);

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        trackEvent(
          "rsvp_step_completed",
          "engagement",
          `step_${currentStep + 1}`
        );
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const formData = form.getValues();
    setSubmitting(true);
    setError(null);

    try {
      // Create individual RSVP records for each guest
      const rsvpPromises = formData.guestResponses.map(
        async (guestResponse) => {
          const rsvpData: Omit<RSVP, "id" | "created_at"> = {
            guest_id: invitation.id,
            guest_first_name: guestResponse.firstName,
            guest_last_name: guestResponse.lastName,
            attending: guestResponse.ceremony_reception_attending,
            dietary_restrictions: guestResponse.dietary_restrictions || null,
            message: guestResponse.message || null,
            welcome_party_attending: invitation.is_welcome_party_invited
              ? guestResponse.welcome_party_attending ?? null
              : null,
            rehearsal_dinner_attending: invitation.is_rehearsal_dinner_invited
              ? guestResponse.rehearsal_dinner_attending ?? null
              : null,
          };

          const { error: insertError } = await supabase
            .from("rsvps")
            .insert(rsvpData as rsvpData);

          if (insertError) throw insertError;
          return rsvpData;
        }
      );

      await Promise.all(rsvpPromises);

      // Track successful submission
      trackEvent(
        "rsvp_submitted",
        "conversion",
        `invitation_id:${invitation.id}|party_size:${invitation.party_size}`
      );

      // Trigger email notification with all guest responses
      await supabase.functions.invoke("send-enhanced-rsvp-notification", {
        body: {
          invitation: invitation,
          guestResponses: formData.guestResponses,
          email: formData.email,
        },
      });

      // Calculate if anyone is attending any event
      const attendingAny = formData.guestResponses.some(
        (response) =>
          response.ceremony_reception_attending ||
          response.welcome_party_attending ||
          response.rehearsal_dinner_attending
      );

      onSuccess(attendingAny);
    } catch (err) {
      console.error("RSVP submission error:", err);
      setError(
        "An error occurred while submitting your RSVP. Please try again."
      );
      trackEvent(
        "rsvp_error",
        "error",
        err instanceof Error ? err.message : String(err)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    if (step.type === "event" && step.event) {
      const eventField = `${step.event === "ceremony" ? "ceremony_reception" : step.event}_attending` as const;

      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-sage-800">
              Who will be attending?
            </h4>
            
            {invitation.guests.map((guest, index) => (
              <div key={`${guest.firstName}-${guest.lastName}-${index}`} 
                   className="bg-sage-50 border border-sage-200 rounded-lg p-4">
                <FormField
                  control={form.control}
                  name={`guestResponses.${index}.${eventField}`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-5 w-5 text-sage-600" />
                        <FormLabel className="text-sage-800 font-medium text-base m-0">
                          {guest.firstName} {guest.lastName}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === "yes")}
                          value={field.value ? "yes" : "no"}
                          className="flex flex-row gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="yes"
                              id={`${index}-${step.event}-yes`}
                            />
                            <Label htmlFor={`${index}-${step.event}-yes`} className="cursor-pointer">
                              Will attend
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="no"
                              id={`${index}-${step.event}-no`}
                            />
                            <Label htmlFor={`${index}-${step.event}-no`} className="cursor-pointer">
                              Cannot attend
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (step.type === "details") {
      return (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sage-800 font-medium text-base">
                  Email Address
                </FormLabel>
                <FormDescription className="text-sage-600">
                  We'll send your RSVP confirmation here
                </FormDescription>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="bg-white border-sage-300 focus:border-sage-500 text-sage-900 h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          {/* Dietary restrictions and messages for each guest */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-sage-800 border-b border-sage-200 pb-2">
              Additional Information (Optional)
            </h4>

            {invitation.guests.map((guest, index) => (
              <div
                key={`${guest.firstName}-${guest.lastName}-${index}`}
                className="bg-sage-50 border border-sage-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-sage-600" />
                  <h5 className="font-medium text-sage-800">
                    {guest.firstName} {guest.lastName}
                  </h5>
                </div>

                <FormField
                  control={form.control}
                  name={`guestResponses.${index}.dietary_restrictions`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sage-800 font-medium">
                        Dietary Restrictions
                      </FormLabel>
                      <FormDescription className="text-sage-600">
                        Please let us know of any allergies or dietary
                        requirements for {guest.firstName}
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Vegetarian, gluten-free, nut allergy, etc."
                          className="bg-white border-sage-300 focus:border-sage-500 text-sage-900"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                {index === 0 && (
                  <FormField
                    control={form.control}
                    name={`guestResponses.${index}.message`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sage-800 font-medium">
                          Message for the Couple (Optional)
                        </FormLabel>
                        <FormDescription className="text-sage-600">
                          Share your well wishes or any other notes from your
                          party
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Share your well wishes or any other notes..."
                            className="bg-white border-sage-300 focus:border-sage-500 text-sage-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const formatInvitationNames = () => {
    const names = invitation.guests.map((g) => `${g.firstName} ${g.lastName}`);
    if (names.length === 1) return names[0];
    if (names.length === 2) return names.join(" & ");
    return names.slice(0, -1).join(", ") + " & " + names[names.length - 1];
  };

  return (
    <Form {...form} key={invitation.id}>
      <div className="bg-ivory-100 p-6 rounded-lg border border-sage-200 shadow-md">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-semibold text-sage-800 font-display">
                RSVP for {formatInvitationNames()}
              </h2>
              <p className="text-sage-700 mt-1">
                Party of {invitation.party_size} | Step {currentStep + 1} of{" "}
                {steps.length}
              </p>
            </div>
            <div className="flex gap-2 justify-center sm:justify-end">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-3 w-8 rounded-full transition-colors ${
                    index <= currentStep ? "bg-sage-600" : "bg-sage-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-sage-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2 text-sage-800 font-display">
              {steps[currentStep].title}
            </h3>
            <p className="text-sage-700 mb-6">
              {steps[currentStep].description}
            </p>
            {renderStepContent()}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button
              type="button"
              onClick={currentStep === 0 ? onBack : handlePrevious}
              disabled={submitting}
              className="bg-white border-2 border-sage-300 text-sage-700 hover:bg-sage-50 hover:border-sage-400 font-medium py-3 px-6 rounded-md transition duration-300 h-12"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {currentStep === 0 ? "Back to Search" : "Previous"}
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="bg-sage-700 hover:bg-sage-800 text-white font-medium py-3 px-6 rounded-md transition duration-300 h-12"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit RSVP
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}