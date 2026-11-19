import { describe, expect, it } from 'vitest'
import { keMenit, type WaktuShalat } from './digital-falak'
import { fraksiSiang, posisiMatahari, waktuShalatBerikutnya } from './posisi-matahari'

const ws: WaktuShalat = {
  imsak: '03:34',
  subuh: '03:44',
  terbit: '05:00',
  dzuhur: '11:21',
  ashar: '14:42',
  maghrib: '17:34',
  isya: '18:48',
}

describe('posisiMatahari', () => {
  it('sebelum terbit: terkunci di ujung kiri', () => {
    expect(posisiMatahari(ws, keMenit('04:00'))).toEqual({ fase: 'sebelum-terbit', fraksi: 0 })
  })

  it('siang: fraksi proporsional antara terbit dan maghrib', () => {
    const { fase, fraksi } = posisiMatahari(ws, keMenit('11:17'))
    expect(fase).toBe('siang')
    expect(fraksi).toBeCloseTo((keMenit('11:17') - keMenit('05:00')) / (keMenit('17:34') - keMenit('05:00')))
  })

  it('tepat saat terbit dan maghrib masih dihitung siang', () => {
    expect(posisiMatahari(ws, keMenit('05:00'))).toEqual({ fase: 'siang', fraksi: 0 })
    expect(posisiMatahari(ws, keMenit('17:34'))).toEqual({ fase: 'siang', fraksi: 1 })
  })

  it('setelah maghrib: terkunci di ujung kanan', () => {
    expect(posisiMatahari(ws, keMenit('20:00'))).toEqual({ fase: 'setelah-maghrib', fraksi: 1 })
  })

  it('data tidak masuk akal (maghrib <= terbit) tidak menghasilkan NaN', () => {
    const rusak = { terbit: '10:00', maghrib: '10:00' }
    expect(posisiMatahari(rusak, keMenit('10:30')).fraksi).toBe(0)
  })
})

describe('fraksiSiang', () => {
  it('menempatkan dzuhur dan ashar pada busur', () => {
    expect(fraksiSiang(ws, ws.dzuhur)).toBeGreaterThan(0.4)
    expect(fraksiSiang(ws, ws.dzuhur)).toBeLessThan(0.6)
    expect(fraksiSiang(ws, ws.ashar)).toBeGreaterThan(fraksiSiang(ws, ws.dzuhur))
  })

  it('mengunci ke 0..1 untuk jam di luar siang', () => {
    expect(fraksiSiang(ws, '03:44')).toBe(0)
    expect(fraksiSiang(ws, '18:48')).toBe(1)
  })
})

describe('waktuShalatBerikutnya', () => {
  it('memilih shalat pertama yang belum tiba', () => {
    expect(waktuShalatBerikutnya(ws, keMenit('02:00'))).toBe('subuh')
    expect(waktuShalatBerikutnya(ws, keMenit('08:00'))).toBe('dzuhur')
    expect(waktuShalatBerikutnya(ws, keMenit('15:00'))).toBe('maghrib')
  })

  it('null setelah Isya', () => {
    expect(waktuShalatBerikutnya(ws, keMenit('19:00'))).toBeNull()
  })

  it('tepat pada waktu shalat dianggap sudah tiba', () => {
    expect(waktuShalatBerikutnya(ws, keMenit('11:21'))).toBe('ashar')
  })
})
