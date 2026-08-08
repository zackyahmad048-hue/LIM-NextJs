import { notFound } from "next/navigation";

import { getOutgoingMailById } from "@/modules/secretariat/queries/secretariat.query";
import { getLetterTypeLabel } from "@/config/letter-types";
import {
  getLetterVerificationUrl,
  renderQrPng,
} from "@/modules/secretariat/application/qr-code";
import { SITE } from "@/config/site";
import { PrintButton } from "./print-button";

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Diajukan",
  REVIEWED: "Direview",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
  SIGNED: "Ditandatangani",
  SENT: "Terkirim",
  ARCHIVED: "Diarsipkan",
};

export default async function CetakOutgoingMailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mail = await getOutgoingMailById(id);

  if (!mail) notFound();

  const officialNumber = mail.fullNumber ?? mail.registrationNumber;
  const validationUrl = mail.fullNumber
    ? getLetterVerificationUrl(mail.fullNumber)
    : null;
  const qrDataUrl = validationUrl
    ? `data:image/png;base64,${(await renderQrPng(validationUrl)).toString("base64")}`
    : null;

  return (
    <div className="min-h-screen bg-neutral-100 print:bg-white">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-3 print:hidden">
        <p className="text-sm text-muted-foreground">
          {officialNumber} &middot; {statusLabels[mail.status] ?? mail.status}
        </p>
        <PrintButton />
      </div>

      {/* Letter */}
      <div className="mx-auto max-w-[210mm] bg-white px-8 py-10 shadow-sm print:shadow-none print:px-6 print:py-8">
        {/* Kop Surat */}
        <div className="border-b-2 border-black pb-4 text-center">
          <h1 className="text-lg font-bold uppercase tracking-wide">
            {SITE.title}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {SITE.email}
            {SITE.phone ? ` · ${SITE.phone}` : ""}
          </p>
        </div>

        {/* Meta */}
        <div className="mt-6 space-y-1 text-sm">
          <div className="flex">
            <span className="w-28 shrink-0 font-semibold">Nomor</span>
            <span>: {officialNumber}</span>
          </div>
          <div className="flex">
            <span className="w-28 shrink-0 font-semibold">Lampiran</span>
            <span>: -</span>
          </div>
          <div className="flex">
            <span className="w-28 shrink-0 font-semibold">Perihal</span>
            <span>: {mail.subject}</span>
          </div>
          {mail.categoryCode && (
            <div className="flex">
              <span className="w-28 shrink-0 font-semibold">Jenis Surat</span>
              <span>: {getLetterTypeLabel(mail.categoryCode)}</span>
            </div>
          )}
          {mail.levelCode && (
            <div className="flex">
              <span className="w-28 shrink-0 font-semibold">Tingkat</span>
              <span>: {mail.levelCode}</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="mt-8 whitespace-pre-line text-sm leading-relaxed">
          {mail.content || "[Belum ada konten surat]"}
        </div>

        {/* QR Code */}
        {qrDataUrl && (
          <div className="mt-10 flex flex-col items-end border-t pt-4">
            <div className="flex size-24 items-center justify-center rounded border bg-white p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="QR Code Verifikasi"
                className="size-full"
              />
            </div>
            <p className="mt-1 text-[9px] text-muted-foreground">
              Scan QR atau kunjungi halaman verifikasi dengan nomor surat
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
