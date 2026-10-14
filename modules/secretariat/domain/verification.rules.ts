import type { OutgoingMailStatus } from "@/generated/client";

import type { OutgoingMailEntity } from "./entities";

/**
 * Hasil Verifikasi Surat. Halaman publik menampilkan tepat satu dari tiga ini,
 * sehingga pembaca tidak pernah menerima dua jawaban yang saling bertentangan.
 */
export type VerificationVerdict =
  | { kind: "sah"; letter: OutgoingMailEntity }
  | { kind: "tidak-berlaku"; letter: OutgoingMailEntity }
  | { kind: "tidak-ditemukan" };

/**
 * Satu-satunya tempat aturan "status mana yang sah" dituliskan.
 * `Record` penuh atas enum, sehingga menambah nilai status kelak gagal typecheck
 * alih-alih diam-diam melahirkan verdict yang salah.
 */
const VERDICT_BY_STATUS: Record<OutgoingMailStatus, "sah" | "tidak-berlaku"> = {
  SENT: "sah",
  ARCHIVED: "sah",
  DRAFT: "tidak-berlaku",
};

export function classifyVerification(
  letter: OutgoingMailEntity | null,
): VerificationVerdict {
  if (!letter) return { kind: "tidak-ditemukan" };

  const kind = VERDICT_BY_STATUS[letter.status];
  return { kind, letter };
}
