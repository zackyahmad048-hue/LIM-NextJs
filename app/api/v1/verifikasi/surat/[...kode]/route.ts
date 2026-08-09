import { NextRequest, NextResponse } from "next/server";

import {
  getMediaByFileId,
  getOutgoingMailByVerificationCode,
} from "@/modules/secretariat/queries/secretariat.query";
import { extractFileIdFromMediaUrl } from "@/modules/secretariat/application/drive-archive.service";
import {
  renderPdfPreview,
  renderImagePreview,
} from "@/modules/secretariat/application/preview.service";
import { driveStorage, storage } from "@/modules/shared/infrastructure/storage";

const PREVIEWABLE_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ kode: string[] }> },
) {
  const { kode: kodeSegments } = await context.params;
  const kode = decodeURIComponent(kodeSegments.join("/"));

  if (request.nextUrl.searchParams.get("preview") !== "1") {
    return NextResponse.json(
      { success: false, message: "Akses dokumen asli ditolak." },
      { status: 403 },
    );
  }

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

    let preview: Buffer;
    if (mimeType === "application/pdf") {
      preview = await renderPdfPreview(buffer);
    } else if (PREVIEWABLE_IMAGE_MIME.has(mimeType)) {
      preview = await renderImagePreview(buffer);
    } else {
      return NextResponse.json(
        { success: false, message: "Format dokumen tidak dapat ditampilkan." },
        { status: 415 },
      );
    }

    return new NextResponse(new Uint8Array(preview), {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(preview.byteLength),
        "Cache-Control": "public, s-maxage=86400, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "File tidak dapat diproses." },
      { status: 500 },
    );
  }
}
