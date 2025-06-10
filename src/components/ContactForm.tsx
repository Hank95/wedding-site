import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormType } from "@/lib/contactSchema";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { analytics } from "@/lib/analytics";

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContactFormType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormType) => {
    setIsSubmitting(true);
    setError(null);
    
    analytics.contactFormStarted();

    try {
      // Insert data into Supabase
      const { error: supabaseError } = await supabase
        .from("contact_us")
        .insert([
          {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
          },
        ]);

      if (supabaseError) throw new Error(supabaseError.message);

      // Show success message
      setIsSubmitted(true);
      analytics.contactFormSubmitted();
    } catch (err) {
      console.error("Error submitting contact form:", err);
      analytics.errorOccurred("contact_submission", err instanceof Error ? err.message : "Unknown error");
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8 bg-ivory-100 rounded-lg border border-sage-200 shadow-md">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-12 w-12 text-sage-600" />
        </div>
        <h3 className="text-2xl font-semibold mb-4 text-sage-800 font-display">
          Thank You!
        </h3>
        <p className="text-sage-700">
          Your message has been sent. We'll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-ivory-100 p-6 rounded-lg border border-sage-200 shadow-md">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sage-800 font-medium">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    className="bg-white border-sage-300 focus:border-sage-500 text-sage-900 h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sage-800 font-medium">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className="bg-white border-sage-300 focus:border-sage-500 text-sage-900 h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sage-800 font-medium">
                  Subject
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="What's this about?"
                    className="bg-white border-sage-300 focus:border-sage-500 text-sage-900 h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sage-800 font-medium">
                  Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your message"
                    className="bg-white border-sage-300 focus:border-sage-500 text-sage-900 min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sage-700 hover:bg-sage-800 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
