import { describe, expect, it } from 'vitest'
import { dariMenit, keMenit, wisKe24, type WaktuShalat } from './digital-falak'

// Contoh respons nyata dari Digital Falak API untuk Markaz Lirboyo, 18 Nov 2026.
const ws: WaktuShalat = {
  imsak: '03:34',
  subuh: '03:44',
  terbit: '05:00',
  dzuhur: '11:21',
  ashar: '14:42',
  maghrib: '17:34',
  isya: '18:48',
}

const wis12: WaktuShalat = {
  imsak: '04:16',
  subuh: '04:26',
  terbit: '05:43',
  dzuhur: '12:04',
  ashar: '03:25',
  maghrib: '06:17',
  isya: '07:31',
}

describe('keMenit / dariMenit', () => {
  it('konversi jam dua arah', () => {
    expect(keMenit('11:21')).toBe(681)
    expect(dariMenit(681)).toBe('11:21')
    expect(dariMenit(-1)).toBe('23:59')
  })
})

describe('wisKe24', () => {
  it('mengubah jam-12 WIS menjadi jam-24 persis seperti aplikasi', () => {
    expect(wisKe24(wis12, ws)).toEqual({
      imsak: '04:16',
      subuh: '04:26',
      terbit: '05:43',
      dzuhur: '12:04',
      ashar: '15:25',
      maghrib: '18:17',
      isya: '19:31',
    })
  })
})
