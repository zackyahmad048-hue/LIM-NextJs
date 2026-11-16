// src/modules/wajib-khidmah/domain/cross-check.rules.test.ts
import { describe, it, expect } from 'vitest'
import { crossCheckLaporan, type LaporanData } from './cross-check.rules'

describe('crossCheckLaporan', () => {
  const baseLaporanGuru: LaporanData = {
    id: 'guru-1',
    pelaporId: 'user-guru',
    rolePelapor: 'GURU_BANTU',
    periodeMinggu: 1,
    periodeTahun: 2026,
    jumlahHariHadir: 6,
    jumlahJamaahDilakukan: 120,
    aktivitasMingguan: 'Mengajar Nahwu & Sharaf',
    statusHonor: 'BELUM',
  }

  const baseLaporanLembaga: LaporanData = {
    id: 'lembaga-1',
    pelaporId: 'user-lembaga',
    rolePelapor: 'LEMBAGA_EKSTERNAL',
    periodeMinggu: 1,
    periodeTahun: 2026,
    jumlahHariHadir: 6,
    jumlahJamaahDilakukan: 120,
    aktivitasMingguan: 'Mengajar Nahwu & Sharaf',
    statusHonor: 'SUDAH_SESUAI',
  }

  it('should return no mismatch when reports are identical', () => {
    const result = crossCheckLaporan(baseLaporanGuru, baseLaporanLembaga)

    expect(result.hasMismatch).toBe(false)
    expect(result.differences).toHaveLength(0)
    expect(result.summary.selisihHari).toBe(0)
    expect(result.summary.selisihJamaah).toBe(0)
  })

  it('should detect mismatch in jumlahHariHadir', () => {
    const laporanLembaga = { ...baseLaporanLembaga, jumlahHariHadir: 5 }
    const result = crossCheckLaporan(baseLaporanGuru, laporanLembaga)

    expect(result.hasMismatch).toBe(true)
    expect(result.differences).toHaveLength(1)
    expect(result.differences[0].field).toBe('jumlahHariHadir')
    expect(result.differences[0].guruValue).toBe(6)
    expect(result.differences[0].lembagaValue).toBe(5)
    expect(result.differences[0].difference).toBe(1)
    expect(result.summary.selisihHari).toBe(1)
  })

  it('should detect mismatch in jumlahJamaahDilakukan', () => {
    const laporanLembaga = { ...baseLaporanLembaga, jumlahJamaahDilakukan: 100 }
    const result = crossCheckLaporan(baseLaporanGuru, laporanLembaga)

    expect(result.hasMismatch).toBe(true)
    expect(result.differences).toHaveLength(1)
    expect(result.differences[0].field).toBe('jumlahJamaahDilakukan')
    expect(result.differences[0].difference).toBe(20)
    expect(result.summary.selisihJamaah).toBe(20)
  })

  it('should detect multiple mismatches', () => {
    const laporanLembaga = {
      ...baseLaporanLembaga,
      jumlahHariHadir: 4,
      jumlahJamaahDilakukan: 80,
    }
    const result = crossCheckLaporan(baseLaporanGuru, laporanLembaga)

    expect(result.hasMismatch).toBe(true)
    expect(result.differences).toHaveLength(2)
    expect(result.summary.selisihHari).toBe(2)
    expect(result.summary.selisihJamaah).toBe(40)
  })

  it('should handle missing guru laporan', () => {
    const result = crossCheckLaporan(null, baseLaporanLembaga)

    expect(result.hasMismatch).toBe(false)
    expect(result.guruLaporan).toBeNull()
    expect(result.summary.totalJamaahGuru).toBe(0)
  })

  it('should handle missing lembaga laporan', () => {
    const result = crossCheckLaporan(baseLaporanGuru, null)

    expect(result.hasMismatch).toBe(false)
    expect(result.lembagaLaporan).toBeNull()
    expect(result.summary.totalJamaahLembaga).toBe(0)
  })

  it('should handle both reports missing', () => {
    const result = crossCheckLaporan(null, null)

    expect(result.hasMismatch).toBe(false)
    expect(result.guruLaporan).toBeNull()
    expect(result.lembagaLaporan).toBeNull()
  })

  it('should throw error if periode does not match', () => {
    const laporanLembaga = { ...baseLaporanLembaga, periodeMinggu: 2 }

    expect(() => crossCheckLaporan(baseLaporanGuru, laporanLembaga)).toThrow(
      'Periode minggu dan tahun harus sama untuk cross-check'
    )
  })

  it('should throw error if tahun does not match', () => {
    const laporanLembaga = { ...baseLaporanLembaga, periodeTahun: 2025 }

    expect(() => crossCheckLaporan(baseLaporanGuru, laporanLembaga)).toThrow(
      'Periode minggu dan tahun harus sama untuk cross-check'
    )
  })
})