import { describe, it, expect } from 'vitest'
import { hitungWaktuShalat, hitungTinggiHilal } from './falak-calculation'

describe('hitungWaktuShalat', () => {
  it('returns HH:MM for all prayers', () => {
    const r = hitungWaktuShalat({
      tanggal: new Date('2026-11-15T00:00:00Z'),
      latitude: -7.818758,
      longitude: 111.993158,
      elevation: 76,
    })
    const re = /^\d{2}:\d{2}$/
    expect(r.subuh).toMatch(re)
    expect(r.terbit).toMatch(re)
    expect(r.dzuhur).toMatch(re)
    expect(r.ashar).toMatch(re)
    expect(r.maghrib).toMatch(re)
    expect(r.isya).toMatch(re)
  })

  it('subuh before terbit before dzuhur before ashar before maghrib before isya', () => {
    const r = hitungWaktuShalat({
      tanggal: new Date('2026-11-15T00:00:00Z'),
      latitude: -7.818758,
      longitude: 111.993158,
    })
    const toMin = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m }
    expect(toMin(r.subuh)).toBeLessThan(toMin(r.terbit))
    expect(toMin(r.terbit)).toBeLessThan(toMin(r.dzuhur))
    expect(toMin(r.dzuhur)).toBeLessThan(toMin(r.ashar))
    expect(toMin(r.ashar)).toBeLessThan(toMin(r.maghrib))
    expect(toMin(r.maghrib)).toBeLessThan(toMin(r.isya))
  })

  it('matches Kemenag reference for 2026-11-15 (koreksi 0)', () => {
    const r = hitungWaktuShalat({
      tanggal: new Date('2026-11-15T00:00:00Z'),
      latitude: -7.818758,
      longitude: 111.993158,
      elevation: 76,
      koreksiMaghrib: 0,
    })
    // Reference (Aladhan, method Kemenag RI): Fajr 03:40, Sunrise 05:02, Dhuhr 11:17, Asr 14:38, Maghrib 17:31, Isha 18:45
    expect(r.subuh).toBe('03:40')
    expect(r.terbit).toBe('05:01') // within 1 min
    expect(r.dzuhur).toBe('11:18') // within 1 min
    expect(r.ashar).toBe('14:37') // within 1 min
    expect(r.maghrib).toBe('17:31')
    expect(r.isya).toBe('18:45')
  })

  it('istiwa mode sets dzuhur to 12:03 (WIs)', () => {
    const r = hitungWaktuShalat({
      tanggal: new Date('2026-11-15T00:00:00Z'),
      latitude: -7.818758,
      longitude: 111.993158,
      elevation: 76,
      modeWaktu: 'istiwa',
      koreksiMaghrib: 0,
    })
    expect(r.dzuhur).toBe('12:03')
    expect(r.satuan).toBe('WIs')
  })

  it('standar mode returns WIB for zona 7', () => {
    const r = hitungWaktuShalat({
      tanggal: new Date('2026-11-15T00:00:00Z'),
      latitude: -7.818758,
      longitude: 111.993158,
      zonaWaktu: 7,
    })
    expect(r.satuan).toBe('WIB')
  })

  it('applies koreksiMaghrib', () => {
    const base = hitungWaktuShalat({ tanggal: new Date('2026-11-15T00:00:00Z'), latitude: -7.818758, longitude: 111.993158 })
    const corr = hitungWaktuShalat({ tanggal: new Date('2026-11-15T00:00:00Z'), latitude: -7.818758, longitude: 111.993158, koreksiMaghrib: 5 })
    expect(corr.maghrib).not.toBe(base.maghrib)
  })
})

describe('hitungTinggiHilal', () => {
  it('returns numbers and boolean', () => {
    const r = hitungTinggiHilal({
      tanggalIjtimak: new Date('2026-03-19T10:00:00Z'),
      tanggal: new Date('2026-03-20T00:00:00Z'),
      latitude: -7.818758,
      longitude: 111.993158,
    })
    expect(typeof r.tinggiHilal).toBe('number')
    expect(typeof r.elongasi).toBe('number')
    expect(typeof r.meetsMABIMS).toBe('boolean')
  })
})