'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type RekapTahun = {
  tahun: string
  namaAngkatan: string | null
  lembagaMengajukan: number
  lembagaDapat: number
  tidakDapat: number
  jalurRekomendasi: number
  totalGbDisetujui: number
  totalDiminta: number
  persenDapat: number | null
}

type RekapWilayah = {
  wilayah: string
  jumlahLembaga: number
  lembagaPernahDapat: number
  totalPengajuan: number
  totalGb: number
}

type KualitasData = {
  tanpaAlamat: number
  tanpaPimpinan: number
  tanpaProvinsi: number
  tanpaKabupaten: number
  riwayatTanpaNamaGb: number
  blacklist: number
  dzuriyyah: number
}

interface Props {
  rekapTahun: RekapTahun[]
  rekapWilayah: RekapWilayah[]
  kualitas: KualitasData
}

export function LaporanRiwayatClient({ rekapTahun, rekapWilayah, kualitas }: Props) {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Riwayat Permohonan Guru Bantu</h1>
        <p className="text-sm text-muted-foreground">
          Rekapitulasi data legacy dan permohonan per tahun ajaran.
        </p>
      </header>

      <section aria-labelledby="rekap-tahun-heading">
        <Card>
          <CardHeader>
            <CardTitle id="rekap-tahun-heading">Rekap per Tahun Ajaran</CardTitle>
          </CardHeader>
          <CardContent>
            {rekapTahun.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada data riwayat.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Angkatan</TableHead>
                    <TableHead className="text-right">Mengajukan</TableHead>
                    <TableHead className="text-right">Mendapat GB</TableHead>
                    <TableHead className="text-right">Tidak dapat</TableHead>
                    <TableHead className="text-right">Rekomendasi</TableHead>
                    <TableHead className="text-right">Total GB</TableHead>
                    <TableHead className="text-right">% Dapat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rekapTahun.map((row) => (
                    <TableRow key={row.tahun}>
                      <TableCell className="font-medium">{row.tahun}</TableCell>
                      <TableCell>{row.namaAngkatan ?? '-'}</TableCell>
                      <TableCell className="text-right">{row.lembagaMengajukan}</TableCell>
                      <TableCell className="text-right">{row.lembagaDapat}</TableCell>
                      <TableCell className="text-right">{row.tidakDapat}</TableCell>
                      <TableCell className="text-right">{row.jalurRekomendasi}</TableCell>
                      <TableCell className="text-right">{row.totalGbDisetujui}</TableCell>
                      <TableCell className="text-right">
                        {row.persenDapat === null ? '-' : `${row.persenDapat}%`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="rekap-wilayah-heading">
        <Card>
          <CardHeader>
            <CardTitle id="rekap-wilayah-heading">Rekap per Wilayah</CardTitle>
          </CardHeader>
          <CardContent>
            {rekapWilayah.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada data wilayah.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wilayah</TableHead>
                    <TableHead className="text-right">Jumlah lembaga</TableHead>
                    <TableHead className="text-right">Pernah dapat</TableHead>
                    <TableHead className="text-right">Total pengajuan</TableHead>
                    <TableHead className="text-right">Total GB</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rekapWilayah.map((row) => (
                    <TableRow key={row.wilayah}>
                      <TableCell className="font-medium">{row.wilayah}</TableCell>
                      <TableCell className="text-right">{row.jumlahLembaga}</TableCell>
                      <TableCell className="text-right">{row.lembagaPernahDapat}</TableCell>
                      <TableCell className="text-right">{row.totalPengajuan}</TableCell>
                      <TableCell className="text-right">{row.totalGb}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="kualitas-data-heading">
        <Card>
          <CardHeader>
            <CardTitle id="kualitas-data-heading">Kualitas Data</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Tanpa alamat', kualitas.tanpaAlamat],
                ['Tanpa pimpinan', kualitas.tanpaPimpinan],
                ['Tanpa provinsi', kualitas.tanpaProvinsi],
                ['Tanpa kabupaten', kualitas.tanpaKabupaten],
                ['Riwayat tanpa nama GB', kualitas.riwayatTanpaNamaGb],
                ['Blacklist', kualitas.blacklist],
                ['Dzuriyyah', kualitas.dzuriyyah],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-md border p-3">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-xl font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
