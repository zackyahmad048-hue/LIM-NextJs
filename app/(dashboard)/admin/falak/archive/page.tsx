import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

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
        description="Data arsip observasi rukyat, hisab, dan eclipse."
      />

      {archivedRukyat.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada arsip observasi.
        </p>
      )}
      <RukyatArchiveTable data={archivedRukyat} />

      {archivedHisab.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada data hisab.
        </p>
      )}
      <HisabArchiveTable data={archivedHisab} />
    </PageContainer>
  );
}