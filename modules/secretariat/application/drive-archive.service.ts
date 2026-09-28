import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
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

  const payload = await getPayloadClient();
  const mediaRes = await payload.find({
    collection: "media",
    where: { fileId: { equals: fileId } },
    limit: 1,
    depth: 0,
  });
  const media = mediaRes.docs[0];
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
    await payload.update({
      collection: "media",
      id: Number(media.id),
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
