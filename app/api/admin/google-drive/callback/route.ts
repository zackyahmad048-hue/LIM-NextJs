import { NextRequest, NextResponse } from "next/server";

import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import {
  exchangeDriveCode,
  saveDriveConnection,
} from "@/modules/shared/infrastructure/storage/google-drive.storage";

export async function GET(request: NextRequest) {
  await requireSessionWithPermissions(["secretariat.view"]);

  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      "/admin/secretariat/surat-menyurat?drive=error",
    );
  }

  try {
    const { email, refreshToken } = await exchangeDriveCode(code);
    if (!email || !refreshToken) {
      return NextResponse.redirect(
        "/admin/secretariat/surat-menyurat?drive=error",
      );
    }
    await saveDriveConnection(email, refreshToken);
    return NextResponse.redirect(
      "/admin/secretariat/surat-menyurat?drive=connected",
    );
  } catch {
    return NextResponse.redirect(
      "/admin/secretariat/surat-menyurat?drive=error",
    );
  }
}
