/**
 * Pagar karakterisasi untuk service secretariat — agregat Surat Masuk dan
 * Surat Keluar.
 *
 * Perilaku eksternal dikunci apa adanya: yang di-assert adalah nilai kembali
 * service dan argumen yang diterima repository. Test ini tidak menguji nama
 * file, susunan folder, atau bentuk query penyimpanan, sehingga pemecahan
 * service per agregat (tiket 05) dapat membuktikan dirinya dengan test ini
 * tanpa mengubah satu pun assertion.
 *
 * Repository dan dua kolaboratornya di-mock pada level modul, bukan hanya
 * repository, karena letter-number.service dan signing.service mengakses
 * prisma secara langsung.
 *
 * PERILAKU LAMA YANG SENGAJA DIKUNCI — jangan "perbaiki" test ini:
 *   1. Surat masuk baru dicatat berstatus ARCHIVED, bukan RECEIVED.
 *   2. transitionIncomingMailStatus selalu melempar, karena tabel transisinya
 *      kosong untuk ketiga status.
 * Keduanya diubah secara sengaja oleh tiket 03, bukan cacat test ini.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../infrastructure/repository", () => ({
  secretariatRepository: {
    findManyIncomingMails: vi.fn(),
    findIncomingMailById: vi.fn(),
    findIncomingMailByNumber: vi.fn(),
    createIncomingMail: vi.fn(),
    updateIncomingMail: vi.fn(),
    softDeleteIncomingMail: vi.fn(),
    findArchivedIncomingMails: vi.fn(),
    findManyOutgoingMails: vi.fn(),
    findOutgoingMailById: vi.fn(),
    findOutgoingMailByNumber: vi.fn(),
    createOutgoingMail: vi.fn(),
    updateOutgoingMail: vi.fn(),
    softDeleteOutgoingMail: vi.fn(),
    findArchivedOutgoingMails: vi.fn(),
  },
}));

vi.mock("./letter-number.service", () => ({
  assignLetterNumber: vi.fn(),
}));

vi.mock("./signing.service", () => ({
  signOutgoingMail: vi.fn(),
}));

import type { IncomingMailEntity, OutgoingMailEntity } from "../domain/entities";
import {
  DuplicateNumberError,
  EntityNotFoundError,
  ForbiddenActionError,
  InvalidStatusTransitionError,
} from "../domain/secretariat.errors";
import { secretariatRepository as repo } from "../infrastructure/repository";
import { assignLetterNumber } from "./letter-number.service";
import {
  VALID_INCOMING_MAIL_TRANSITIONS,
  VALID_OUTGOING_MAIL_TRANSITIONS,
  canTransition,
  secretariatService,
} from "./service";
import { signOutgoingMail } from "./signing.service";

const FIXED_DATE = new Date("2026-01-02T00:00:00.000Z");

function incomingMail(
  overrides: Partial<IncomingMailEntity> = {},
): IncomingMailEntity {
  return {
    id: "im-1",
    registrationNumber: "001/ABC/2026",
    sender: "Pengirim",
    subject: "Perihal surat",
    senderAddress: null,
    receivedDate: FIXED_DATE,
    status: "ARCHIVED",
    classification: null,
    category: null,
    notes: null,
    attachmentUrl: null,
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
    deletedAt: null,
    archivedAt: null,
    ...overrides,
  };
}

function outgoingMail(
  overrides: Partial<OutgoingMailEntity> = {},
): OutgoingMailEntity {
  return {
    id: "om-1",
    registrationNumber: "DRAFT-1-ABCD",
    recipient: null,
    subject: "Perihal surat",
    senderName: null,
    mailDate: FIXED_DATE,
    status: "DRAFT",
    categoryCode: "A",
    content: null,
    sentAt: null,
    archivedAt: null,
    sequence: null,
    levelCode: "PP",
    romanMonth: null,
    periodYear: null,
    fullNumber: null,
    verificationCode: null,
    qrFileId: null,
    attachmentUrl: null,
    ketuaName: null,
    ketuaPosition: null,
    sekretarisName: null,
    sekretarisPosition: null,
    qrKetuaPosition: null,
    qrSekretarisPosition: null,
    qrVerifikasiPosition: null,
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
    deletedAt: null,
    ...overrides,
  };
}

type CreateIncomingMailInput = Parameters<
  typeof secretariatService.createIncomingMail
>[0];

function incomingMailInput(
  overrides: Partial<CreateIncomingMailInput> = {},
): CreateIncomingMailInput {
  return {
    registrationNumber: "001/ABC/2026",
    sender: "Pengirim",
    subject: "Perihal surat",
    senderAddress: null,
    receivedDate: FIXED_DATE,
    classification: null,
    category: null,
    notes: null,
    attachmentUrl: null,
    ...overrides,
  };
}

type CreateOutgoingMailInput = Parameters<
  typeof secretariatService.createOutgoingMail
>[0];

function outgoingMailInput(
  overrides: Partial<CreateOutgoingMailInput> = {},
): CreateOutgoingMailInput {
  return {
    recipient: null,
    subject: "Perihal surat",
    senderName: null,
    mailDate: FIXED_DATE,
    content: null,
    attachmentUrl: null,
    ketuaName: null,
    ketuaPosition: null,
    sekretarisName: null,
    sekretarisPosition: null,
    qrKetuaPosition: null,
    qrSekretarisPosition: null,
    qrVerifikasiPosition: null,
    levelCode: "PP",
    categoryCode: "A",
    ...overrides,
  };
}

function letterNumber(fullNumber: string) {
  return {
    sequence: 1,
    levelCode: "PP",
    categoryCode: "A",
    romanMonth: "I",
    year: 2026,
    fullNumber,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("Surat Masuk", () => {
  it("menolak nomor surat masuk yang sudah tercatat", async () => {
    vi.mocked(repo.findIncomingMailByNumber).mockResolvedValue(incomingMail());

    await expect(
      secretariatService.createIncomingMail(incomingMailInput()),
    ).rejects.toBeInstanceOf(DuplicateNumberError);
    expect(repo.createIncomingMail).not.toHaveBeenCalled();
  });

  it("mencatat surat masuk baru berstatus ARCHIVED [PERILAKU LAMA, diubah tiket 03]", async () => {
    vi.mocked(repo.findIncomingMailByNumber).mockResolvedValue(null);
    vi.mocked(repo.createIncomingMail).mockImplementation(async (data) =>
      incomingMail(data),
    );

    await secretariatService.createIncomingMail(incomingMailInput());

    expect(repo.createIncomingMail).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "ARCHIVED",
        registrationNumber: "001/ABC/2026",
        sender: "Pengirim",
        subject: "Perihal surat",
      }),
    );
  });

  it("memakai halaman dan batas bawaan saat daftar surat masuk diminta", async () => {
    vi.mocked(repo.findManyIncomingMails).mockResolvedValue({
      items: [],
      total: 0,
    });

    await secretariatService.listIncomingMails({});

    expect(repo.findManyIncomingMails).toHaveBeenCalledWith({
      search: undefined,
      status: undefined,
      page: 1,
      limit: 20,
    });
  });

  it("melempar ketika surat masuk tidak ditemukan", async () => {
    vi.mocked(repo.findIncomingMailById).mockResolvedValue(null);

    await expect(
      secretariatService.getIncomingMailById("im-9"),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it("menolak perubahan nomor surat masuk menjadi nomor yang sudah dipakai", async () => {
    vi.mocked(repo.findIncomingMailById).mockResolvedValue(
      incomingMail({ registrationNumber: "001/ABC/2026" }),
    );
    vi.mocked(repo.findIncomingMailByNumber).mockResolvedValue(
      incomingMail({ id: "im-2", registrationNumber: "002/ABC/2026" }),
    );

    await expect(
      secretariatService.updateIncomingMail("im-1", {
        registrationNumber: "002/ABC/2026",
      }),
    ).rejects.toBeInstanceOf(DuplicateNumberError);
    expect(repo.updateIncomingMail).not.toHaveBeenCalled();
  });

  it("meneruskan perubahan surat masuk ketika nomornya tidak berubah", async () => {
    vi.mocked(repo.findIncomingMailById).mockResolvedValue(
      incomingMail({ registrationNumber: "001/ABC/2026" }),
    );
    vi.mocked(repo.updateIncomingMail).mockResolvedValue(incomingMail());

    await secretariatService.updateIncomingMail("im-1", {
      registrationNumber: "001/ABC/2026",
      subject: "Perihal baru",
    });

    expect(repo.findIncomingMailByNumber).not.toHaveBeenCalled();
    expect(repo.updateIncomingMail).toHaveBeenCalledWith("im-1", {
      registrationNumber: "001/ABC/2026",
      subject: "Perihal baru",
    });
  });

  it("menghapus surat masuk secara lunak", async () => {
    vi.mocked(repo.findIncomingMailById).mockResolvedValue(incomingMail());
    vi.mocked(repo.softDeleteIncomingMail).mockResolvedValue(undefined);

    await secretariatService.deleteIncomingMail("im-1");

    expect(repo.softDeleteIncomingMail).toHaveBeenCalledWith("im-1");
  });

  it("melempar ketika menghapus surat masuk yang tidak ada", async () => {
    vi.mocked(repo.findIncomingMailById).mockResolvedValue(null);

    await expect(
      secretariatService.deleteIncomingMail("im-9"),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
    expect(repo.softDeleteIncomingMail).not.toHaveBeenCalled();
  });

  it.each(["RECEIVED", "PROCESSED", "ARCHIVED"] as const)(
    "melempar untuk transisi surat masuk ke %s [tabel transisi kosong, diubah tiket 03]",
    async (target) => {
      vi.mocked(repo.findIncomingMailById).mockResolvedValue(
        incomingMail({ status: "ARCHIVED" }),
      );

      await expect(
        secretariatService.transitionIncomingMailStatus("im-1", target),
      ).rejects.toBeInstanceOf(InvalidStatusTransitionError);
      expect(repo.updateIncomingMail).not.toHaveBeenCalled();
    },
  );
});

describe("Surat Keluar", () => {
  it("mencatat surat keluar sebagai draft tanpa nomor resmi", async () => {
    vi.mocked(repo.createOutgoingMail).mockImplementation(async (data) =>
      outgoingMail(data),
    );

    const created = await secretariatService.createOutgoingMail(
      outgoingMailInput(),
    );

    const passed = vi.mocked(repo.createOutgoingMail).mock.calls[0][0];
    expect(passed).toMatchObject({
      status: "DRAFT",
      sentAt: null,
      archivedAt: null,
      sequence: null,
      romanMonth: null,
      periodYear: null,
      fullNumber: null,
      verificationCode: null,
      qrFileId: null,
      levelCode: "PP",
      categoryCode: "A",
    });
    expect(passed.registrationNumber).toMatch(/^DRAFT-\d+-[0-9A-Z]{1,4}$/);
    expect(created.status).toBe("DRAFT");
  });

  it("memakai halaman dan batas bawaan saat daftar surat keluar diminta", async () => {
    vi.mocked(repo.findManyOutgoingMails).mockResolvedValue({
      items: [],
      total: 0,
    });

    await secretariatService.listOutgoingMails({});

    expect(repo.findManyOutgoingMails).toHaveBeenCalledWith({
      search: undefined,
      status: undefined,
      page: 1,
      limit: 20,
    });
  });

  it("meneruskan pencarian arsip surat keluar", async () => {
    vi.mocked(repo.findArchivedOutgoingMails).mockResolvedValue([]);

    await secretariatService.listArchivedOutgoingMails({ search: "abc" });

    expect(repo.findArchivedOutgoingMails).toHaveBeenCalledWith({
      search: "abc",
      limit: undefined,
    });
  });

  it("melempar ketika surat keluar tidak ditemukan", async () => {
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(null);

    await expect(
      secretariatService.getOutgoingMailById("om-9"),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it("menolak perubahan surat keluar yang sudah diarsipkan", async () => {
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(
      outgoingMail({ status: "ARCHIVED" }),
    );

    await expect(
      secretariatService.updateOutgoingMail("om-1", { subject: "Baru" }),
    ).rejects.toBeInstanceOf(ForbiddenActionError);
    expect(repo.updateOutgoingMail).not.toHaveBeenCalled();
  });

  it("menolak perubahan nomor surat keluar menjadi nomor yang sudah dipakai", async () => {
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(
      outgoingMail({ registrationNumber: "DRAFT-1-ABCD" }),
    );
    vi.mocked(repo.findOutgoingMailByNumber).mockResolvedValue(
      outgoingMail({ id: "om-2", registrationNumber: "DRAFT-2-EFGH" }),
    );

    await expect(
      secretariatService.updateOutgoingMail("om-1", {
        registrationNumber: "DRAFT-2-EFGH",
      }),
    ).rejects.toBeInstanceOf(DuplicateNumberError);
    expect(repo.updateOutgoingMail).not.toHaveBeenCalled();
  });

  it("tidak menerbitkan ulang nomor ketika surat masih draft", async () => {
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(
      outgoingMail({ status: "DRAFT", levelCode: "PP" }),
    );
    vi.mocked(repo.updateOutgoingMail).mockResolvedValue(outgoingMail());

    await secretariatService.updateOutgoingMail("om-1", { levelCode: "PW" });

    expect(assignLetterNumber).not.toHaveBeenCalled();
    expect(signOutgoingMail).not.toHaveBeenCalled();
    expect(repo.updateOutgoingMail).toHaveBeenCalledTimes(1);
  });

  it("menerbitkan ulang nomor dan menandatangani ketika tingkat berubah pada surat terkirim", async () => {
    const sent = outgoingMail({
      status: "SENT",
      levelCode: "PP",
      categoryCode: "A",
      fullNumber: "001/PP/A/I/2026",
    });
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(sent);
    vi.mocked(repo.updateOutgoingMail).mockResolvedValue(sent);
    vi.mocked(assignLetterNumber).mockResolvedValue(
      letterNumber("002/PW/A/I/2026"),
    );
    vi.mocked(signOutgoingMail).mockResolvedValue({
      verificationCode: "002/PW/A/I/2026",
      qrFileId: "qr-1",
      attachmentUrl: "https://contoh.test/lampiran.pdf",
    });

    await secretariatService.updateOutgoingMail("om-1", { levelCode: "PW" });

    expect(assignLetterNumber).toHaveBeenCalledWith(
      "om-1",
      expect.objectContaining({ levelCode: "PW" }),
    );
    expect(signOutgoingMail).toHaveBeenCalledWith(
      expect.objectContaining({ fullNumber: "002/PW/A/I/2026" }),
    );
    // Service menulis dua kali pada jalur terbit ulang (perubahan dulu, lalu
    // nomor baru). Kedua panggilan dikunci agar pemecahan tiket 05 tidak
    // menggabungkannya secara diam-diam.
    expect(repo.updateOutgoingMail).toHaveBeenNthCalledWith(1, "om-1", {
      levelCode: "PW",
    });
    expect(repo.updateOutgoingMail).toHaveBeenLastCalledWith(
      "om-1",
      expect.objectContaining({
        fullNumber: "002/PW/A/I/2026",
        verificationCode: "002/PW/A/I/2026",
        qrFileId: "qr-1",
        attachmentUrl: "https://contoh.test/lampiran.pdf",
      }),
    );
  });

  it("menghapus surat keluar secara lunak", async () => {
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(outgoingMail());
    vi.mocked(repo.softDeleteOutgoingMail).mockResolvedValue(undefined);

    await secretariatService.deleteOutgoingMail("om-1");

    expect(repo.softDeleteOutgoingMail).toHaveBeenCalledWith("om-1");
  });

  it("menerbitkan nomor resmi dan menandatangani saat surat ditandai terkirim", async () => {
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(
      outgoingMail({ status: "DRAFT", fullNumber: null }),
    );
    vi.mocked(repo.updateOutgoingMail).mockResolvedValue(
      outgoingMail({ status: "SENT" }),
    );
    vi.mocked(assignLetterNumber).mockResolvedValue(
      letterNumber("001/PP/A/I/2026"),
    );
    vi.mocked(signOutgoingMail).mockResolvedValue({
      verificationCode: "001/PP/A/I/2026",
      qrFileId: "qr-1",
      attachmentUrl: null,
    });

    await secretariatService.transitionOutgoingMailStatus("om-1", "SENT");

    expect(repo.updateOutgoingMail).toHaveBeenCalledWith(
      "om-1",
      expect.objectContaining({
        status: "SENT",
        sentAt: expect.any(Date),
        fullNumber: "001/PP/A/I/2026",
        verificationCode: "001/PP/A/I/2026",
        qrFileId: "qr-1",
      }),
    );
  });

  it("tidak menerbitkan nomor baru ketika surat terkirim sudah punya nomor", async () => {
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(
      outgoingMail({ status: "DRAFT", fullNumber: "001/PP/A/I/2026" }),
    );
    vi.mocked(repo.updateOutgoingMail).mockResolvedValue(
      outgoingMail({ status: "SENT" }),
    );

    await secretariatService.transitionOutgoingMailStatus("om-1", "SENT");

    expect(assignLetterNumber).not.toHaveBeenCalled();
    expect(repo.updateOutgoingMail).toHaveBeenCalledWith("om-1", {
      status: "SENT",
      sentAt: expect.any(Date),
    });
  });

  it("mengembalikan surat terkirim ke draft dan menghapus waktu kirim", async () => {
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(
      outgoingMail({
        status: "SENT",
        sentAt: FIXED_DATE,
        fullNumber: "001/PP/A/I/2026",
      }),
    );
    vi.mocked(repo.updateOutgoingMail).mockResolvedValue(
      outgoingMail({ status: "DRAFT" }),
    );

    await secretariatService.transitionOutgoingMailStatus("om-1", "DRAFT");

    expect(repo.updateOutgoingMail).toHaveBeenCalledWith("om-1", {
      status: "DRAFT",
      sentAt: null,
    });
  });

  it("mencatat waktu arsip saat surat diarsipkan", async () => {
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(outgoingMail());
    vi.mocked(repo.updateOutgoingMail).mockResolvedValue(
      outgoingMail({ status: "ARCHIVED" }),
    );

    await secretariatService.transitionOutgoingMailStatus("om-1", "ARCHIVED");

    expect(repo.updateOutgoingMail).toHaveBeenCalledWith(
      "om-1",
      expect.objectContaining({
        status: "ARCHIVED",
        archivedAt: expect.any(Date),
      }),
    );
  });

  it("menolak transisi status surat keluar yang tidak sah", async () => {
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(
      outgoingMail({ status: "ARCHIVED" }),
    );

    await expect(
      secretariatService.transitionOutgoingMailStatus("om-1", "SENT"),
    ).rejects.toBeInstanceOf(InvalidStatusTransitionError);
    expect(repo.updateOutgoingMail).not.toHaveBeenCalled();
  });

  it("melempar ketika mengubah status surat keluar yang tidak ada", async () => {
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(null);

    await expect(
      secretariatService.transitionOutgoingMailStatus("om-9", "SENT"),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it("menerbitkan ulang nomor dan menandatangani ketika kategori berubah pada surat terkirim", async () => {
    const sent = outgoingMail({
      status: "SENT",
      levelCode: "PP",
      categoryCode: "A",
      fullNumber: "001/PP/A/I/2026",
    });
    vi.mocked(repo.findOutgoingMailById).mockResolvedValue(sent);
    vi.mocked(repo.updateOutgoingMail).mockResolvedValue(sent);
    vi.mocked(assignLetterNumber).mockResolvedValue(
      letterNumber("001/PP/B/I/2026"),
    );
    vi.mocked(signOutgoingMail).mockResolvedValue({
      verificationCode: "001/PP/B/I/2026",
      qrFileId: "qr-2",
      attachmentUrl: null,
    });

    await secretariatService.updateOutgoingMail("om-1", {
      categoryCode: "B",
    });

    expect(assignLetterNumber).toHaveBeenCalledWith(
      "om-1",
      expect.objectContaining({ categoryCode: "B" }),
    );
    expect(repo.updateOutgoingMail).toHaveBeenLastCalledWith(
      "om-1",
      expect.objectContaining({
        fullNumber: "001/PP/B/I/2026",
        verificationCode: "001/PP/B/I/2026",
        qrFileId: "qr-2",
      }),
    );
  });
});

describe("Aturan transisi status", () => {
  it.each([
    ["DRAFT", "SENT", true],
    ["DRAFT", "ARCHIVED", true],
    ["SENT", "DRAFT", true],
    ["SENT", "ARCHIVED", true],
    ["ARCHIVED", "DRAFT", false],
    ["ARCHIVED", "SENT", false],
    ["DRAFT", "DRAFT", false],
    ["SENT", "SENT", false],
    ["ARCHIVED", "ARCHIVED", false],
  ] as const)(
    "surat keluar %s ke %s diizinkan: %s",
    (from, to, expected) => {
      expect(canTransition(VALID_OUTGOING_MAIL_TRANSITIONS, from, to)).toBe(
        expected,
      );
    },
  );

  it("surat masuk tidak memiliki transisi sah sama sekali [PERILAKU LAMA, diubah tiket 03]", () => {
    const statuses = ["RECEIVED", "PROCESSED", "ARCHIVED"] as const;

    for (const from of statuses) {
      for (const to of statuses) {
        expect(canTransition(VALID_INCOMING_MAIL_TRANSITIONS, from, to)).toBe(
          false,
        );
      }
    }
  });
});
