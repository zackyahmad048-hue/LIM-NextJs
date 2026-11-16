// modules/wajib-khidmah/domain/cross-check.rules.ts

export interface LaporanData {
  id: string
  pelaporId: string
  rolePelapor: 'GURU_BANTU' | 'LEMBAGA_EKSTERNAL'
  periodeMinggu: number
  periodeTahun: number
  jumlahHariHadir: number
  jumlahJamaahDilakukan: number
  aktivitasMingguan: string
  statusHonor: 'SUDAH_SESUAI' | 'BELUM' | 'SEBAGIAN' | 'TIDAK_BERLAKU'
}

export interface CrossCheckResult {
  hasMismatch: boolean
  guruLaporan: LaporanData | null
  lembagaLaporan: LaporanData | null
  differences: {
    field: string
    guruValue: number | string
    lembagaValue: number | string
    difference: number
  }[]
  summary: {
    totalHariHadirGuru: number
    totalHariHadirLembaga: number
    totalJamaahGuru: number
    totalJamaahLembaga: number
    selisihHari: number
    selisihJamaah: number
  }
}

/**
 * Cross-check laporan mingguan antara Guru Bantu dan Lembaga Eksternal
 * untuk penugasan yang sama pada periode yang sama.
 * 
 * @param laporanGuru - Laporan dari Guru Bantu (atau null jika belum ada)
 * @param laporanLembaga - Laporan dari Lembaga Eksternal (atau null jika belum ada)
 * @returns Objek CrossCheckResult yang detail
 */
export function crossCheckLaporan(
  laporanGuru: LaporanData | null,
  laporanLembaga: LaporanData | null
): CrossCheckResult {
  // Validasi: Kedua laporan harus ada untuk cross-check
  if (!laporanGuru || !laporanLembaga) {
    return {
      hasMismatch: false,
      guruLaporan: laporanGuru,
      lembagaLaporan: laporanLembaga,
      differences: [],
      summary: {
        totalHariHadirGuru: laporanGuru?.jumlahHariHadir || 0,
        totalHariHadirLembaga: laporanLembaga?.jumlahHariHadir || 0,
        totalJamaahGuru: laporanGuru?.jumlahJamaahDilakukan || 0,
        totalJamaahLembaga: laporanLembaga?.jumlahJamaahDilakukan || 0,
        selisihHari: 0,
        selisihJamaah: 0,
      },
    }
  }

  // Validasi: Periode harus sama
  if (
    laporanGuru.periodeMinggu !== laporanLembaga.periodeMinggu ||
    laporanGuru.periodeTahun !== laporanLembaga.periodeTahun
  ) {
    throw new Error('Periode minggu dan tahun harus sama untuk cross-check')
  }

  const differences: CrossCheckResult['differences'] = []

  // Bandingkan jumlah hari hadir
  const selisihHari = laporanGuru.jumlahHariHadir - laporanLembaga.jumlahHariHadir
  if (selisihHari !== 0) {
    differences.push({
      field: 'jumlahHariHadir',
      guruValue: laporanGuru.jumlahHariHadir,
      lembagaValue: laporanLembaga.jumlahHariHadir,
      difference: selisihHari,
    })
  }

  // Bandingkan jumlah jamaah
  const selisihJamaah = laporanGuru.jumlahJamaahDilakukan - laporanLembaga.jumlahJamaahDilakukan
  if (selisihJamaah !== 0) {
    differences.push({
      field: 'jumlahJamaahDilakukan',
      guruValue: laporanGuru.jumlahJamaahDilakukan,
      lembagaValue: laporanLembaga.jumlahJamaahDilakukan,
      difference: selisihJamaah,
    })
  }

  return {
    hasMismatch: differences.length > 0,
    guruLaporan: laporanGuru,
    lembagaLaporan: laporanLembaga,
    differences,
    summary: {
      totalHariHadirGuru: laporanGuru.jumlahHariHadir,
      totalHariHadirLembaga: laporanLembaga.jumlahHariHadir,
      totalJamaahGuru: laporanGuru.jumlahJamaahDilakukan,
      totalJamaahLembaga: laporanLembaga.jumlahJamaahDilakukan,
      selisihHari,
      selisihJamaah,
    },
  }
}