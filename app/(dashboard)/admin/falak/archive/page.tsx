import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import { getRukyatByStatus } from "@/modules/falak/queries/rukyat.query";
import { falakHisabRepository } from "@/modules/falak/infrastructure/repository";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function FalakArchivePage() {
  const [archivedRukyat, hisabResult] = await Promise.all([
    getRukyatByStatus("ARCHIVED"),
    falakHisabRepository.findPaginated({ page: 1, limit: 50 }),
  ]);
  const archivedHisab = hisabResult.items;

  return (
    <PageContainer>
      <PageHeader
        title="Arsip Falak"
        description="Data arsip observasi rukyat, hisab, dan eclipse."
      />

      <AdminTable
        title="Arsip Observasi Rukyat"
        description={`${archivedRukyat.length} observasi terarsipkan.`}
        columns={[
          {
            key: "lokasi",
            label: "Lokasi",
            render: (item) => (
              <span className="text-sm font-medium">{item.locationName}</span>
            ),
          },
          {
            key: "tanggal",
            label: "Tanggal",
            render: (item) => (
              <span className="text-xs">
                {formatDate(item.observationDate)}
              </span>
            ),
          },
          {
            key: "hasil",
            label: "Hasil",
            render: (item) => <Badge variant="outline">{item.result}</Badge>,
          },
          {
            key: "cuaca",
            label: "Cuaca",
            render: (item) => (
              <span className="text-xs text-muted-foreground">
                {item.weather}
              </span>
            ),
          },
        ]}
        data={archivedRukyat}
        emptyMessage="Belum ada arsip observasi."
      />

      <AdminTable
        title="Arsip Hisab"
        description={`${archivedHisab.length} data hisab.`}
        columns={[
          {
            key: "lokasi",
            label: "Lokasi",
            render: (item) => (
              <span className="text-sm font-medium">{item.locationName}</span>
            ),
          },
          {
            key: "tanggal",
            label: "Tanggal",
            render: (item) => (
              <span className="text-xs">
                {formatDate(item.calculationDate)}
              </span>
            ),
          },
          {
            key: "koordinat",
            label: "Koordinat",
            render: (item) => (
              <span className="text-xs text-muted-foreground">
                {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
              </span>
            ),
          },
        ]}
        data={archivedHisab}
        emptyMessage="Belum ada data hisab."
      />
    </PageContainer>
  );
}
