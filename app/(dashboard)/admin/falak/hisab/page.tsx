import { formatDateId } from "@/lib/format";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import { falakService } from "@/modules/falak/application/service";
import { deleteHisab } from "@/modules/falak/presentation/falak.action";

type Item = Awaited<
  ReturnType<typeof falakService.getHisabPaginated>
>["items"][number];

export default async function HisabPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const result = await falakService.getHisabPaginated(
    params.page ? Number(params.page) : 1,
    20,
    params.search,
  );
  const hisabItems = result.items;

  return (
    <PageContainer>
      <PageHeader
        title="Data Hisab"
        description="Kelola data perhitungan hisab."
      />

      <TableSearchForm
        basePath="/admin/falak/hisab"
        defaultValue={params.search ?? ""}
        placeholder="Cari lokasi..."
      />

      {hisabItems.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada data hisab.
        </p>
      )}
      <DataTable<Item, unknown>
        data={hisabItems}
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
            accessorKey: "latitude",
            header: "Koordinat",
            cell: ({ row }) => (
              <span className="text-xs tabular-nums text-admin-content-fg/60">
                {row.original.latitude.toFixed(4)},{" "}
                {row.original.longitude.toFixed(4)}
              </span>
            ),
          },
          {
            accessorKey: "calculationDate",
            header: "Tanggal",
            cell: ({ row }) => (
              <span className="text-xs tabular-nums text-admin-content-fg/80">
                {formatDateId(row.original.calculationDate)}
              </span>
            ),
          },
          {
            accessorKey: "id",
            header: "Aksi",
            cell: ({ row }) => (
              <div className="flex justify-end gap-1">
                <ConfirmDelete
                  onConfirm={deleteHisab}
                  args={[row.original.id]}
                  title="Hapus data hisab"
                  description={`Data hisab untuk "${row.original.locationName}" akan dihapus permanen.`}
                  label="Hapus data hisab"
                />
              </div>
            ),
          },
        ]}
      />

      <TablePagination
        page={params.page ? Number(params.page) : 1}
        pageSize={20}
        total={result.total}
        basePath="/admin/falak/hisab"
        queryParams={{ search: params.search }}
      />
    </PageContainer>
  );
}