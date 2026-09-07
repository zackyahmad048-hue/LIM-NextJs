import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import {
  getProgramById,
  getDocumentation,
} from "@/modules/program/queries/program.query";
import {
  addDocumentation,
  removeDocumentation,
} from "@/modules/program/presentation/program.action";

type Item = Awaited<ReturnType<typeof getDocumentation>>[number];

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

      <DataTable<Item, unknown>
        data={documentation}
        columns={[
          {
            accessorKey: "title",
            header: "Judul",
            cell: ({ row }) => (
              <span className="text-sm font-medium text-admin-content-fg">
                {row.original.title}
              </span>
            ),
          },
          {
            accessorKey: "description",
            header: "Deskripsi",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/60">
                {row.original.description || "-"}
              </span>
            ),
          },
          {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
              <div className="flex justify-end">
                <ConfirmDelete
                  onConfirm={removeDocumentation}
                  args={[row.original.id, program.id]}
                  title="Hapus dokumentasi"
                  description={`Dokumentasi "${row.original.title}" akan dihapus permanen.`}
                  label="Hapus dokumentasi"
                />
              </div>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}