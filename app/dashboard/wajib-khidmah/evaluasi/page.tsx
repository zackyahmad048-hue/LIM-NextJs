import { PageHeader } from '@/components/layout/page-header'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { listPenugasan } from '@/modules/wajib-khidmah/presentation/queries/list-penugasan.query'
import { createEvaluasiKasusAction } from '@/modules/wajib-khidmah/presentation/actions/create-evaluasi-kasus.action'
import { updateMediasiAction } from '@/modules/wajib-khidmah/presentation/actions/update-mediasi.action'

export default async function WkEvaluasiPage() {
  const penugasan = await listPenugasan()
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Wajib Khidmah — Evaluasi Kasus" />
      <ActionForm action={createEvaluasiKasusAction} submitLabel="Buat Kasus">
        <div className="space-y-4">
          <FormField label="Penugasan" name="penugasanId">
            <select name="penugasanId" required className="w-full rounded-md border bg-transparent px-3 py-2">
              <option value="">— Pilih penugasan —</option>
              {penugasan.map((p) => <option key={p.id} value={p.id}>{p.guruBantu?.user.name ?? p.guruBantuId} · {p.lembaga?.namaLembaga ?? p.lembagaId}</option>)}
            </select>
          </FormField>
          <FormField label="Judul masalah" name="judulMasalah">
            <input name="judulMasalah" required className="w-full rounded-md border bg-transparent px-3 py-2" />
          </FormField>
          <FormField label="Deskripsi" name="deskripsi">
            <textarea name="deskripsi" required rows={4} className="w-full rounded-md border bg-transparent px-3 py-2" />
          </FormField>
          <FormField label="Tingkat keparahan" name="tingkatKeparahan">
            <select name="tingkatKeparahan" required className="w-full rounded-md border bg-transparent px-3 py-2">
              <option value="RINGAN">Ringan</option>
              <option value="SEDANG">Sedang</option>
              <option value="BERAT">Berat</option>
            </select>
          </FormField>
        </div>
      </ActionForm>
      <section className="space-y-2">
        <h2 className="font-medium">Update Mediasi</h2>
        <ActionForm action={updateMediasiAction} submitLabel="Update">
          <div className="space-y-4">
            <FormField label="ID Kasus" name="kasusId">
              <input name="kasusId" required className="w-full rounded-md border bg-transparent px-3 py-2" />
            </FormField>
            <FormField label="Status mediasi" name="statusMediasi">
              <select name="statusMediasi" required className="w-full rounded-md border bg-transparent px-3 py-2">
                <option value="MENUNGGU_PUSAT">Menunggu pusat</option>
                <option value="MEDIASI_CABANG">Mediasi cabang</option>
                <option value="EVALUASI_INDUK">Evaluasi induk</option>
                <option value="SELESAI">Selesai</option>
                <option value="DICABUT">Dicabut</option>
              </select>
            </FormField>
            <FormField label="Catatan mediasi" name="catatanMediasi">
              <textarea name="catatanMediasi" rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" />
            </FormField>
          </div>
        </ActionForm>
      </section>
    </div>
  )
}
