import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { withRequiredSessionTenant } from '@/lib/auth'
import { listArticleCategories } from '@/modules/cms/presentation/queries/list-articles.query'
import { createCategoryAction } from '@/modules/cms/presentation/actions/create-category.action'

// Membaca sesi/DB tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

export default async function CmsKategoriPage() {
  const categories = await withRequiredSessionTenant(() => listArticleCategories())
  return (
    <div className="space-y-8">
      <PageHeader title="CMS — Kategori Artikel" />
      <section className="max-w-xl space-y-3">
        <h2 className="font-medium">Kategori Baru</h2>
        <ActionForm action={createCategoryAction} submitLabel="Simpan Kategori">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Nama" name="nama"><input name="nama" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Slug" name="slug"><input name="slug" required pattern="[a-z0-9-]+" className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Urutan" name="urutan"><input name="urutan" type="number" min={0} defaultValue={0} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
        </ActionForm>
      </section>
      <section className="space-y-3">
        <h2 className="font-medium">Daftar Kategori</h2>
        {categories.length === 0 ? <EmptyState title="Belum ada kategori" /> : (
          <ul className="rounded-lg border divide-y text-sm">
            {categories.map((c) => <li key={c.id} className="flex justify-between p-3"><span>{c.nama}</span><span className="font-mono text-xs text-muted-foreground">{c.slug} · urutan {c.urutan}</span></li>)}
          </ul>
        )}
      </section>
    </div>
  )
}
