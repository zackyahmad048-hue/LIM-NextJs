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
import { DataTable } from "@/components/admin/shared/data-table";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import { getAdministrativeDocuments } from "@/modules/secretariat/queries/secretariat.query";
import {
  deleteAdministrativeDocument,
  transitionAdministrativeDocumentStatus,
} from "@/modules/secretariat/presentation/secretariat.action";

export const dynamic = "force-dynamic";

type Document = Awaited<ReturnType<typeof getAdministrativeDocuments>>["items"][number];

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
  const page = params.page ? Number(params.page) : 1;
  const { items, total } = await getAdministrativeDocuments({
    search: params.search,
    status: params.status,
    page,
  });
  const pageSize = 20;

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

      <TableSearchForm
        basePath="/admin/secretariat/document/list"
        defaultValue={params.search ?? ""}
        placeholder="Cari dokumen..."
      />

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada dokumen administrasi. Buat dokumen pertama Anda.
        </p>
      )}

      <DataTable<Document, unknown>
        data={items}
        columns={[
          {
            accessorKey: "documentNumber",
            header: "No. Dokumen",
            cell: ({ row }) => (
              <span className="font-mono text-xs text-admin-content-fg/60">
                {row.original.documentNumber}
              </span>
            ),
          },
          {
            accessorKey: "title",
            header: "Judul",
            cell: ({ row }) => (
              <div className="max-w-62.5">
                <p className="truncate text-sm font-medium text-admin-content-fg">
                  {row.original.title}
                </p>
                <p className="truncate text-xs text-admin-content-fg/60">
                  {documentTypeLabels[row.original.documentType] ??
                    row.original.documentType}
                </p>
              </div>
            ),
          },
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
              const s = statusLabels[row.original.status] ?? {
                label: row.original.status,
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
            id: "actions",
            header: () => (
              <div className="text-right text-sm font-medium text-admin-content-fg/70">
                Aksi
              </div>
            ),
            cell: ({ row }) => (
              <div className="flex justify-end gap-1">
                {(statusActions[row.original.status] ?? []).map((action) => {
                  const Icon = action.icon;
                  return (
                    <form
                      key={action.status}
                      action={transitionAdministrativeDocumentStatus.bind(
                        null,
                        row.original.id,
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
                  <Link href={`/admin/secretariat/document/${row.original.id}/cetak`}>
                    <FileText className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" aria-label="Edit dokumen">
                  <Link href={`/admin/secretariat/document/${row.original.id}/edit`}>
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <ConfirmDelete
                  onConfirm={deleteAdministrativeDocument}
                  args={[row.original.id]}
                  title="Hapus dokumen"
                  description={`Dokumen "${row.original.title}" akan dihapus permanen.`}
                  label="Hapus dokumen"
                />
              </div>
            ),
          },
        ]}
      />

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        basePath="/admin/secretariat/document/list"
        queryParams={{ search: params.search, status: params.status }}
      />
    </PageContainer>
  );
}