import { z } from "zod";

import { CAMPAIGN_CATEGORIES, MAX_DONATION, MIN_DONATION } from "./constants";

export const donationSchema = z.object({
  amount: z.coerce
    .number({ error: "Enter a donation amount" })
    .min(MIN_DONATION, `The minimum donation is ${MIN_DONATION}`)
    .max(MAX_DONATION, "That amount is too large — please contact us directly"),
  frequency: z.enum(["one_time", "monthly"]).default("one_time"),
  campaignId: z.string().uuid().or(z.literal("")).optional(),
  donorName: z
    .string()
    .trim()
    .min(2, "Please tell us your name")
    .max(80, "That name is too long"),
  donorEmail: z.email("Enter a valid email address").max(160),
  donorPhone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(500, "Keep it under 500 characters").optional().or(z.literal("")),
  isAnonymous: z.boolean().default(false),
});

export type DonationInput = z.infer<typeof donationSchema>;

export const campaignSchema = z.object({
  title: z.string().trim().min(4, "Give the campaign a title").max(120),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is too short")
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only"),
  summary: z.string().trim().min(20, "Write at least a sentence").max(280),
  description: z.string().trim().max(20_000).optional().or(z.literal("")),
  category: z.enum(CAMPAIGN_CATEGORIES),
  goalAmount: z.coerce.number().min(1, "Set a fundraising goal").max(100_000_000),
  status: z.enum(["draft", "active", "completed", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  coverImageUrl: z.url("Enter a valid image URL").optional().or(z.literal("")),
  endsAt: z.string().optional().or(z.literal("")),
});

export type CampaignInput = z.infer<typeof campaignSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Passwords are at least 8 characters"),
});

/** Flattens a ZodError into `{ fieldName: "first message" }` for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
}
