// app/(public)/falak/page.tsx
import { Clock, MapPin } from 'lucide-react'

// Mock data jadwal (nanti diganti dengan fetch dari API /api/falak/jadwal)
const jadwalShalat = {
  lokasi: 'Markaz Lirboyo, Kota Kediri',
  tanggal: '18 November 2026 / 27 Jumadil Awal 1448 H',
  waktu: {
    subuh: '04:15',
    terbit: '05:30',
    dzuhur: '11:45',
    ashar: '15:10',
    maghrib: '17:50',
    isya: '19:05',
  },
  metode: 'Tashilul Amtsilah (Khas Lirboyo)',
}

export default function FalakPage() {
  return (
    <div className="bg-muted py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Jadwal Shalat Harian
          </h1>
          <div className="mt-4 flex flex-col items-center justify-center gap-2 text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{jadwalShalat.lokasi}</span>
            </div>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{jadwalShalat.tanggal}</span>
            </div>
          </div>
        </div>

        {/* Jadwal Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(jadwalShalat.waktu).map(([sholat, waktu]) => (
            <div
              key={sholat}
              className="rounded-lg border bg-card flex flex-col items-center justify-center p-6 text-center transition-all duration-200 hover:border-primary"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {sholat}
              </span>
              <span className="mt-2 text-2xl font-bold text-foreground">
                {waktu}
              </span>
            </div>
          ))}
        </div>

        {/* Info Metode */}
        <div className="mt-8 rounded-md border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Metode Hisab:</span> {jadwalShalat.metode}
            <br />
            <span className="text-xs">
              *Jadwal ini dapat mengalami perubahan sesuai dengan ketetapan resmi dari Lajnah Falak LIM.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}