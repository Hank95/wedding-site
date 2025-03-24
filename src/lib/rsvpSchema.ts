// Define schema for RSVP form validation

import { z } from "zod";
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