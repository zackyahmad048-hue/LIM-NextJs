import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { listDaerahBinaan } from '@/modules/daerah-binaan/presentation/queries/list-daerah-binaan.query'
import { createDaerahBinaanAction } from '@/modules/daerah-binaan/presentation/actions/create-daerah-binaan.action'
import { withRequiredSessionTenant } from '@/lib/auth'

// Membaca sesi/DB tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

export default async function DaerahBinaanPage() {
  const rows = await withRequiredSessionTenant(() => listDaerahBinaan())
  return (
    <div className="space-y-8">
      <PageHeader title="Daerah Binaan" actions={<a href="/dashboard/daerah-binaan/laporan" className="rounded-md border px-3 py-2 text-sm hover:bg-accent">Laporan Bulanan</a>} />
      <section className="max-w-2xl space-y-3">
        <h2 className="font-medium">Tambah Daerah Binaan</h2>
        <ActionForm action={createDaerahBinaanAction} submitLabel="Simpan">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nama lokasi" name="namaLokasi"><input name="namaLokasi" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Provinsi" name="provinsi"><input name="provinsi" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Kabupaten" name="kabupaten"><input name="kabupaten" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Kecamatan" name="kecamatan"><input name="kecamatan" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Sumber lokasi (ops.)" name="sumberLokasi"><input name="sumberLokasi" className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
          <FormField label="Deskripsi kondisi" name="deskripsiKondisi"><textarea name="deskripsiKondisi" required rows={3} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
        </ActionForm>
      </section>
      <section className="space-y-3">
        <h2 className="font-medium">Daftar</h2>
        {rows.length === 0 ? <EmptyState title="Belum ada daerah binaan" /> : (
          <ul className="rounded-lg border divide-y text-sm">
            {rows.map((d) => <li key={d.id} className="p-3">{d.namaLokasi} <span className="text-xs text-muted-foreground">· {d.kabupaten}, {d.provinsi} · {d.status}</span></li>)}
          </ul>
        )}
      </section>
    </div>
  )
}
