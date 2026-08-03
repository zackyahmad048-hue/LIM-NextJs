export type GoogleApiErrorCode =
  | "UNAUTHENTICATED"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "CONFLICT"
  | "UNKNOWN";

export class GoogleApiError extends Error {
  constructor(
    public readonly code: GoogleApiErrorCode,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "GoogleApiError";
  }
}
