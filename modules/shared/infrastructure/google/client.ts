import { google } from "googleapis";
import type { sheets_v4 } from "googleapis";
import { googleConfig } from "./config";
import { GoogleApiError } from "./errors";

export interface GoogleClients {
  sheets: sheets_v4.Sheets;
}

let cachedClients: GoogleClients | null = null;

function getAuth() {
  const { serviceAccountEmail, serviceAccountPrivateKey } = googleConfig;
  if (!serviceAccountEmail || !serviceAccountPrivateKey) {
    throw new GoogleApiError(
      "UNAUTHENTICATED",
      "Kredensial Google belum dikonfigurasi (GOOGLE_SERVICE_ACCOUNT_EMAIL/GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY).",
    );
  }

  return new google.auth.JWT({
    email: serviceAccountEmail,
    key: serviceAccountPrivateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export function getGoogleClients(): GoogleClients {
  if (cachedClients) return cachedClients;

  const auth = getAuth();
  cachedClients = {
    sheets: google.sheets({ version: "v4", auth }),
  };
  return cachedClients;
}

export function mapGoogleError(e: unknown): GoogleApiError {
  if (e instanceof GoogleApiError) return e;

  const status = (e as { response?: { status?: number } })?.response?.status;
  const message =
    e instanceof Error ? e.message : "Terjadi kesalahan pada Google API.";

  switch (status) {
    case 401:
    case 403:
      return new GoogleApiError("UNAUTHENTICATED", message, { cause: e });
    case 404:
      return new GoogleApiError("NOT_FOUND", message, { cause: e });
    case 409:
      return new GoogleApiError("CONFLICT", message, { cause: e });
    case 429:
      return new GoogleApiError("RATE_LIMITED", message, { cause: e });
    default:
      return new GoogleApiError("UNKNOWN", message, { cause: e });
  }
}

export async function withGoogle<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    throw mapGoogleError(e);
  }
}

export async function withGoogleRetry<T>(
  fn: () => Promise<T>,
  attempts = 2,
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (e) {
      const err = mapGoogleError(e);
      if (
        attempt >= attempts ||
        (err.code !== "RATE_LIMITED" && err.code !== "TIMEOUT")
      ) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
}
