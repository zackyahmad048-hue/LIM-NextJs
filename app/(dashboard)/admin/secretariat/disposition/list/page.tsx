import { formatDateId } from "@/lib/format";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import { getDispositions } from "@/modules/secretariat/queries/secretariat.query";
import { deleteDisposition } from "@/modules/secretariat/presentation/secretariat.action";

export const dynamic = "force-dynamic";

type Disposition = Awaited<ReturnType<typeof getDispositions>>["items"][number];

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  PENDING: { label: "Menunggu", variant: "outline" },
  IN_PROGRESS: { label: "Dikerjakan", variant: "default" },
  COMPLETED: { label: "Selesai", variant: "secondary" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
};

const priorityLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  LOW: { label: "Rendah", variant: "outline" },
  MEDIUM: { label: "Sedang", variant: "default" },
  HIGH: { label: "Tinggi", variant: "destructive" },
  URGENT: { label: "Mendesak", variant: "destructive" },
};

export default async function DispositionListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const { items, total } = await getDispositions({ page });
  const pageSize = 20;

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Disposisi"
        description="Kelola seluruh disposisi surat masuk."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/secretariat/disposition/new">
              <Plus className="size-4" />
              Disposisi Baru
            </Link>
          </Button>
        }
      />

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada disposisi. Buat disposisi pertama Anda.
        </p>
      )}

      <DataTable<Disposition, unknown>
        data={items}
        columns={[
          {
            id: "incomingMail",
            header: "Surat Masuk",
            cell: ({ row }) => (
              <div className="max-w-50">
                <p className="truncate text-sm font-medium text-admin-content-fg">
                  {row.original.incomingMail?.registrationNumber ?? "-"}
                </p>
                <p className="truncate text-xs text-admin-content-fg/60">
                  {row.original.incomingMail?.subject ?? ""}
                </p>
              </div>
            ),
          },
          {
            accessorKey: "instruction",
            header: "Instruksi",
            cell: ({ row }) => (
              <span className="truncate text-xs text-admin-content-fg/80">
                {row.original.instruction}
              </span>
            ),
          },
          {
            accessorKey: "priority",
            header: "Prioritas",
            cell: ({ row }) => {
              const p = priorityLabels[row.original.priority] ?? {
                label: row.original.priority,
                variant: "outline" as const,
              };
              return (
                <Badge variant={p.variant} className="h-5 px-2 text-[11px]">
                  {p.label}
                </Badge>
              );
            },
          },
          {
            accessorKey: "dueDate",
            header: "Batas Waktu",
            cell: ({ row }) => (
              <span className="text-xs tabular-nums text-admin-content-fg/80">
                {row.original.dueDate ? formatDateId(row.original.dueDate) : "-"}
              </span>
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
                <Button asChild variant="ghost" size="sm" aria-label="Edit disposisi">
                  <Link href={`/admin/secretariat/disposition/${row.original.id}/edit`}>
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <ConfirmDelete
                  onConfirm={deleteDisposition}
                  args={[row.original.id]}
                  title="Hapus disposisi"
                  description={`Disposisi "${row.original.instruction}" akan dihapus permanen.`}
                  label="Hapus disposisi"
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
        basePath="/admin/secretariat/disposition/list"
      />
    </PageContainer>
  );
}