import Link from "next/link";
import {
  BadgeCheck,
  ShieldAlert,
  CalendarDays,
  Stamp,
  FileSearch,
  FileText,
} from "lucide-react";

import { LETTER_TYPES } from "@/config/letter-types";
import {
  getOutgoingMailByVerificationCode,
  getMediaByFileId,
} from "@/modules/secretariat/queries/secretariat.query";
import { extractFileIdFromMediaUrl } from "@/modules/secretariat/application/drive-archive.service";
import { LetterPlate } from "@/components/admin/shared/letter-plate";
import { VerificationForm } from "../verification-form";

const INLINE_VIEWABLE_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

interface VerifyLetterPageProps {
  params: Promise<{ kode: string[] }>;
}

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Terkirim",
  ARCHIVED: "Diarsipkan",
};

export default async function VerifyLetterPage({
  params,
}: VerifyLetterPageProps) {
  const { kode: kodeSegments } = await params;
  const kode = decodeURIComponent(kodeSegments.join("/"));
  const letter = await getOutgoingMailByVerificationCode(kode);

  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const category = LETTER_TYPES.find(
    (type) => type.key === letter?.categoryCode,
  );
  const attachmentFileId = letter?.attachmentUrl
    ? extractFileIdFromMediaUrl(letter.attachmentUrl)
    : null;
  const fileSrc = attachmentFileId
    ? `/api/v1/verifikasi/surat/${encodeURIComponent(kode)}?preview=1`
    : null;
  const attachmentMedia = attachmentFileId
    ? await getMediaByFileId(attachmentFileId)
    : null;
  const hasPreview = letter !== null && fileSrc !== null;
  const canPreviewInline =
    hasPreview &&
    (attachmentMedia?.mimeType
      ? INLINE_VIEWABLE_MIME.has(attachmentMedia.mimeType)
      : true);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <div className="text-center">
        <Link
          href="/"
          className="text-sm font-semibold text-balance text-foreground"
        >
          LIM Digital Platform
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">
          Layanan verifikasi keaslian surat
        </p>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-3">
        <VerificationForm />
      </div>

      {letter ? (
        <div className="mt-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-50 px-6 py-4 dark:bg-emerald-950/30">
            <div className="flex items-center gap-2">
              <BadgeCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Surat Sah
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {letter.verificationCode}
            </span>
          </div>

          {letter.fullNumber && (
            <div className="border-b px-6 py-5">
              <div className="flex flex-col items-center gap-3">
                <LetterPlate fullNumber={letter.fullNumber} />
                <p className="text-xs text-muted-foreground">
                  Nomor terdaftar di sistem penomoran LIM
                </p>
              </div>
            </div>
          )}

          <dl className="divide-y">
            {[
              [
                "Jenis Surat",
                category
                  ? `${category.key} — ${category.label}`
                  : (letter.categoryCode ?? "—"),
              ],
              ["Perihal", letter.subject],
              ["Tanggal Surat", formatDate(letter.mailDate)],
              ["Penerima", letter.recipient ?? "—"],
              ["Penandatangan       :"],
              [
                "Ketua",
                letter.ketuaName
                  ? `${letter.ketuaName}${letter.ketuaPosition ? ` (${letter.ketuaPosition})` : ""}`
                  : "—",
              ],
              [
                "Sekretaris",
                letter.sekretarisName
                  ? `${letter.sekretarisName}${letter.sekretarisPosition ? ` (${letter.sekretarisPosition})` : ""}`
                  : "—",
              ],
              ["Status Terkini", statusLabels[letter.status] ?? letter.status],
              ["Diterbitkan", formatDate(letter.sentAt ?? letter.mailDate)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[150px_1fr] gap-4 px-6 py-3"
              >
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="min-w-0 wrap-break-words text-sm font-medium">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex items-center gap-3 border-t bg-muted/40 px-6 py-4">
            <Stamp className="size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Lembar ini adalah pengesahan digital dari sekretariat LIM.
              Bandingkan QR pada lembar cetak surat Anda dengan kode di atas.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-destructive/30 bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-destructive/20 bg-destructive/5 px-6 py-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-destructive" />
              <span className="text-sm font-semibold text-destructive">
                Surat Tidak Ditemukan
              </span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {kode}
            </span>
          </div>
          <div className="px-6 py-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Kode verifikasi <span className="font-mono">{kode}</span> tidak
              ditemukan pada sistem kami. Kemungkinan kode salah ketik, surat
              belum ditandatangani, atau dokumen tersebut memang tidak
              diterbitkan melalui platform ini. Hubungi sekretariat untuk
              klarifikasi.
            </p>
          </div>
        </div>
      )}

      {hasPreview && (
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <FileSearch className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Dokumen Asli</h2>
          </div>
          {canPreviewInline ? (
            <div className="relative mt-3 h-[80vh] select-none overflow-hidden rounded-lg border shadow-sm">
              <iframe
                src={fileSrc ?? undefined}
                title={`Dokumen ${letter?.fullNumber ?? letter?.subject}`}
                className="h-full w-full"
              />
              <div className="pointer-events-none absolute inset-0 z-10 flex select-none items-center justify-center">
                <span className="-rotate-45 whitespace-nowrap rounded border border-foreground/20 px-8 py-1 text-lg font-semibold uppercase text-foreground/15 select-none">
                  Salinan Digital
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex flex-col items-center justify-center gap-3 rounded-lg border bg-muted/40 px-6 py-10 text-center">
              <FileText className="size-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {attachmentMedia?.originalName ?? "Dokumen asli"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Dokumen asli tidak dapat ditampilkan di halaman ini.
                  Hubungi sekretariat untuk salinan resmi.
                </p>
              </div>
            </div>
          )}
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Dokumen ini adalah salinan digital yang dibubuhi tanda air untuk
            mencegah penyalahgunaan.
          </p>
        </div>
      )}

      <div className="mt-10 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <CalendarDays className="size-3.5" />
        Sistem Verifikasi Surat LIM
      </div>
    </div>
  );
}
