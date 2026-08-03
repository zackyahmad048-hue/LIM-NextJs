import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(2).max(100),

  slug: z.string().min(2).max(100),

  description: z.string().optional(),
});

export type RoleSchema = z.infer<typeof roleSchema>;
