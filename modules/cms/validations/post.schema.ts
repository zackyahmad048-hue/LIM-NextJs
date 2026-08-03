import { z } from "zod";

export const postIdSchema = z.string().trim().min(1, "Berita tidak valid.");

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Judul minimal 5 karakter")
    .max(255, "Judul maksimal 255 karakter"),

  slug: z
    .string()
    .trim()
    .min(3, "Slug minimal 3 karakter")
    .max(255)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung",
    ),

  excerpt: z
    .string()
    .max(500, "Ringkasan maksimal 500 karakter")
    .optional()
    .or(z.literal("")),

  content: z.string().min(1, "Konten wajib diisi"),

  categoryId: z.string().min(1, "Kategori wajib dipilih"),

  thumbnail: z.string().optional().or(z.literal("")),
});

export type PostInput = z.infer<typeof postSchema>;
