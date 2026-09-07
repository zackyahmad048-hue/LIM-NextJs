import { formatDateId } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";

import { getRukyatByStatus } from "@/modules/falak/queries/rukyat.query";
import { falakHisabRepository } from "@/modules/falak/infrastructure/repository";

type RukyatItem = Awaited<
  ReturnType<typeof getRukyatByStatus>
>[number];
type HisabItem = Awaited<
  ReturnType<typeof falakHisabRepository.findPaginated>
>["items"][number];

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

      {archivedRukyat.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada arsip observasi.
        </p>
      )}
      <DataTable<RukyatItem, unknown>
        data={archivedRukyat}
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
            accessorKey: "result",
            header: "Hasil",
            cell: ({ row }) => (
              <Badge variant="outline">{row.original.result}</Badge>
            ),
          },
          {
            accessorKey: "weather",
            header: "Cuaca",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/60">
                {row.original.weather}
              </span>
            ),
          },
        ]}
      />

      {archivedHisab.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada data hisab.
        </p>
      )}
      <DataTable<HisabItem, unknown>
        data={archivedHisab}
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
            accessorKey: "calculationDate",
            header: "Tanggal",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/80">
                {formatDateId(row.original.calculationDate)}
              </span>
            ),
          },
          {
            accessorKey: "latitude",
            header: "Koordinat",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/60">
                {row.original.latitude.toFixed(4)},{" "}
                {row.original.longitude.toFixed(4)}
              </span>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}