import { formatDateId } from "@/lib/format";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import { getIncomingMails } from "@/modules/secretariat/queries/secretariat.query";
import { deleteIncomingMail } from "@/modules/secretariat/presentation/secretariat.action";

export const dynamic = "force-dynamic";

type Incoming = Awaited<ReturnType<typeof getIncomingMails>>["items"][number];

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  RECEIVED: { label: "Diterima", variant: "default" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

export default async function IncomingMailListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const { items, total } = await getIncomingMails({
    search: params.search,
    status: params.status,
    page,
  });
  const pageSize = 20;

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Surat Masuk"
        description="Kelola seluruh surat masuk organisasi."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/secretariat/incoming-mail/new">
              <Plus className="size-4" />
              Surat Masuk Baru
            </Link>
          </Button>
        }
      />

      <TableSearchForm
        basePath="/admin/secretariat/incoming-mail/list"
        defaultValue={params.search ?? ""}
        placeholder="Cari perihal/pengirim..."
      />

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada surat masuk. Buat surat masuk pertama Anda.
        </p>
      )}

      <DataTable<Incoming, unknown>
        data={items}
        columns={[
          {
            accessorKey: "registrationNumber",
            header: "No. Surat Pengirim",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/60">
                {row.original.registrationNumber}
              </span>
            ),
          },
          {
            accessorKey: "sender",
            header: "Pengirim",
            cell: ({ row }) => (
              <div className="max-w-50">
                <p className="truncate text-sm font-medium text-admin-content-fg">
                  {row.original.sender}
                </p>
                {row.original.senderAddress && (
                  <p className="truncate text-xs text-admin-content-fg/60">
                    {row.original.senderAddress}
                  </p>
                )}
              </div>
            ),
          },
          {
            accessorKey: "subject",
            header: "Perihal",
            cell: ({ row }) => (
              <span className="truncate text-xs text-admin-content-fg/80">
                {row.original.subject}
              </span>
            ),
          },
          {
            accessorKey: "receivedDate",
            header: "Tanggal Diterima",
            cell: ({ row }) => (
              <span className="text-xs tabular-nums text-admin-content-fg/80">
                {formatDateId(row.original.receivedDate)}
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
                <Button asChild variant="ghost" size="sm" aria-label="Edit surat masuk">
                  <Link href={`/admin/secretariat/incoming-mail/${row.original.id}/edit`}>
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <ConfirmDelete
                  onConfirm={deleteIncomingMail}
                  args={[row.original.id]}
                  title="Hapus surat masuk"
                  description={`Surat masuk "${row.original.subject}" akan dihapus permanen.`}
                  label="Hapus surat masuk"
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
        basePath="/admin/secretariat/incoming-mail/list"
        queryParams={{ search: params.search, status: params.status }}
      />
    </PageContainer>
  );
}