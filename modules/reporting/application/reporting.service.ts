import { googleConfig } from "@/modules/shared/infrastructure/google/config";
import {
  ensureSheetTab,
  overwriteSheetValues,
  type SheetSchema,
} from "@/modules/shared/infrastructure/google/spreadsheet";
import {
  getFalakProjectionData,
  getSecretariatProjectionData,
  type ReportRow,
} from "../infrastructure/report.repository";

const SUMMARY_TAB = "Ringkasan";
const SUMMARY_HEADERS = ["kode", "indikator", "nilai", "diperbarui"];

async function writeSummary(
  spreadsheetId: string | null,
  rows: ReportRow[],
): Promise<boolean> {
  if (!spreadsheetId) return false;
  const schema: SheetSchema = {
    spreadsheetId,
    tab: SUMMARY_TAB,
    headers: SUMMARY_HEADERS,
  };
  await ensureSheetTab(spreadsheetId, SUMMARY_TAB);
  await overwriteSheetValues(
    schema,
    rows as unknown as Record<string, string>[],
  );
  return true;
}

export interface SyncReportingResult {
  synced: string[];
}

export async function syncReporting(): Promise<SyncReportingResult> {
  const synced: string[] = [];

  if (googleConfig.spreadsheetPendataanId) {
    const rows = await getSecretariatProjectionData();
    await writeSummary(googleConfig.spreadsheetPendataanId, rows);
    synced.push("sekretariat");
  }

  if (googleConfig.spreadsheetFalakId) {
    const rows = await getFalakProjectionData();
    await writeSummary(googleConfig.spreadsheetFalakId, rows);
    synced.push("falak");
  }

  if (synced.length === 0) {
    throw new Error(
      "Reporting belum dikonfigurasi. Set GOOGLE_SPREADSHEET_PENDATAAN_ID / GOOGLE_SPREADSHEET_FALAK_ID di .env.",
    );
  }

  return { synced };
}
