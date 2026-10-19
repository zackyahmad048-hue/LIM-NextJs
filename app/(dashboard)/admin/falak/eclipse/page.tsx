import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

import { falakService } from "@/modules/falak/application/service";
import { EclipseTable } from "./eclipse-table";

export default async function EclipsePage() {
  const result = await falakService.getEclipsePaginated(1, 50);
  const items = result.items;

  return (
    <PageContainer>
      <PageHeader
        title="Data Gerhana"
        description="Kelola data gerhana matahari dan bulan."
      />

      <Band variant="raised">
        <EclipseTable data={items} />
      </Band>
    </PageContainer>
  );
}