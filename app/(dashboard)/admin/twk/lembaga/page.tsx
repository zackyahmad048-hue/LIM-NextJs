import { Input } from "@/components/ui/input";
import { Band } from "@/components/admin/shared/band";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { listLembaga } from "@/modules/twk-lembaga/queries/lembaga.query";
import { LembagaTable } from "./lembaga-table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function LembagaListPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const { items, total } = await listLembaga({
    search: q,
    page: 1,
    limit: 50,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Lembaga Pemohon Guru Bantu"
        description="Daftar lembaga eksternal yang mengajukan permohonan guru bantu."
        actions={
          <form
            action="/admin/twk/lembaga"
            method="GET"
            className="w-full sm:w-auto"
          >
            <Input
              name="q"
              defaultValue={q ?? ""}
              aria-label="Cari lembaga"
              placeholder="Cari nama lembaga, daerah, pengasuh..."
              className="w-full sm:w-80"
            />
          </form>
        }
      />

      <p className="text-sm text-admin-content-fg/60">
        {total} lembaga tercatat.
      </p>

      <Band variant="raised">
        <LembagaTable data={items} />
      </Band>
    </PageContainer>
  );
}