import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import {
  getProgramById,
  getDocumentation,
} from "@/modules/program/queries/program.query";
import { addDocumentation } from "@/modules/program/presentation/program.action";
import { DocumentationTable } from "./documentation-table";

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [program, documentation] = await Promise.all([
    getProgramById(id),
    getDocumentation(id),
  ]);

  if (!program) notFound();

  return (
    <PageContainer>
      <PageHeader
        title={`Dokumentasi - ${program.name}`}
        description="Kelola dokumentasi kegiatan."
      />

      <form
        action={addDocumentation.bind(null, program.id)}
        className="max-w-sm space-y-3 rounded-lg border bg-background p-4"
      >
        <h3 className="text-sm font-semibold">Tambah Dokumentasi</h3>
        <div className="space-y-1.5">
          <label htmlFor="doc-title" className="text-xs font-medium">
            Judul
          </label>
          <input
            id="doc-title"
            name="title"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="doc-media" className="text-xs font-medium">
            Media ID
          </label>
          <input
            id="doc-media"
            name="mediaId"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="doc-desc" className="text-xs font-medium">
            Deskripsi (opsional)
          </label>
          <textarea
            id="doc-desc"
            name="description"
            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
          />
        </div>
        <Button type="submit" size="sm">
          Simpan
        </Button>
      </form>

      {documentation.length > 0 && (
        <p className="text-sm text-admin-content-fg/60">
          {documentation.length} item.
        </p>
      )}

      {documentation.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada dokumentasi.
        </p>
      )}

      <DocumentationTable data={documentation} programId={program.id} />
    </PageContainer>
  );
}