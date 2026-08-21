import { prisma } from "@/modules/shared/infrastructure/prisma";
import { storage } from "@/modules/shared/infrastructure/storage";
import { LembagaValidationError } from "../domain/lembaga.errors";

export const MAX_PHOTO_BYTES = 200 * 1024;
export const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;

const PDF_MAGIC = Buffer.from("%PDF-", "latin1");
const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export type LembagaUploadFolder = "lembaga-pemohon";

export type LembagaUploadKind = "foto" | "dokumen";

export interface UploadedLembagaFile {
  fileId: string;
  attachmentUrl: string;
  originalName: string;
  size: number;
}

async function validate(file: File, kind: LembagaUploadKind): Promise<Buffer> {
  if (!file || file.size === 0) {
    throw new LembagaValidationError("Pilih berkas untuk diunggah.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (kind === "dokumen") {
    if (file.size > MAX_DOCUMENT_BYTES) {
      throw new LembagaValidationError("Ukuran dokumen maksimal 5 MB.");
    }
    const isPdf =
      file.type === "application/pdf" &&
      buffer.subarray(0, PDF_MAGIC.length).equals(PDF_MAGIC);
    if (!isPdf) {
      throw new LembagaValidationError("Hanya file PDF yang diperbolehkan.");
    }
  } else {
    if (file.size > MAX_PHOTO_BYTES) {
      throw new LembagaValidationError("Ukuran foto maksimal 200 KB.");
    }
    if (!IMAGE_MIME_TYPES.has(file.type)) {
      throw new LembagaValidationError(
        "Hanya file gambar (JPG/PNG/WebP) yang diperbolehkan.",
      );
    }
  }

  return buffer;
}

export async function uploadLembagaFile(
  file: File,
  uploadedById: string | null,
  kind: LembagaUploadKind,
): Promise<UploadedLembagaFile> {
  const buffer = await validate(file, kind);

  const fileId = await storage.save(buffer, file.name, file.type);

  const media = await prisma.media.create({
    data: {
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      fileId,
      access: "PRIVATE",
      folder: "lembaga-pemohon",
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
