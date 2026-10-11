/**
 * Pagar karakterisasi untuk service secretariat — seluruh agregat.
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
 * Cakupan: Surat Masuk, Surat Keluar, Disposisi, Dokumen Administrasi, Buku
 * Agenda, Arsip Dokumen, dan baca dasbor.
 *
 * PERILAKU LAMA YANG SENGAJA DIKUNCI — jangan "perbaiki" test ini:
 *   1. Surat masuk baru dicatat berstatus ARCHIVED, bukan RECEIVED.
 *   2. transitionIncomingMailStatus selalu melempar, karena tabel transisinya
 *      kosong untuk ketiga status.
 *   3. deleteDisposition menghapus permanen (hard delete).
 *   4. updateAgendaBook mengirim payload lewat `as any` di service.
 *   5. DocumentArchive adalah kode mati yang dipertahankan.
 * Butir 1-2 diubah secara sengaja oleh tiket 03; 3-5 dicatat, bukan
 * diperbaiki di sini. Semuanya bukan cacat test ini.
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
    findManyDispositions: vi.fn(),
    findDispositionById: vi.fn(),
    createDisposition: vi.fn(),
    updateDisposition: vi.fn(),
    deleteDisposition: vi.fn(),
    findManyAdministrativeDocuments: vi.fn(),
    findAdministrativeDocumentById: vi.fn(),
    findAdministrativeDocumentByNumber: vi.fn(),
    createAdministrativeDocument: vi.fn(),
    updateAdministrativeDocument: vi.fn(),
    softDeleteAdministrativeDocument: vi.fn(),
    findManyAgendaBooks: vi.fn(),
    findAgendaBookById: vi.fn(),
    createAgendaBook: vi.fn(),
    updateAgendaBook: vi.fn(),
    softDeleteAgendaBook: vi.fn(),
    findAgendasInRange: vi.fn(),
    findManyDocumentArchives: vi.fn(),
    findDocumentArchiveById: vi.fn(),
    getDashboardStats: vi.fn(),
    findRecentOutgoingMails: vi.fn(),
    findRecentIncomingMails: vi.fn(),
    findUpcomingAgendas: vi.fn(),
    countIncomingMailsByMonth: vi.fn(),
    countOutgoingMailsByMonth: vi.fn(),
  },
}));

vi.mock("./letter-number.service", () => ({
  assignLetterNumber: vi.fn(),
}));

vi.mock("./signing.service", () => ({
  signOutgoingMail: vi.fn(),
}));

import type {
  AgendaBookEntity,
  AdministrativeDocumentEntity,
  DispositionEntity,
  DocumentArchiveEntity,
  IncomingMailEntity,
  OutgoingMailEntity,
} from "../domain/entities";
import {
  DuplicateNumberError,
  EntityNotFoundError,
  ForbiddenActionError,
  InvalidStatusTransitionError,
} from "../domain/secretariat.errors";
import { secretariatRepository as repo } from "../infrastructure/repository";
import { assignLetterNumber } from "./letter-number.service";
import {
  VALID_ADMINISTRATIVE_DOCUMENT_TRANSITIONS,
  VALID_DISPOSITION_TRANSITIONS,
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

function disposition(
  overrides: Partial<DispositionEntity> = {},
): DispositionEntity {
  return {
    id: "dp-1",
    incomingMailId: "im-1",
    assignedToId: "usr-1",
    instruction: "Diteruskan untuk diproses",
    priority: "NORMAL",
    status: "PENDING",
    dueDate: null,
    notes: null,
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
    deletedAt: null,
    ...overrides,
  };
}

function administrativeDocument(
  overrides: Partial<AdministrativeDocumentEntity> = {},
): AdministrativeDocumentEntity {
  return {
    id: "doc-1",
    documentNumber: "001/SK/2026",
    documentType: "KEPUTUSAN",
    title: "Keputusan contoh",
    description: null,
    content: null,
    attachmentUrl: null,
    status: "DRAFT",
    submittedById: null,
    submittedAt: null,
    approvedById: null,
    approvedAt: null,
    archivedAt: null,
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE,
    deletedAt: null,
    ...overrides,
  };
}

function agendaBook(
  overrides: Partial<AgendaBookEntity> = {},
): AgendaBookEntity {
  return {
    id: "ag-1",
    date: FIXED_DATE,
    title: "Rapat contoh",
    description: null,
    location: null,
    participants: null,
    notes: null,
    createdAt: FIXED_DATE,
    deletedAt: null,
    ...overrides,
  };
}

function documentArchive(
  overrides: Partial<DocumentArchiveEntity> = {},
): DocumentArchiveEntity {
  return {
    id: "ar-1",
    archiveNumber: "001/ARS/2026",
    title: "Arsip contoh",
    documentType: "KEPUTUSAN",
    category: null,
    retentionYear: null,
    archivedAt: FIXED_DATE,
    createdAt: FIXED_DATE,
    deletedAt: null,
    ...overrides,
  };
}

type CreateDispositionInput = Parameters<
  typeof secretariatService.createDisposition
>[0];

function dispositionInput(
  overrides: Partial<CreateDispositionInput> = {},
): CreateDispositionInput {
  return {
    incomingMailId: "im-1",
    assignedToId: "usr-1",
    instruction: "Diteruskan untuk diproses",
    priority: "NORMAL",
    dueDate: null,
    notes: null,
    ...overrides,
  };
}

type CreateAdministrativeDocumentInput = Parameters<
  typeof secretariatService.createAdministrativeDocument
>[0];

function administrativeDocumentInput(
  overrides: Partial<CreateAdministrativeDocumentInput> = {},
): CreateAdministrativeDocumentInput {
  return {
    documentNumber: "001/SK/2026",
    documentType: "KEPUTUSAN",
    title: "Keputusan contoh",
    description: null,
    content: null,
    attachmentUrl: null,
    ...overrides,
  };
}

type CreateAgendaBookInput = Parameters<
  typeof secretariatService.createAgendaBook
>[0];

function agendaBookInput(
  overrides: Partial<CreateAgendaBookInput> = {},
): CreateAgendaBookInput {
  return {
    date: FIXED_DATE,
    title: "Rapat contoh",
    description: null,
    location: null,
    participants: null,
    notes: null,
    ...overrides,
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

  it("meneruskan pencarian arsip surat masuk", async () => {
    vi.mocked(repo.findArchivedIncomingMails).mockResolvedValue([]);

    await secretariatService.listArchivedIncomingMails({ search: "abc" });

    expect(repo.findArchivedIncomingMails).toHaveBeenCalledWith({
      search: "abc",
      limit: undefined,
    });
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

describe("Disposisi", () => {
  it("meneruskan filter dan memakai halaman serta batas bawaan", async () => {
    vi.mocked(repo.findManyDispositions).mockResolvedValue({
      items: [],
      total: 0,
    });

    await secretariatService.listDispositions({});

    expect(repo.findManyDispositions).toHaveBeenCalledWith({
      incomingMailId: undefined,
      assignedToId: undefined,
      status: undefined,
      page: 1,
      limit: 20,
    });
  });

  it("melempar ketika disposisi tidak ditemukan", async () => {
    vi.mocked(repo.findDispositionById).mockResolvedValue(null);

    await expect(
      secretariatService.getDispositionById("dp-9"),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it("menolak disposisi atas surat masuk yang tidak ada", async () => {
    vi.mocked(repo.findIncomingMailById).mockResolvedValue(null);

    await expect(
      secretariatService.createDisposition(dispositionInput()),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
    expect(repo.createDisposition).not.toHaveBeenCalled();
  });

  it("mencatat disposisi baru berstatus PENDING", async () => {
    vi.mocked(repo.findIncomingMailById).mockResolvedValue(incomingMail());
    vi.mocked(repo.createDisposition).mockResolvedValue(disposition());

    await secretariatService.createDisposition(dispositionInput());

    expect(repo.createDisposition).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "PENDING",
        incomingMailId: "im-1",
        assignedToId: "usr-1",
        instruction: "Diteruskan untuk diproses",
      }),
    );
  });

  it("meneruskan perubahan disposisi", async () => {
    vi.mocked(repo.findDispositionById).mockResolvedValue(disposition());
    vi.mocked(repo.updateDisposition).mockResolvedValue(disposition());

    await secretariatService.updateDisposition("dp-1", {
      instruction: "Instruksi baru",
    });

    expect(repo.updateDisposition).toHaveBeenCalledWith("dp-1", {
      instruction: "Instruksi baru",
    });
  });

  it("melempar ketika memperbarui disposisi yang tidak ada", async () => {
    vi.mocked(repo.findDispositionById).mockResolvedValue(null);

    await expect(
      secretariatService.updateDisposition("dp-9", { notes: "Baru" }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
    expect(repo.updateDisposition).not.toHaveBeenCalled();
  });

  it("menghapus disposisi secara permanen [hard delete, dicatat tiket 03]", async () => {
    vi.mocked(repo.findDispositionById).mockResolvedValue(disposition());
    vi.mocked(repo.deleteDisposition).mockResolvedValue(undefined);

    await secretariatService.deleteDisposition("dp-1");

    expect(repo.deleteDisposition).toHaveBeenCalledWith("dp-1");
  });

  it("melempar ketika menghapus disposisi yang tidak ada", async () => {
    vi.mocked(repo.findDispositionById).mockResolvedValue(null);

    await expect(
      secretariatService.deleteDisposition("dp-9"),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
    expect(repo.deleteDisposition).not.toHaveBeenCalled();
  });

  it("mengubah status disposisi yang diizinkan", async () => {
    vi.mocked(repo.findDispositionById).mockResolvedValue(disposition());
    vi.mocked(repo.updateDisposition).mockResolvedValue(
      disposition({ status: "IN_PROGRESS" }),
    );

    await secretariatService.transitionDispositionStatus("dp-1", "IN_PROGRESS");

    expect(repo.updateDisposition).toHaveBeenCalledWith("dp-1", {
      status: "IN_PROGRESS",
    });
  });

  it("menolak transisi status disposisi yang tidak sah", async () => {
    vi.mocked(repo.findDispositionById).mockResolvedValue(
      disposition({ status: "COMPLETED" }),
    );

    await expect(
      secretariatService.transitionDispositionStatus("dp-1", "PENDING"),
    ).rejects.toBeInstanceOf(InvalidStatusTransitionError);
    expect(repo.updateDisposition).not.toHaveBeenCalled();
  });

  it("melempar ketika mengubah status disposisi yang tidak ada", async () => {
    vi.mocked(repo.findDispositionById).mockResolvedValue(null);

    await expect(
      secretariatService.transitionDispositionStatus("dp-9", "IN_PROGRESS"),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });
});

describe("Dokumen Administrasi", () => {
  it("memakai halaman dan batas bawaan saat daftar dokumen diminta", async () => {
    vi.mocked(repo.findManyAdministrativeDocuments).mockResolvedValue({
      items: [],
      total: 0,
    });

    await secretariatService.listAdministrativeDocuments({});

    expect(repo.findManyAdministrativeDocuments).toHaveBeenCalledWith({
      search: undefined,
      status: undefined,
      documentType: undefined,
      page: 1,
      limit: 20,
    });
  });

  it("melempar ketika dokumen tidak ditemukan", async () => {
    vi.mocked(repo.findAdministrativeDocumentById).mockResolvedValue(null);

    await expect(
      secretariatService.getAdministrativeDocumentById("doc-9"),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it("menolak nomor dokumen yang sudah tercatat", async () => {
    vi.mocked(repo.findAdministrativeDocumentByNumber).mockResolvedValue(
      administrativeDocument(),
    );

    await expect(
      secretariatService.createAdministrativeDocument(
        administrativeDocumentInput(),
      ),
    ).rejects.toBeInstanceOf(DuplicateNumberError);
    expect(repo.createAdministrativeDocument).not.toHaveBeenCalled();
  });

  it("mencatat dokumen baru sebagai draft tanpa jejak pengajuan", async () => {
    vi.mocked(repo.findAdministrativeDocumentByNumber).mockResolvedValue(null);
    vi.mocked(repo.createAdministrativeDocument).mockImplementation(
      async (data) => administrativeDocument(data),
    );

    await secretariatService.createAdministrativeDocument(
      administrativeDocumentInput(),
    );

    expect(repo.createAdministrativeDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "DRAFT",
        submittedById: null,
        submittedAt: null,
        approvedById: null,
        approvedAt: null,
        documentType: "KEPUTUSAN",
      }),
    );
  });

  it("menolak perubahan nomor dokumen menjadi nomor yang sudah dipakai", async () => {
    vi.mocked(repo.findAdministrativeDocumentById).mockResolvedValue(
      administrativeDocument(),
    );
    vi.mocked(repo.findAdministrativeDocumentByNumber).mockResolvedValue(
      administrativeDocument({ id: "doc-2" }),
    );

    await expect(
      secretariatService.updateAdministrativeDocument("doc-1", {
        documentNumber: "002/SK/2026",
      }),
    ).rejects.toBeInstanceOf(DuplicateNumberError);
    expect(repo.updateAdministrativeDocument).not.toHaveBeenCalled();
  });

  it("meneruskan perubahan dokumen ketika nomornya tidak berubah", async () => {
    vi.mocked(repo.findAdministrativeDocumentById).mockResolvedValue(
      administrativeDocument(),
    );
    vi.mocked(repo.updateAdministrativeDocument).mockResolvedValue(
      administrativeDocument(),
    );

    await secretariatService.updateAdministrativeDocument("doc-1", {
      documentNumber: "001/SK/2026",
      title: "Judul baru",
    });

    expect(repo.findAdministrativeDocumentByNumber).not.toHaveBeenCalled();
    expect(repo.updateAdministrativeDocument).toHaveBeenCalledWith("doc-1", {
      documentNumber: "001/SK/2026",
      title: "Judul baru",
    });
  });

  it("melempar ketika memperbarui dokumen yang tidak ada", async () => {
    vi.mocked(repo.findAdministrativeDocumentById).mockResolvedValue(null);

    await expect(
      secretariatService.updateAdministrativeDocument("doc-9", {
        title: "Baru",
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
    expect(repo.updateAdministrativeDocument).not.toHaveBeenCalled();
  });

  it("menghapus dokumen secara lunak", async () => {
    vi.mocked(repo.findAdministrativeDocumentById).mockResolvedValue(
      administrativeDocument(),
    );
    vi.mocked(repo.softDeleteAdministrativeDocument).mockResolvedValue(
      undefined,
    );

    await secretariatService.deleteAdministrativeDocument("doc-1");

    expect(repo.softDeleteAdministrativeDocument).toHaveBeenCalledWith("doc-1");
  });

  it("melempar ketika menghapus dokumen yang tidak ada", async () => {
    vi.mocked(repo.findAdministrativeDocumentById).mockResolvedValue(null);

    await expect(
      secretariatService.deleteAdministrativeDocument("doc-9"),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
    expect(repo.softDeleteAdministrativeDocument).not.toHaveBeenCalled();
  });

  it("melengkapi jejak waktu saat transisi dilakukan", async () => {
    vi.mocked(repo.findAdministrativeDocumentById).mockResolvedValue(
      administrativeDocument(),
    );
    vi.mocked(repo.updateAdministrativeDocument).mockResolvedValue(
      administrativeDocument(),
    );

    await secretariatService.transitionAdministrativeDocumentStatus(
      "doc-1",
      "SUBMITTED",
    );
    expect(repo.updateAdministrativeDocument).toHaveBeenLastCalledWith(
      "doc-1",
      expect.objectContaining({
        status: "SUBMITTED",
        submittedAt: expect.any(Date),
      }),
    );

    vi.mocked(repo.findAdministrativeDocumentById).mockResolvedValue(
      administrativeDocument({ status: "SUBMITTED" }),
    );
    await secretariatService.transitionAdministrativeDocumentStatus(
      "doc-1",
      "APPROVED",
    );
    expect(repo.updateAdministrativeDocument).toHaveBeenLastCalledWith(
      "doc-1",
      expect.objectContaining({
        status: "APPROVED",
        approvedAt: expect.any(Date),
      }),
    );

    vi.mocked(repo.findAdministrativeDocumentById).mockResolvedValue(
      administrativeDocument({ status: "APPROVED" }),
    );
    await secretariatService.transitionAdministrativeDocumentStatus(
      "doc-1",
      "ARCHIVED",
    );
    expect(repo.updateAdministrativeDocument).toHaveBeenLastCalledWith(
      "doc-1",
      expect.objectContaining({
        status: "ARCHIVED",
        archivedAt: expect.any(Date),
      }),
    );
  });

  it.each(["REJECTED", "DRAFT"] as const)(
    "menghapus jejak persetujuan saat dokumen kembali ke %s",
    async (target) => {
      vi.mocked(repo.findAdministrativeDocumentById).mockResolvedValue(
        administrativeDocument({
          status: target === "REJECTED" ? "SUBMITTED" : "REJECTED",
          approvedAt: FIXED_DATE,
          approvedById: "usr-1",
        }),
      );
      vi.mocked(repo.updateAdministrativeDocument).mockResolvedValue(
        administrativeDocument(),
      );

      await secretariatService.transitionAdministrativeDocumentStatus(
        "doc-1",
        target,
      );

      expect(repo.updateAdministrativeDocument).toHaveBeenCalledWith("doc-1", {
        status: target,
        approvedAt: null,
        approvedById: null,
      });
    },
  );

  it("menolak transisi status dokumen yang tidak sah", async () => {
    vi.mocked(repo.findAdministrativeDocumentById).mockResolvedValue(
      administrativeDocument({ status: "APPROVED" }),
    );

    await expect(
      secretariatService.transitionAdministrativeDocumentStatus(
        "doc-1",
        "SUBMITTED",
      ),
    ).rejects.toBeInstanceOf(InvalidStatusTransitionError);
    expect(repo.updateAdministrativeDocument).not.toHaveBeenCalled();
  });

  it("melempar ketika mengubah status dokumen yang tidak ada", async () => {
    vi.mocked(repo.findAdministrativeDocumentById).mockResolvedValue(null);

    await expect(
      secretariatService.transitionAdministrativeDocumentStatus(
        "doc-9",
        "SUBMITTED",
      ),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });
});

describe("Buku Agenda", () => {
  it("memakai halaman dan batas bawaan saat daftar agenda diminta", async () => {
    vi.mocked(repo.findManyAgendaBooks).mockResolvedValue({
      items: [],
      total: 0,
    });

    await secretariatService.listAgendaBooks({});

    expect(repo.findManyAgendaBooks).toHaveBeenCalledWith({
      search: undefined,
      page: 1,
      limit: 20,
    });
  });

  it("melempar ketika agenda tidak ditemukan", async () => {
    vi.mocked(repo.findAgendaBookById).mockResolvedValue(null);

    await expect(
      secretariatService.getAgendaBookById("ag-9"),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it("menyerahkan tanggal agenda sebagai Date", async () => {
    vi.mocked(repo.createAgendaBook).mockResolvedValue(agendaBook());

    await secretariatService.createAgendaBook(agendaBookInput());

    expect(repo.createAgendaBook).toHaveBeenCalledWith(
      expect.objectContaining({ date: expect.any(Date), title: "Rapat contoh" }),
    );
  });

  it("melempar ketika memperbarui agenda yang tidak ada", async () => {
    vi.mocked(repo.findAgendaBookById).mockResolvedValue(null);

    await expect(
      secretariatService.updateAgendaBook("ag-9", { title: "Baru" }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it("meneruskan tanggal saat agenda diperbarui [payload dikonversi via as any, dicatat tiket 05]", async () => {
    vi.mocked(repo.findAgendaBookById).mockResolvedValue(agendaBook());
    vi.mocked(repo.updateAgendaBook).mockResolvedValue(agendaBook());

    await secretariatService.updateAgendaBook("ag-1", {
      date: new Date("2026-01-05"),
    });

    expect(repo.updateAgendaBook).toHaveBeenCalledWith(
      "ag-1",
      expect.objectContaining({ date: expect.any(Date) }),
    );
  });

  it("menghapus agenda secara lunak", async () => {
    vi.mocked(repo.findAgendaBookById).mockResolvedValue(agendaBook());
    vi.mocked(repo.softDeleteAgendaBook).mockResolvedValue(undefined);

    await secretariatService.deleteAgendaBook("ag-1");

    expect(repo.softDeleteAgendaBook).toHaveBeenCalledWith("ag-1");
  });

  it("melempar ketika menghapus agenda yang tidak ada", async () => {
    vi.mocked(repo.findAgendaBookById).mockResolvedValue(null);

    await expect(
      secretariatService.deleteAgendaBook("ag-9"),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
    expect(repo.softDeleteAgendaBook).not.toHaveBeenCalled();
  });

  it("meneruskan rentang tanggal saat agenda dalam rentang diminta", async () => {
    vi.mocked(repo.findAgendasInRange).mockResolvedValue([]);

    const from = new Date("2026-01-01");
    const to = new Date("2026-01-31");

    await secretariatService.listAgendasInRange({ from, to });

    expect(repo.findAgendasInRange).toHaveBeenCalledWith({ from, to });
  });
});

describe("Arsip Dokumen [kode mati, dipertahankan]", () => {
  it("memakai halaman dan batas bawaan saat daftar arsip diminta", async () => {
    vi.mocked(repo.findManyDocumentArchives).mockResolvedValue({
      items: [],
      total: 0,
    });

    await secretariatService.listDocumentArchives({});

    expect(repo.findManyDocumentArchives).toHaveBeenCalledWith({
      search: undefined,
      documentType: undefined,
      page: 1,
      limit: 20,
    });
  });

  it("meneruskan pencarian dan jenis dokumen pada daftar arsip", async () => {
    vi.mocked(repo.findManyDocumentArchives).mockResolvedValue({
      items: [],
      total: 0,
    });

    await secretariatService.listDocumentArchives({
      search: "kp",
      documentType: "KEPUTUSAN",
      page: 2,
      limit: 10,
    });

    expect(repo.findManyDocumentArchives).toHaveBeenCalledWith({
      search: "kp",
      documentType: "KEPUTUSAN",
      page: 2,
      limit: 10,
    });
  });

  it("melempar ketika arsip tidak ditemukan", async () => {
    vi.mocked(repo.findDocumentArchiveById).mockResolvedValue(null);

    await expect(
      secretariatService.getDocumentArchiveById("ar-9"),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it("mengembalikan arsip yang ditemukan", async () => {
    vi.mocked(repo.findDocumentArchiveById).mockResolvedValue(
      documentArchive(),
    );

    const archive = await secretariatService.getDocumentArchiveById("ar-1");

    expect(archive.id).toBe("ar-1");
  });
});

describe("Baca dasbor", () => {
  it("meneruskan batas saat surat keluar terbaru diminta", async () => {
    vi.mocked(repo.findRecentOutgoingMails).mockResolvedValue([]);

    await secretariatService.listRecentOutgoingMails(5);

    expect(repo.findRecentOutgoingMails).toHaveBeenCalledWith(5);
  });

  it("meneruskan batas saat surat masuk terbaru diminta", async () => {
    vi.mocked(repo.findRecentIncomingMails).mockResolvedValue([]);

    await secretariatService.listRecentIncomingMails(5);

    expect(repo.findRecentIncomingMails).toHaveBeenCalledWith(5);
  });

  it("meneruskan rentang dan batas saat agenda mendatang diminta", async () => {
    vi.mocked(repo.findUpcomingAgendas).mockResolvedValue([]);

    const from = new Date("2026-01-10");

    await secretariatService.listUpcomingAgendas({ from, limit: 5 });

    expect(repo.findUpcomingAgendas).toHaveBeenCalledWith({ from, limit: 5 });
  });

  it("meneruskan tahun saat tren bulanan diminta", async () => {
    vi.mocked(repo.countIncomingMailsByMonth).mockResolvedValue([]);
    vi.mocked(repo.countOutgoingMailsByMonth).mockResolvedValue([]);

    await secretariatService.countIncomingMailsByMonth(2026);
    await secretariatService.countOutgoingMailsByMonth(2026);

    expect(repo.countIncomingMailsByMonth).toHaveBeenCalledWith(2026);
    expect(repo.countOutgoingMailsByMonth).toHaveBeenCalledWith(2026);
  });

  it("meneruskan statistik dasbor", async () => {
    vi.mocked(repo.getDashboardStats).mockResolvedValue({
      totalIncomingMails: 2,
      totalOutgoingMails: 3,
      pendingDispositions: 1,
      totalAdministrativeDocuments: 4,
      totalAgenda: 5,
    });

    const stats = await secretariatService.getDashboardStats();

    expect(repo.getDashboardStats).toHaveBeenCalledTimes(1);
    expect(stats).toEqual({
      totalIncomingMails: 2,
      totalOutgoingMails: 3,
      pendingDispositions: 1,
      totalAdministrativeDocuments: 4,
      totalAgenda: 5,
    });
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

  it.each([
    ["PENDING", "IN_PROGRESS", true],
    ["PENDING", "CANCELLED", true],
    ["IN_PROGRESS", "COMPLETED", true],
    ["IN_PROGRESS", "CANCELLED", true],
    ["COMPLETED", "PENDING", false],
    ["COMPLETED", "IN_PROGRESS", false],
    ["CANCELLED", "PENDING", false],
    ["PENDING", "PENDING", false],
    ["COMPLETED", "COMPLETED", false],
    ["CANCELLED", "CANCELLED", false],
  ] as const)(
    "disposisi %s ke %s diizinkan: %s",
    (from, to, expected) => {
      expect(canTransition(VALID_DISPOSITION_TRANSITIONS, from, to)).toBe(
        expected,
      );
    },
  );

  it.each([
    ["DRAFT", "SUBMITTED", true],
    ["DRAFT", "REJECTED", true],
    ["SUBMITTED", "APPROVED", true],
    ["SUBMITTED", "REJECTED", true],
    ["APPROVED", "ARCHIVED", true],
    ["REJECTED", "DRAFT", true],
    ["APPROVED", "SUBMITTED", false],
    ["DRAFT", "APPROVED", false],
    ["ARCHIVED", "DRAFT", false],
    ["DRAFT", "DRAFT", false],
    ["APPROVED", "APPROVED", false],
    ["ARCHIVED", "ARCHIVED", false],
  ] as const)(
    "dokumen administrasi %s ke %s diizinkan: %s",
    (from, to, expected) => {
      expect(
        canTransition(
          VALID_ADMINISTRATIVE_DOCUMENT_TRANSITIONS,
          from,
          to,
        ),
      ).toBe(expected);
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
