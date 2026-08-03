import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import {
  getProgramById,
  getDocumentation,
} from "@/modules/program/queries/program.query";
import {
  addDocumentation,
  removeDocumentation,
} from "@/modules/program/presentation/program.action";

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
          <label className="text-xs font-medium">Judul</label>
          <input
            name="title"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Media ID</label>
          <input
            name="mediaId"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Deskripsi (opsional)</label>
          <textarea
            name="description"
            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
          />
        </div>
        <Button type="submit" size="sm">
          Simpan
        </Button>
      </form>

      <AdminTable
        title="Daftar Dokumentasi"
        description={`${documentation.length} item.`}
        columns={[
          {
            key: "title",
            label: "Judul",
            render: (item) => (
              <span className="text-sm font-medium">{item.title}</span>
            ),
          },
          {
            key: "description",
            label: "Deskripsi",
            render: (item) => (
              <span className="text-xs text-muted-foreground">
                {item.description || "-"}
              </span>
            ),
          },
          {
            key: "actions",
            label: "Aksi",
            align: "right",
            render: (item) => (
              <form
                action={removeDocumentation.bind(null, item.id, program.id)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </form>
            ),
          },
        ]}
        data={documentation as any[]}
        emptyMessage="Belum ada dokumentasi."
      />
    </PageContainer>
  );
}
