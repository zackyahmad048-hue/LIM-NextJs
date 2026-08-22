import { formatDateId } from "@/lib/format";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import { falakService } from "@/modules/falak/application/service";
import { deleteHisab } from "@/modules/falak/presentation/falak.action";

export default async function HisabPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const result = await falakService.getHisabPaginated(
    params.page ? Number(params.page) : 1,
    20,
    params.search
  );
  const hisabItems = result.items;

  return (
    <PageContainer>
      <PageHeader
        title="Data Hisab"
        description="Kelola data perhitungan hisab."
      />

      <AdminTable
        title="Daftar Hisab"
        description={`${result.total} data hisab tercatat.`}
        toolbar={
          <TableSearchForm
            basePath="/admin/falak/hisab"
            defaultValue={params.search ?? ""}
            placeholder="Cari lokasi..."
          />
        }
        pagination={
          <TablePagination
            page={params.page ? Number(params.page) : 1}
            pageSize={20}
            total={result.total}
            basePath="/admin/falak/hisab"
            queryParams={{ search: params.search }}
          />
        }
        columns={[
          {
            key: "lokasi",
            label: "Lokasi",
            render: (item) => (
              <span className="text-sm font-medium">{item.locationName}</span>
            ),
          },
          {
            key: "koordinat",
            label: "Koordinat",
            render: (item) => (
              <span className="text-xs tabular-nums text-muted-foreground">
                {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
              </span>
            ),
          },
          {
            key: "tanggal",
            label: "Tanggal",
            render: (item) => (
              <span className="text-xs tabular-nums">
                {formatDateId(item.calculationDate)}
              </span>
            ),
          },
          {
            key: "aksi",
            label: "Aksi",
            align: "right",
            render: (item) => (
              <div className="flex justify-end gap-1">
                <ConfirmDelete
                  onConfirm={deleteHisab}
                  args={[item.id]}
                  title="Hapus data hisab"
                  description={`Data hisab untuk "${item.locationName}" akan dihapus permanen.`}
                  label="Hapus data hisab"
                />
              </div>
            ),
          },
        ]}
        data={hisabItems}
        emptyMessage="Belum ada data hisab."
      />
    </PageContainer>
  );
}
