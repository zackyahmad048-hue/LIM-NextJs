import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { listLaporanHarianPengajar } from '@/modules/pesantren-ramadan/presentation/queries/list-laporan-harian.query'
import { listPenugasanPesantren } from '@/modules/pesantren-ramadan/presentation/queries/list-penugasan-pesantren.query'
import { createLaporanHarianPengajarAction } from '@/modules/pesantren-ramadan/presentation/actions/create-laporan-harian-pengajar.action'

// Membaca sesi/DB tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

export default async function PesantrenLaporanPage() {
  const [rows, penugasan] = await Promise.all([listLaporanHarianPengajar(), listPenugasanPesantren()])
  return (
    <div className="space-y-8">
      <PageHeader title="Pesantren Ramadan — Laporan Harian Pengajar" />
      <section className="max-w-2xl space-y-3">
        <h2 className="font-medium">Input Laporan</h2>
        <ActionForm action={createLaporanHarianPengajarAction} submitLabel="Kirim Laporan">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Penugasan" name="penugasanId">
              <select name="penugasanId" required className="w-full rounded-md border bg-transparent px-3 py-2">
                <option value="">— Pilih penugasan —</option>
                {penugasan.map((p) => <option key={p.id} value={p.id}>{p.id}</option>)}
              </select>
            </FormField>
            <FormField label="Tanggal" name="tanggal"><input name="tanggal" type="date" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Kelas" name="kelas"><input name="kelas" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Jumlah siswa (L)" name="jumlahSiswaL"><input name="jumlahSiswaL" type="number" min={0} required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Jumlah siswa (P)" name="jumlahSiswaP"><input name="jumlahSiswaP" type="number" min={0} required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Materi ID" name="materiId"><input name="materiId" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Kondisi kelas" name="kondisiKelas">
              <select name="kondisiKelas" required className="w-full rounded-md border bg-transparent px-3 py-2">
                <option value="TENANG">Tenang</option>
                <option value="RAMAI_TAPI_KONDUSIF">Ramai tapi kondusif</option>
                <option value="DISKUSI_BERJALAN_BAIK">Diskusi berjalan baik</option>
                <option value="BANYAK_YANG_MENGANTUK">Banyak yang mengantuk</option>
                <option value="TIDAK_KONDUSIF">Tidak kondusif</option>
              </select>
            </FormField>
            <FormField label="Praktik dilakukan" name="praktikDilakukan">
              <select name="praktikDilakukan" className="w-full rounded-md border bg-transparent px-3 py-2"><option value="false">Tidak</option><option value="true">Ya</option></select>
            </FormField>
          </div>
          <div className="space-y-4">
            <FormField label="Pertanyaan peserta (ops.)" name="pertanyaanPeserta"><textarea name="pertanyaanPeserta" rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Catatan tambahan (ops.)" name="catatanTambahan"><textarea name="catatanTambahan" rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
        </ActionForm>
      </section>
      <section className="space-y-3">
        <h2 className="font-medium">Riwayat</h2>
        {rows.length === 0 ? <EmptyState title="Belum ada laporan harian" /> : (
          <ul className="rounded-lg border divide-y text-sm">
            {rows.map((l) => <li key={l.id} className="p-3">{new Date(l.tanggal).toLocaleDateString('id-ID')} — {l.kelas} · siswa L {l.jumlahSiswaL} / P {l.jumlahSiswaP}</li>)}
          </ul>
        )}
      </section>
    </div>
  )
}
