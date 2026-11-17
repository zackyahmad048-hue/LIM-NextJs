import { PageHeader } from '@/components/layout/page-header'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { listPenugasan } from '@/modules/wajib-khidmah/presentation/queries/list-penugasan.query'
import { submitLaporanAction } from '@/modules/wajib-khidmah/presentation/actions/submit-laporan.action'

export default async function WkLaporanPage() {
  const penugasan = await listPenugasan()
  const now = new Date()
  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader title="Wajib Khidmah — Laporan Mingguan" description="Laporan mingguan penugasan guru bantu." />
      <ActionForm action={submitLaporanAction} submitLabel="Kirim Laporan">
        <div className="space-y-4">
          <FormField label="Penugasan" name="penugasanId">
            <select name="penugasanId" required className="w-full rounded-md border bg-transparent px-3 py-2">
              <option value="">— Pilih penugasan —</option>
              {penugasan.map((p) => <option key={p.id} value={p.id}>{p.guruBantu?.user.name ?? p.guruBantuId} · {p.lembaga?.namaLembaga ?? p.lembagaId}</option>)}
            </select>
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Minggu ke-" name="periodeMinggu">
              <input name="periodeMinggu" type="number" min={1} max={53} required defaultValue={1} className="w-full rounded-md border bg-transparent px-3 py-2" />
            </FormField>
            <FormField label="Tahun" name="periodeTahun">
              <input name="periodeTahun" type="number" min={2020} max={2100} required defaultValue={now.getFullYear()} className="w-full rounded-md border bg-transparent px-3 py-2" />
            </FormField>
            <FormField label="Hari hadir (0-7)" name="jumlahHariHadir">
              <input name="jumlahHariHadir" type="number" min={0} max={7} required className="w-full rounded-md border bg-transparent px-3 py-2" />
            </FormField>
            <FormField label="Jumlah jamaah" name="jumlahJamaahDilakukan">
              <input name="jumlahJamaahDilakukan" type="number" min={0} required className="w-full rounded-md border bg-transparent px-3 py-2" />
            </FormField>
          </div>
          <FormField label="Status honor" name="statusHonor">
            <select name="statusHonor" required className="w-full rounded-md border bg-transparent px-3 py-2">
              <option value="SUDAH_SESUAI">Sudah sesuai</option>
              <option value="BELUM">Belum</option>
              <option value="SEBAGIAN">Sebagian</option>
              <option value="TIDAK_BERLAKU">Tidak berlaku</option>
            </select>
          </FormField>
          <FormField label="Aktivitas mingguan" name="aktivitasMingguan">
            <textarea name="aktivitasMingguan" required rows={4} className="w-full rounded-md border bg-transparent px-3 py-2" />
          </FormField>
          <FormField label="Kendala (opsional)" name="kendala">
            <textarea name="kendala" rows={2} className="w-full rounded-md border bg-transparent px-3 py-2" />
          </FormField>
          <FormField label="Nama pengisi" name="namaPengisi">
            <input name="namaPengisi" required className="w-full rounded-md border bg-transparent px-3 py-2" />
          </FormField>
          <FormField label="Jabatan pengisi" name="jabatanPengisi">
            <input name="jabatanPengisi" required className="w-full rounded-md border bg-transparent px-3 py-2" />
          </FormField>
        </div>
      </ActionForm>
    </div>
  )
}
