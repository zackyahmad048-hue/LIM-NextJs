import { formatDateId } from "@/lib/format";
import { Calendar, MapPin, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const { items } = await getAgendaBooks({
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
            cell: ({ row }) => {
              return (
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span className="text-xs tabular-nums">{formatDateId(row.original.date, { long: true })}</span>
                </div>
              );
            },
          },
          {
            accessorKey: "title",
            header: "Judul",
            cell: ({ row }) => {
              const item = row.original;
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
            cell: ({ row }) => {
              const item = row.original;
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
            cell: ({ row }) => {
              const item = row.original;
              return (
                <div className="max-w-50">
                  {item.participants ? (
                    <div className="flex items-center gap-1.5">
                      <Users className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate text-xs">{item.participants}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </div>
              );
            },
          },
          {
            accessorKey: "notes",
            header: "Catatan",
            cell: ({ row }) => {
              const item = row.original;
              return <span className="truncate text-xs">{item.notes ?? "-"}</span>;
            },
          },
        ]}
      />
    </PageContainer>
  );
}