import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";

import { falakService } from "@/modules/falak/application/service";
import { HisabTable } from "./hisab-table";

export default async function HisabPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const result = await falakService.getHisabPaginated(
    params.page ? Number(params.page) : 1,
    20,
    params.search,
  );
  const hisabItems = result.items;

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

      {hisabItems.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada data hisab.
        </p>
      )}
      <HisabTable data={hisabItems} />

      <TablePagination
        page={params.page ? Number(params.page) : 1}
        pageSize={20}
        total={result.total}
        basePath="/admin/falak/hisab"
        queryParams={{ search: params.search }}
      />
    </PageContainer>
  );
}