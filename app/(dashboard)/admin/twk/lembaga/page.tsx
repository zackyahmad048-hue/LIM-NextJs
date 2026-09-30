import { Building2 } from "lucide-react";

import { Input } from "@/components/ui/input";
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
          <form action="/admin/twk/lembaga" method="GET" className="w-full sm:w-auto">
            <Input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Cari nama lembaga, daerah, pengasuh..."
              className="w-full sm:w-80"
            />
          </form>
        }
      />

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="mb-4 h-12 w-12 text-admin-content-fg/40" />
          <h3 className="font-semibold text-admin-content-fg">Belum ada permohonan</h3>
          <p className="mt-2 max-w-sm text-sm text-admin-content-fg/60">
            Permohonan akan muncul di sini ketika lembaga eksternal mengisi
            formulir permohonan guru bantu.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <p className="text-sm text-admin-content-fg/60">
          {total} lembaga tercatat.
        </p>
      )}

      <LembagaTable data={items} />
    </PageContainer>
  );
}