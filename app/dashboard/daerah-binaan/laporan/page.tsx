import { connection } from 'next/server'
import { PageHeader } from '@/components/layout/page-header'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { listDaerahBinaan } from '@/modules/daerah-binaan/presentation/queries/list-daerah-binaan.query'
import { createLaporanBulananAction } from '@/modules/daerah-binaan/presentation/actions/create-laporan-bulanan.action'

export default async function DaerahBinaanLaporanPage() {
  await connection()
  const daerah = await listDaerahBinaan()
  const now = new Date()
  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader title="Daerah Binaan — Laporan Bulanan" />
      <ActionForm action={createLaporanBulananAction} submitLabel="Kirim Laporan">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Daerah binaan" name="daerahBinaanId">
            <select name="daerahBinaanId" required className="w-full rounded-md border bg-transparent px-3 py-2">
              <option value="">— Pilih daerah —</option>
              {daerah.map((d) => <option key={d.id} value={d.id}>{d.namaLokasi}</option>)}
            </select>
          </FormField>
          <FormField label="Bulan" name="bulan">
            <select name="bulan" required defaultValue={now.getMonth() + 1} className="w-full rounded-md border bg-transparent px-3 py-2">
              {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
            </select>
          </FormField>
          <FormField label="Tahun" name="tahun"><input name="tahun" type="number" min={2020} max={2100} required defaultValue={now.getFullYear()} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          <FormField label="Estimasi peserta (ops.)" name="jumlahPesertaEstimasi"><input name="jumlahPesertaEstimasi" type="number" min={0} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
        </div>
        <div className="space-y-4">
          <FormField label="Kegiatan dilakukan" name="kegiatanDilakukan"><textarea name="kegiatanDilakukan" required rows={3} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          <FormField label="Dampak (naratif)" name="dampakNaratif"><textarea name="dampakNaratif" required rows={3} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          <FormField label="Tantangan (ops.)" name="tantanganHambatan"><textarea name="tantanganHambatan" rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          <FormField label="Rencana bulan depan (ops.)" name="rencanaBulanDepan"><textarea name="rencanaBulanDepan" rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
        </div>
      </ActionForm>
    </div>
  )
}
