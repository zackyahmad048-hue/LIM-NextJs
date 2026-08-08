import { NextRequest, NextResponse } from "next/server";

import {
  getMediaByFileId,
  getOutgoingMailByVerificationCode,
} from "@/modules/secretariat/queries/secretariat.query";
import { extractFileIdFromMediaUrl } from "@/modules/secretariat/application/drive-archive.service";
import { driveStorage, storage } from "@/modules/shared/infrastructure/storage";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ kode: string[] }> },
) {
  const { kode: kodeSegments } = await context.params;
  const kode = decodeURIComponent(kodeSegments.join("/"));
  const letter = await getOutgoingMailByVerificationCode(kode);

  const fileId = letter?.attachmentUrl
    ? extractFileIdFromMediaUrl(letter.attachmentUrl)
    : null;
  if (!letter || !fileId) {
    return NextResponse.json(
      { success: false, message: "Surat tidak ditemukan." },
      { status: 404 },
    );
  }

  const media = await getMediaByFileId(fileId);
  const mimeType = media?.mimeType ?? "application/pdf";
  const isDrive = media?.storageProvider === "GOOGLE_DRIVE";

  try {
    const buffer = isDrive
      ? await driveStorage.read(media.storageKey ?? fileId)
      : await storage.read(fileId);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "public, max-age=3600, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "File tidak ditemukan." },
      { status: 404 },
    );
  }
}
