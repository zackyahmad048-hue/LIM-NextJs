"use server";

import { revalidatePath } from "next/cache";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import {
  createVerifiedLetter,
  deleteVerifiedLetter,
  UnsupportedFileTypeError,
} from "../application/verified-letter.service";
import { createVerifiedLetterSchema } from "../validations/schema";

const PERMISSION_LETTER_CREATE = ["secretariat.letter.create"];
const PERMISSION_LETTER_DELETE = ["secretariat.letter.delete"];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export interface VerifiedLetterActionResult {
  success?: boolean;
  error?: string;
}

export async function createVerifiedLetterAction(
  formData: FormData,
): Promise<VerifiedLetterActionResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "File surat wajib diunggah." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Ukuran file maksimal 2 MB." };
  }

  const parsed = createVerifiedLetterSchema.safeParse({
    letterType: formData.get("letterType"),
    registrationNumber: formData.get("registrationNumber"),
    subject: formData.get("subject"),
    date: formData.get("date"),
    issuer: formData.get("issuer"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await requireSessionWithPermissions(PERMISSION_LETTER_CREATE);
  } catch {
    return { error: "Kamu tidak memiliki izin untuk membuat surat." };
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await createVerifiedLetter({
      fileBuffer,
      fileName: file.name,
      mimeType: file.type,
      letterType: parsed.data.letterType,
      registrationNumber: parsed.data.registrationNumber,
      subject: parsed.data.subject,
      date: new Date(parsed.data.date),
      issuer: parsed.data.issuer || null,
    });
    revalidatePath("/admin/secretariat/surat-menyurat");
    return { success: true };
  } catch (error) {
    console.error("[createVerifiedLetterAction]", error);
    if (error instanceof UnsupportedFileTypeError) {
      return { error: error.message };
    }
    return {
      error:
        "Gagal memproses surat. Pastikan file PDF/gambar valid dan penyimpanan file (Vercel Blob) terkonfigurasi.",
    };
  }
}

export async function deleteVerifiedLetterAction(
  id: string,
): Promise<VerifiedLetterActionResult> {
  try {
    await requireSessionWithPermissions(PERMISSION_LETTER_DELETE);
  } catch {
    return { error: "Kamu tidak memiliki izin untuk menghapus surat." };
  }

  try {
    await deleteVerifiedLetter(id);
    revalidatePath("/admin/secretariat/surat-menyurat");
    return { success: true };
  } catch (error) {
    console.error("[deleteVerifiedLetterAction]", error);
    return { error: "Gagal menghapus surat." };
  }
}
