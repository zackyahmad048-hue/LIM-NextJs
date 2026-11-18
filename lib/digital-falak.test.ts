// lib/digital-falak.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  bacaJadwalCache,
  jamKini,
  simpanJadwalCache,
  type JadwalLengkap,
  type LokasiFalak,
} from './digital-falak'

const lokasi: LokasiFalak = { name: 'Uji', latitude: -7.818758, longitude: 111.993158 }

// nilai wis = hasil konversi wisKe24 dari fixture API nyata (12-jam → 24-jam)
const jadwal: JadwalLengkap = {
  ws: {
    tanggal: '18',
    imsak: '03:34',
    subuh: '03:44',
    terbit: '05:00',
    dzuhur: '11:21',
    ashar: '14:42',
    maghrib: '17:34',
    isya: '18:48',
  },
  wis: {
    imsak: '04:16',
    subuh: '04:26',
    terbit: '05:43',
    dzuhur: '12:04',
    ashar: '15:25',
    maghrib: '18:17',
    isya: '19:31',
  },
  selisih: '00:42:51',
  diambilPada: Date.now(),
}

const simpan = new Map<string, string>()

beforeEach(() => {
  simpan.clear()
  const storage = {
    getItem: (kunci: string) => simpan.get(kunci) ?? null,
    setItem: (kunci: string, nilai: string) => {
      simpan.set(kunci, String(nilai))
    },
    removeItem: (kunci: string) => {
      simpan.delete(kunci)
    },
  }
  vi.stubGlobal('window', { localStorage: storage })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('jamKini', () => {
  it('menggeser jam sesuai selisih WIB→WIS dari API', () => {
    expect(jamKini(new Date(2026, 10, 18, 11, 21, 9), '00:42:51')).toBe('12:04:00')
  })

  it('melintasi tengah malam dengan aman', () => {
    expect(jamKini(new Date(2026, 10, 18, 23, 40, 0), '00:42:51')).toBe('00:22:51')
  })

  it('tanpa selisih menampilkan jam lokal apa adanya', () => {
    expect(jamKini(new Date(2026, 10, 18, 11, 21, 9))).toBe('11:21:09')
  })
})

describe('cache jadwal', () => {
  it('round-trip: simpan lalu baca mengembalikan data yang sama', () => {
    simpanJadwalCache(lokasi, jadwal)
    expect(bacaJadwalCache(lokasi)).toEqual(jadwal)
  })

  it('cache milik lokasi berbeda tidak dipakai', () => {
    simpanJadwalCache(lokasi, jadwal)
    expect(bacaJadwalCache({ ...lokasi, latitude: -7.1 })).toBeNull()
  })

  it('cache dari hari lain ditolak (jadwal beda hari tidak valid)', () => {
    simpanJadwalCache(lokasi, { ...jadwal, diambilPada: jadwal.diambilPada - 24 * 60 * 60 * 1000 })
    expect(bacaJadwalCache(lokasi)).toBeNull()
  })
})
