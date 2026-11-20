import { connection } from 'next/server'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { ActionForm } from '@/components/forms/action-form'
import { FormField } from '@/components/forms/form-field'
import { listJadwalShalat } from '@/modules/falak/presentation/queries/list-jadwal.query'
import { generateJadwalAction } from '@/modules/falak/presentation/actions/generate-jadwal.action'

const fieldOrder = [
  'subuh', 'terbit', 'dzuhur', 'ashar', 'maghrib', 'isya',
] as const

// Membaca sesi/DB tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

export default async function FalakJadwalPage() {
  await connection()
  const today = new Date()
  const to = new Date(today)
  to.setDate(to.getDate() + 7)
  const rows = await listJadwalShalat(today, to)
  return (
    <div className="space-y-8">
      <PageHeader title="Falak — Jadwal Shalat" description="7 hari ke depan" />
      <section className="max-w-xl space-y-3">
        <h2 className="font-medium">Generate Jadwal</h2>
        <ActionForm action={generateJadwalAction} submitLabel="Generate">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Tanggal" name="tanggal"><input name="tanggal" type="date" required className="w-full rounded-md border bg-transparent px-3 py-2" /></FormField>
            <FormField label="Mode waktu" name="modeWaktu">
              <select name="modeWaktu" className="w-full rounded-md border bg-transparent px-3 py-2">
                <option value="standar">Standar (zona)</option>
                <option value="istiwa">Istiwa (Dzuhur 12:03 WIs)</option>
              </select>
            </FormField>
          </div>
        </ActionForm>
      </section>
      <section className="space-y-3">
        <h2 className="font-medium">Jadwal</h2>
        {rows.length === 0 ? <EmptyState title="Belum ada jadwal" description="Generate jadwal terlebih dahulu." /> : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr><th className="p-3">Tanggal</th>{fieldOrder.map((f) => <th key={f} className="p-3 capitalize">{f}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((j) => (
                  <tr key={j.id} className="border-t">
                    <td className="p-3">{new Date(j.tanggal).toLocaleDateString('id-ID')}</td>
                    {fieldOrder.map((f) => <td key={f} className="p-3 font-mono text-xs">{String((j as Record<string, unknown>)[f] ?? '—')}</td>)}
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
