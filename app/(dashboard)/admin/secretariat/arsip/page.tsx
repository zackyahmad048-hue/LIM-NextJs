import Link from "next/link";
import { formatDateId } from "@/lib/format";
import { ExternalLink, FileText, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";

import { getArchiveData } from "@/modules/secretariat/queries/secretariat.query";
import { extractFileIdFromMediaUrl } from "@/modules/secretariat/application/drive-archive.service";

const documentTypeLabels: Record<string, string> = {
  SURAT_KETERANGAN: "Surat Keterangan",
  SURAT_TUGAS: "Surat Tugas",
  SURAT_KEPUTUSAN: "Surat Keputusan",
  SURAT_UNDANGAN: "Surat Undangan",
  LAINNYA: "Lainnya",
};

function AttachmentLink({ url, label }: { url: string | null; label: string }) {
  const fileId = url ? extractFileIdFromMediaUrl(url) : null;
  if (!fileId) return null;
  return (
    <Button asChild variant="ghost" size="sm" aria-label={label} title={label}>
      <a href={`/api/media/${encodeURIComponent(fileId)}`} target="_blank">
        <ExternalLink className="size-3.5" />
      </a>
    </Button>
  );
}

export const dynamic = "force-dynamic";

export default async function ArsipPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const { outgoing, incoming, documents } = await getArchiveData({
    search: params.search,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Arsip"
        description="Kumpulan surat dan dokumen terarsip — hanya baca, diagregasi otomatis dari surat menyurat."
        actions={
          <div className="flex items-center gap-2">
            <Input
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Cari perihal, nomor, atau pengirim..."
              className="rounded-md text-xs"
            />
            <Button type="submit" size="sm" variant="secondary">
              <Search className="size-3.5" /> Cari
            </Button>
          </div>
        }
      />

      <div className="mt-4 space-y-6">
        <DataTable
          title="Surat Keluar Terarsip"
          description={`${outgoing.length} surat keluar yang telah diarsipkan.`}
          columns={[
            {
              key: "fullNumber",
              label: "Nomor Surat",
              render: (item) =>
                item.fullNumber ? (
                  <LetterPlate fullNumber={item.fullNumber} size="sm" />
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                ),
            },
            {
              key: "subject",
              label: "Perihal",
              render: (item) => (
                <div className="max-w-[240px]">
                  <p className="truncate text-sm font-medium">{item.subject}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.recipient ?? "-"}
                  </p>
                </div>
              ),
            },
            {
              key: "archivedAt",
              label: "Tanggal Arsip",
              render: (item) => (
                <span className="text-xs">{formatDateId(item.archivedAt, { fallback: "—" })}</span>
              ),
            },
            {
              key: "actions",
              label: "Aksi",
              align: "right",
              render: (item) => {
                return (
                  <div className="flex justify-end gap-1">
                    <AttachmentLink
                      url={item.attachmentUrl}
                      label="Buka lampiran"
                    />
                    <Button asChild variant="ghost" size="sm" aria-label="Buka surat" title="Buka surat">
                      <Link
                        href={`/admin/secretariat/outgoing-mail/${item.id}/edit`}
                      >
                        <FileText className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                );
              },
            },
          ]}
          data={outgoing}
          emptyMessage="Belum ada surat keluar yang diarsipkan."
        />

        <DataTable
          title="Surat Masuk Terarsip"
          description={`${incoming.length} surat masuk yang telah diarsipkan.`}
          columns={[
            {
              key: "registrationNumber",
              label: "No. Surat Pengirim",
              render: (item) => (
                <span className="text-xs text-muted-foreground">
                  {item.registrationNumber}
                </span>
              ),
            },
            {
              key: "sender",
              label: "Pengirim",
              render: (item) => (
                <div className="max-w-[200px]">
                  <p className="truncate text-sm font-medium">{item.sender}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.senderAddress ?? ""}
                  </p>
                </div>
              ),
            },
            {
              key: "subject",
              label: "Perihal",
              render: (item) => <span className="truncate text-xs">{item.subject}</span>,
            },
            {
              key: "archivedAt",
              label: "Tanggal Arsip",
              render: (item) => (
                <span className="text-xs">{formatDateId(item.archivedAt, { fallback: "—" })}</span>
              ),
            },
            {
              key: "actions",
              label: "Aksi",
              align: "right",
              render: (item) => {
                return (
                  <div className="flex justify-end gap-1">
                    <AttachmentLink
                      url={item.attachmentUrl}
                      label="Buka lampiran"
                    />
                    <Button asChild variant="ghost" size="sm" aria-label="Buka surat" title="Buka surat">
                      <Link
                        href={`/admin/secretariat/incoming-mail/${item.id}/edit`}
                      >
                        <FileText className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                );
              },
            },
          ]}
          data={incoming}
          emptyMessage="Belum ada surat masuk yang diarsipkan."
        />

        <DataTable
          title="Dokumen Administrasi"
          description={`${documents.length} dokumen administrasi terarsip.`}
          columns={[
            {
              key: "documentNumber",
              label: "No. Dokumen",
              render: (item) => (
                <span className="text-xs text-muted-foreground">
                  {item.documentNumber}
                </span>
              ),
            },
            {
              key: "title",
              label: "Judul",
              render: (item) => {
                return (
                  <div className="max-w-[240px]">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    {item.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                );
              },
            },
            {
              key: "documentType",
              label: "Jenis Dokumen",
              render: (item) => (
                <span className="text-xs">
                  {documentTypeLabels[item.documentType] ?? item.documentType}
                </span>
              ),
            },
            {
              key: "archivedAt",
              label: "Tanggal Arsip",
              render: (item) => (
                <span className="text-xs">
                  {formatDateId(
                    item.archivedAt ?? item.approvedAt,
                    { fallback: "—" }
                  )}
                </span>
              ),
            },
          ]}
          data={documents}
          emptyMessage="Belum ada dokumen administrasi terarsip."
        />
      </div>
    </PageContainer>
  );
}