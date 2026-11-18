import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = { title: 'Tentang' }

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader title="Tentang LIM" description="Lembaga Ittihadul Muballighin (LIM) — Pondok Pesantren Lirboyo" />
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Lembaga Ittihadul Muballighin (LIM) adalah lembaga di bawah Pondok Pesantren Lirboyo
          yang membina guru bantu dan muballigh di seluruh Indonesia. Platform digital ini
          mengintegrasikan persuratan, kepengurusan, Wajib Khidmah, Safari Ramadan,
          Pesantren Ramadan, Digital Falak, dakwah digital, dan daerah binaan.
        </p>
        <p>
          Platform mengikuti ketetapan resmi PKO MUNAS II 2025 dan arahan Lajnah Falak LIM.
        </p>
      </div>
    </div>
  )
}
