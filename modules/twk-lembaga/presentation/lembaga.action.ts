"use server";

import { revalidatePath } from "next/cache";

import { lembagaService } from "../application/lembaga.service";
import { uploadLembagaFile } from "../application/upload.service";
import { LembagaValidationError } from "../domain/lembaga.errors";
import { wajibKhidmahLembagaSchema } from "../validations/schema";

const LEMBAGA_PATH = "/admin/twk/lembaga";

function readString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (value === null) return undefined;
  const trimmed = String(value).trim();
  return trimmed ? trimmed : undefined;
}

function readNumber(formData: FormData, key: string): number | "" | undefined {
  const raw = readString(formData, key);
  if (raw === undefined) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : "";
}

function readEnum<T extends string>(
  formData: FormData,
  key: string,
): T | "" | undefined {
  const raw = readString(formData, key);
  if (raw === undefined) return undefined;
  return raw as T | "" | undefined;
}

function readStringArray(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .map((value) => String(value).trim())
    .filter((value) => value.length > 0);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return "Sesi tidak valid. Silakan login kembali.";
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return "Anda tidak memiliki izin untuk melakukan aksi ini.";
  }
  if (error instanceof LembagaValidationError) {
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan.";
}

function buildPayload(formData: FormData): Record<string, unknown> {
  return {
    namaLembagaPendidikan: formData.get("namaLembagaPendidikan") ?? "",
    rtRw: readString(formData, "rtRw"),
    desaKelurahan: readString(formData, "desaKelurahan"),
    kecamatan: readString(formData, "kecamatan"),
    kabupatenKota: readString(formData, "kabupatenKota"),
    provinsi: readString(formData, "provinsi"),
    teleponLembaga: readString(formData, "teleponLembaga"),
    mediaSosialLembaga: readString(formData, "mediaSosialLembaga"),

    pengasuhNama: readString(formData, "pengasuhNama"),
    pengasuhStatus: readEnum(formData, "pengasuhStatus"),
    pengasuhStatusLainnya: readString(formData, "pengasuhStatusLainnya"),
    pengasuhAlumniAngkatan: readString(formData, "pengasuhAlumniAngkatan"),
    pengasuhTelepon: readString(formData, "pengasuhTelepon"),
    pengasuhFotoFileId: readString(formData, "pengasuhFotoFileId"),

    penanggungJawabNama: readString(formData, "penanggungJawabNama"),
    penanggungJawabStatus: readEnum(formData, "penanggungJawabStatus"),
    penanggungJawabStatusLainnya: readString(
      formData,
      "penanggungJawabStatusLainnya",
    ),
    penanggungJawabAlumniAngkatan: readString(
      formData,
      "penanggungJawabAlumniAngkatan",
    ),
    penanggungJawabTelepon: readString(formData, "penanggungJawabTelepon"),
    penanggungJawabFotoFileId: readString(
      formData,
      "penanggungJawabFotoFileId",
    ),

    lokasiMadrasah: readEnum(formData, "lokasiMadrasah"),
    jenisSatuanPendidikan: readStringArray(formData, "jenisSatuanPendidikan"),
    jenisSatuanPendidikanLainnya: readString(
      formData,
      "jenisSatuanPendidikanLainnya",
    ),
    kitabBermakna: readStringArray(formData, "kitabBermakna"),
    kitabBermaknaLainnya: readString(formData, "kitabBermaknaLainnya"),
    bahasaPengantar: readStringArray(formData, "bahasaPengantar"),
    bahasaPengantarLainnya: readString(formData, "bahasaPengantarLainnya"),
    jumlahPengurusPutra: readNumber(formData, "jumlahPengurusPutra"),
    jumlahPengurusPutri: readNumber(formData, "jumlahPengurusPutri"),
    jumlahSantriPutra: readNumber(formData, "jumlahSantriPutra"),
    jumlahSantriPutri: readNumber(formData, "jumlahSantriPutri"),

    jumlahGuruBantuDimohon: readNumber(formData, "jumlahGuruBantuDimohon"),
    tugasGuruBantu: readString(formData, "tugasGuruBantu"),
    kitabDiajarkanGuruBantu: readString(formData, "kitabDiajarkanGuruBantu"),
    catatanCalonGuruBantu: readString(formData, "catatanCalonGuruBantu"),
    dokumenPermohonanFileId: readString(formData, "dokumenPermohonanFileId"),
  };
}

export async function createWajibKhidmahLembaga(
  prevState: { success: boolean; message?: string } | null,
  formData: FormData,
) {
  try {
    const parsed = wajibKhidmahLembagaSchema.safeParse(buildPayload(formData));
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return {
        success: false as const,
        message: first ? first.message : "Periksa kembali isian form.",
      };
    }

    await lembagaService.create(parsed.data);

    revalidatePath(LEMBAGA_PATH);
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      message: getErrorMessage(error),
    };
  }
}

export type CreateLembagaResult = Awaited<
  ReturnType<typeof createWajibKhidmahLembaga>
>;

export type UploadLembagaFileResult =
  | {
      success: true;
      fileId: string;
      url: string;
      originalName: string;
      size: number;
    }
  | { success: false; message: string };

export async function uploadLembagaFoto(
  formData: FormData,
): Promise<UploadLembagaFileResult> {
  return uploadPublicLembagaFile(formData, "foto");
}

export async function uploadLembagaDokumen(
  formData: FormData,
): Promise<UploadLembagaFileResult> {
  return uploadPublicLembagaFile(formData, "dokumen");
}

async function uploadPublicLembagaFile(
  formData: FormData,
  kind: "foto" | "dokumen",
): Promise<UploadLembagaFileResult> {
  try {
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return { success: false, message: "Pilih berkas untuk diunggah." };
    }

    const uploaded = await uploadLembagaFile(file, null, kind);
    return {
      success: true,
      fileId: uploaded.fileId,
      url: uploaded.attachmentUrl,
      originalName: uploaded.originalName,
      size: uploaded.size,
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export type { UploadedLembagaFile } from "../application/upload.service";
