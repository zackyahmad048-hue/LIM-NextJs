import { getGoogleClients, withGoogleRetry } from "./client";
import { GoogleApiError } from "./errors";

export interface SheetSchema {
  spreadsheetId: string;
  tab: string;
  headers: string[];
}

function columnLetter(index: number): string {
  let letter = "";
  let i = index + 1;
  while (i > 0) {
    const rem = (i - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    i = Math.floor((i - 1) / 26);
  }
  return letter;
}



export async function ensureSheetTab(
  spreadsheetId: string,
  tab: string,
): Promise<void> {
  if (!spreadsheetId) {
    throw new GoogleApiError(
      "UNAUTHENTICATED",
      "Google Spreadsheet ID belum dikonfigurasi.",
    );
  }
  const { sheets } = getGoogleClients();
  const meta = await withGoogleRetry(() =>
    sheets.spreadsheets.get({ spreadsheetId }),
  );
  const exists = meta.data.sheets?.some(
    (sheet) => sheet.properties?.title === tab,
  );
  if (exists) return;

  await withGoogleRetry(() =>
    sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: tab } } }],
      },
    }),
  );
}

export async function overwriteSheetValues(
  schema: SheetSchema,
  data: Record<string, string>[],
): Promise<void> {
  const { sheets } = getGoogleClients();
  const rows = [
    schema.headers,
    ...data.map((record) =>
      schema.headers.map((header) => record[header] ?? ""),
    ),
  ];

  await withGoogleRetry(() =>
    sheets.spreadsheets.values.clear({
      spreadsheetId: schema.spreadsheetId,
      range: schema.tab,
    }),
  );
  if (rows.length === 0) return;

  const lastColumn = columnLetter(schema.headers.length - 1);
  await withGoogleRetry(() =>
    sheets.spreadsheets.values.update({
      spreadsheetId: schema.spreadsheetId,
      range: `${schema.tab}!A1:${lastColumn}${rows.length}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: rows },
    }),
  );
}



