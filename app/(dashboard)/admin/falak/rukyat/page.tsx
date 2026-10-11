import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";

import { falakService } from "@/modules/falak/application/service";
import { RukyatTable } from "./rukyat-table";

export default async function RukyatPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const result = await falakService.getRukyatPaginated(page, 20, params.search);
  const items = result.items;
  const pageSize = 20;
  const pageCount = Math.max(1, Math.ceil(result.total / pageSize));

  return (
    <PageContainer>
      <PageHeader
        title="Data Rukyat"
        description="Kelola data observasi rukyat."
      />

      <TableSearchForm
        basePath="/admin/falak/rukyat"
        defaultValue={params.search ?? ""}
        placeholder="Cari lokasi..."
      />

      <Band variant="raised" className="mt-4">
        <RukyatTable data={items} page={page} pageCount={pageCount} />
      </Band>
    </PageContainer>
  );
}