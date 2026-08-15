import { z } from "zod";

import {
  BAHASA_PENGANTAR_OPTIONS,
  KITAB_BERMAKNA_OPTIONS,
  LOKASI_MADRASAH,
  SATUAN_PENDIDIKAN,
  STATUS_PEMOHON,
  type WajibKhidmahStatusPemohon,
} from "../domain/entities";

const optionalText = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal(""));

const requiredText = (
  max: number,
  requiredMessage: string,
  maxMessage: string,
) => z.string().trim().min(1, requiredMessage).max(max, maxMessage);

const requiredNumber = z
  .union([z.number().int().min(0), z.literal("")])
  .superRefine((value, ctx) => {
    if (value === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Jumlah wajib diisi.",
      });
    }
  });

const statusPemohonEnum = z.enum(STATUS_PEMOHON, {
  message: "Status pemohon tidak valid.",
});

const requiredStatusPemohon = z
  .union([statusPemohonEnum, z.literal("")])
  .superRefine((value, ctx) => {
    if (value === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Status wajib diisi.",
      });
    }
  });

const requiredLokasi = z
  .union([
    z.enum(LOKASI_MADRASAH, { message: "Lokasi madrasah tidak valid." }),
    z.literal(""),
  ])
  .superRefine((value, ctx) => {
    if (value === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Lokasi madrasah wajib diisi.",
      });
    }
  });

const satuanPendidikanEnum = z.enum(SATUAN_PENDIDIKAN, {
  message: "Jenis satuan pendidikan tidak valid.",
});

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
    rtRw: requiredText(20, "RT/RW wajib diisi.", "RT/RW maksimal 20 karakter."),
    desaKelurahan: requiredText(
      100,
      "Desa/Kelurahan wajib diisi.",
      "Desa/Kelurahan maksimal 100 karakter.",
    ),
    kecamatan: requiredText(
      100,
      "Kecamatan wajib diisi.",
      "Kecamatan maksimal 100 karakter.",
    ),
    kabupatenKota: requiredText(
      100,
      "Kabupaten/Kota wajib diisi.",
      "Kabupaten/Kota maksimal 100 karakter.",
    ),
    provinsi: requiredText(
      100,
      "Provinsi wajib diisi.",
      "Provinsi maksimal 100 karakter.",
    ),
    teleponLembaga: requiredText(
      30,
      "Nomor telepon lembaga wajib diisi.",
      "Telepon lembaga maksimal 30 karakter.",
    ),
    mediaSosialLembaga: optionalText(
      255,
      "Akun media sosial maksimal 255 karakter.",
    ),

    pengasuhNama: requiredText(
      255,
      "Nama pengasuh wajib diisi.",
      "Nama pengasuh maksimal 255 karakter.",
    ),
    pengasuhStatus: requiredStatusPemohon,
    pengasuhStatusLainnya: optionalText(
      100,
      "Status lainnya maksimal 100 karakter.",
    ),
    pengasuhAlumniAngkatan: optionalText(30, "Angkatan maksimal 30 karakter."),
    pengasuhTelepon: requiredText(
      30,
      "Nomor telepon pengasuh wajib diisi.",
      "Nomor telepon maksimal 30 karakter.",
    ),
    pengasuhFotoFileId: requiredText(
      500,
      "Foto pengasuh wajib diunggah.",
      "Foto maksimal 500 karakter.",
    ),

    penanggungJawabNama: requiredText(
      255,
      "Nama penanggung jawab wajib diisi.",
      "Nama penanggung jawab maksimal 255 karakter.",
    ),
    penanggungJawabStatus: requiredStatusPemohon,
    penanggungJawabStatusLainnya: optionalText(
      100,
      "Status lainnya maksimal 100 karakter.",
    ),
    penanggungJawabAlumniAngkatan: optionalText(
      30,
      "Angkatan maksimal 30 karakter.",
    ),
    penanggungJawabTelepon: requiredText(
      30,
      "Nomor telepon penanggung jawab wajib diisi.",
      "Nomor telepon maksimal 30 karakter.",
    ),
    penanggungJawabFotoFileId: requiredText(
      500,
      "Foto penanggung jawab wajib diunggah.",
      "Foto maksimal 500 karakter.",
    ),

    lokasiMadrasah: requiredLokasi,
    jenisSatuanPendidikan: z
      .array(satuanPendidikanEnum)
      .min(1, "Jenis satuan pendidikan wajib dipilih (minimal satu)."),
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
      .min(1, "Kitab bermakna wajib dipilih (minimal satu)."),
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
      .min(1, "Bahasa pengantar wajib dipilih (minimal satu)."),
    bahasaPengantarLainnya: optionalText(
      255,
      "Bahasa pengantar lainnya maksimal 255 karakter.",
    ),
    jumlahPengurusPutra: requiredNumber,
    jumlahPengurusPutri: requiredNumber,
    jumlahSantriPutra: requiredNumber,
    jumlahSantriPutri: requiredNumber,

    jumlahGuruBantuDimohon: z
      .union([z.literal(1), z.literal(2), z.literal("")])
      .optional(),
    tugasGuruBantu: requiredText(
      255,
      "Tugas yang diamanatkan wajib diisi.",
      "Tugas guru bantu maksimal 255 karakter.",
    ),
    kitabDiajarkanGuruBantu: requiredText(
      255,
      "Kitab yang akan diajarkan wajib diisi.",
      "Kitab yang diajarkan maksimal 255 karakter.",
    ),
    catatanCalonGuruBantu: requiredText(
      2000,
      "Catatan untuk calon guru bantu wajib diisi.",
      "Catatan maksimal 2000 karakter.",
    ),
    dokumenPermohonanFileId: requiredText(
      500,
      "Dokumen permohonan wajib diunggah.",
      "Dokumen permohonan maksimal 500 karakter.",
    ),
  })
  .superRefine((data, ctx) => applyConditionalStatus(data, ctx, "pengasuh"))
  .superRefine((data, ctx) =>
    applyConditionalStatus(data, ctx, "penanggungJawab"),
  )
  .superRefine((data, ctx) => {
    const jenis = data.jenisSatuanPendidikan ?? [];
    if (jenis.includes("LAINNYA") && !data.jenisSatuanPendidikanLainnya?.trim()) {
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
