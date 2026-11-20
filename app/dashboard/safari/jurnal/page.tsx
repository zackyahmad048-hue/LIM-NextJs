import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { TransitionButton } from '@/components/forms/transition-button'
import { listAllJurnal } from '@/modules/safari/presentation/queries/list-jurnal.query'
import { createJurnalAction } from '@/modules/safari/presentation/actions/create-jurnal.action'
import { approveJurnalAction } from '@/modules/safari/presentation/actions/approve-jurnal.action'

// Membaca sesi/DB tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

export default async function SafariJurnalPage() {
  const rows = await listAllJurnal()
  return (
    <div className="space-y-8">
      <PageHeader title="Safari Ramadan — Jurnal Harian" />
      <section className="max-w-2xl space-y-3">
        <h2 className="font-medium">Kirim Jurnal</h2>
        <ActionForm action={createJurnalAction} submitLabel="Kirim Jurnal">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Delegasi ID" name="delegasiId"><input name="delegasiId" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Tanggal" name="tanggal"><input name="tanggal" type="date" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Jumlah jamaah (ops.)" name="jumlahJamaah"><input name="jumlahJamaah" type="number" min={0} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
          <div className="space-y-4">
            <FormField label="Kegiatan" name="kegiatan"><textarea name="kegiatan" required rows={3} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Catatan (ops.)" name="catatan"><textarea name="catatan" rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
        </ActionForm>
      </section>
      <section className="space-y-3">
        <h2 className="font-medium">Daftar Jurnal</h2>
        {rows.length === 0 ? <EmptyState title="Belum ada jurnal" /> : (
          <ul className="rounded-lg border divide-y text-sm">
            {rows.map((j) => (
              <li key={j.id} className="flex items-start justify-between gap-4 p-3">
                <div>
                  <p className="font-medium">{new Date(j.tanggal).toLocaleDateString('id-ID')} · delegasi {j.delegasiId}</p>
                  <p className="text-muted-foreground">{j.kegiatan}</p>
                  {j.jumlahJamaah !== null && <p className="text-xs text-muted-foreground">Jamaah: {j.jumlahJamaah}</p>}
                </div>
                <TransitionButton action={approveJurnalAction} id={j.delegasiId} fieldName="delegasiId" label="Approve" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
