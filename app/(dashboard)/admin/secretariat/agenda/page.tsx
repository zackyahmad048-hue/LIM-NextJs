import Link from "next/link";
import { formatDateId } from "@/lib/format";
import { Calendar, MapPin, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";

import { getAgendaBooks } from "@/modules/secretariat/queries/secretariat.query";

export const dynamic = "force-dynamic";

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { items, total } = await getAgendaBooks({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Buku Agenda"
        description="Daftar agenda dan kegiatan organisasi (hanya baca)."
        actions={
          <div className="flex items-center gap-2">
            <Input
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Cari judul agenda..."
              className="rounded-md text-xs"
            />
            <Button type="submit" size="sm" variant="secondary">
              <Search className="size-3.5" /> Cari
            </Button>
          </div>
        }
      />

      {items.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">Belum ada agenda.</p>
      )}

      <DataTable
        data={items}
        columns={[
          {
            accessorKey: "date",
            header: "Tanggal",
            cell: (info) => {
              return (
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span className="text-xs tabular-nums">{formatDateId(info.original.date, { long: true })}</span>
                </div>
              );
            },
          },
          {
            accessorKey: "title",
            header: "Judul",
            cell: (info) => {
              return (
                <div className="max-w-62.5">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  {item.description && (
                    <p className="truncate text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              );
            },
          },
          {
            accessorKey: "location",
            header: "Lokasi",
            cell: (info) => {
              return (
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  <span className="text-xs">{item.location ?? "-"}</span>
                </div>
              );
            },
          },
          {
            accessorKey: "participants",
            header: "Peserta",
            cell: (info) => {
              return (
                <div className="max-w-50">
                  {item.participants ? (
                    <div className="flex items-center gap-1.5">
                      <Users className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate text-xs">{item.participants}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  );
                });
            },
          },
          {
            accessorKey: "notes",
            header: "Catatan",
            cell: (info) => {
              return <span className="truncate text-xs">{item.notes ?? "-"}</span>;
            },
          },
        ]}
      />
    </PageContainer>
  );
}