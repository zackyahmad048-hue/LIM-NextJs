import { NextRequest, NextResponse } from "next/server";

import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import { driveStorage, storage } from "@/modules/shared/infrastructure/storage";
import { findFiducialPositions } from "@/modules/secretariat/application/fiducial.service";
import { renderPdfPagesForEditor } from "@/modules/secretariat/application/qr-editor.service";

const PERMISSION_OUTGOING_UPDATE = ["secretariat.outgoing-mail.update"];

export async function GET(request: NextRequest) {
  try {
    await requireSessionWithPermissions(PERMISSION_OUTGOING_UPDATE);
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  const fileId = request.nextUrl.searchParams.get("fileId");
  if (!fileId) {
    return NextResponse.json(
      { success: false, message: "fileId wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const media = await prisma.media.findUnique({ where: { fileId } });
    if (!media || media.mimeType !== "application/pdf") {
      return NextResponse.json(
        { success: false, message: "Dokumen tidak ditemukan." },
        { status: 404 },
      );
    }

    const buffer =
      media.storageProvider === "GOOGLE_DRIVE"
        ? await driveStorage.read(media.storageKey ?? fileId)
        : await storage.read(fileId);

    const pages = await renderPdfPagesForEditor(buffer);
    const detect = request.nextUrl.searchParams.get("detect") === "1";
    const fiducial = detect ? await findFiducialPositions(buffer) : null;

    return NextResponse.json({
      success: true,
      pages: pages.map((page) => ({
        page: page.page,
        widthPt: page.widthPt,
        heightPt: page.heightPt,
        width: page.width,
        height: page.height,
        dataUrl: `data:image/png;base64,${page.png.toString("base64")}`,
      })),
      fiducial,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal merender dokumen." },
      { status: 500 },
    );
  }
}
