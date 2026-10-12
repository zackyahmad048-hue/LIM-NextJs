import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { SearchForm } from "./search-form";

import { getOutgoingMails } from "@/modules/secretariat";
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
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Surat Keluar"
        description="Kelola seluruh surat keluar organisasi."
        actions={
          <div className="flex items-center gap-2">
            <SearchForm search={params.search ?? ""} status={params.status} />
            <Link href="/admin/secretariat/outgoing-mail/new">
              <Button size="sm">
                <Plus className="size-4" />
                Surat Keluar Baru
              </Button>
            </Link>
          </div>
        }
      />

      <Band variant="raised">
        <OutgoingMailsTable data={items} page={page} pageCount={pageCount} />
      </Band>
    </PageContainer>
  );
}