import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Format email tidak valid").min(1, "Email wajib diisi"),

  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
