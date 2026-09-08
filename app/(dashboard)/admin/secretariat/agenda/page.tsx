import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { getAgendaBooks } from "@/modules/secretariat/queries/secretariat.query";
import { AgendaTable } from "./agenda-table";

export const dynamic = "force-dynamic";

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { items } = await getAgendaBooks({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Buku Agenda"
        description="Daftar agenda dan kegiatan organisasi (hanya baca)."
        actions={
          <div className="flex items-center gap-2">
            <Input
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Cari judul agenda..."
              className="rounded-md text-xs"
            />
            <Button type="submit" size="sm" variant="secondary">
              <Search className="size-3.5" /> Cari
            </Button>
          </div>
        }
      />

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">Belum ada agenda.</p>
      )}

      <AgendaTable data={items} />
    </PageContainer>
  );
}