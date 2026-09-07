import { formatDateId } from "@/lib/format";
import Link from "next/link";
import { FileText, Pencil, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { LetterPlate } from "@/components/admin/shared/letter-plate";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import { getOutgoingMails } from "@/modules/secretariat/queries/secretariat.query";
import { deleteOutgoingMail } from "@/modules/secretariat/presentation/secretariat.action";
import { SearchForm } from "./search-form";

export const dynamic = "force-dynamic";

type Mail = Awaited<ReturnType<typeof getOutgoingMails>>["items"][number];

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  DRAFT: { label: "Draft", variant: "outline" },
  SENT: { label: "Terkirim", variant: "default" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

export default async function OutgoingMailListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const { items, total } = await getOutgoingMails({
    search: params.search,
    status: params.status,
    page,
  });
  const pageSize = 20;

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Surat Keluar"
        description="Kelola seluruh surat keluar organisasi."
        actions={
          <div className="flex items-center gap-2">
            <SearchForm search={params.search ?? ""} status={params.status} />
            <Button asChild size="sm">
              <Link href="/admin/secretariat/outgoing-mail/new">
                <Plus className="size-4" />
                Surat Keluar Baru
              </Link>
            </Button>
          </div>
        }
      />

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada surat keluar. Buat surat keluar pertama Anda.
        </p>
      )}

      <DataTable<Mail, unknown>
        data={items}
        columns={[
          {
            accessorKey: "fullNumber",
            header: "Nomor Surat",
            cell: ({ row }) =>
              row.original.fullNumber ? (
                <LetterPlate fullNumber={row.original.fullNumber} size="sm" />
              ) : (
                <span className="text-xs text-admin-content-fg/60">
                  Belum bernomor
                </span>
              ),
          },
          {
            accessorKey: "recipient",
            header: "Penerima",
            cell: ({ row }) => (
              <div className="max-w-50">
                <p className="truncate text-sm font-medium text-admin-content-fg">
                  {row.original.recipient || "-"}
                </p>
                {row.original.ketuaName && (
                  <p className="truncate text-xs text-admin-content-fg/60">
                    Ketua: {row.original.ketuaName}
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
            accessorKey: "mailDate",
            header: "Tanggal Surat",
            cell: ({ row }) => (
              <span className="text-xs tabular-nums text-admin-content-fg/80">
                {formatDateId(row.original.mailDate)}
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
                <Button asChild variant="ghost" size="sm" aria-label="Cetak / PDF">
                  <Link href={`/admin/secretariat/outgoing-mail/${row.original.id}/cetak`}>
                    <FileText className="size-3.5" />
                  </Link>
                </Button>
                {row.original.status !== "ARCHIVED" && (
                  <Button asChild variant="ghost" size="sm" aria-label="Edit surat keluar">
                    <Link href={`/admin/secretariat/outgoing-mail/${row.original.id}/edit`}>
                      <Pencil className="size-3.5" />
                    </Link>
                  </Button>
                )}
                <ConfirmDelete
                  onConfirm={deleteOutgoingMail}
                  args={[row.original.id]}
                  title="Hapus surat keluar"
                  description={`Surat keluar "${row.original.subject}" akan dihapus permanen.`}
                  label="Hapus surat keluar"
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
        basePath="/admin/secretariat/outgoing-mail/list"
        queryParams={{ search: params.search, status: params.status }}
      />
    </PageContainer>
  );
}