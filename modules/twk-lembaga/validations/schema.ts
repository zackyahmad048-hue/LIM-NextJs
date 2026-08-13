import { z } from "zod";

import {
  BAHASA_PENGANTAR_OPTIONS,
  KITAB_BERMAKNA_OPTIONS,
  LOKASI_MADRASAH,
  SATUAN_PENDIDIKAN,
  STATUS_PEMOHON,
  type WajibKhidmahSatuanPendidikan,
  type WajibKhidmahStatusPemohon,
} from "../domain/entities";

const optionalText = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal(""));

const optionalNumber = z
  .union([z.number().int().min(0), z.literal("")])
  .optional();

const statusPemohonEnum = z.enum(STATUS_PEMOHON, {
  message: "Status pemohon tidak valid.",
});

const optionalStatusPemohon = z
  .union([statusPemohonEnum, z.literal(""), z.undefined()])
  .optional();

const optionalLokasi = z
  .union([
    z.enum(LOKASI_MADRASAH, { message: "Lokasi madrasah tidak valid." }),
    z.literal(""),
    z.undefined(),
  ])
  .optional();

const optionalSatuan = z
  .union([
    z.enum(SATUAN_PENDIDIKAN, {
      message: "Jenis satuan pendidikan tidak valid.",
    }),
    z.literal(""),
    z.undefined(),
  ])
  .optional();

function applyConditionalStatus(
  data: Record<string, unknown>,
  ctx: z.RefinementCtx,
  prefix: "pengasuh" | "penanggungJawab",
): void {
  const label = prefix === "pengasuh" ? "Pengasuh" : "Penanggung Jawab";
  const status = data[`${prefix}Status`] as
    WajibKhidmahStatusPemohon | "" | undefined;
  const statusLainnya = data[`${prefix}StatusLainnya`] as string | undefined;
  const alumniAngkatan = data[`${prefix}AlumniAngkatan`] as string | undefined;

  if (status === "LAINNYA" && !statusLainnya?.trim()) {
    ctx.addIssue({
      path: [`${prefix}StatusLainnya`],
      code: z.ZodIssueCode.custom,
      message: `Status ${label} wajib diisi ketika memilih "Yang Lain".`,
    });
  }

  if (status === "ALUMNI_LIRBOYO" && !alumniAngkatan?.trim()) {
    ctx.addIssue({
      path: [`${prefix}AlumniAngkatan`],
      code: z.ZodIssueCode.custom,
      message: `Angkatan ${label} wajib diisi ketika memilih "Alumni Lirboyo".`,
    });
  }
}

