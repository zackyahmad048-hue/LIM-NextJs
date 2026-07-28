export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Email atau password salah",
  USER_NOT_FOUND: "User tidak ditemukan",
  USER_ALREADY_EXISTS: "Email sudah terdaftar",
  SESSION_EXPIRED: "Sesi telah berakhir",
  SESSION_NOT_FOUND: "Sesi tidak ditemukan",
  UNAUTHORIZED: "Anda tidak memiliki akses",
  VALIDATION_ERROR: "Validasi gagal",
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERRORS;
