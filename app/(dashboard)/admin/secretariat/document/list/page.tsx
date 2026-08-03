import Link from "next/link";
import { ExternalLink, FileText, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import { getAdministrativeDocuments } from "@/modules/secretariat/queries/secretariat.query";
import {
  deleteAdministrativeDocument,
  generateAdministrativeDocument,
} from "@/modules/secretariat/presentation/secretariat.action";

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  DRAFT: { label: "Draft", variant: "outline" },
  SUBMITTED: { label: "Diajukan", variant: "default" },
  APPROVED: { label: "Disetujui", variant: "secondary" },
  REJECTED: { label: "Ditolak", variant: "destructive" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

const documentTypeLabels: Record<string, string> = {
  SURAT_KETERANGAN: "Surat Keterangan",
  SURAT_TUGAS: "Surat Tugas",
  SURAT_KEPUTUSAN: "Surat Keputusan",
  SURAT_UNDANGAN: "Surat Undangan",
  LAINNYA: "Lainnya",
};

export default async function DocumentListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { items, total } = await getAdministrativeDocuments({
    search: params.search,
    status: params.status,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Dokumen Administrasi"
        description="Kelola seluruh dokumen administrasi organisasi."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/secretariat/document/new">
              <Plus className="size-4" />
              Dokumen Baru
            </Link>
          </Button>
        }
      />

      <AdminTable
        title="Dokumen Administrasi"
        description={`${total} dokumen ditemukan.`}
        columns={[
          {
            key: "documentNumber",
            label: "No. Dokumen",
            render: (item) => (
              <span className="text-xs font-mono text-muted-foreground">
                {item.documentNumber}
              </span>
            ),
          },
          {
            key: "title",
            label: "Judul",
            render: (item) => (
              <div className="max-w-[250px]">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {documentTypeLabels[item.documentType] ?? item.documentType}
                </p>
              </div>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (item) => {
              const s = statusLabels[item.status] ?? {
                label: item.status,
                variant: "outline" as const,
              };
              return (
                <Badge variant={s.variant} className="h-5 px-2 text-[11px]">
                  {s.label}
                </Badge>
              );
            },
          },
          {
            key: "actions",
            label: "Aksi",
            align: "right",
            render: (item) => (
              <div className="flex justify-end gap-1">
                {item.googleDocUrl && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    title="Buka di Google Docs"
                  >
                    <a
                      href={item.googleDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                )}
                <form
                  action={generateAdministrativeDocument.bind(null, item.id)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Buat dokumen di Google Docs"
                  >
                    <FileText className="size-3.5" />
                  </Button>
                </form>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/secretariat/document/${item.id}/edit`}>
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <form action={deleteAdministrativeDocument.bind(null, item.id)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </form>
              </div>
            ),
          },
        ]}
        data={items as any[]}
        emptyMessage="Belum ada dokumen administrasi. Buat dokumen pertama Anda."
      />
    </PageContainer>
  );
}