export const wajibKhidmahLembagaSchema = z
  .object({
    namaLembagaPendidikan: z
      .string()
      .trim()
      .min(1, "Nama lembaga pendidikan wajib diisi.")
      .max(255, "Nama lembaga pendidikan maksimal 255 karakter."),
    rtRw: optionalText(20, "RT/RW maksimal 20 karakter."),
    desaKelurahan: optionalText(100, "Desa/Kelurahan maksimal 100 karakter."),
    kecamatan: optionalText(100, "Kecamatan maksimal 100 karakter."),
    kabupatenKota: optionalText(100, "Kabupaten/Kota maksimal 100 karakter."),
    provinsi: optionalText(100, "Provinsi maksimal 100 karakter."),
    teleponLembaga: optionalText(30, "Telepon lembaga maksimal 30 karakter."),
    mediaSosialLembaga: optionalText(
      255,
      "Akun media sosial maksimal 255 karakter.",
    ),

    pengasuhNama: optionalText(255, "Nama pengasuh maksimal 255 karakter."),
    pengasuhStatus: optionalStatusPemohon,
    pengasuhStatusLainnya: optionalText(
      100,
      "Status lainnya maksimal 100 karakter.",
    ),
    pengasuhAlumniAngkatan: optionalText(30, "Angkatan maksimal 30 karakter."),
    pengasuhTelepon: optionalText(30, "Nomor telepon maksimal 30 karakter."),
    pengasuhFotoFileId: optionalText(500, "Foto maksimal 500 karakter."),

    penanggungJawabNama: optionalText(
      255,
      "Nama penanggung jawab maksimal 255 karakter.",
    ),
    penanggungJawabStatus: optionalStatusPemohon,
    penanggungJawabStatusLainnya: optionalText(
      100,
      "Status lainnya maksimal 100 karakter.",
    ),
    penanggungJawabAlumniAngkatan: optionalText(
      30,
      "Angkatan maksimal 30 karakter.",
    ),
    penanggungJawabTelepon: optionalText(
      30,
      "Nomor telepon maksimal 30 karakter.",
    ),
    penanggungJawabFotoFileId: optionalText(500, "Foto maksimal 500 karakter."),

    lokasiMadrasah: optionalLokasi,
    jenisSatuanPendidikan: optionalSatuan,
    jenisSatuanPendidikanLainnya: optionalText(
      100,
      "Jenis satuan pendidikan lainnya maksimal 100 karakter.",
    ),
    kitabBermakna: z
      .array(
        z.enum(KITAB_BERMAKNA_OPTIONS, {
          message: "Kitab bermakna tidak valid.",
        }),
      )
      .optional(),
    kitabBermaknaLainnya: optionalText(
      255,
      "Kitab bermakna lainnya maksimal 255 karakter.",
    ),
    bahasaPengantar: z
      .array(
        z.enum(BAHASA_PENGANTAR_OPTIONS, {
          message: "Bahasa pengantar tidak valid.",
        }),
      )
      .optional(),
    bahasaPengantarLainnya: optionalText(
      255,
      "Bahasa pengantar lainnya maksimal 255 karakter.",
    ),
    jumlahPengurusPutra: optionalNumber,
    jumlahPengurusPutri: optionalNumber,
    jumlahSantriPutra: optionalNumber,
    jumlahSantriPutri: optionalNumber,

    jumlahGuruBantuDimohon: z
      .union([z.literal(1), z.literal(2), z.literal("")])
      .optional(),
    tugasGuruBantu: optionalText(
      255,
      "Tugas guru bantu maksimal 255 karakter.",
    ),
    kitabDiajarkanGuruBantu: optionalText(
      255,
      "Kitab yang diajarkan maksimal 255 karakter.",
    ),
    catatanCalonGuruBantu: optionalText(
      2000,
      "Catatan maksimal 2000 karakter.",
    ),
    dokumenPermohonanFileId: optionalText(
      500,
      "Dokumen permohonan maksimal 500 karakter.",
    ),
  })
  .superRefine((data, ctx) => applyConditionalStatus(data, ctx, "pengasuh"))
  .superRefine((data, ctx) =>
    applyConditionalStatus(data, ctx, "penanggungJawab"),
  )
  .superRefine((data, ctx) => {
    const jenis = data.jenisSatuanPendidikan as
      WajibKhidmahSatuanPendidikan | "" | undefined;
    if (jenis === "LAINNYA" && !data.jenisSatuanPendidikanLainnya?.trim()) {
      ctx.addIssue({
        path: ["jenisSatuanPendidikanLainnya"],
        code: z.ZodIssueCode.custom,
        message: "Jenis satuan pendidikan lainnya wajib diisi.",
      });
    }
  })
  .superRefine((data, ctx) => {
    const kitab = data.kitabBermakna ?? [];
    if (kitab.includes("Lainnya") && !data.kitabBermaknaLainnya?.trim()) {
      ctx.addIssue({
        path: ["kitabBermaknaLainnya"],
        code: z.ZodIssueCode.custom,
        message: "Kitab bermakna lainnya wajib diisi.",
      });
    }
  })
  .superRefine((data, ctx) => {
    const bahasa = data.bahasaPengantar ?? [];
    if (bahasa.includes("Lainnya") && !data.bahasaPengantarLainnya?.trim()) {
      ctx.addIssue({
        path: ["bahasaPengantarLainnya"],
        code: z.ZodIssueCode.custom,
        message: "Bahasa pengantar lainnya wajib diisi.",
      });
    }
  })
  .superRefine((data, ctx) => {
    if (
      data.jumlahGuruBantuDimohon === "" ||
      data.jumlahGuruBantuDimohon === undefined
    ) {
      ctx.addIssue({
        path: ["jumlahGuruBantuDimohon"],
        code: z.ZodIssueCode.custom,
        message: "Jumlah guru bantu yang dimohon wajib diisi (1 atau 2).",
      });
    }
  });

export type WajibKhidmahLembagaInput = z.infer<
  typeof wajibKhidmahLembagaSchema
>;

export function toEnum<T extends string>(
  value: T | "" | undefined,
): T | null | undefined {
  if (value === undefined) return undefined;
  if (value === "") return null;
  return value;
}

export function toNumberOrNull(
  value: number | "" | undefined,
): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === "") return null;
  return value;
}

export function toGuruBantuCount(value: 1 | 2 | "" | undefined): number {
  return typeof value === "number" ? value : 1;
}
