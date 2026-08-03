import { z } from "zod";

export const wajibKhidmahMemberSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi.")
    .max(255, "Nama maksimal 255 karakter."),
  alamat: z
    .string()
    .trim()
    .max(500, "Alamat maksimal 500 karakter.")
    .optional()
    .or(z.literal("")),
  kelas: z
    .string()
    .trim()
    .max(100, "Kelas maksimal 100 karakter.")
    .optional()
    .or(z.literal("")),
  posWajibKhidmah: z
    .string()
    .trim()
    .max(100, "Pos Wajib Khidmah maksimal 100 karakter.")
    .optional()
    .or(z.literal("")),
  tempatWajibKhidmah: z
    .string()
    .trim()
    .max(100, "Tempat Wajib Khidmah maksimal 100 karakter.")
    .optional()
    .or(z.literal("")),
});

export const createWajibKhidmahMemberSchema = wajibKhidmahMemberSchema;

export const updateWajibKhidmahMemberSchema = wajibKhidmahMemberSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Minimal satu kolom harus diisi.",
  });

export type WajibKhidmahMemberInput = z.infer<
  typeof wajibKhidmahMemberSchema
>;
export type CreateWajibKhidmahMemberInput = z.infer<
  typeof createWajibKhidmahMemberSchema
>;
export type UpdateWajibKhidmahMemberInput = z.infer<
  typeof updateWajibKhidmahMemberSchema
>;
