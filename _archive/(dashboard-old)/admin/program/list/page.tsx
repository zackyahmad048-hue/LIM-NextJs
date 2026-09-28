import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";

import { getPrograms } from "@/modules/program/queries/program.query";
import { ProgramsTable } from "./programs-table";

export default async function ProgramListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { items, total } = await getPrograms({
    search: params.search,
    status: params.status,
    page: params.page ? Number(params.page) : 1,
  });

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

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada program.{" "}
          <Button variant="link" size="sm" className="p-0" asChild>
            <Link href="/admin/program/new">Buat program pertama</Link>
          </Button>
        </p>
      )}

      {items.length > 0 && (
        <p className="text-sm text-admin-content-fg/60">
          {total} program ditemukan.
        </p>
      )}

      <ProgramsTable data={items} />

      <TablePagination
        page={params.page ? Number(params.page) : 1}
        pageSize={20}
        total={total}
        basePath="/admin/program/list"
        queryParams={{ search: params.search, status: params.status }}
      />
    </PageContainer>
  );
}