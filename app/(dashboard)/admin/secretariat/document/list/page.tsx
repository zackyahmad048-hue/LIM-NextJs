import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";

import { getAdministrativeDocuments } from "@/modules/secretariat/queries/secretariat.query";
import { DocumentTable } from "./document-table";

export const dynamic = "force-dynamic";

export default async function DocumentListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const { items, total } = await getAdministrativeDocuments({
    search: params.search,
    status: params.status,
    page,
  });
  const pageSize = 20;

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Dokumen Administrasi"
        description="Kelola seluruh dokumen administrasi organisasi."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/secretariat/document/new">
              <Plus className="size-4" />
              Dokumen Baru
            </Link>
          </Button>
        }
      />

      <TableSearchForm
        basePath="/admin/secretariat/document/list"
        defaultValue={params.search ?? ""}
        placeholder="Cari dokumen..."
      />

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada dokumen administrasi. Buat dokumen pertama Anda.
        </p>
      )}

      <DocumentTable data={items} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        basePath="/admin/secretariat/document/list"
        queryParams={{ search: params.search, status: params.status }}
      />
    </PageContainer>
  );
}