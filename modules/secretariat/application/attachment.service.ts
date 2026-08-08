import { prisma } from "@/modules/shared/infrastructure/prisma";
import { storage } from "@/modules/shared/infrastructure/storage";
import { SecretariatError } from "../domain/secretariat.errors";

export const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
]);

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
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new SecretariatError(
      "Jenis file tidak didukung. Gunakan PDF, DOC/DOCX, atau gambar.",
    );
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new SecretariatError("Ukuran file maksimal 2 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
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
