import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";

import { getPrograms } from "@/modules/program/queries/program.query";
import { ProgramsTable } from "./programs-table";

export default async function ProgramListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const pageSize = 20;
  const { items, total } = await getPrograms({
    search: params.search,
    status: params.status,
    page,
  });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Program"
        description="Kelola seluruh program dan kegiatan organisasi."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/program/new">
              <Plus className="size-4" />
              Buat Program
            </Link>
          </Button>
        }
      />

      <TableSearchForm
        basePath="/admin/program/list"
        defaultValue={params.search ?? ""}
        placeholder="Cari nama/kode program..."
      />

      <Band variant="raised" className="mt-4">
        <ProgramsTable data={items} page={page} pageCount={pageCount} total={total} />
      </Band>
    </PageContainer>
  );
}