import Link from "next/link";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";
import { LetterPlate } from "@/components/admin/shared/letter-plate";

import { getOutgoingMails } from "@/modules/secretariat/queries/secretariat.query";
import { deleteOutgoingMail } from "@/modules/secretariat/presentation/secretariat.action";

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
  DRAFT: { label: "Draft", variant: "outline" },
  SUBMITTED: { label: "Diajukan", variant: "secondary" },
  REVIEWED: { label: "Direview", variant: "secondary" },
  APPROVED: { label: "Disetujui", variant: "default" },
  REJECTED: { label: "Ditolak", variant: "destructive" },
  SIGNED: { label: "Ditandatangani", variant: "secondary" },
  SENT: { label: "Terkirim", variant: "secondary" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

export default async function OutgoingMailListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { items, total } = await getOutgoingMails({
    search: params.search,
    status: params.status,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Surat Keluar"
        description="Kelola seluruh surat keluar organisasi."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/secretariat/outgoing-mail/new">
              <Plus className="size-4" />
              Surat Keluar Baru
            </Link>
          </Button>
        }
      />

      <AdminTable
        title="Surat Keluar"
        description={`${total} surat keluar ditemukan.`}
        columns={[
          {
            key: "fullNumber",
            label: "Nomor Surat",
            render: (item) =>
              item.fullNumber ? (
                <LetterPlate fullNumber={item.fullNumber} size="sm" />
              ) : (
                <span className="text-xs text-muted-foreground">
                  Belum bernomor
                </span>
              ),
          },
          {
            key: "recipient",
            label: "Penerima",
            render: (item) => (
              <div className="max-w-[200px]">
                <p className="truncate text-sm font-medium">
                  {item.recipient || "-"}
                </p>
                {item.senderName && (
                  <p className="truncate text-xs text-muted-foreground">
                    {item.senderName}
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
            key: "mailDate",
            label: "Tanggal Surat",
            render: (item) => (
              <span className="text-xs">{formatDate(item.mailDate)}</span>
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
                <Button asChild variant="ghost" size="sm" title="Cetak / PDF">
                  <Link
                    href={`/admin/secretariat/outgoing-mail/${item.id}/cetak`}
                  >
                    <FileText className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link
                    href={`/admin/secretariat/outgoing-mail/${item.id}/edit`}
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <form action={deleteOutgoingMail.bind(null, item.id)}>
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
        emptyMessage="Belum ada surat keluar. Buat surat keluar pertama Anda."
      />
    </PageContainer>
  );
}
