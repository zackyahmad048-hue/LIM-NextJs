"use server";

import { revalidatePath } from "next/cache";

import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { parseCsv } from "../application/service";
import { twkService } from "../application/twk.service";
import { DEACTIVATED_STATUSES } from "../domain/entities";
import type { WajibKhidmahStatus } from "../domain/entities";
import { MemberNotFoundError } from "../domain/twk.errors";
import {
  createWajibKhidmahMemberSchema,
  updateWajibKhidmahMemberSchema,
} from "../validations/schema";

const TWK_PATH = "/admin/twk";

const PERMISSION_CREATE = ["twk.member.create"];
const PERMISSION_UPDATE = ["twk.member.update"];
const PERMISSION_DELETE = ["twk.member.delete"];
const PERMISSION_IMPORT = ["twk.member.import"];

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return "Sesi tidak valid. Silakan login kembali.";
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return "Anda tidak memiliki izin untuk melakukan aksi ini.";
  }
  if (error instanceof MemberNotFoundError) {
    return error.message;
  }
  return error instanceof Error ? error.message : "Terjadi kesalahan.";
}

function readString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (value === null) return undefined;
  const trimmed = String(value).trim();
  return trimmed ? trimmed : undefined;
}

function readStatus(formData: FormData): WajibKhidmahStatus | undefined {
  const raw = readString(formData, "status");
  if (!raw) return undefined;
  const normalized = raw.toUpperCase().replace(/[\s-]/g, "_");
  const valid = ["AKTIF", "GUGUR", "BEBAS_TUGAS", "QODLO"] as const;
  if ((valid as readonly string[]).includes(normalized)) {
    return normalized as WajibKhidmahStatus;
  }
  return undefined;
}

export async function createWajibKhidmahMember(formData: FormData) {
  try {
    await requireSessionWithPermissions(PERMISSION_CREATE);

    const status = readStatus(formData);
    const parsed = createWajibKhidmahMemberSchema.parse({
      nama: formData.get("nama") ?? "",
      asalDaerah: readString(formData, "asalDaerah"),
      alamatLembaga: readString(formData, "alamatLembaga"),
      posWajibKhidmah: readString(formData, "posWajibKhidmah"),
      tempatWajibKhidmah: readString(formData, "tempatWajibKhidmah"),
      tugasKhidmah: readString(formData, "tugasKhidmah"),
      status: status ?? "AKTIF",
      keterangan: readString(formData, "keterangan"),
      catatan: readString(formData, "catatan"),
      absensi: readString(formData, "absensi"),
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
    await requireSessionWithPermissions(PERMISSION_UPDATE);

    const data: Record<string, unknown> = {};

    const nama = readString(formData, "nama");
    if (nama !== undefined) data.nama = nama;

    const asalDaerah = readString(formData, "asalDaerah");
    if (asalDaerah !== undefined) data.asalDaerah = asalDaerah;

    const alamatLembaga = readString(formData, "alamatLembaga");
    if (alamatLembaga !== undefined) data.alamatLembaga = alamatLembaga;

    const posWajibKhidmah = readString(formData, "posWajibKhidmah");
    if (posWajibKhidmah !== undefined) data.posWajibKhidmah = posWajibKhidmah;

    const tempatWajibKhidmah = readString(formData, "tempatWajibKhidmah");
    if (tempatWajibKhidmah !== undefined)
      data.tempatWajibKhidmah = tempatWajibKhidmah;

    const tugasKhidmah = readString(formData, "tugasKhidmah");
    if (tugasKhidmah !== undefined) data.tugasKhidmah = tugasKhidmah;

    const status = readStatus(formData);
    if (status !== undefined) data.status = status;

    const keterangan = readString(formData, "keterangan");
    if (keterangan !== undefined) data.keterangan = keterangan;

    const catatan = readString(formData, "catatan");
    if (catatan !== undefined) data.catatan = catatan;

    const absensi = readString(formData, "absensi");
    if (absensi !== undefined) data.absensi = absensi;

    if (Object.keys(data).length === 0) {
      return {
        ok: false,
        message: "Minimal satu kolom harus diisi untuk pembaruan.",
      };
    }

    const parsed = updateWajibKhidmahMemberSchema.parse(data);

    await twkService.update(id, parsed);

    revalidatePath(TWK_PATH);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

export async function deleteWajibKhidmahMember(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_DELETE);

    await twkService.delete(id);

    revalidatePath(TWK_PATH);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

export async function deactivateWajibKhidmahMember(formData: FormData) {
  try {
    await requireSessionWithPermissions(PERMISSION_UPDATE);

    const id = String(formData.get("id") ?? "").trim();
    if (!id) {
      return { ok: false, message: "ID anggota tidak ditemukan." };
    }

    const statusRaw = String(formData.get("status") ?? "").trim();
    const normalized = statusRaw.toUpperCase().replace(/[\s-]/g, "_");
    if (!(DEACTIVATED_STATUSES as readonly string[]).includes(normalized)) {
      return {
        ok: false,
        message: `Status non-aktif tidak valid. Pilih: ${DEACTIVATED_STATUSES.join(", ")}.`,
      };
    }

    const reason = String(formData.get("reason") ?? "").trim();
    if (!reason) {
      return {
        ok: false,
        message: "Alasan penonaktifan wajib diisi.",
      };
    }

    await twkService.deactivate(
      id,
      normalized as WajibKhidmahStatus,
      reason,
    );

    revalidatePath(TWK_PATH);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

export async function reactivateWajibKhidmahMember(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_UPDATE);

    await twkService.reactivate(id);

    revalidatePath(TWK_PATH);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

export async function importWajibKhidmahMembers(csvText: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_IMPORT);

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
    await requireSessionWithPermissions(PERMISSION_IMPORT);

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
