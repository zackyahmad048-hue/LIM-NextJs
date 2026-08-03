import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import { falakService } from "@/modules/falak/application/service";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function EclipsePage() {
  const result = await falakService.getEclipsePaginated(1, 50);
  const items = result.items;

  return (
    <PageContainer>
      <PageHeader
        title="Data Eclipse"
        description="Kelola data gerhana matahari dan bulan."
      />

      <AdminTable
        title="Daftar Eclipse"
        description={`${items.length} data eclipse tercatat.`}
        columns={[
          {
            key: "jenis",
            label: "Jenis",
            render: (item) => (
              <Badge
                variant={item.eclipseType === "SOLAR" ? "default" : "secondary"}
              >
                {item.eclipseType === "SOLAR" ? "Matahari" : "Bulan"}
              </Badge>
            ),
          },
          {
            key: "tanggal",
            label: "Tanggal",
            render: (item) => (
              <span className="text-xs">{formatDate(item.eclipseDate)}</span>
            ),
          },
          {
            key: "visibilitas",
            label: "Visibilitas",
            render: (item) => (
              <span className="text-xs">{item.visibility || "-"}</span>
            ),
          },
          {
            key: "keterangan",
            label: "Keterangan",
            render: (item) => (
              <span className="text-xs text-muted-foreground">
                {item.details ? JSON.stringify(item.details) : "-"}
              </span>
            ),
          },
        ]}
        data={items}
        emptyMessage="Belum ada data eclipse."
      />
    </PageContainer>
  );
}
