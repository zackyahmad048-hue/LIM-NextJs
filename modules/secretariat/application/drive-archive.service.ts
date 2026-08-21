import { prisma } from "@/modules/shared/infrastructure/prisma";
import { driveStorage, storage } from "@/modules/shared/infrastructure/storage";
import {
  getDriveConnection,
  GoogleDriveStorage,
} from "@/modules/shared/infrastructure/storage/google-drive.storage";
import type { OutgoingMailEntity } from "../domain/entities";

export function extractFileIdFromMediaUrl(url: string): string | null {
  const match = url.match(/\/api\/media\/([^?]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export function extractMimeFromMediaUrl(url: string): string | null {
  const match = url.match(/[?&]mime=([^&]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

/**
 * Memindahkan lampiran surat yang telah diarsipkan ke Google Drive
 * (jika sudah terhubung). File dihapus dari Vercel Blob agar kuota
 * tetap longgar, dan web tetap bisa menyajikan file lewat Media.
 */
export async function archiveOutgoingMailFile(
  mail: OutgoingMailEntity,
): Promise<void> {
  if (!mail.attachmentUrl) return;

  const connection = await getDriveConnection();
  if (!connection) return;

  const fileId = extractFileIdFromMediaUrl(mail.attachmentUrl);
  if (!fileId) return;

  const media = await prisma.media.findUnique({ where: { fileId } });
  if (!media) return;
  if (media.storageProvider === "GOOGLE_DRIVE") return;

  try {
    const buffer = await storage.read(fileId);
    const driveFileId = await (driveStorage as GoogleDriveStorage).save(
      buffer,
      media.originalName,
      media.mimeType,
      connection,
    );

    await storage.remove(fileId);
    await prisma.media.update({
      where: { id: media.id },
      data: {
        storageProvider: "GOOGLE_DRIVE",
        storageKey: driveFileId,
      },
    });
  } catch {
    // Arsip Drive bersifat best-effort; surat tetap diarsipkan di sistem.
    return;
  }
}
