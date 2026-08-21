import { NextResponse } from "next/server";

import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import {
  getDriveAuthUrl,
  GoogleDriveNotConfiguredError,
} from "@/modules/shared/infrastructure/storage/google-drive.storage";

export async function GET() {
  await requireSessionWithPermissions(["secretariat.view"]);

  try {
    return NextResponse.redirect(getDriveAuthUrl());
  } catch (error) {
    const message =
      error instanceof GoogleDriveNotConfiguredError
        ? error.message
        : "Gagal memulai koneksi Google Drive.";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
