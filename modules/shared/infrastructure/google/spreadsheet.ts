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

export async function readSheetValues(
  spreadsheetId: string,
  tab: string,
): Promise<string[][]> {
  if (!spreadsheetId) {
    throw new GoogleApiError(
      "UNAUTHENTICATED",
      "Google Spreadsheet ID belum dikonfigurasi.",
    );
  }
  const { sheets } = getGoogleClients();
  const res = await withGoogleRetry(() =>
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: tab,
    }),
  );
  return res.data.values ?? [];
}

export async function readRows(
  schema: SheetSchema,
): Promise<Record<string, string>[]> {
  const values = await readSheetValues(schema.spreadsheetId, schema.tab);
  if (values.length < 2) return [];

  const headers = values[0];
  return values.slice(1).map((row) => {
    const record: Record<string, string> = {};
    headers.forEach((header, i) => {
      record[header] = row[i] ?? "";
    });
    return record;
  });
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

export async function appendRow(
  schema: SheetSchema,
  data: Record<string, string>,
): Promise<void> {
  const { sheets } = getGoogleClients();
  const values = schema.headers.map((header) => data[header] ?? "");
  await withGoogleRetry(() =>
    sheets.spreadsheets.values.append({
      spreadsheetId: schema.spreadsheetId,
      range: `${schema.tab}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    }),
  );
}

export async function findRowIndexById(
  schema: SheetSchema,
  id: string,
): Promise<number | null> {
  const values = await readSheetValues(schema.spreadsheetId, schema.tab);
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) return i;
  }
  return null;
}

export async function updateRowById(
  schema: SheetSchema,
  id: string,
  data: Record<string, string>,
): Promise<void> {
  const rowIndex = await findRowIndexById(schema, id);
  if (rowIndex === null) {
    throw new GoogleApiError(
      "NOT_FOUND",
      `Data ${id} tidak ditemukan di tab ${schema.tab}.`,
    );
  }

  const { sheets } = getGoogleClients();
  const rowA1 = rowIndex + 2;
  const lastColumn = columnLetter(schema.headers.length - 1);
  const range = `${schema.tab}!A${rowA1}:${lastColumn}${rowA1}`;

  const currentRes = await withGoogleRetry(() =>
    sheets.spreadsheets.values.get({
      spreadsheetId: schema.spreadsheetId,
      range,
    }),
  );
  const current = currentRes.data.values?.[0] ?? [];

  const merged = schema.headers.map((header, i) =>
    data[header] !== undefined ? data[header] : (current[i] ?? ""),
  );

  await withGoogleRetry(() =>
    sheets.spreadsheets.values.update({
      spreadsheetId: schema.spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [merged] },
    }),
  );
}
