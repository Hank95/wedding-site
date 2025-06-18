import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { GuestSearchResult } from "@/types/database.types";
import { trackEvent } from "@/lib/analytics";
import { Database } from "database.types";

type RSVPFormData = Database["public"]["Tables"]["rsvps"]["Insert"];

interface MultiStepRSVPFormProps {
  guest: GuestSearchResult;
  onSuccess: (attendingAny: boolean) => void;
  onBack: () => void;
}

// Create dynamic schema based on guest invitations
const createRSVPSchema = (guest: GuestSearchResult) => {
  const baseSchema = {
    email: z.string().email("Please enter a valid email address"),
    ceremony_reception_attending: z.boolean({
      required_error:
        "Please let us know if you'll be attending the ceremony and reception",
    }),
    guest_count_ceremony: z
      .number()
      .min(1, "Please specify at least 1 guest")
      .max(guest.party_size, `Maximum ${guest.party_size} guests allowed`),
    dietary_restrictions: z.string().optional(),
    message: z.string().optional(),
    // Always include these fields for type safety, but make them optional if not invited
    welcome_party_attending: guest.is_welcome_party_invited
      ? z.boolean({
          required_error:
            "Please let us know if you'll be attending the welcome party",
        })
      : z.boolean().optional(),
    guest_count_welcome: guest.is_welcome_party_invited
      ? z
          .number()
          .min(1, "Please specify at least 1 guest")
          .max(guest.party_size, `Maximum ${guest.party_size} guests allowed`)
      : z.number().optional(),
    rehearsal_dinner_attending: guest.is_rehearsal_dinner_invited
      ? z.boolean({
          required_error:
            "Please let us know if you'll be attending the rehearsal dinner",
        })
      : z.boolean().optional(),
    guest_count_rehearsal: guest.is_rehearsal_dinner_invited
      ? z
          .number()
          .min(1, "Please specify at least 1 guest")
          .max(guest.party_size, `Maximum ${guest.party_size} guests allowed`)
      : z.number().optional(),
  };

  return z.object(baseSchema);
};

