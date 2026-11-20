import { notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { PageHeader } from '@/components/layout/page-header'
import { StatusBadge } from '@/components/data/status-badge'
import { getLetterById } from '@/modules/letter/presentation/queries/get-letter-by-id.query'
import { submitForReviewAction } from '@/modules/letter/presentation/actions/submit-for-review.action'
import { approveLetterAction } from '@/modules/letter/presentation/actions/approve-letter.action'
import { sendLetterAction } from '@/modules/letter/presentation/actions/send-letter.action'
import { deleteLetterAction } from '@/modules/letter/presentation/actions/delete-letter.action'
import { TransitionButton } from '@/modules/letter/presentation/components/transition-button'
import { letterStatusVariant } from '@/modules/letter/presentation/letter-status-variant'
import type { Role, AccountType } from '@/generated/client'

// Membaca sesi/DB tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

export default async function LetterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()
  if (!session) notFound()
  const letter = await getLetterById(id, {
    id: session.user.id,
    role: session.user.role as Role,
    accountType: session.user.accountType as AccountType | undefined,
  })
  if (!letter) notFound()

  return (
    <div className="space-y-4 max-w-3xl">
      <PageHeader
        title={letter.perihal}
        description={`Nomor: ${letter.nomorSurat ?? '— (dibuat saat SENT)'}`}
        actions={
          <>
            <StatusBadge label={letter.status} variant={letterStatusVariant[letter.status] ?? 'neutral'} />
            {letter.status === 'DIKETIK' && <TransitionButton action={submitForReviewAction} letterId={letter.id} label="Kirim ke Review" />}
            {letter.status === 'REVIEW' && <TransitionButton action={approveLetterAction} letterId={letter.id} label="Approve" />}
            {(letter.status === 'APPROVED' || letter.status === 'REVIEW') && <TransitionButton action={sendLetterAction} letterId={letter.id} label="Kirim (generate nomor)" className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50" />}
            {letter.status !== 'SENT' && letter.status !== 'ARCHIVED' && <TransitionButton action={deleteLetterAction} letterId={letter.id} label="Hapus" className="rounded-md border border-destructive px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50" />}
          </>
        }
      />
      <div className="rounded-lg border bg-card p-4 text-sm space-y-2">
        <p><span className="text-muted-foreground">Tipe:</span> {letter.type}</p>
        <p><span className="text-muted-foreground">Pengirim:</span> {letter.pengirim}</p>
        {letter.penerima && <p><span className="text-muted-foreground">Penerima:</span> {letter.penerima}</p>}
        <div className="whitespace-pre-wrap border-t pt-3">{letter.isiSurat}</div>
      </div>
    </div>
  )
}
