import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { listLembaga } from "@/modules/twk-lembaga/queries/lembaga.query";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
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
      />

      <SectionCard variant="glass" className="rounded-lg p-4 shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Building2 className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Daftar lembaga</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {total} lembaga tercatat.
              </p>
            </div>
          </div>

          <form
            action="/admin/twk/lembaga"
            method="GET"
            className="w-full sm:w-auto"
          >
            <Input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Cari nama lembaga, daerah, pengasuh..."
              className="w-full sm:w-80"
            />
          </form>
        </div>
      </SectionCard>

      <SectionCard variant="glass" className="rounded-lg p-0 shadow-none">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="font-semibold">Belum ada permohonan</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Permohonan akan muncul di sini ketika lembaga eksternal mengisi
              formulir permohonan guru bantu.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-160">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Nama Lembaga
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Daerah
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Pengasuh
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Guru Bantu
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((lembaga, index) => {
                  const daerah = [
                    lembaga.kecamatan,
                    lembaga.kabupatenKota,
                    lembaga.provinsi,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <tr key={lembaga.id} className="border-t">
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/twk/lembaga/${lembaga.id}`}
                          className="font-medium text-foreground transition-colors hover:text-primary hover:underline"
                        >
                          {lembaga.namaLembagaPendidikan}
                        </Link>
                      </td>
                      <td className="max-w-48 truncate px-4 py-3 text-sm">
                        {daerah || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {lembaga.pengasuhNama || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {lembaga.jumlahGuruBantuDimohon}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/twk/lembaga/${lembaga.id}`}>
                            Detail
                            <ArrowRight className="size-3.5" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </PageContainer>
  );
}
