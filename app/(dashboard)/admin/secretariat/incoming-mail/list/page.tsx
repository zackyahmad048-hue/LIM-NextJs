import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

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
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

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

      <Band variant="raised">
        <IncomingMailsTable data={items} page={page} pageCount={pageCount} />
      </Band>
    </PageContainer>
  );
}