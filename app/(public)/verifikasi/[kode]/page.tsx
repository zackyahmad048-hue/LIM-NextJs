import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { StatusBadge } from '@/components/data/status-badge'
import { EmptyState } from '@/components/data/states'
import { getLetterForVerification } from '@/modules/letter/presentation/queries/get-letter-for-verification.query'

export const metadata: Metadata = { title: 'Hasil Verifikasi' }

const variant: Record<string, 'neutral' | 'info' | 'success' | 'warning' | 'muted'> = {
  DIKETIK: 'neutral',
  REVIEW: 'info',
  APPROVED: 'success',
  SENT: 'success',
  ARCHIVED: 'muted',
}

async function Hasil({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params
  const letter = await getLetterForVerification(decodeURIComponent(kode))
  if (!letter) {
    return <EmptyState title="Kode tidak valid" description="Periksa kembali kode verifikasi Anda." />
  }
  return (
    <div className="rounded-lg border bg-card p-4 text-sm">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs">{letter.nomorSurat ?? '—'}</p>
        <StatusBadge label={letter.status} variant={variant[letter.status] ?? 'neutral'} />
      </div>
      <p className="mt-2 font-medium">{letter.perihal}</p>
      <p className="text-muted-foreground">Pengirim: {letter.pengirim}</p>
      <p className="text-xs text-muted-foreground">Tanggal surat: {new Date(letter.tanggalSurat).toLocaleDateString('id-ID')}</p>
    </div>
  )
}

export default function HasilVerifikasiPage({ params }: { params: Promise<{ kode: string }> }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <PageHeader title="Hasil Verifikasi" />
      <div className="mt-6">
        <Suspense fallback={<div className="h-32 animate-pulse rounded-lg bg-muted" />}>
          <Hasil params={params} />
        </Suspense>
      </div>
    </div>
  )
}
