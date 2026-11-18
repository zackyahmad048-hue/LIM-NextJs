import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = { title: 'Verifikasi Surat' }
// Halaman form kecil dengan redirect via ?kode — blocking render cukup
export const instant = false

// Tanpa JS: form GET → ?kode=… → redirect ke /verifikasi/{kode}
export default async function VerifikasiPage({ searchParams }: { searchParams: Promise<{ kode?: string }> }) {
  const { kode } = await searchParams
  if (kode) redirect(`/verifikasi/${kode.trim()}`)
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <PageHeader title="Verifikasi Surat" description="Masukkan kode verifikasi pada QR/lembar surat." />
      <form method="get" className="mt-6 space-y-3">
        <input name="kode" required placeholder="Kode verifikasi" className="w-full rounded-md border bg-transparent px-3 py-2" />
        <button type="submit" className="w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
          Verifikasi
        </button>
      </form>
    </div>
  )
}
