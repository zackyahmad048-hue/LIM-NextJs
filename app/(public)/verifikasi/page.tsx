import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const metadata: Metadata = { title: 'Verifikasi Surat' }
// Halaman form kecil dengan redirect via ?kode — blocking render cukup
export const instant = false

// Tanpa JS: form GET → ?kode=… → redirect ke /verifikasi/{kode}
export default async function VerifikasiPage({ searchParams }: { searchParams: Promise<{ kode?: string }> }) {
  const { kode } = await searchParams
  if (kode) redirect(`/verifikasi/${kode.trim()}`)
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Verifikasi Surat</h1>
      <p className="mt-3 text-lg text-muted-foreground">Masukkan kode verifikasi pada QR/lembar surat.</p>
      <form method="get" className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="kode">Kode verifikasi</Label>
          <Input
            id="kode"
            name="kode"
            required
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="h-11 border-muted-foreground/40 font-mono"
          />
        </div>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Periksa surat
        </Button>
      </form>
    </div>
  )
}
