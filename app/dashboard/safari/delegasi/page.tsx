import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { listDelegasi } from '@/modules/safari/presentation/queries/list-delegasi.query'
import { createDelegasiAction } from '@/modules/safari/presentation/actions/create-delegasi.action'
import { createJurnalAction } from '@/modules/safari/presentation/actions/create-jurnal.action'
import { createLaporanSidakAction } from '@/modules/safari/presentation/actions/create-laporan-sidak.action'

export default async function SafariDelegasiPage() {
  const rows = await listDelegasi()
  return (
    <div className="space-y-8">
      <PageHeader title="Safari Ramadan — Delegasi & Jurnal" />
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
      <section className="max-w-2xl space-y-3">
        <h2 className="font-medium">Jurnal Harian</h2>
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
      <section className="max-w-2xl space-y-3">
        <h2 className="font-medium">Laporan Sidak</h2>
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
