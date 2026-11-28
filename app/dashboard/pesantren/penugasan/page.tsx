import { PageHeader } from '@/components/layout/page-header'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { withRequiredSessionTenant } from '@/lib/auth'
import { listSekolahMitra } from '@/modules/pesantren-ramadan/presentation/queries/list-sekolah-mitra.query'
import { createPenugasanPesantrenAction } from '@/modules/pesantren-ramadan/presentation/actions/create-penugasan-pesantren.action'

// Membaca sesi/DB tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

export default async function PesantrenPenugasanPage() {
  const sekolah = await withRequiredSessionTenant(() => listSekolahMitra())
  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader title="Pesantren Ramadan — Penugasan Pengajar" />
      <ActionForm action={createPenugasanPesantrenAction} submitLabel="Simpan Penugasan">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Sekolah mitra" name="sekolahId">
            <select name="sekolahId" required className="w-full rounded-md border bg-transparent px-3 py-2">
              <option value="">— Pilih sekolah —</option>
              {sekolah.map((s) => <option key={s.id} value={s.id}>{s.namaSekolah}</option>)}
            </select>
          </FormField>
          <FormField label="Pengajar (User ID)" name="pengajarId"><input name="pengajarId" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          <FormField label="Koordinator (User ID)" name="koordinatorId"><input name="koordinatorId" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          <FormField label="Tanggal mulai" name="tanggalMulai"><input name="tanggalMulai" type="date" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
          <FormField label="Tanggal selesai" name="tanggalSelesai"><input name="tanggalSelesai" type="date" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
        </div>
      </ActionForm>
    </div>
  )
}
