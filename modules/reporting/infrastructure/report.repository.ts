import { prisma } from "@/modules/shared/infrastructure/prisma";

export interface ReportRow {
  kode: string;
  indikator: string;
  nilai: string;
  diperbarui: string;
}

function fmt(value: number | bigint): string {
  return value.toString();
}

export async function getSecretariatProjectionData(): Promise<ReportRow[]> {
  const [
    incomingTotal,
    incomingReceived,
    incomingProcessed,
    incomingArchived,
    outgoingTotal,
    outgoingDraft,
    outgoingApproved,
    outgoingSent,
    outgoingArchived,
    pendingDispositions,
    adminDocs,
    verifiedLetters,
  ] = await Promise.all([
    prisma.incomingMail.count({ where: { deletedAt: null } }),
    prisma.incomingMail.count({ where: { status: "RECEIVED", deletedAt: null } }),
    prisma.incomingMail.count({ where: { status: "PROCESSED", deletedAt: null } }),
    prisma.incomingMail.count({ where: { status: "ARCHIVED", deletedAt: null } }),
    prisma.outgoingMail.count({ where: { deletedAt: null } }),
    prisma.outgoingMail.count({ where: { status: "DRAFT", deletedAt: null } }),
    prisma.outgoingMail.count({ where: { status: "APPROVED", deletedAt: null } }),
    prisma.outgoingMail.count({ where: { status: "SENT", deletedAt: null } }),
    prisma.outgoingMail.count({ where: { status: "ARCHIVED", deletedAt: null } }),
    prisma.disposition.count({ where: { status: "PENDING", deletedAt: null } }),
    prisma.administrativeDocument.count({ where: { deletedAt: null } }),
    prisma.verifiedLetter.count({ where: { deletedAt: null } }),
  ]);

  const updatedAt = new Date().toISOString();
  return [
    { kode: "im.total", indikator: "Surat Masuk", nilai: fmt(incomingTotal), diperbarui: updatedAt },
    { kode: "im.received", indikator: "Surat Masuk · Diterima", nilai: fmt(incomingReceived), diperbarui: updatedAt },
    { kode: "im.processed", indikator: "Surat Masuk · Diproses", nilai: fmt(incomingProcessed), diperbarui: updatedAt },
    { kode: "im.archived", indikator: "Surat Masuk · Diarsipkan", nilai: fmt(incomingArchived), diperbarui: updatedAt },
    { kode: "om.total", indikator: "Surat Keluar", nilai: fmt(outgoingTotal), diperbarui: updatedAt },
    { kode: "om.draft", indikator: "Surat Keluar · Draf", nilai: fmt(outgoingDraft), diperbarui: updatedAt },
    { kode: "om.approved", indikator: "Surat Keluar · Disetujui", nilai: fmt(outgoingApproved), diperbarui: updatedAt },
    { kode: "om.sent", indikator: "Surat Keluar · Terkirim", nilai: fmt(outgoingSent), diperbarui: updatedAt },
    { kode: "om.archived", indikator: "Surat Keluar · Diarsipkan", nilai: fmt(outgoingArchived), diperbarui: updatedAt },
    { kode: "disposition.pending", indikator: "Disposisi · Pending", nilai: fmt(pendingDispositions), diperbarui: updatedAt },
    { kode: "doc.total", indikator: "Dokumen Administrasi", nilai: fmt(adminDocs), diperbarui: updatedAt },
    { kode: "letter.total", indikator: "Surat Terverifikasi (QR)", nilai: fmt(verifiedLetters), diperbarui: updatedAt },
  ];
}

export async function getFalakProjectionData(): Promise<ReportRow[]> {
  const [prayerTimes, qibla, hijri, hisab, rukyat, eclipse] =
    await Promise.all([
      prisma.falakPrayerTime.count(),
      prisma.falakQibla.count(),
      prisma.falakHijriCalendar.count(),
      prisma.falakHisab.count({ where: { deletedAt: null } }),
      prisma.falakRukyat.count({ where: { deletedAt: null } }),
      prisma.falakEclipse.count(),
    ]);

  const updatedAt = new Date().toISOString();
  return [
    { kode: "prayer-time.total", indikator: "Jadwal Shalat", nilai: fmt(prayerTimes), diperbarui: updatedAt },
    { kode: "qibla.total", indikator: "Arah Kiblat", nilai: fmt(qibla), diperbarui: updatedAt },
    { kode: "hijri.total", indikator: "Kalender Hijriah", nilai: fmt(hijri), diperbarui: updatedAt },
    { kode: "hisab.total", indikator: "Hisab", nilai: fmt(hisab), diperbarui: updatedAt },
    { kode: "rukyat.total", indikator: "Rukyat", nilai: fmt(rukyat), diperbarui: updatedAt },
    { kode: "eclipse.total", indikator: "Gerhana", nilai: fmt(eclipse), diperbarui: updatedAt },
  ];
}
