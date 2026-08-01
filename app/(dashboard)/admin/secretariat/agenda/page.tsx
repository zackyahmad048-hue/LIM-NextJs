import { Calendar, MapPin, Users } from "lucide-react";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import { getAgendaBooks } from "@/modules/secretariat/queries/secretariat.query";

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

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
      />

      <AdminTable
        title="Agenda"
        description={`${total} agenda ditemukan.`}
        columns={[
          {
            key: "date",
            label: "Tanggal",
            render: (item) => (
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground" />
                <span className="text-xs">{formatDate(item.date)}</span>
              </div>
            ),
          },
          {
            key: "title",
            label: "Judul",
            render: (item) => (
              <div className="max-w-[250px]">
                <p className="truncate text-sm font-medium">{item.title}</p>
                {item.description && (
                  <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                )}
              </div>
            ),
          },
          {
            key: "location",
            label: "Lokasi",
            render: (item) => (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground" />
                <span className="text-xs">{item.location ?? "-"}</span>
              </div>
            ),
          },
          {
            key: "participants",
            label: "Peserta",
            render: (item) => (
              <div className="max-w-[200px]">
                {item.participants ? (
                  <div className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate text-xs">{item.participants}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </div>
            ),
          },
          {
            key: "notes",
            label: "Catatan",
            render: (item) => (
              <span className="truncate text-xs">{item.notes ?? "-"}</span>
            ),
          },
        ]}
        data={items as any[]}
        emptyMessage="Belum ada agenda."
      />
    </PageContainer>
  );
}
