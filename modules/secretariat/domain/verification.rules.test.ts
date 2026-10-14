import { describe, expect, it } from "vitest";

import type { OutgoingMailEntity } from "./entities";
import { classifyVerification } from "./verification.rules";

/** Surat Keluar lengkap; hanya status yang berubah antar kasus. */
function suratKeluar(overrides: Partial<OutgoingMailEntity> = {}): OutgoingMailEntity {
  return {
    id: "om_1",
    registrationNumber: "REG-1",
    recipient: "Pengurus Cabang Kota Malang",
    subject: "Undangan Rapat Koordinasi Bidang Dakwah",
    senderName: null,
    mailDate: new Date("2026-08-12T00:00:00.000Z"),
    status: "SENT",
    categoryCode: "B",
    content: null,
    sentAt: new Date("2026-08-13T00:00:00.000Z"),
    archivedAt: null,
    sequence: 17,
    levelCode: "PP",
    romanMonth: "VIII",
    periodYear: 2026,
    fullNumber: "017/PP/B/VIII/2026",
    verificationCode: "017/PP/B/VIII/2026",
    qrFileId: null,
    attachmentUrl: null,
    ketuaName: "KH. Ahmad Fauzi",
    ketuaPosition: "Ketua",
    sekretarisName: "Ust. M. Ridwan",
    sekretarisPosition: "Sekretaris",
    qrKetuaPosition: null,
    qrSekretarisPosition: null,
    qrVerifikasiPosition: null,
    createdAt: new Date("2026-08-12T00:00:00.000Z"),
    updatedAt: new Date("2026-08-12T00:00:00.000Z"),
    deletedAt: null,
    ...overrides,
  };
}

describe("classifyVerification", () => {
  it("menyatakan surat terkirim sebagai sah", () => {
    const verdict = classifyVerification(suratKeluar({ status: "SENT" }));
    expect(verdict.kind).toBe("sah");
  });

  it("menyatakan surat terarsip sebagai sah", () => {
    const verdict = classifyVerification(suratKeluar({ status: "ARCHIVED" }));
    expect(verdict.kind).toBe("sah");
  });

  it("menyatakan surat yang ditarik kembali ke Draft sebagai tidak berlaku", () => {
    const verdict = classifyVerification(suratKeluar({ status: "DRAFT" }));
    expect(verdict.kind).toBe("tidak-berlaku");
  });

  it("menyatakan kode yang tidak menunjuk surat mana pun sebagai tidak ditemukan", () => {
    expect(classifyVerification(null).kind).toBe("tidak-ditemukan");
  });

  it("membawa surat di dalam verdict, sehingga halaman tidak perlu membaca ulang", () => {
    const letter = suratKeluar({ status: "SENT" });
    const verdict = classifyVerification(letter);
    expect(verdict.kind === "sah" && verdict.letter).toBe(letter);
  });
});
