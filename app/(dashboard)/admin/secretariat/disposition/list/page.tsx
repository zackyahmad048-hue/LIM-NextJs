import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import { getDispositions } from "@/modules/secretariat/queries/secretariat.query";
import { deleteDisposition } from "@/modules/secretariat/presentation/secretariat.action";

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
  PENDING: { label: "Menunggu", variant: "outline" },
  IN_PROGRESS: { label: "Dikerjakan", variant: "default" },
  COMPLETED: { label: "Selesai", variant: "secondary" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
};

const priorityLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  LOW: { label: "Rendah", variant: "outline" },
  MEDIUM: { label: "Sedang", variant: "default" },
  HIGH: { label: "Tinggi", variant: "destructive" },
  URGENT: { label: "Mendesak", variant: "destructive" },
};

export default async function DispositionListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const { items, total } = await getDispositions({
    page: params.page ? Number(params.page) : 1,
  });

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

      <AdminTable
        title="Disposisi"
        description={`${total} disposisi ditemukan.`}
        columns={[
          {
            key: "incomingMail",
            label: "Surat Masuk",
            render: (item) => (
              <div className="max-w-[200px]">
                <p className="truncate text-sm font-medium">
                  {item.incomingMail?.registrationNumber ?? "-"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.incomingMail?.subject ?? ""}
                </p>
              </div>
            ),
          },
          {
            key: "instruction",
            label: "Instruksi",
            render: (item) => (
              <span className="truncate text-xs">{item.instruction}</span>
            ),
          },
          {
            key: "priority",
            label: "Prioritas",
            render: (item) => {
              const p = priorityLabels[item.priority] ?? {
                label: item.priority,
                variant: "outline" as const,
              };
              return (
                <Badge variant={p.variant} className="h-5 px-2 text-[11px]">
                  {p.label}
                </Badge>
              );
            },
          },
          {
            key: "dueDate",
            label: "Batas Waktu",
            render: (item) => (
              <span className="text-xs">
                {item.dueDate ? formatDate(item.dueDate) : "-"}
              </span>
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
                  <Link href={`/admin/secretariat/disposition/${item.id}/edit`}>
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <form action={deleteDisposition.bind(null, item.id)}>
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
        emptyMessage="Belum ada disposisi. Buat disposisi pertama Anda."
      />
    </PageContainer>
  );
}
