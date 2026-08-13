import { z } from "zod";

import {
  DEACTIVATED_STATUSES,
  POS_WAJIB_KHIDMAH,
  TUGAS_POS_ELIGIBLE,
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
  .refine((value) => {
    if (value === "") return true;
    const match = value.match(/^(.+?)\s-\s(.+)$/);
    if (!match) return false;
    const left = match[1].trim();
    const right = match[2].trim();
    return (
      left.length > 0 && right.length > 0 && !right.startsWith("-")
    );
  }, "Format Asal Daerah: [Kota/Kabupaten] - [Provinsi]. Contoh: Kediri - Jawa Timur.")
  .optional()
  .or(z.literal(""));

const baseShape = z.object({
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
    .array(
      z
        .string()
        .trim()
        .max(100, "Tempat Wajib Khidmah maksimal 100 karakter."),
    )
    .optional(),
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

type WajibKhidmahMemberShape = z.infer<typeof baseShape>;

function applyConditionalKeterangan(
  data: WajibKhidmahMemberShape,
  ctx: z.RefinementCtx,
  fieldPath: string[],
): void {
  const keteranganRaw = data.keterangan;
  const isAktif = data.status === "AKTIF";
  const isDeactivated = DEACTIVATED_STATUSES.includes(
    data.status as (typeof DEACTIVATED_STATUSES)[number],
  );

  if (isAktif) {
    if (keteranganRaw !== "-") {
      ctx.addIssue({
        path: fieldPath,
        code: z.ZodIssueCode.custom,
        message: "Keterangan wajib diisi dengan tanda '-' jika Status Aktif.",
      });
    }
  } else if (isDeactivated) {
    const trimmed = keteranganRaw?.trim() ?? "";
    if (!trimmed || trimmed === "-") {
      ctx.addIssue({
        path: fieldPath,
        code: z.ZodIssueCode.custom,
        message:
          "Keterangan wajib diisi dengan alasan jika Status bukan Aktif.",
      });
    }
  }
}

function applyConditionalTugas(
  data: WajibKhidmahMemberShape,
  ctx: z.RefinementCtx,
  fieldPath: string[],
): void {
  const pos = data.posWajibKhidmah ?? "";
  const eligible = (TUGAS_POS_ELIGIBLE as readonly string[]).includes(pos);
  if (!eligible) return;

  const tugas = data.tugasKhidmah?.trim() ?? "";
  if (!tugas) {
    ctx.addIssue({
      path: fieldPath,
      code: z.ZodIssueCode.custom,
      message: "Tugas Khidmah wajib diisi untuk Pos terpilih.",
    });
  }
}

export const wajibKhidmahMemberSchema = baseShape
  .superRefine((data, ctx) =>
    applyConditionalKeterangan(data, ctx, ["keterangan"]),
  )
  .superRefine((data, ctx) => applyConditionalTugas(data, ctx, ["tugasKhidmah"]));

export const createWajibKhidmahMemberSchema = wajibKhidmahMemberSchema;

export const updateWajibKhidmahMemberSchema = baseShape
  .partial()
  .superRefine((data, ctx) => {
    if (!("status" in data) || !("keterangan" in data)) {
      return;
    }
    applyConditionalKeterangan(
      data as WajibKhidmahMemberShape,
      ctx,
      ["keterangan"],
    );
  })
  .superRefine((data, ctx) => {
    if (!("posWajibKhidmah" in data) || !("tugasKhidmah" in data)) {
      return;
    }
    applyConditionalTugas(data as WajibKhidmahMemberShape, ctx, [
      "tugasKhidmah",
    ]);
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
