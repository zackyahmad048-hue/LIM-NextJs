export const googleConfig = {
  serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? null,
  serviceAccountPrivateKey:
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? null,
  spreadsheetPendataanId: process.env.GOOGLE_SPREADSHEET_PENDATAAN_ID ?? null,
  spreadsheetFalakId: process.env.GOOGLE_SPREADSHEET_FALAK_ID ?? null,
} as const;

 