import { withRequiredSessionTenant } from '@/lib/auth'
import { rekapPerTahun, rekapWilayah, kualitasData } from '@/modules/wajib-khidmah/presentation/queries/laporan-riwayat.query'
import { LaporanRiwayatClient } from './laporan-riwayat-client'

export const instant = false

export default async function WkRiwayatPage() {
  const [rekapTahun, rekapWilayahData, kualitas] = await withRequiredSessionTenant(() =>
    Promise.all([rekapPerTahun(), rekapWilayah(), kualitasData()]),
  )

  return <LaporanRiwayatClient rekapTahun={rekapTahun} rekapWilayah={rekapWilayahData} kualitas={kualitas} />
}
