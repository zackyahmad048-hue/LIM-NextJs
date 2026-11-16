// modules/falak/domain/falak-calculation.ts
// Tashilul Amtsilah prayer-time calculation (standard solar position).

const DEG = Math.PI / 180
const RAD = 180 / Math.PI

export type ModeWaktu = 'standar' | 'istiwa'

export interface HitungWaktuShalatInput {
  tanggal: Date
  latitude: number
  longitude: number
  elevation?: number
  sudutSubuh?: number
  sudutIsya?: number
  koreksiSubuh?: number
  koreksiMaghrib?: number
  zonaWaktu?: number // UTC offset hours, default 7 (WIB)
  modeWaktu?: ModeWaktu // 'standar' (WIB/WITA/WIT) atau 'istiwa' (WIs)
}

export interface WaktuShalatResult {
  subuh: string
  terbit: string
  dzuhur: string
  ashar: string
  maghrib: string
  isya: string
  satuan: string // WIB / WITA / WIT / WIs
}

export function satuanWaktu(zonaWaktu: number, modeWaktu: ModeWaktu = 'standar'): string {
  if (modeWaktu === 'istiwa') return 'WIs'
  if (zonaWaktu === 7) return 'WIB'
  if (zonaWaktu === 8) return 'WITA'
  if (zonaWaktu === 9) return 'WIT'
  return `UTC${zonaWaktu >= 0 ? '+' : ''}${zonaWaktu}`
}

function toRad(d: number) { return d * DEG }
function toDeg(r: number) { return r * RAD }

function pad(n: number) { return String(Math.round(n)).padStart(2, '0') }
function fmt(minutes: number): string {
  let m = minutes
  // normalize to 0..1440
  while (m < 0) m += 1440
  while (m >= 1440) m -= 1440
  const h = Math.floor(m / 60)
  const mn = Math.round(m % 60)
  return `${pad(h)}:${pad(mn)}`
}

function julianDay(date: Date): number {
  const y = date.getUTCFullYear()
  const m = date.getUTCMonth() + 1
  const d = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24
  let Y = y, M = m
  if (m <= 2) { Y -= 1; M += 12 }
  const A = Math.floor(Y / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5
}

function solarPosition(jd: number) {
  const n = jd - 2451545.0
  const L = (280.460 + 0.9856474 * n) % 360
  const g = toRad((357.528 + 0.9856003 * n) % 360)
  const lambda = toRad(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g))
  const eps = toRad(23.439 - 0.0000004 * n)
  const alpha = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda))
  const delta = Math.asin(Math.sin(eps) * Math.sin(lambda))
  const eot = 4 * (L - toDeg(alpha)) // minutes (approx)
  return { decl: delta, eot }
}

function hourAngle(lat: number, decl: number, altDeg: number): number {
  const alt = toRad(altDeg)
  const phi = toRad(lat)
  const cosHA = (Math.sin(alt) - Math.sin(phi) * Math.sin(decl)) / (Math.cos(phi) * Math.cos(decl))
  if (cosHA > 1) return 0
  if (cosHA < -1) return 180
  return toDeg(Math.acos(cosHA))
}

