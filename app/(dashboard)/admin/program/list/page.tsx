import Link from "next/link";
import { Calendar, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import { getPrograms } from "@/modules/program/queries/program.query";
import { deleteProgram } from "@/modules/program/presentation/program.action";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  DRAFT: { label: "Draft", variant: "outline" },
  PUBLISHED: { label: "Published", variant: "default" },
  REGISTRATION_OPEN: { label: "Registrasi Dibuka", variant: "default" },
  REGISTRATION_CLOSED: { label: "Registrasi Ditutup", variant: "secondary" },
  ON_GOING: { label: "Berlangsung", variant: "default" },
  COMPLETED: { label: "Selesai", variant: "secondary" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

export default async function ProgramListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { items, total } = await getPrograms({
    search: params.search,
    status: params.status,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Program"
        description="Kelola seluruh program dan kegiatan organisasi."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/program/new">
              <Plus className="size-4" />
              Buat Program
            </Link>
          </Button>
        }
      />

      <AdminTable
        title="Program"
        description={`${total} program ditemukan.`}
        columns={[
          {
            key: "code",
            label: "Kode",
            render: (item) => (
              <span className="text-xs font-mono text-muted-foreground">
                {item.code}
              </span>
            ),
          },
          {
            key: "name",
            label: "Nama Program",
            render: (item) => (
              <div className="max-w-62.5">
                <p className="truncate text-sm font-medium">{item.name}</p>
                {item.personInCharge && (
                  <p className="truncate text-xs text-muted-foreground">
                    PIC: {item.personInCharge.name}
                  </p>
                )}
              </div>
            ),
          },
          {
            key: "type",
            label: "Jenis",
            render: (item) => <span className="text-xs">{item.type}</span>,
          },
          {
            key: "startDate",
            label: "Mulai",
            render: (item) => (
              <span className="text-xs">{formatDate(item.startDate)}</span>
            ),
          },
          {
            key: "endDate",
            label: "Selesai",
            render: (item) => (
              <span className="text-xs">{formatDate(item.endDate)}</span>
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
                  <Link href={`/admin/program/${item.id}/edit`}>
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/program/${item.id}/schedules`}>
                    <Calendar className="size-3.5" />
                  </Link>
                </Button>
                <form action={deleteProgram.bind(null, item.id)}>
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
        emptyMessage="Belum ada program. Buat program pertama Anda."
      />
    </PageContainer>
  );
}
