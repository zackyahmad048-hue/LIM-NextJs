import { getPayloadClient } from "@/modules/cms/infrastructure/payload";

export interface ReportRow {
  kode: string;
  indikator: string;
  nilai: string;
  diperbarui: string;
}

function fmt(value: number | bigint): string {
  return value.toString();
}

async function countNotDeleted(
  collection:
    | "incoming-mails"
    | "outgoing-mails"
    | "dispositions"
    | "administrative-documents",
  status?: string,
): Promise<number> {
  const payload = await getPayloadClient();
  const where: Record<string, unknown> =
    status != null
      ? {
          and: [
            { deletedAt: { exists: false } },
            { status: { equals: status } },
          ],
        }
      : { deletedAt: { exists: false } };
  const res = await payload.count({
    collection,
    where: where as never,
  });
  return res.totalDocs;
}

export async function getSecretariatProjectionData(): Promise<ReportRow[]> {
  const [
    incomingTotal,
    incomingReceived,
    incomingProcessed,
    incomingArchived,
    outgoingTotal,
    outgoingDraft,
    outgoingSent,
    outgoingArchived,
    pendingDispositions,
    adminDocs,
  ] = await Promise.all([
    countNotDeleted("incoming-mails"),
    countNotDeleted("incoming-mails", "RECEIVED"),
    countNotDeleted("incoming-mails", "PROCESSED"),
    countNotDeleted("incoming-mails", "ARCHIVED"),
    countNotDeleted("outgoing-mails"),
    countNotDeleted("outgoing-mails", "DRAFT"),
    countNotDeleted("outgoing-mails", "SENT"),
    countNotDeleted("outgoing-mails", "ARCHIVED"),
    countNotDeleted("dispositions", "PENDING"),
    countNotDeleted("administrative-documents"),
  ]);

  const updatedAt = new Date().toISOString();
  return [
    { kode: "im.total", indikator: "Surat Masuk", nilai: fmt(incomingTotal), diperbarui: updatedAt },
    { kode: "im.received", indikator: "Surat Masuk · Diterima", nilai: fmt(incomingReceived), diperbarui: updatedAt },
    { kode: "im.processed", indikator: "Surat Masuk · Diproses", nilai: fmt(incomingProcessed), diperbarui: updatedAt },
    { kode: "im.archived", indikator: "Surat Masuk · Diarsipkan", nilai: fmt(incomingArchived), diperbarui: updatedAt },
    { kode: "om.total", indikator: "Surat Keluar", nilai: fmt(outgoingTotal), diperbarui: updatedAt },
    { kode: "om.draft", indikator: "Surat Keluar · Draf", nilai: fmt(outgoingDraft), diperbarui: updatedAt },
    { kode: "om.sent", indikator: "Surat Keluar · Terkirim", nilai: fmt(outgoingSent), diperbarui: updatedAt },
    { kode: "om.archived", indikator: "Surat Keluar · Diarsipkan", nilai: fmt(outgoingArchived), diperbarui: updatedAt },
    { kode: "disposition.pending", indikator: "Disposisi · Pending", nilai: fmt(pendingDispositions), diperbarui: updatedAt },
    { kode: "doc.total", indikator: "Dokumen Administrasi", nilai: fmt(adminDocs), diperbarui: updatedAt },
  ];
}

export async function getFalakProjectionData(): Promise<ReportRow[]> {
  const payload = await getPayloadClient();
  const [prayerTimes, qibla, hijri, hisab, rukyat, eclipse] =
    await Promise.all([
      payload.count({ collection: "falak-prayer-times" }),
      payload.count({ collection: "falak-qiblas" }),
      payload.count({ collection: "falak-hijri-calendars" }),
      payload.count({
        collection: "falak-hisabs",
        where: { deletedAt: { exists: false } } as never,
      }),
      payload.count({
        collection: "falak-rukyats",
        where: { deletedAt: { exists: false } } as never,
      }),
      payload.count({ collection: "falak-eclipses" }),
    ]);

  const updatedAt = new Date().toISOString();
  return [
    { kode: "prayer-time.total", indikator: "Jadwal Shalat", nilai: fmt(prayerTimes.totalDocs), diperbarui: updatedAt },
    { kode: "qibla.total", indikator: "Arah Kiblat", nilai: fmt(qibla.totalDocs), diperbarui: updatedAt },
    { kode: "hijri.total", indikator: "Kalender Hijriah", nilai: fmt(hijri.totalDocs), diperbarui: updatedAt },
    { kode: "hisab.total", indikator: "Hisab", nilai: fmt(hisab.totalDocs), diperbarui: updatedAt },
    { kode: "rukyat.total", indikator: "Rukyat", nilai: fmt(rukyat.totalDocs), diperbarui: updatedAt },
    { kode: "eclipse.total", indikator: "Gerhana", nilai: fmt(eclipse.totalDocs), diperbarui: updatedAt },
  ];
}
