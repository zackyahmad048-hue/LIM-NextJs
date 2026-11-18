import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { listPendaftaranEvent } from '@/modules/dakwah-digital/presentation/queries/list-konten.query'
import { registerEventAction } from '@/modules/dakwah-digital/presentation/actions/register-event.action'

export default async function DakwahEventPage() {
  const rows = await listPendaftaranEvent()
  return (
    <div className="space-y-8">
      <PageHeader title="Dakwah Digital — Event" />
      <section className="max-w-xl space-y-3">
        <h2 className="font-medium">Pendaftaran Peserta (publik)</h2>
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
        <h2 className="font-medium">Daftar Pendaftar</h2>
        {rows.length === 0 ? <EmptyState title="Belum ada pendaftar" /> : (
          <ul className="rounded-lg border divide-y text-sm">
            {rows.map((p) => <li key={p.id} className="p-3">{p.namaPeserta} <span className="text-muted-foreground">· {p.email} · {p.noHp}</span></li>)}
          </ul>
        )}
      </section>
    </div>
  )
}
