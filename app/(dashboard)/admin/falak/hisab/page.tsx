import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import { falakService } from "@/modules/falak/application/service";
import { deleteHisab } from "@/modules/falak/presentation/falak.action";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function HisabPage() {
  const result = await falakService.getHisabPaginated(1, 50);
  const hisabItems = result.items;

  return (
    <PageContainer>
      <PageHeader
        title="Data Hisab"
        description="Kelola data perhitungan hisab."
      />

      <AdminTable
        title="Daftar Hisab"
        description={`${hisabItems.length} data hisab tercatat.`}
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
                {formatDate(item.calculationDate)}
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
