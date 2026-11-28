import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { withRequiredSessionTenant } from '@/lib/auth'
import { listDelegasi } from '@/modules/safari/presentation/queries/list-delegasi.query'
import { createDelegasiAction } from '@/modules/safari/presentation/actions/create-delegasi.action'

// Membaca sesi/DB tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

export default async function SafariDelegasiPage() {
  const rows = await withRequiredSessionTenant(() => listDelegasi())
  return (
    <div className="space-y-8">
      <PageHeader title="Safari Ramadan — Delegasi" />
      <section className="max-w-2xl space-y-3">
        <h2 className="font-medium">Tambah Delegasi</h2>
        <ActionForm action={createDelegasiAction} submitLabel="Simpan Delegasi">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Titik ID" name="titikId"><input name="titikId" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="User ID" name="userId"><input name="userId" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Nama lengkap" name="namaLengkap"><input name="namaLengkap" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="No HP" name="noHp"><input name="noHp" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Asal pondok (ops.)" name="asalPondok"><input name="asalPondok" className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
        </ActionForm>
      </section>
      <section className="space-y-3">
        <h2 className="font-medium">Daftar Delegasi</h2>
        {rows.length === 0 ? <EmptyState title="Belum ada delegasi" /> : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left"><tr><th className="p-3">Nama</th><th className="p-3">Titik</th><th className="p-3">Status</th></tr></thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="p-3">{d.namaLengkap}</td>
                    <td className="p-3">{d.titikId}</td>
                    <td className="p-3">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
