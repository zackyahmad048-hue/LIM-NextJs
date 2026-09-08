import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { TablePagination } from "@/components/admin/shared/table-pagination";
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

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada data observasi rukyat.
        </p>
      )}
      <RukyatTable data={items} />

      <TablePagination
        page={page}
        pageSize={20}
        total={result.total}
        basePath="/admin/falak/rukyat"
        queryParams={{ search: params.search }}
      />
    </PageContainer>
  );
}