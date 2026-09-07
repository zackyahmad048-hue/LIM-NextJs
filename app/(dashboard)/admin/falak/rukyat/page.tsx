import { formatDateId } from "@/lib/format";
import { CheckCircle, Archive, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";

import { falakService } from "@/modules/falak/application/service";
import {
  verifyRukyat,
  confirmRukyat,
  archiveRukyat,
} from "@/modules/falak/presentation/falak.action";

type Item = Awaited<
  ReturnType<typeof falakService.getRukyatPaginated>
>["items"][number];

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "CONFIRMED"
      ? "default"
      : status === "VERIFIED"
        ? "secondary"
        : "outline";

  const label =
    status === "DRAFT"
      ? "Draft"
      : status === "VERIFIED"
        ? "Terverifikasi"
        : status === "CONFIRMED"
          ? "Dikonfirmasi"
          : status === "ARCHIVED"
            ? "Diarsipkan"
            : status;

  return (
    <Badge variant={variant} className="h-5 px-2 text-[11px]">
      {label}
    </Badge>
  );
}

export default async function RukyatPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const result = await falakService.getRukyatPaginated(page, 20, params.search);
  const items = result.items;

  return (
    <PageContainer>
      <PageHeader
        title="Data Rukyat"
        description="Kelola data observasi rukyat."
      />

      <TableSearchForm
        basePath="/admin/falak/rukyat"
        defaultValue={params.search ?? ""}
        placeholder="Cari lokasi..."
      />

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada data observasi rukyat.
        </p>
      )}
      <DataTable<Item, unknown>
        data={items}
        columns={[
          {
            accessorKey: "locationName",
            header: "Lokasi",
            cell: ({ row }) => (
              <span className="text-sm font-medium text-admin-content-fg">
                {row.original.locationName}
              </span>
            ),
          },
          {
            accessorKey: "observationDate",
            header: "Tanggal",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/80">
                {formatDateId(row.original.observationDate)}
              </span>
            ),
          },
          {
            accessorKey: "weather",
            header: "Cuaca",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/80">
                {row.original.weather}
              </span>
            ),
          },
          {
            accessorKey: "result",
            header: "Hasil",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/80">
                {row.original.result}
              </span>
            ),
          },
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
          },
          {
            accessorKey: "id",
            header: "Aksi",
            cell: ({ row }) => (
              <div className="flex justify-end gap-1">
                {row.original.status === "DRAFT" && (
                  <form
                    action={verifyRukyat.bind(null, row.original.id)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Verifikasi"
                      title="Verifikasi"
                    >
                      <ShieldCheck className="size-3.5" />
                    </Button>
                  </form>
                )}
                {row.original.status === "VERIFIED" && (
                  <form
                    action={confirmRukyat.bind(null, row.original.id)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Konfirmasi"
                      title="Konfirmasi"
                    >
                      <CheckCircle className="size-3.5" />
                    </Button>
                  </form>
                )}
                {row.original.status === "CONFIRMED" && (
                  <form
                    action={archiveRukyat.bind(null, row.original.id)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Arsipkan"
                      title="Arsipkan"
                    >
                      <Archive className="size-3.5" />
                    </Button>
                  </form>
                )}
              </div>
            ),
          },
        ]}
      />

      <TablePagination
        page={page}
        pageSize={20}
        total={result.total}
        basePath="/admin/falak/rukyat"
        queryParams={{ search: params.search }}
      />
    </PageContainer>
  );
}