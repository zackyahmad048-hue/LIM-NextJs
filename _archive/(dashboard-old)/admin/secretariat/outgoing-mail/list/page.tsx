import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { TablePagination } from "@/components/admin/shared/table-pagination";

import { getOutgoingMails } from "@/modules/secretariat/queries/secretariat.query";
import { SearchForm } from "./search-form";
import { OutgoingMailsTable } from "./outgoing-mails-table";

export const dynamic = "force-dynamic";

export default async function OutgoingMailListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const { items, total } = await getOutgoingMails({
    search: params.search,
    status: params.status,
    page,
  });
  const pageSize = 20;

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Surat Keluar"
        description="Kelola seluruh surat keluar organisasi."
        actions={
          <div className="flex items-center gap-2">
            <SearchForm search={params.search ?? ""} status={params.status} />
            <Button asChild size="sm">
              <Link href="/admin/secretariat/outgoing-mail/new">
                <Plus className="size-4" />
                Surat Keluar Baru
              </Link>
            </Button>
          </div>
        }
      />

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada surat keluar. Buat surat keluar pertama Anda.
        </p>
      )}

      <OutgoingMailsTable data={items} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        basePath="/admin/secretariat/outgoing-mail/list"
        queryParams={{ search: params.search, status: params.status }}
      />
    </PageContainer>
  );
}