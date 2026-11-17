import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/data/states'
import { listPenugasan } from '@/modules/wajib-khidmah/presentation/queries/list-penugasan.query'

export default function WkPenugasanPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Wajib Khidmah — Penugasan" actions={<Link href="/dashboard/wajib-khidmah/laporan" className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Input Laporan</Link>} />
      <PenugasanList />
    </div>
  )
}

async function PenugasanList() {
  const rows = await listPenugasan()
  if (rows.length === 0) return <EmptyState title="Belum ada penugasan" description="Penugasan guru bantu akan tampil di sini." />
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr><th className="p-3">Guru Bantu</th><th className="p-3">Lembaga</th><th className="p-3">Status</th></tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.guruBantu?.user.name ?? p.guruBantuId}</td>
              <td className="p-3">{p.lembaga?.namaLembaga ?? p.lembagaId}</td>
              <td className="p-3">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
