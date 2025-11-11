import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().optional(),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email address"),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD must be at least 8 characters"),
  MAILCHIMP_API_KEY: z.string().optional(),
  MAILCHIMP_AUDIENCE_ID: z.string().optional(),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
  MAILCHIMP_AUDIENCE_ID: process.env.MAILCHIMP_AUDIENCE_ID,
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

