import { notFound } from "next/navigation";
import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

import { getOutgoingMailById } from "@/modules/secretariat/queries/secretariat.query";
import { SITE } from "@/config/site";

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  APPROVED: "Disetujui",
  SENT: "Terkirim",
  ARCHIVED: "Diarsipkan",
};

const typeLabels: Record<string, string> = {
  UNDANGAN: "Undangan",
  PERMOHONAN: "Permohonan",
  PEMBERITAHUAN: "Pemberitahuan",
  INSTRUKSI: "Instruksi",
  KETERANGAN: "Keterangan",
  KEPUTUSAN: "Keputusan",
  TERIMA_KASIH: "Terima Kasih",
  LAINNYA: "Lain-lain",
};

export default async function CetakOutgoingMailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mail = await getOutgoingMailById(id);

  if (!mail) notFound();

  const validationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify/surat/${mail.id}`;

  return (
    <div className="min-h-screen bg-neutral-100 print:bg-white">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-3 print:hidden">
        <p className="text-sm text-muted-foreground">
          {mail.registrationNumber} &middot; {statusLabels[mail.status] ?? mail.status}
        </p>
        <div className="flex gap-2">
          {mail.googleDocUrl && (
            <Button asChild size="sm" variant="outline">
              <a href={mail.googleDocUrl} target="_blank" rel="noopener noreferrer">
                Buka di Google Docs
              </a>
            </Button>
          )}
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="size-3.5" />
            Cetak / PDF
          </Button>
        </div>
      </div>

      {/* Letter */}
      <div className="mx-auto max-w-[210mm] bg-white px-8 py-10 shadow-sm print:shadow-none print:px-6 print:py-8">
        {/* Kop Surat */}
        <div className="border-b-2 border-black pb-4 text-center">
          <h1 className="text-lg font-bold uppercase tracking-wide">{SITE.title}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {SITE.email}{SITE.phone ? ` · ${SITE.phone}` : ""}
          </p>
        </div>

        {/* Meta */}
        <div className="mt-6 space-y-1 text-sm">
          <div className="flex">
            <span className="w-28 shrink-0 font-semibold">Nomor</span>
            <span>: {mail.registrationNumber}</span>
          </div>
          <div className="flex">
            <span className="w-28 shrink-0 font-semibold">Lampiran</span>
            <span>: -</span>
          </div>
          <div className="flex">
            <span className="w-28 shrink-0 font-semibold">Perihal</span>
            <span>: {mail.subject}</span>
          </div>
          {mail.documentType && (
            <div className="flex">
              <span className="w-28 shrink-0 font-semibold">Jenis Surat</span>
              <span>: {typeLabels[mail.documentType] ?? mail.documentType}</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="mt-8 whitespace-pre-line text-sm leading-relaxed">
          {mail.content || "[Belum ada konten surat]"}
        </div>

        {/* QR Code */}
        <div className="mt-10 flex flex-col items-end border-t pt-4">
          <div className="flex size-24 items-center justify-center rounded border bg-white p-1.5">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(validationUrl)}`}
              alt="QR Code Validasi"
              className="size-full"
            />
          </div>
          <p className="mt-1 text-[9px] text-muted-foreground">
            Scan untuk verifikasi
          </p>
        </div>
      </div>
    </div>
  );
}
