import Link from "next/link";
import {
  Archive,
  CheckCircle,
  FileText,
  Pencil,
  Plus,
  Send,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import { getAdministrativeDocuments } from "@/modules/secretariat/queries/secretariat.query";
import {
  deleteAdministrativeDocument,
  transitionAdministrativeDocumentStatus,
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

const statusActions: Record<
  string,
  {
    label: string;
    status: string;
    icon: typeof Send;
    variant: "default" | "secondary" | "destructive" | "outline";
  }[]
> = {
  DRAFT: [{ label: "Ajukan", status: "SUBMITTED", icon: Send, variant: "default" }],
  SUBMITTED: [
    { label: "Setujui", status: "APPROVED", icon: CheckCircle, variant: "default" },
    { label: "Tolak", status: "REJECTED", icon: XCircle, variant: "destructive" },
  ],
  APPROVED: [
    { label: "Arsipkan", status: "ARCHIVED", icon: Archive, variant: "outline" },
  ],
  REJECTED: [],
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
        toolbar={
          <TableSearchForm
            basePath="/admin/secretariat/document/list"
            defaultValue={params.search ?? ""}
            placeholder="Cari dokumen..."
          />
        }
        pagination={
          <TablePagination
            page={params.page ? Number(params.page) : 1}
            pageSize={20}
            total={total}
            basePath="/admin/secretariat/document/list"
            queryParams={{ search: params.search, status: params.status }}
          />
        }
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
                {(statusActions[item.status] ?? []).map((action) => {
                  const Icon = action.icon;
                  return (
                    <form
                      key={action.status}
                      action={transitionAdministrativeDocumentStatus.bind(
                        null,
                        item.id,
                        action.status,
                      )}
                    >
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        aria-label={action.label}
                        title={action.label}
                      >
                        <Icon className="size-3.5" />
                        <span className="hidden xl:inline">{action.label}</span>
                      </Button>
                    </form>
                  );
                })}
                <Button asChild variant="ghost" size="sm" aria-label="Cetak / PDF">
                  <Link href={`/admin/secretariat/document/${item.id}/cetak`}>
                    <FileText className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" aria-label="Edit dokumen">
                  <Link href={`/admin/secretariat/document/${item.id}/edit`}>
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <ConfirmDelete
                  onConfirm={deleteAdministrativeDocument}
                  args={[item.id]}
                  title="Hapus dokumen"
                  description={`Dokumen "${item.title}" akan dihapus permanen.`}
                  label="Hapus dokumen"
                />
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
