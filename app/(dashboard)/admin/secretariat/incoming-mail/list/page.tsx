import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import { getIncomingMails } from "@/modules/secretariat/queries/secretariat.query";
import { deleteIncomingMail } from "@/modules/secretariat/presentation/secretariat.action";

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  RECEIVED: { label: "Diterima", variant: "default" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

export default async function IncomingMailListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { items, total } = await getIncomingMails({
    search: params.search,
    status: params.status,
    page: params.page ? Number(params.page) : 1,
  });

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

      <AdminTable
        title="Surat Masuk"
        description={`${total} surat masuk ditemukan.`}
        columns={[
          {
            key: "registrationNumber",
            label: "No. Surat Pengirim",
            render: (item) => (
              <span className="text-xs text-muted-foreground">
                {item.registrationNumber}
              </span>
            ),
          },
          {
            key: "sender",
            label: "Pengirim",
            render: (item) => (
              <div className="max-w-50">
                <p className="truncate text-sm font-medium">{item.sender}</p>
                {item.senderAddress && (
                  <p className="truncate text-xs text-muted-foreground">
                    {item.senderAddress}
                  </p>
                )}
              </div>
            ),
          },
          {
            key: "subject",
            label: "Perihal",
            render: (item) => (
              <span className="truncate text-xs">{item.subject}</span>
            ),
          },
          {
            key: "receivedDate",
            label: "Tanggal Diterima",
            render: (item) => (
              <span className="text-xs">{formatDate(item.receivedDate)}</span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (item) => {
              const s = statusLabels[item.status] ?? {
                label: item.status,
                variant: "outline" as const,
              };
              return (
                <Badge variant={s.variant} className="h-5 px-2 text-[11px]">
                  {s.label}
                </Badge>
              );
            },
          },
          {
            key: "actions",
            label: "Aksi",
            align: "right",
            render: (item) => (
              <div className="flex justify-end gap-1">
                <Button asChild variant="ghost" size="sm">
                  <Link
                    href={`/admin/secretariat/incoming-mail/${item.id}/edit`}
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <form action={deleteIncomingMail.bind(null, item.id)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </form>
              </div>
            ),
          },
        ]}
        data={items as any[]}
        emptyMessage="Belum ada surat masuk. Buat surat masuk pertama Anda."
      />
    </PageContainer>
  );
}
