import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { falakService } from "@/modules/falak/application/service";
import { EclipseTable } from "./eclipse-table";

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
      <EclipseTable data={items} />
    </PageContainer>
  );
}