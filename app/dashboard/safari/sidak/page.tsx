import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { listAllLaporanSidak } from '@/modules/safari/presentation/queries/list-laporan-sidak.query'
import { createLaporanSidakAction } from '@/modules/safari/presentation/actions/create-laporan-sidak.action'

// Membaca sesi/DB tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

export default async function SafariSidakPage() {
  const rows = await listAllLaporanSidak()
  return (
    <div className="space-y-8">
      <PageHeader title="Safari Ramadan — Laporan Sidak" />
      <section className="max-w-2xl space-y-3">
        <h2 className="font-medium">Tambah Laporan Sidak</h2>
        <ActionForm action={createLaporanSidakAction} submitLabel="Simpan Sidak">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Delegasi ID" name="delegasiId"><input name="delegasiId" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Tanggal sidak" name="tanggalSidak"><input name="tanggalSidak" type="date" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
          <div className="space-y-4">
            <FormField label="Kondisi kegiatan" name="kondisiKegiatan"><textarea name="kondisiKegiatan" required rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Kondisi delegasi" name="kondisiDelegasi"><textarea name="kondisiDelegasi" required rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Kendala (ops.)" name="kendala"><textarea name="kendala" rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Rekomendasi (ops.)" name="rekomendasi"><textarea name="rekomendasi" rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
        </ActionForm>
      </section>
      <section className="space-y-3">
        <h2 className="font-medium">Daftar Laporan Sidak</h2>
        {rows.length === 0 ? <EmptyState title="Belum ada laporan sidak" /> : (
          <ul className="rounded-lg border divide-y text-sm">
            {rows.map((s) => (
              <li key={s.id} className="p-3">
                <p className="font-medium">{new Date(s.tanggalSidak).toLocaleDateString('id-ID')} · delegasi {s.delegasiId}</p>
                <p className="text-muted-foreground">{s.kondisiKegiatan}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
