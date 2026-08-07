import { NextRequest, NextResponse } from "next/server";

import { requireSession } from "@/modules/shared/infrastructure/require-session";
import {
  driveStorage,
  storage,
} from "@/modules/shared/infrastructure/storage";
import { prisma } from "@/modules/shared/infrastructure/prisma";

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
  const mime =
    request.nextUrl.searchParams.get("mime") ?? "application/octet-stream";

  try {
    const media = await prisma.media.findUnique({ where: { fileId } });
    const isDrive = media?.storageProvider === "GOOGLE_DRIVE";

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
