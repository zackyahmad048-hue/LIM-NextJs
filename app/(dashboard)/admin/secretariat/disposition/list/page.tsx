import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { TablePagination } from "@/components/admin/shared/table-pagination";

import { getDispositions } from "@/modules/secretariat/queries/secretariat.query";
import { DispositionTable } from "./disposition-table";

export const dynamic = "force-dynamic";

export default async function DispositionListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const { items, total } = await getDispositions({ page });
  const pageSize = 20;

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Disposisi"
        description="Kelola seluruh disposisi surat masuk."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/secretariat/disposition/new">
              <Plus className="size-4" />
              Disposisi Baru
            </Link>
          </Button>
        }
      />

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada disposisi. Buat disposisi pertama Anda.
        </p>
      )}

      <DispositionTable data={items} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        basePath="/admin/secretariat/disposition/list"
      />
    </PageContainer>
  );
}