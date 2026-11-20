import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { listBankMateri } from '@/modules/pesantren-ramadan/presentation/queries/list-sekolah-mitra.query'
import { createBankMateriAction } from '@/modules/pesantren-ramadan/presentation/actions/create-bank-materi.action'

// Membaca sesi/DB tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

export default async function PesantrenBankMateriPage() {
  const rows = await listBankMateri()
  return (
    <div className="space-y-8">
      <PageHeader title="Pesantren Ramadan — Bank Materi" />
      <section className="max-w-xl space-y-3">
        <h2 className="font-medium">Tambah Materi</h2>
        <ActionForm action={createBankMateriAction} submitLabel="Simpan Materi">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Judul materi" name="judulMateri"><input name="judulMateri" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Target jenjang" name="targetJenjang">
              <select name="targetJenjang" required className="w-full rounded-md border bg-transparent px-3 py-2">
                <option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option><option value="PERGURUAN_TINGGI">Perguruan tinggi</option>
              </select>
            </FormField>
            <FormField label="Durasi (menit)" name="durasiMenit"><input name="durasiMenit" type="number" min={1} max={600} required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
          <FormField label="Deskripsi" name="deskripsi"><textarea name="deskripsi" required rows={3} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
        </ActionForm>
      </section>
      <section className="space-y-3">
        <h2 className="font-medium">Daftar Materi</h2>
        {rows.length === 0 ? <EmptyState title="Belum ada materi" /> : (
          <ul className="rounded-lg border divide-y text-sm">
            {rows.map((m) => <li key={m.id} className="p-3">{m.judulMateri} <span className="text-muted-foreground">· {m.targetJenjang} · {m.durasiMenit} menit</span></li>)}
          </ul>
        )}
      </section>
    </div>
  )
}
