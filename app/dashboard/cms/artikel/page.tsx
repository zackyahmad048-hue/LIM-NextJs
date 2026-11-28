import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { withRequiredSessionTenant } from '@/lib/auth'
import { listArticles, listArticleCategories } from '@/modules/cms/presentation/queries/list-articles.query'
import { createArticleAction } from '@/modules/cms/presentation/actions/create-article.action'
import { createCategoryAction } from '@/modules/cms/presentation/actions/create-category.action'

// Membaca sesi/DB tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

export default async function CmsArtikelPage() {
  const [articles, categories] = await withRequiredSessionTenant(() =>
    Promise.all([listArticles(), listArticleCategories()]),
  )
  return (
    <div className="space-y-8">
      <PageHeader title="CMS — Artikel" />
      <section className="max-w-2xl space-y-3">
        <h2 className="font-medium">Buat Artikel</h2>
        <ActionForm action={createArticleAction} submitLabel="Simpan Draft">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Judul" name="title"><input name="title" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Slug" name="slug"><input name="slug" required pattern="[a-z0-9-]+" className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Kategori" name="categoryId">
              <select name="categoryId" required className="w-full rounded-md border bg-transparent px-3 py-2">
                <option value="">— Pilih kategori —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
              </select>
            </FormField>
            <FormField label="Cover image URL (ops.)" name="coverImageUrl"><input name="coverImageUrl" type="url" className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
          <FormField label="Excerpt (ops.)" name="excerpt"><input name="excerpt" className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          <FormField label="Konten" name="content"><textarea name="content" required rows={6} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
        </ActionForm>
      </section>
      <section className="max-w-2xl space-y-3">
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
        <h2 className="font-medium">Daftar Artikel</h2>
        {articles.length === 0 ? <EmptyState title="Belum ada artikel" /> : (
          <ul className="rounded-lg border divide-y text-sm">
            {articles.map((a) => <li key={a.id} className="flex items-center justify-between p-3"><span>{a.title}</span><span className="text-xs text-muted-foreground">{a.status}</span></li>)}
          </ul>
        )}
      </section>
    </div>
  )
}
