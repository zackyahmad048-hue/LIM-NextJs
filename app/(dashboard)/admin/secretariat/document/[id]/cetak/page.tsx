import { notFound } from "next/navigation";
import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

import { getAdministrativeDocumentById } from "@/modules/secretariat/queries/secretariat.query";
import { SITE } from "@/config/site";

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Diajukan",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
  ARCHIVED: "Diarsipkan",
};

const typeLabels: Record<string, string> = {
  SURAT_KETERANGAN: "Surat Keterangan",
  SURAT_TUGAS: "Surat Tugas",
  SURAT_KEPUTUSAN: "Surat Keputusan",
  SURAT_UNDANGAN: "Surat Undangan",
  LAINNYA: "Lainnya",
};

export default async function CetakDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getAdministrativeDocumentById(id);

  if (!doc) notFound();

  return (
    <div className="min-h-screen bg-neutral-100 print:bg-white">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-3 print:hidden">
        <p className="text-sm text-muted-foreground">
          {doc.documentNumber} &middot; {statusLabels[doc.status] ?? doc.status}
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="size-3.5" />
            Cetak / PDF
          </Button>
        </div>
      </div>

      {/* Document */}
      {doc.attachmentUrl ? (
        <div className="mx-auto max-w-[210mm] bg-white p-4 shadow-sm print:shadow-none print:p-0">
          <div className="overflow-hidden rounded border">
            <iframe
              src={doc.attachmentUrl}
              title={`Dokumen ${doc.documentNumber}`}
              className="h-[1200px] w-full print:h-[auto] print:min-h-[900mm]"
            />
          </div>
        </div>
      ) : (
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
              <span>: {doc.documentNumber}</span>
            </div>
            {doc.documentType && (
              <div className="flex">
                <span className="w-28 shrink-0 font-semibold">
                  Jenis Dokumen
                </span>
                <span>
                  : {typeLabels[doc.documentType] ?? doc.documentType}
                </span>
              </div>
            )}
            <div className="flex">
              <span className="w-28 shrink-0 font-semibold">Perihal</span>
              <span>: {doc.title}</span>
            </div>
            {doc.description && (
              <div className="flex">
                <span className="w-28 shrink-0 font-semibold">Keterangan</span>
                <span>: {doc.description}</span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="mt-8 whitespace-pre-line text-sm leading-relaxed">
            {doc.content || "[Belum ada konten dokumen]"}
          </div>

          {/* Signature */}
          <div className="mt-16 flex justify-end text-sm">
            <div className="w-56 text-center">
              <p>Mengetahui,</p>
              {doc.approvedAt ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(doc.approvedAt)}
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(new Date())}
                </p>
              )}
              <div className="mt-24 border-b border-black" />
              <p className="mt-1 font-semibold">Pejabat Berwenang</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
