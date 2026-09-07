import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";

import { listLembaga } from "@/modules/twk-lembaga/queries/lembaga.query";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

interface LembagaRow {
  id: string;
  namaLembagaPendidikan: string;
  kecamatan: string | null;
  kabupatenKota: string | null;
  provinsi: string | null;
  pengasuhNama: string | null;
  jumlahGuruBantuDimohon: number;
}

export default async function LembagaListPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const { items, total } = await listLembaga({
    search: q,
    page: 1,
    limit: 50,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Lembaga Pemohon Guru Bantu"
        description="Daftar lembaga eksternal yang mengajukan permohonan guru bantu."
        actions={
          <form action="/admin/twk/lembaga" method="GET" className="w-full sm:w-auto">
            <Input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Cari nama lembaga, daerah, pengasuh..."
              className="w-full sm:w-80"
            />
          </form>
        }
      />

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="mb-4 h-12 w-12 text-admin-content-fg/40" />
          <h3 className="font-semibold text-admin-content-fg">Belum ada permohonan</h3>
          <p className="mt-2 max-w-sm text-sm text-admin-content-fg/60">
            Permohonan akan muncul di sini ketika lembaga eksternal mengisi
            formulir permohonan guru bantu.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <p className="text-sm text-admin-content-fg/60">
          {total} lembaga tercatat.
        </p>
      )}

      <DataTable<LembagaRow, unknown>
        data={items}
        columns={[
          {
            accessorKey: "namaLembagaPendidikan",
            header: "Nama Lembaga",
            cell: ({ row }) => (
              <Link
                href={`/admin/twk/lembaga/${row.original.id}`}
                className="font-medium transition-colors hover:text-primary hover:underline"
              >
                {row.original.namaLembagaPendidikan}
              </Link>
            ),
          },
          {
            id: "daerah",
            header: "Daerah",
            cell: ({ row }) => {
              const daerah = [
                row.original.kecamatan,
                row.original.kabupatenKota,
                row.original.provinsi,
              ]
                .filter(Boolean)
                .join(", ");
              return (
                <span className="text-sm text-admin-content-fg/80">
                  {daerah || <span className="text-admin-content-fg/40">-</span>}
                </span>
              );
            },
          },
          {
            accessorKey: "pengasuhNama",
            header: "Pengasuh",
            cell: ({ row }) => (
              <span className="text-sm text-admin-content-fg/80">
                {row.original.pengasuhNama || (
                  <span className="text-admin-content-fg/40">-</span>
                )}
              </span>
            ),
          },
          {
            accessorKey: "jumlahGuruBantuDimohon",
            header: "Guru Bantu",
            cell: ({ row }) => (
              <span className="text-sm tabular-nums text-admin-content-fg/80">
                {row.original.jumlahGuruBantuDimohon}
              </span>
            ),
          },
          {
            id: "actions",
            header: () => (
              <div className="text-right text-sm font-medium text-admin-content-fg/70">
                Aksi
              </div>
            ),
            cell: ({ row }) => (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/twk/lembaga/${row.original.id}`}>
                    Detail
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}