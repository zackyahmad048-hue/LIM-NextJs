import { prisma } from "@/modules/shared/infrastructure/prisma";
import { storage } from "@/modules/shared/infrastructure/storage";
import { SecretariatError } from "../domain/secretariat.errors";

export const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;

const PDF_MAGIC = Buffer.from("%PDF-", "latin1");

export interface UploadedAttachment {
  fileId: string;
  attachmentUrl: string;
  originalName: string;
  size: number;
}

export type AttachmentFolder =
  "surat-masuk" | "surat-keluar" | "dokumen-administrasi";

/**
 * Mengunggah dokumen lampiran ke Vercel Blob dan mencatatnya di tabel
 * Media. Batas ukuran 2 MB. `folder` menentukan pengelompokan media.
 */
export async function uploadSecretariatAttachmentFile(
  file: File,
  uploadedById: string,
  folder: AttachmentFolder,
): Promise<UploadedAttachment> {
  if (!file || file.size === 0) {
    throw new SecretariatError("Pilih dokumen untuk diunggah.");
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new SecretariatError("Ukuran file maksimal 2 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const isPdf =
    file.type === "application/pdf" &&
    buffer.subarray(0, PDF_MAGIC.length).equals(PDF_MAGIC);
  if (!isPdf) {
    throw new SecretariatError("Hanya file PDF yang diperbolehkan.");
  }

  const fileId = await storage.save(buffer, file.name, file.type);

  const media = await prisma.media.create({
    data: {
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      fileId,
      access: "PRIVATE",
      folder,
      storageProvider: "BLOB",
      storageKey: fileId,
      uploadedById,
    },
    select: { fileId: true, originalName: true, size: true },
  });

  return {
    fileId: media.fileId,
    attachmentUrl: `/api/media/${encodeURIComponent(media.fileId)}`,
    originalName: media.originalName,
    size: media.size,
  };
}
