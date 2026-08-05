import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { getStructure } from "@/modules/cms/queries/structure.query";
import { StructureEditor } from "@/components/admin/structure/editor";

export default async function PengurusPusatPage() {
  const structure = await getStructure();

  return (
    <PageContainer>
      <PageHeader
        title="Pengurus Pusat"
        description="Kelola struktur pengurus pusat LIM periode 2024–2029."
        actions={
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <a href="/profil/pengurus-pusat" target="_blank" rel="noreferrer">
              Lihat halaman
            </a>
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StructureEditor initial={structure} />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Ringkasan</h3>
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>
                Pengurus Pusat:{" "}
                <strong>{structure.centralBoard.length}</strong>
              </p>
              <p>
                Pengurus Wilayah:{" "}
                <strong>{structure.regionalBoards.length}</strong>{" "}
                wilayah
              </p>
              <p>
                Pengurus Cabang:{" "}
                <strong>{structure.branchBoards.length}</strong>{" "}
                cabang
              </p>
              <p>
                Anggota: <strong>{structure.members.length}</strong>
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <h3 className="text-sm font-semibold">Informasi</h3>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <p>
                Simpan perubahan untuk memperbarui tampilan struktur
                di halaman publik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}