export function hitungWaktuShalat(input: HitungWaktuShalatInput): WaktuShalatResult {
  const {
    tanggal, latitude, longitude, elevation = 0,
    sudutSubuh = 20, sudutIsya = 18,
    koreksiSubuh = 0, koreksiMaghrib = 0,
    zonaWaktu = 7,
    modeWaktu = 'standar',
  } = input

  const jd = julianDay(tanggal)
  const { decl, eot } = solarPosition(jd)

  // solar noon in UTC hours
  const solarNoonUTC = 12 - longitude / 15 - eot / 60
  const solarNoon = (solarNoonUTC + zonaWaktu) * 60 // minutes in local time

  // subuh
  const haSubuh = hourAngle(latitude, decl, -sudutSubuh)
  const subuh = solarNoon - haSubuh * 4 + koreksiSubuh

  // terbit
  const haTerbit = hourAngle(latitude, decl, -0.833 - (elevation > 0 ? 0.0347 * Math.sqrt(elevation) : 0))
  const terbit = solarNoon - haTerbit * 4

  // dzuhur
  const dzuhur = solarNoon + 1 // +1 min standard

  // ashar (Shafi'i, factor 1)
  const altAshar = toDeg(Math.atan(1 / (Math.tan(Math.abs(toRad(latitude) - decl)) + 1)))
  const haAshar = hourAngle(latitude, decl, altAshar)
  const ashar = solarNoon + haAshar * 4

  // maghrib
  const haMaghrib = hourAngle(latitude, decl, -0.833)
  const maghrib = solarNoon + haMaghrib * 4 + koreksiMaghrib

  // isya
  const haIsya = hourAngle(latitude, decl, -sudutIsya)
  const isya = solarNoon + haIsya * 4

  const satuan = satuanWaktu(zonaWaktu, modeWaktu)

  if (modeWaktu === 'istiwa') {
    // Waktu Istiwa: dzuhur ditetapkan pukul 12:03 (WIs), geser semua waktu.
    const shift = 12 * 60 + 3 - dzuhur
    return {
      subuh: fmt(subuh + shift),
      terbit: fmt(terbit + shift),
      dzuhur: fmt(dzuhur + shift), // = 12:03
      ashar: fmt(ashar + shift),
      maghrib: fmt(maghrib + shift),
      isya: fmt(isya + shift),
      satuan,
    }
  }

  return {
    subuh: fmt(subuh),
    terbit: fmt(terbit),
    dzuhur: fmt(dzuhur),
    ashar: fmt(ashar),
    maghrib: fmt(maghrib),
    isya: fmt(isya),
    satuan,
  }
}

// Hilal calculation (simplified Meeus-based; precision to be validated vs Kemenag/NU references).
export interface HitungTinggiHilalInput {
  tanggalIjtimak: Date
  tanggal: Date
  latitude: number
  longitude: number
}

export interface TinggiHilalResult {
  tinggiHilal: number
  elongasi: number
  meetsMABIMS: boolean
}

function moonPosition(jd: number) {
  const T = (jd - 2451545.0) / 36525
  const Lp = (218.316 + 481267.8813 * T) % 360
  const Mp = (134.963 + 477198.8676 * T) % 360
  const F = (93.272 + 483202.0175 * T) % 360
  const lambda = Lp + 6.289 * Math.sin(toRad(Mp)) // simplified
  const beta = 5.128 * Math.sin(toRad(F)) // simplified
  const eps = 23.439 - 0.0000004 * (jd - 2451545) * 36525
  // ecliptic -> equatorial
  const alpha = Math.atan2(Math.sin(toRad(lambda)) * Math.cos(toRad(eps)) - Math.tan(toRad(beta)) * Math.sin(toRad(eps)), Math.cos(toRad(lambda)))
  const delta = Math.asin(Math.sin(toRad(beta)) * Math.cos(toRad(eps)) + Math.cos(toRad(beta)) * Math.sin(toRad(eps)) * Math.sin(toRad(lambda)))
  return { lambda, beta, alpha: toDeg(alpha), delta: toDeg(delta) }
}

export function hitungTinggiHilal(input: HitungTinggiHilalInput): TinggiHilalResult {
  const { tanggal, latitude } = input
  const jd = julianDay(tanggal)
  const moon = moonPosition(jd)
  // elongation (angular separation) via ecliptic longitudes
  const sunLambda = (280.460 + 0.9856474 * (jd - 2451545)) % 360
  const elongasi = Math.abs(((moon.lambda - sunLambda + 540) % 360) - 180)
  const ha = hourAngle(latitude, toRad(moon.delta), -0.833)
  const alt = toDeg(Math.asin(Math.sin(toRad(latitude)) * Math.sin(toRad(moon.delta)) +
    Math.cos(toRad(latitude)) * Math.cos(toRad(moon.delta)) * Math.cos(toRad(ha))))
  const tinggiHilal = alt
  const meetsMABIMS = tinggiHilal >= 3.0 && elongasi >= 6.4
  return { tinggiHilal, elongasi, meetsMABIMS }
}