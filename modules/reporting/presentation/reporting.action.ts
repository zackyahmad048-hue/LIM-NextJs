"use server";

import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { syncReporting } from "../application/reporting.service";

export async function syncReportingAction() {
  await requireSessionWithPermissions(["reports.sync"]);
  return syncReporting();
}
