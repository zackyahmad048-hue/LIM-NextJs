import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";

import { falakService } from "@/modules/falak/application/service";
import { HisabTable } from "./hisab-table";

export default async function HisabPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const pageSize = 20;
  const result = await falakService.getHisabPaginated(page, pageSize, params.search);
  const hisabItems = result.items;
  const pageCount = Math.max(1, Math.ceil(result.total / pageSize));

  return (
    <PageContainer>
      <PageHeader
        title="Data Hisab"
        description="Kelola data perhitungan hisab."
      />

      <TableSearchForm
        basePath="/admin/falak/hisab"
        defaultValue={params.search ?? ""}
        placeholder="Cari lokasi..."
      />

      <Band variant="raised" className="mt-4">
        <HisabTable data={hisabItems} page={page} pageCount={pageCount} />
      </Band>
    </PageContainer>
  );
}