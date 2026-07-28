import { Building2 } from "lucide-react";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { getStructure } from "@/modules/cms/queries/structure.query";
import { StructureEditor } from "@/components/admin/structure/editor";

export default async function StructurePage() {
  const structure = await getStructure();

  return (
    <PageContainer>
      <PageHeader
        title="Struktur Organisasi"
        description="Kelola informasi organisasi, bidang, jabatan, dan pengurus."
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
                Bidang: <strong>{structure.departments.length}</strong>
              </p>
              <p>
                Jabatan: <strong>{structure.positions.length}</strong>
              </p>
              <p>
                Pengurus: <strong>{structure.management.length}</strong>
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <h3 className="text-sm font-semibold">Informasi</h3>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <p>Simpan perubahan untuk memperbarui tampilan struktur di halaman publik.</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