export function MultiStepRSVPForm({
  guest,
  onSuccess,
  onBack,
}: MultiStepRSVPFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = createRSVPSchema(guest);
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: guest.email || "",
      ceremony_reception_attending: true,
      guest_count_ceremony: guest.party_size,
      welcome_party_attending: true,
      guest_count_welcome: guest.party_size,
      rehearsal_dinner_attending: true,
      guest_count_rehearsal: guest.party_size,
      dietary_restrictions: "",
      message: "",
    },
    mode: "onChange",
  });

  // Reset form when guest changes to prevent stale data
  useEffect(() => {
    const defaultValues = {
      email: guest.email || "",
      ceremony_reception_attending: true,
      guest_count_ceremony: guest.party_size,
      welcome_party_attending: true,
      guest_count_welcome: guest.party_size,
      rehearsal_dinner_attending: true,
      guest_count_rehearsal: guest.party_size,
      dietary_restrictions: "",
      message: "",
    };

    form.reset(defaultValues);
    setCurrentStep(0);
    setError(null);
  }, [guest.id, guest.email, guest.party_size, form]);

  // Determine the steps based on invitations - rehearsal dinner first if invited
  interface Step {
    title: string;
    description: string;
    fields: string[];
  }

  const steps: Step[] = [];

  // Add rehearsal dinner first if invited
  if (guest.is_rehearsal_dinner_invited) {
    steps.push({
      title: "Rehearsal Dinner",
      description: "Friday, October 25th, 2025 at 5:00 PM - The Oyster House",
      fields: ["rehearsal_dinner_attending", "guest_count_rehearsal"],
    });
  }

  if (guest.is_welcome_party_invited) {
    steps.push({
      title: "Welcome Party",
      description: "Friday, October 25th, 2025 at 8:00 PM - The Oyster House",
      fields: ["welcome_party_attending", "guest_count_welcome"],
    });
  }

  // Always include ceremony step
  steps.push({
    title: "Wedding Ceremony & Reception",
    description:
      "Saturday, October 26th, 2025 at 5:00 PM - Legare Waring House",
    fields: ["ceremony_reception_attending", "guest_count_ceremony"],
  });

  // Add details step
  steps.push({
    title: "Additional Details",
    description:
      "Please provide your contact information and any special requirements",
    fields: ["email", "dietary_restrictions", "message"],
  });

  const handleNext = async () => {
    const step = steps[currentStep];
    let fieldsToValidate = step.fields;

    // For event steps, only validate guest count if attending
    if (step.title === "Wedding Ceremony & Reception") {
      fieldsToValidate = ["ceremony_reception_attending"];
      if (form.getValues("ceremony_reception_attending")) {
        fieldsToValidate.push("guest_count_ceremony");
      }
    } else if (step.title === "Welcome Party") {
      fieldsToValidate = ["welcome_party_attending"];
      if (form.getValues("welcome_party_attending")) {
        fieldsToValidate.push("guest_count_welcome");
      }
    } else if (step.title === "Rehearsal Dinner") {
      fieldsToValidate = ["rehearsal_dinner_attending"];
      if (form.getValues("rehearsal_dinner_attending")) {
        fieldsToValidate.push("guest_count_rehearsal");
      }
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
      // Create RSVP record
      const rsvpData = {
        guest_id: guest.id,
        name: `${guest.first_name} ${guest.last_name}`,
        email: formData.email,
        attending: formData.ceremony_reception_attending,
        guest_count_ceremony: formData.ceremony_reception_attending
          ? formData.guest_count_ceremony
          : 0,
        dietary_restrictions: formData.dietary_restrictions || null,
        message: formData.message || null,
        plus_one_first_name: guest.plus_one_first_name || null,
        plus_one_last_name: guest.plus_one_last_name || null,
        created_at: new Date().toISOString(),
      } as RSVPFormData;

      // Add optional fields if guest is invited
      if (
        guest.is_welcome_party_invited &&
        "welcome_party_attending" in formData
      ) {
        rsvpData.welcome_party_attending = formData.welcome_party_attending;
        rsvpData.guest_count_welcome = formData.welcome_party_attending
          ? formData.guest_count_welcome || 1
          : 0;
      } else {
        rsvpData.guest_count_welcome = 0;
      }

      if (
        guest.is_rehearsal_dinner_invited &&
        "rehearsal_dinner_attending" in formData
      ) {
        rsvpData.rehearsal_dinner_attending =
          formData.rehearsal_dinner_attending;
        rsvpData.guest_count_rehearsal = formData.rehearsal_dinner_attending
          ? formData.guest_count_rehearsal || 1
          : 0;
      } else {
        rsvpData.guest_count_rehearsal = 0;
      }

      const { error: insertError } = await supabase
        .from("rsvps")
        .insert([rsvpData]);

      if (insertError) throw insertError;

      // Track successful submission
      trackEvent(
        "rsvp_submitted",
        "conversion",
        `guest_id:${guest.id}|attending_ceremony:${formData.ceremony_reception_attending}|total_guests:${formData.guest_count_ceremony}`
      );

      // Trigger email notification
      await supabase.functions.invoke("send-enhanced-rsvp-notification", {
        body: {
          rsvp: rsvpData,
          guest: guest,
        },
      });

      // Calculate if attending any event
      const attendingAny =
        (formData.ceremony_reception_attending ?? false) ||
        (formData.welcome_party_attending ?? false) ||
        (formData.rehearsal_dinner_attending ?? false);

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

  console.log(" guest plus one first name", guest.plus_one_first_name);
  console.log(" guest plus one last name", guest.plus_one_last_name);

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.title) {
      case "Wedding Ceremony & Reception":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="ceremony_reception_attending"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Will you be attending the wedding ceremony and reception?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === "yes")}
                      value={field.value ? "yes" : "no"}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="ceremony-yes" />
                        <Label htmlFor="ceremony-yes">
                          Yes, I'll be there!
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="ceremony-no" />
                        <Label htmlFor="ceremony-no">
                          Sorry, I can't make it
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("ceremony_reception_attending") && (
              <FormField
                control={form.control}
                name="guest_count_ceremony"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sage-800 font-medium text-base">
                      How many guests will be attending?
                    </FormLabel>
                    <FormDescription className="text-sage-600">
                      Including yourself (maximum {guest.party_size})
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={guest.party_size}
                        className="bg-white border-sage-300 focus:border-sage-500 text-sage-900 h-12 text-base"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseInt(e.target.value) || guest.party_size
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            )}
          </div>
        );

      case "Welcome Party":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="welcome_party_attending"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Will you be attending the welcome party?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === "yes")}
                      value={field.value ? "yes" : "no"}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="welcome-yes" />
                        <Label htmlFor="welcome-yes">Yes, I'll be there!</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="welcome-no" />
                        <Label htmlFor="welcome-no">
                          Sorry, I can't make it
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("welcome_party_attending") && (
              <FormField
                control={form.control}
                name="guest_count_welcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sage-800 font-medium text-base">
                      How many guests will be attending?
                    </FormLabel>
                    <FormDescription className="text-sage-600">
                      Including yourself (maximum {guest.party_size})
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={guest.party_size}
                        className="bg-white border-sage-300 focus:border-sage-500 text-sage-900 h-12 text-base"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseInt(e.target.value) || guest.party_size
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            )}
          </div>
        );

      case "Rehearsal Dinner":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="rehearsal_dinner_attending"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Will you be attending the rehearsal dinner?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === "yes")}
                      value={field.value ? "yes" : "no"}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="rehearsal-yes" />
                        <Label htmlFor="rehearsal-yes">
                          Yes, I'll be there!
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="rehearsal-no" />
                        <Label htmlFor="rehearsal-no">
                          Sorry, I can't make it
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("rehearsal_dinner_attending") && (
              <FormField
                control={form.control}
                name="guest_count_rehearsal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sage-800 font-medium text-base">
                      How many guests will be attending?
                    </FormLabel>
                    <FormDescription className="text-sage-600">
                      Including yourself (maximum {guest.party_size})
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={guest.party_size}
                        className="bg-white border-sage-300 focus:border-sage-500 text-sage-900 h-12 text-base"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseInt(e.target.value) || guest.party_size
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            )}
          </div>
        );

      case "Additional Details":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              key={`email-${guest.id}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormDescription>
                    We'll send your RSVP confirmation here
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={typeof field.value === "string" ? field.value : ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Guest Information - show if guest has additional guest in database */}
            {guest.plus_one_first_name && guest.plus_one_last_name && (
              <div className="space-y-3 border-t pt-4">
                <div>
                  <h4 className="font-medium text-sm">Your Guest</h4>
                  <p className="text-sm text-muted-foreground">
                    Additional guest included in this invitation
                  </p>
                </div>

                <div className="bg-sage/10 border border-sage/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    <span className="font-medium text-sage-dark">
                      {guest.plus_one_first_name} {guest.plus_one_last_name}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="dietary_restrictions"
              key={`dietary-${guest.id}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Restrictions</FormLabel>
                  <FormDescription>
                    Please let us know of any allergies or dietary requirements
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Vegetarian, gluten-free, nut allergy, etc."
                      value={typeof field.value === "string" ? field.value : ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              key={`message-${guest.id}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message for the Couple (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your well wishes or any other notes..."
                      value={typeof field.value === "string" ? field.value : ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Form {...form} key={guest.id}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {guest.plus_one_first_name && guest.plus_one_last_name
                  ? `RSVP for ${guest.first_name} ${guest.last_name} & ${guest.plus_one_first_name} ${guest.plus_one_last_name}`
                  : `RSVP for ${guest.first_name} ${guest.last_name}`}
              </CardTitle>
              <CardDescription>
                Party of {guest.party_size} | Step {currentStep + 1} of{" "}
                {steps.length}
              </CardDescription>
            </div>
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index <= currentStep ? "bg-sage" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-1">
                {steps[currentStep].title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {steps[currentStep].description}
              </p>
              {renderStepContent()}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 0 ? onBack : handlePrevious}
                disabled={submitting}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {currentStep === 0 ? "Back to Search" : "Previous"}
              </Button>

              <Button type="button" onClick={handleNext} disabled={submitting}>
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
        </CardContent>
      </Card>
    </Form>
  );
}
