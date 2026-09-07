import { formatDateId } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";

import { falakService } from "@/modules/falak/application/service";

type Item = Awaited<
  ReturnType<typeof falakService.getEclipsePaginated>
>["items"][number];

export default async function EclipsePage() {
  const result = await falakService.getEclipsePaginated(1, 50);
  const items = result.items;

  return (
    <PageContainer>
      <PageHeader
        title="Data Eclipse"
        description="Kelola data gerhana matahari dan bulan."
      />

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada data eclipse.
        </p>
      )}
      <DataTable<Item, unknown>
        data={items}
        columns={[
          {
            accessorKey: "eclipseType",
            header: "Jenis",
            cell: ({ row }) => (
              <Badge
                variant={
                  row.original.eclipseType === "SOLAR" ? "default" : "secondary"
                }
              >
                {row.original.eclipseType === "SOLAR" ? "Matahari" : "Bulan"}
              </Badge>
            ),
          },
          {
            accessorKey: "eclipseDate",
            header: "Tanggal",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/80">
                {formatDateId(row.original.eclipseDate)}
              </span>
            ),
          },
          {
            accessorKey: "visibility",
            header: "Visibilitas",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/80">
                {row.original.visibility || "-"}
              </span>
            ),
          },
          {
            accessorKey: "details",
            header: "Keterangan",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/60">
                {row.original.details
                  ? JSON.stringify(row.original.details)
                  : "-"}
              </span>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}