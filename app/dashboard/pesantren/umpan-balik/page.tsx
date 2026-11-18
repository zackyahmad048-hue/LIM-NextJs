import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { listUmpanBalikPusat, listUmpanBalikPeserta } from '@/modules/pesantren-ramadan/presentation/queries/list-laporan-harian.query'
import { createUmpanBalikPusatAction } from '@/modules/pesantren-ramadan/presentation/actions/create-umpan-balik-pusat.action'
import { createUmpanBalikPesertaAction } from '@/modules/pesantren-ramadan/presentation/actions/create-umpan-balik-peserta.action'

export default async function PesantrenUmpanBalikPage() {
  const [pusat, peserta] = await Promise.all([listUmpanBalikPusat(), listUmpanBalikPeserta()])
  return (
    <div className="space-y-8">
      <PageHeader title="Pesantren Ramadan — Umpan Balik" />
      <section className="max-w-xl space-y-3">
        <h2 className="font-medium">Umpan Balik Pusat (kunjungan)</h2>
        <ActionForm action={createUmpanBalikPusatAction} submitLabel="Simpan">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Penugasan ID" name="penugasanId"><input name="penugasanId" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Tanggal kunjungan" name="tanggalKunjungan"><input name="tanggalKunjungan" type="date" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
          <div className="space-y-4">
            <FormField label="Kondisi sarana" name="kondisiSarana"><textarea name="kondisiSarana" required rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Relevansi materi" name="relevansiMateri"><textarea name="relevansiMateri" required rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Kesesuaian kesepakatan" name="kesesuaianKesepakatan"><textarea name="kesesuaianKesepakatan" required rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Rekomendasi (ops.)" name="rekomendasi"><textarea name="rekomendasi" rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
        </ActionForm>
      </section>
      <section className="max-w-xl space-y-3">
        <h2 className="font-medium">Umpan Balik Peserta</h2>
        <ActionForm action={createUmpanBalikPesertaAction} submitLabel="Simpan">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Penugasan ID" name="penugasanId"><input name="penugasanId" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Jumlah responden" name="jumlahResponden"><input name="jumlahResponden" type="number" min={1} required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Rating kepuasan (0-5)" name="ratingKepuasan"><input name="ratingKepuasan" type="number" step="0.1" min={0} max={5} required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
          <div className="space-y-4">
            <FormField label="Komentar positif (ops.)" name="komentarPositif"><textarea name="komentarPositif" rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Komentar perbaikan (ops.)" name="komentarPerbaikan"><textarea name="komentarPerbaikan" rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          </div>
        </ActionForm>
      </section>
      <section className="space-y-3">
        <h2 className="font-medium">Riwayat Umpan Balik</h2>
        {pusat.length === 0 && peserta.length === 0 ? <EmptyState title="Belum ada umpan balik" /> : (
          <ul className="rounded-lg border divide-y text-sm">
            {pusat.map((u) => <li key={u.id} className="p-3">Pusat · penugasan {u.penugasanId} · {new Date(u.tanggalKunjungan).toLocaleDateString('id-ID')}</li>)}
            {peserta.map((u) => <li key={u.id} className="p-3">Peserta · penugasan {u.penugasanId} · rating {u.ratingKepuasan}/5 ({u.jumlahResponden} responden)</li>)}
          </ul>
        )}
      </section>
    </div>
  )
}
