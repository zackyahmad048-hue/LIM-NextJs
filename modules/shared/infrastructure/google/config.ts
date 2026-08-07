export const googleConfig = {
  serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? null,
  serviceAccountPrivateKey:
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? null,
  spreadsheetPendataanId: process.env.GOOGLE_SPREADSHEET_PENDATAAN_ID ?? null,
  spreadsheetFalakId: process.env.GOOGLE_SPREADSHEET_FALAK_ID ?? null,
} as const;

export function isGoogleConfigured(): boolean {
  return Boolean(
    googleConfig.serviceAccountEmail &&
    googleConfig.serviceAccountPrivateKey &&
    googleConfig.spreadsheetPendataanId &&
    googleConfig.spreadsheetFalakId,
  );
}
