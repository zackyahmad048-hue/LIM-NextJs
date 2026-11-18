'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { runCrossCheckAction } from '@/modules/wajib-khidmah/presentation/actions/submit-laporan.action'

type Result = Awaited<ReturnType<typeof runCrossCheckAction>>

export default function CrossCheckPage() {
  const [result, setResult] = useState<Result | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setPending(true)
    setResult(null)
    try {
      setResult(await runCrossCheckAction(String(fd.get('penugasanId') ?? ''), Number(fd.get('minggu')), Number(fd.get('tahun'))))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader title="Wajib Khidmah — Cross-Check" description="Bandingkan laporan guru bantu dengan data jamaah." />
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-4">
        <div>
          <label htmlFor="penugasanId" className="mb-1 block text-sm font-medium">Penugasan ID</label>
          <input id="penugasanId" name="penugasanId" required className="w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minggu" className="mb-1 block text-sm font-medium">Minggu ke-</label>
            <input id="minggu" name="minggu" type="number" min={1} required defaultValue={1} className="w-full rounded-md border bg-transparent px-3 py-2" />
          </div>
          <div>
            <label htmlFor="tahun" className="mb-1 block text-sm font-medium">Tahun</label>
            <input id="tahun" name="tahun" type="number" min={2020} required defaultValue={2026} className="w-full rounded-md border bg-transparent px-3 py-2" />
          </div>
        </div>
        <button type="submit" disabled={pending} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
          {pending ? 'Memproses…' : 'Jalankan Cross-Check'}
        </button>
      </form>
      {result && (
        result.success ? (
          <div className="rounded-lg border bg-card p-4 text-sm">
            <p className="font-medium">{result.data?.hasMismatch ? '⚠️ Ada ketidaksesuaian' : '✅ Laporan sesuai'}</p>
            <p className="text-muted-foreground">Selisih hari: {result.data?.summary.selisihHari} · Selisih jamaah: {result.data?.summary.selisihJamaah}</p>
          </div>
        ) : (
          <p role="alert" className="text-sm text-destructive">{result.error}</p>
        )
      )}
    </div>
  )
}
