import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { StatusBadge } from '@/components/data/status-badge'
import { EmptyState } from '@/components/data/states'
import { listLetters } from '@/modules/letter/presentation/queries/list-letters.query'

export const statusVariant: Record<string, 'neutral' | 'info' | 'success' | 'warning' | 'muted'> = {
  DIKETIK: 'neutral',
  REVIEW: 'info',
  APPROVED: 'success',
  SENT: 'success',
  ARCHIVED: 'muted',
}

export default async function LettersPage() {
  const result = await listLetters({})
  const rows = result.items
  return (
    <div className="space-y-4">
      <PageHeader title="Persuratan" description="Daftar surat" actions={<Link href="/dashboard/letters/new" className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Buat Surat</Link>} />
      {rows.length === 0 ? (
        <EmptyState title="Belum ada surat" description="Buat surat pertama Anda." />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr><th className="p-3">Nomor</th><th className="p-3">Perihal</th><th className="p-3">Status</th><th className="p-3">Dibuat</th></tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="p-3 font-mono text-xs">{l.nomorSurat ?? '—'}</td>
                  <td className="p-3"><Link className="underline" href={`/dashboard/letters/${l.id}`}>{l.perihal}</Link></td>
                  <td className="p-3"><StatusBadge label={l.status} variant={statusVariant[l.status] ?? 'neutral'} /></td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(l.createdAt).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

