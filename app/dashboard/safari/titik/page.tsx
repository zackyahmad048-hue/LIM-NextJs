import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { listTitikSafari } from '@/modules/safari/presentation/queries/list-titik-safari.query'
import { createTitikSafariAction } from '@/modules/safari/presentation/actions/create-titik-safari.action'

export default async function SafariTitikPage() {
  const rows = await listTitikSafari()
  return (
    <div className="space-y-6">
      <PageHeader title="Safari Ramadan — Titik Safari" />
      <section className="max-w-2xl space-y-3">
        <h2 className="font-medium">Tambah Titik</h2>
        <ActionForm action={createTitikSafariAction} submitLabel="Simpan Titik">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nama titik" name="namaTitik"><input name="namaTitik" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Alamat" name="alamat"><input name="alamat" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Provinsi" name="provinsi"><input name="provinsi" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Kabupaten" name="kabupaten"><input name="kabupaten" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Kecamatan" name="kecamatan"><input name="kecamatan" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Desa" name="desa"><input name="desa" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="PIC nama (ops.)" name="picNama"><input name="picNama" className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="PIC no HP (ops.)" name="picNoHp"><input name="picNoHp" className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
        </ActionForm>
      </section>
      <section className="space-y-3">
        <h2 className="font-medium">Daftar Titik</h2>
        {rows.length === 0 ? <EmptyState title="Belum ada titik safari" /> : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left"><tr><th className="p-3">Nama</th><th className="p-3">Wilayah</th><th className="p-3">PIC</th></tr></thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="p-3">{t.namaTitik}</td>
                    <td className="p-3">{t.kabupaten}, {t.provinsi}</td>
                    <td className="p-3">{t.picNama ?? '—'}</td>
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
