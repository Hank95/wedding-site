"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RSVPFormType, rsvpSchema } from "@/lib/rsvpSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export function RSVPForm({
  onSubmit,
}: {
  onSubmit: (data: RSVPFormType) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const form = useForm<RSVPFormType>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      attending: "yes",
      dietaryRestrictions: "",
      songRequest: "",
      message: "",
    },
  });

  async function handleSubmit(data: RSVPFormType) {
    setLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  }

  const isAttending = form.watch("attending") === "yes";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sage-800">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    className="bg-white border-sage-300 focus:border-sage-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sage-800">Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className="bg-white border-sage-300 focus:border-sage-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="attending"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sage-800">
                Will you be attending?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" className="text-sage-600" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Joyfully Accept
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" className="text-sage-600" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Regretfully Decline
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isAttending && (
          <>
            <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sage-800">
                    Dietary Restrictions or Allergies
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please specify any dietary restrictions"
                      className="bg-white border-sage-300 focus:border-sage-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sage-800">
                Message for the Couple (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your wishes or a message for us"
                  className="bg-white border-sage-300 focus:border-sage-500 min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-sage-700 hover:bg-sage-800 text-white px-8 py-6 text-lg font-display rounded-md"
          >
            {loading
              ? "Submitting..."
              : isAttending
              ? "Submit RSVP"
              : "Send Response"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
