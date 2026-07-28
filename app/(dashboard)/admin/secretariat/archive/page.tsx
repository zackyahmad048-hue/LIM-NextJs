import { Archive, FolderOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import { getDocumentArchives } from "@/modules/secretariat/queries/secretariat.query";

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

const documentTypeLabels: Record<string, string> = {
  SURAT_KETERANGAN: "Surat Keterangan",
  SURAT_TUGAS: "Surat Tugas",
  SURAT_KEPUTUSAN: "Surat Keputusan",
  SURAT_UNDANGAN: "Surat Undangan",
  LAINNYA: "Lainnya",
};

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { items, total } = await getDocumentArchives({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Arsip Dokumen"
        description="Daftar dokumen yang telah diarsipkan (hanya baca)."
      />

      <AdminTable
        title="Arsip"
        description={`${total} arsip ditemukan.`}
        columns={[
          {
            key: "archiveNumber",
            label: "No. Arsip",
            render: (item) => (
              <span className="text-xs font-mono text-muted-foreground">{item.archiveNumber}</span>
            ),
          },
          {
            key: "title",
            label: "Judul",
            render: (item) => (
              <div className="max-w-[250px]">
                <p className="truncate text-sm font-medium">{item.title}</p>
                {item.category && (
                  <p className="truncate text-xs text-muted-foreground">{item.category}</p>
                )}
              </div>
            ),
          },
          {
            key: "documentType",
            label: "Jenis Dokumen",
            render: (item) => (
              <span className="text-xs">{documentTypeLabels[item.documentType] ?? item.documentType}</span>
            ),
          },
          {
            key: "retentionYear",
            label: "Masa Retensi",
            render: (item) => (
              <span className="text-xs">{item.retentionYear ? `${item.retentionYear} tahun` : "-"}</span>
            ),
          },
          {
            key: "archivedAt",
            label: "Tanggal Arsip",
            render: (item) => (
              <span className="text-xs">{formatDate(item.archivedAt)}</span>
            ),
          },
        ]}
        data={items as any[]}
        emptyMessage="Belum ada arsip dokumen."
      />
    </PageContainer>
  );
}
