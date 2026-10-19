import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

import { getRukyatByStatus } from "@/modules/falak/queries/rukyat.query";
import { falakHisabRepository } from "@/modules/falak/infrastructure/repository";
import { HisabArchiveTable, RukyatArchiveTable } from "./falak-archive-tables";

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
        description="Data arsip observasi rukyat dan hisab."
      />

      <Band variant="raised" title="Observasi Rukyat Terarsip">
        <RukyatArchiveTable data={archivedRukyat} />
      </Band>

      <Band variant="raised" title="Data Hisab">
        <HisabArchiveTable data={archivedHisab} />
      </Band>
    </PageContainer>
  );
}