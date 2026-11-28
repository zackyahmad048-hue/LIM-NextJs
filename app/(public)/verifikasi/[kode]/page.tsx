import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { StatusBadge } from '@/components/data/status-badge'
import { EmptyState } from '@/components/data/states'
import { buttonVariants } from '@/components/ui/button'
import { VerifiedMark } from '@/components/motion/verified-mark'
import { getLetterForVerification } from '@/modules/letter/presentation/queries/get-letter-for-verification.query'
import { letterStatusVariant } from '@/modules/letter/presentation/letter-status-variant'
import { runWithTenantContext } from '@/lib/tenant-context'

export const metadata: Metadata = { title: 'Hasil Verifikasi' }

// Nomor surat baru ada setelah SENT; hanya status ini yang diberi tanda centang.
const statusTerbit = new Set(['SENT', 'ARCHIVED'])

async function Hasil({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params
  const letter = await runWithTenantContext({ scope: 'PUBLIC', unitId: null, userId: null }, () => getLetterForVerification(kode))
  if (!letter) {
    return (
      <EmptyState
        title="Kode tidak valid"
        description="Periksa kembali kode verifikasi Anda."
        action={
          <Link href="/verifikasi" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Coba kode lain
          </Link>
        }
      />
    )
  }
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {statusTerbit.has(letter.status) && <VerifiedMark />}
          <p className="font-mono text-sm">{letter.nomorSurat ?? '—'}</p>
        </div>
        <StatusBadge label={letter.status} variant={letterStatusVariant[letter.status] ?? 'neutral'} />
      </div>
      <h2 className="mt-5 text-xl leading-snug font-semibold text-balance">{letter.perihal}</h2>
      <dl className="mt-5 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Pengirim</dt>
          <dd className="mt-0.5 font-medium">{letter.pengirim}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Tanggal surat</dt>
          <dd className="mt-0.5 font-medium">
            {new Date(letter.tanggalSurat).toLocaleDateString('id-ID', { dateStyle: 'long' })}
          </dd>
        </div>
      </dl>
    </div>
  )
}

export default function HasilVerifikasiPage({ params }: { params: Promise<{ kode: string }> }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Hasil Verifikasi</h1>
      <div className="mt-8">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-3xl bg-muted" />}>
          <Hasil params={params} />
        </Suspense>
      </div>
    </div>
  )
}
