import { NextResponse } from "next/server";

import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { deleteDriveConnection } from "@/modules/shared/infrastructure/storage/google-drive.storage";

export async function POST() {
  await requireSessionWithPermissions(["secretariat.view"]);
  await deleteDriveConnection();
  return NextResponse.json({ success: true });
}
