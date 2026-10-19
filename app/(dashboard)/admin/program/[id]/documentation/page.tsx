import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

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

      <Band variant="raised" title="Tambah Dokumentasi" className="max-w-sm">
        <form
          action={addDocumentation.bind(null, program.id)}
          className="space-y-3"
        >
          <div className="space-y-1.5">
            <Label htmlFor="doc-title" className="text-xs">
              Judul
            </Label>
            <Input
              id="doc-title"
              name="title"
              required
              className="rounded-md text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="doc-media" className="text-xs">
              Media ID
            </Label>
            <Input
              id="doc-media"
              name="mediaId"
              required
              className="rounded-md text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="doc-desc" className="text-xs">
              Deskripsi (opsional)
            </Label>
            <Textarea
              id="doc-desc"
              name="description"
              className="min-h-20 rounded-md text-xs"
            />
          </div>
          <Button type="submit" size="sm">
            Simpan
          </Button>
        </form>
      </Band>

      <Band variant="raised">
        <DocumentationTable data={documentation} programId={program.id} />
      </Band>
    </PageContainer>
  );
}