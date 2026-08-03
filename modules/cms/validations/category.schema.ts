import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter").max(100),

  slug: z
    .string()
    .trim()
    .min(3, "Slug minimal 3 karakter")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)",
    ),

  description: z.string().max(500).optional().or(z.literal("")),
});

export type CategoryInput = z.infer<typeof categorySchema>;
