"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/modules/shared/infrastructure/require-session";
import { parseCsv } from "../application/service";
import { twkService } from "../application/twk.service";
import { MemberNotFoundError } from "../domain/twk.errors";
import {
  createWajibKhidmahMemberSchema,
  updateWajibKhidmahMemberSchema,
} from "../validations/schema";

const TWK_PATH = "/admin/twk";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return "Sesi tidak valid. Silakan login kembali.";
  }
  if (error instanceof MemberNotFoundError) {
    return error.message;
  }
  return error instanceof Error ? error.message : "Terjadi kesalahan.";
}

export async function createWajibKhidmahMember(formData: FormData) {
  try {
    await requireSession();

    const parsed = createWajibKhidmahMemberSchema.parse({
      nama: formData.get("nama"),
      alamat: formData.get("alamat") || undefined,
      kelas: formData.get("kelas") || undefined,
      posWajibKhidmah: formData.get("posWajibKhidmah") || undefined,
      tempatWajibKhidmah: formData.get("tempatWajibKhidmah") || undefined,
    });

    await twkService.create(parsed);

    revalidatePath(TWK_PATH);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

export async function updateWajibKhidmahMember(
  id: string,
  formData: FormData,
) {
  try {
    await requireSession();

    const parsed = updateWajibKhidmahMemberSchema.parse({
      nama: formData.get("nama"),
      alamat: formData.get("alamat") ?? undefined,
      kelas: formData.get("kelas") ?? undefined,
      posWajibKhidmah: formData.get("posWajibKhidmah") ?? undefined,
      tempatWajibKhidmah: formData.get("tempatWajibKhidmah") ?? undefined,
    });

    await twkService.update(id, parsed);

    revalidatePath(TWK_PATH);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

export async function deleteWajibKhidmahMember(id: string) {
  try {
    await requireSession();

    await twkService.delete(id);

    revalidatePath(TWK_PATH);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

export async function importWajibKhidmahMembers(csvText: string) {
  try {
    await requireSession();

    const members = parseCsv(csvText);
    if (members.length === 0) {
      return {
        ok: false,
        message:
          "Tidak ada data valid yang ditemukan. Pastikan baris pertama berisi kolom nama.",
      };
    }

    await twkService.createMany(members);

    revalidatePath(TWK_PATH);
    return { ok: true, imported: members.length };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

function extractGoogleSheetUrl(input: string): string | null {
  const trimmed = input.trim();
  const match = trimmed.match(
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)(?:\/edit)?(?:\?.*gid=(\d+))?/,
  );
  if (!match) return null;

  const id = match[1];
  const gid = match[2];

  return gid
    ? `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`
    : `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
}

export async function importWajibKhidmahFromGoogleSheet(url: string) {
  try {
    await requireSession();

    const exportUrl = extractGoogleSheetUrl(url);
    if (!exportUrl) {
      return {
        ok: false,
        message:
          "URL Google Sheet tidak valid. Gunakan tautan berbagi dokumen.",
      };
    }

    const response = await fetch(exportUrl, { cache: "no-store" });
    if (!response.ok) {
      return {
        ok: false,
        message: "Gagal mengambil data dari Google Sheet.",
      };
    }

    const csvText = await response.text();
    const members = parseCsv(csvText);
    if (members.length === 0) {
      return {
        ok: false,
        message:
          "Tidak ada data valid yang ditemukan. Pastikan sheet memiliki kolom nama.",
      };
    }

    await twkService.createMany(members);

    revalidatePath(TWK_PATH);
    return { ok: true, imported: members.length };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}
