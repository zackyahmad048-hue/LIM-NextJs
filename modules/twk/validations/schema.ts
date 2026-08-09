import { z } from "zod";

import {
  DEACTIVATED_STATUSES,
  POS_WAJIB_KHIDMAH,
  WAJIB_KHIDMAH_STATUS_LABELS,
  type WajibKhidmahStatus,
} from "../domain/entities";

const STATUS_VALUES = [
  "AKTIF",
  "GUGUR",
  "BEBAS_TUGAS",
  "QODLO",
] as const satisfies readonly WajibKhidmahStatus[];

const posEnum = z.enum(POS_WAJIB_KHIDMAH, {
  message: "Pos Khidmah tidak valid.",
});

const statusEnum = z.enum(STATUS_VALUES, {
  message: `Status harus salah satu dari: ${Object.values(WAJIB_KHIDMAH_STATUS_LABELS).join(", ")}.`,
});

const asalDaerahSchema = z
  .string()
  .trim()
  .max(200, "Asal Daerah maksimal 200 karakter.")
  .refine(
    (value) => value === "" || /^.+ - .+$/.test(value),
    "Format Asal Daerah: [Kota/Kabupaten] - [Provinsi]. Contoh: Kediri - Jawa Timur.",
  )
  .optional()
  .or(z.literal(""));

const baseSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi.")
    .max(255, "Nama maksimal 255 karakter."),
  asalDaerah: asalDaerahSchema,
  alamatLembaga: z
    .string()
    .trim()
    .max(500, "Alamat Lembaga maksimal 500 karakter.")
    .optional()
    .or(z.literal("")),
  posWajibKhidmah: z
    .union([posEnum, z.literal(""), z.undefined()])
    .optional(),
  tempatWajibKhidmah: z
    .string()
    .trim()
    .max(100, "Tempat Wajib Khidmah maksimal 100 karakter.")
    .optional()
    .or(z.literal("")),
  tugasKhidmah: z
    .string()
    .trim()
    .max(100, "Tugas Khidmah maksimal 100 karakter.")
    .optional()
    .or(z.literal("")),
  status: statusEnum.default("AKTIF"),
  keterangan: z
    .string()
    .trim()
    .max(500, "Keterangan maksimal 500 karakter.")
    .optional()
    .or(z.literal("")),
  catatan: z
    .string()
    .trim()
    .max(1000, "Catatan maksimal 1000 karakter.")
    .optional()
    .or(z.literal("")),
  absensi: z
    .string()
    .trim()
    .max(100, "Absensi maksimal 100 karakter.")
    .optional()
    .or(z.literal("")),
});

export const wajibKhidmahMemberSchema = baseSchema.superRefine(
  (data, ctx) => {
    const keteranganValue = data.keterangan?.trim();
    const isPlaceholderKeterangan =
      !keteranganValue || keteranganValue === "-";
    const isAktif = data.status === "AKTIF";
    const isDeactivated = DEACTIVATED_STATUSES.includes(
      data.status as (typeof DEACTIVATED_STATUSES)[number],
    );

    if (isAktif && !isPlaceholderKeterangan) {
      ctx.addIssue({
        path: ["keterangan"],
        code: z.ZodIssueCode.custom,
        message: "Keterangan harus '-' jika Status Aktif.",
      });
    }

    if (isDeactivated && isPlaceholderKeterangan) {
      ctx.addIssue({
        path: ["keterangan"],
        code: z.ZodIssueCode.custom,
        message:
          "Keterangan wajib diisi dengan alasan jika Status bukan Aktif.",
      });
    }
  },
);

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

export { STATUS_VALUES };
