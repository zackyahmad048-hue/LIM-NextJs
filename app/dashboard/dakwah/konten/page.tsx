import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { StatusBadge } from '@/components/data/status-badge'
import { TransitionButton } from '@/components/forms/transition-button'
import { withRequiredSessionTenant } from '@/lib/auth'
import { listKonten } from '@/modules/dakwah-digital/presentation/queries/list-konten.query'
import { uploadKontenAction } from '@/modules/dakwah-digital/presentation/actions/upload-konten.action'
import { approveKontenAction, publishKontenAction } from '@/modules/dakwah-digital/presentation/actions/approve-konten.action'
import { registerEventAction } from '@/modules/dakwah-digital/presentation/actions/register-event.action'

const kontenVariant: Record<string, 'neutral' | 'info' | 'success' | 'warning' | 'danger'> = {
  DRAFT: 'neutral',
  PENDING_REVIEW: 'warning',
  APPROVED: 'info',
  PUBLISHED: 'success',
  REJECTED: 'danger',
}

// Membaca sesi/DB tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

export default async function DakwahKontenPage() {
  const rows = await withRequiredSessionTenant(() => listKonten())
  return (
    <div className="space-y-8">
      <PageHeader title="Dakwah Digital — Konten" />
      <section className="max-w-2xl space-y-3">
        <h2 className="font-medium">Upload Konten</h2>
        <ActionForm action={uploadKontenAction} submitLabel="Simpan">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Judul" name="judul"><input name="judul" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Slug" name="slug"><input name="slug" required pattern="[a-z0-9-]+" className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Jenis konten" name="jenisKonten">
              <select name="jenisKonten" required className="w-full rounded-md border bg-transparent px-3 py-2">
                <option value="WEBINAR">Webinar</option><option value="PODCAST">Podcast</option><option value="KONTEN_MEDIASOS">Konten medsos</option><option value="KULTUM_DIGITAL">Kultum digital</option><option value="TANYA_JAWAB_ONLINE">Tanya jawab online</option>
              </select>
            </FormField>
            <FormField label="Link video (ops.)" name="linkVideo"><input name="linkVideo" type="url" className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Thumbnail URL (ops.)" name="thumbnailUrl"><input name="thumbnailUrl" type="url" className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
          <FormField label="Deskripsi" name="deskripsi"><textarea name="deskripsi" required rows={3} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
        </ActionForm>
      </section>
      <section className="max-w-2xl space-y-3">
        <h2 className="font-medium">Daftar Event (publik)</h2>
        <ActionForm action={registerEventAction} submitLabel="Daftar">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Konten ID" name="kontenId"><input name="kontenId" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Nama peserta" name="namaPeserta"><input name="namaPeserta" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Email" name="email"><input name="email" type="email" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="No HP" name="noHp"><input name="noHp" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Asal instansi (ops.)" name="asalInstansi"><input name="asalInstansi" className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
        </ActionForm>
      </section>
      <section className="space-y-3">
        <h2 className="font-medium">Daftar Konten</h2>
        {rows.length === 0 ? <EmptyState title="Belum ada konten" /> : (
          <ul className="rounded-lg border divide-y text-sm">
            {rows.map((k) => (
              <li key={k.id} className="flex items-center justify-between gap-3 p-3">
                <span>{k.judul} <span className="text-xs text-muted-foreground">· {k.jenisKonten}</span></span>
                <span className="flex items-center gap-2">
                  <StatusBadge label={k.status} variant={kontenVariant[k.status] ?? 'neutral'} />
                  {k.status === 'PENDING_REVIEW' && <TransitionButton action={approveKontenAction} id={k.id} fieldName="kontenId" label="Approve" />}
                  {k.status === 'APPROVED' && <TransitionButton action={publishKontenAction} id={k.id} fieldName="kontenId" label="Publish" />}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
