import { NextRequest, NextResponse } from "next/server";

import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import { requireSession } from "@/modules/shared/infrastructure/require-session";
import { driveStorage, storage } from "@/modules/shared/infrastructure/storage";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ fileId: string }> },
) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  const { fileId } = await context.params;

  try {
    const payload = await getPayloadClient();
    const mediaRes = await payload.find({
      collection: "media",
      where: { fileId: { equals: fileId } },
      limit: 1,
      depth: 0,
    });
    const media = mediaRes.docs[0];
    const isDrive = media?.storageProvider === "GOOGLE_DRIVE";
    const mime =
      request.nextUrl.searchParams.get("mime") ??
      media?.mimeType ??
      "application/octet-stream";

    const buffer = isDrive
      ? await driveStorage.read(media.storageKey ?? fileId)
      : await storage.read(fileId);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mime,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "private, max-age=3600",
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
