import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";

import { getIncomingMails } from "@/modules/secretariat/queries/secretariat.query";
import { IncomingMailsTable } from "./incoming-mails-table";

export const dynamic = "force-dynamic";

export default async function IncomingMailListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const { items, total } = await getIncomingMails({
    search: params.search,
    status: params.status,
    page,
  });
  const pageSize = 20;

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Surat Masuk"
        description="Kelola seluruh surat masuk organisasi."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/secretariat/incoming-mail/new">
              <Plus className="size-4" />
              Surat Masuk Baru
            </Link>
          </Button>
        }
      />

      <TableSearchForm
        basePath="/admin/secretariat/incoming-mail/list"
        defaultValue={params.search ?? ""}
        placeholder="Cari perihal/pengirim..."
      />

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada surat masuk. Buat surat masuk pertama Anda.
        </p>
      )}

      <IncomingMailsTable data={items} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        basePath="/admin/secretariat/incoming-mail/list"
        queryParams={{ search: params.search, status: params.status }}
      />
    </PageContainer>
  );
}