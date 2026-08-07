import { NextRequest, NextResponse } from "next/server";

import {
  isImageMime,
  isPdfMime,
} from "@/modules/secretariat/application/verified-letter.service";
import { getVerifiedLetterByCode } from "@/modules/secretariat/queries/secretariat.query";
import { storage } from "@/modules/shared/infrastructure/storage";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ kode: string }> },
) {
  const { kode } = await context.params;
  const letter = await getVerifiedLetterByCode(kode);

  const fileId = letter?.processedFileId ?? letter?.originalFileId;
  if (!letter || !fileId) {
    return NextResponse.json(
      { success: false, message: "Surat tidak ditemukan." },
      { status: 404 },
    );
  }

  let mime = "application/pdf";
  if (isPdfMime(letter.mimeType)) {
    mime = "application/pdf";
  } else if (isImageMime(letter.mimeType)) {
    mime = letter.mimeType.includes("jpeg") ? "image/jpeg" : "image/png";
  }

  try {
    const buffer = await storage.read(fileId);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mime,
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
