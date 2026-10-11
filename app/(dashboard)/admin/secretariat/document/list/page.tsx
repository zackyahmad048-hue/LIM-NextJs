import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

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
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

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

      <Band variant="raised">
        <DocumentTable data={items} page={page} pageCount={pageCount} />
      </Band>
    </PageContainer>
  );
}