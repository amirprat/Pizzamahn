import { z } from "zod";

export const areaTagSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type AreaTagInput = z.infer<typeof areaTagSchema>;

