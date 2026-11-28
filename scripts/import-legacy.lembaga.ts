/**
 * Impor master Lembaga + RiwayatPermohonan dari Excel legacy.
 * Jalankan: bun scripts/import-legacy-lembaga.ts "<file.xlsx>" [--commit]
 * Default DRY-RUN (tidak menulis DB). Guard bloat: sheetRows membatasi baca ≤620 baris.
 */
import { readFileSync } from 'node:fs'
import * as XLSX from 'xlsx'
import {
  PLACEHOLDER, TAHUN_AJARAN_SEED, lembagaImportSchema, riwayatImportSchema,
  type LembagaImport, type RiwayatImport,
} from '../modules/wajib-khidmah/domain/import-legacy.schema'

const FILE = process.argv[2] ?? '01. DATABASE PEMOHON GURU BANTU (MULAI 2021)  .xlsx'
const COMMIT = process.argv.includes('--commit')
const SHEET = 'DATABASE PEMOHON GB MASAKEMASA'
const YEARS = [
  { tahun: '2021/2022', p: 7, d: 8, c: 9 }, { tahun: '2022/2023', p: 10, d: 11, c: 12 },
  { tahun: '2023/2024', p: 13, d: 14, c: 15 }, { tahun: '2024/2025', p: 16, d: 17, c: 18 },
  { tahun: '2025/2026', p: 19, d: 20, c: 21 }, { tahun: '2026/2027', p: 22, d: 23, c: -1 },
  { tahun: '2027/2028', p: 24, d: 25, c: -1 },
]
// 7 lembaga orange (asuhan dzuriyyah) dari sheet lama — substring nama ternormalisasi
const DZURIYYAH = ['kanzul makarim', 'an najah mamba', 'hidayatus sholihin turus',
  'roudlotul huda klodran', 'tegal arum talun', 'sentono agung', 'nazhatut thullab']
// alias key -> canonical key (merge manual yang sudah dikonfirmasi)
const MANUAL_MERGE: Record<string, string> = {
  'al amin ngasinan|kediri': 'al amien ngasinan|kediri',
  'pari ulu gurah|kediri': 'pare ulu gurah|kediri',
  'madin al amin roudlotul quran|lamongan': 'roudlotul qur an|lamongan',
  'hidayatul mubtadiien|lampung timur': 'hidayatul mubtadiin bauh gunung sari|lampung timur',
}
const PROV = new Set(['bali','banten','bengkulu','benkulu','jambi','lampung','riau','papua','ntb',
  'kalimantan barat','kalimantan tengah','kalimantan utara','kalimantan timur','sumatera selatan',
  'sumatra selatan','sumatra barat','sumatera barat','sumatera utara','sumatra utara','maluku',
  'jakarta','jakarta selatan','jakarta timur','aceh','bangka belitung','yogyakarta','diy'])
const PROV_REGEX: [RegExp, string][] = [
  [/jawa timur|jatim/i, 'Jawa Timur'], [/jawa barat|jabar/i, 'Jawa Barat'],
  [/jawa tengah|jateng/i, 'Jawa Tengah'], [/aceh/i, 'Aceh'], [/banten/i, 'Banten'],
  [/bengkulu|benkulu/i, 'Bengkulu'], [/jambi/i, 'Jambi'], [/lampung/i, 'Lampung'],
  [/kepulauan riau|kepri|batam/i, 'Kepulauan Riau'], [/riau/i, 'Riau'],
  [/bangka|babel|belitung/i, 'Kepulauan Bangka Belitung'], [/sumatera barat|sumbar/i, 'Sumatera Barat'],
  [/sumatera selatan|sumsel/i, 'Sumatera Selatan'], [/sumatera utara|sumut/i, 'Sumatera Utara'],
  [/kalimantan barat|kalbar/i, 'Kalimantan Barat'], [/kalimantan tengah|kalteng/i, 'Kalimantan Tengah'],
  [/kalimantan timur|kaltim/i, 'Kalimantan Timur'], [/kalimantan utara|kalut/i, 'Kalimantan Utara'],
  [/ntb|lombok|sumbawa/i, 'Nusa Tenggara Barat'], [/bali/i, 'Bali'], [/papua/i, 'Papua'],
  [/maluku/i, 'Maluku'], [/yogyakarta|diy/i, 'DI Yogyakarta'],
]

const s = (v: unknown) => String(v ?? '').replace(/\s+/g, ' ').trim()
const num = (v: unknown) => { const n = Number(s(v)); return Number.isFinite(n) && s(v) !== '' ? n : null }
const normName = (v: unknown) => s(v).toLowerCase().replace(/[’‘`]/g, "'").replace(/\*+$/, '')
  .replace(/[^a-z0-9]+/g, ' ').replace(/\b(ponpes|pondok|pesantren|pp|pon)\b/g, ' ').replace(/\s+/g, ' ').trim()
const TITLES = new Set(['kh','ky','kyai','hj','h','dr','drs','prof','ust','ustadz','ustad','nyai','agus',
  'gus','rk','rkh','tgh','habib','al','bpk','bp','st','spd','mpd','ma','lc','shi','mhi','ar','mh','mm','sos','psi','ag'])
const normPerson = (v: unknown) => s(v).toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^a-z0-9 ]/g, ' ')
  .split(' ').filter(t => t.length > 1 && !TITLES.has(t))
const personCompatible = (a: string, b: string) => {
  const A = new Set(normPerson(a)), B = new Set(normPerson(b))
  if (!A.size || !B.size) return true
  const inter = [...A].filter(x => B.has(x)).length
  const uni = new Set([...A, ...B]).size
  return inter / uni >= 0.6 || [...A].every(x => B.has(x)) || [...B].every(x => A.has(x))
}
function wilayah(kotaRaw: string, alamat: string) {
  const kota = kotaRaw.trim()
  let kab: string | null = null
  let prov: string | null = null
  if (kota.includes(',')) { const [k, p] = kota.split(','); kab = k.trim(); prov = p.trim() }
  const kl = kota.toLowerCase()
  if (PROV.has(kl)) prov = kota
  else if (kota) kab = kota.replace(/\b\w/g, c => c.toUpperCase())
  if (kab) kab = kab.replace(/^Kota /i, '').replace(/\bBenkulu\b/i, 'Bengkulu')
    .replace(/\bSumatra\b/i, 'Sumatera').replace(/\bNganjuk\b/i, 'Nganjuk')
  if (!prov) for (const [re, p] of PROV_REGEX) if (re.test(alamat) || re.test(kota)) { prov = p; break }
  return { provinsi: prov, kabupaten: kab }
}
const jenis = (n: string) => {
  const x = n.toLowerCase()
  if (/^madrasah diniyah|^madin|^mdta|^mds/.test(x)) return 'MADIN'
  if (/^tpq|^tpa/.test(x)) return 'TPQ'
  if (/^mtq/.test(x)) return 'MTQ'
  if (/^mts/.test(x)) return 'MTS'
  if (/^ma\b/.test(x)) return 'MA'
  if (/^mi\b/.test(x)) return 'MI'
  if (/^masjid/.test(x)) return 'MASJID'
  if (/^ldnu/.test(x)) return 'LDNU'
  if (/^lksa/.test(x)) return 'LKSA'
  if (/^lim\b/.test(x)) return 'LIM'
  if (/^ypi|^ypp|^yayasan/.test(x)) return 'YAYASAN'
  if (/ponpes|pondok|pesantren|^pp\./.test(x)) return 'PONPES'
  return 'LAINNYA'
}
const alumniTahun = (pengasuh: string, ket: string) =>
  pengasuh.match(/\(Alumni\s+(\d{4})\)/i)?.[1] ?? ket.match(/Alumni\s+(\d{4})/i)?.[1]
  ?? (pengasuh.match(/'(\d{2})\b/)?.[1] ? '20' + pengasuh.match(/'(\d{2})\b/)![1] : null)
const isGbNote = (t: string) => /\bGB\b|guru bantu|khodim|amoral|kabur/i.test(t)
const stripAuthor = (t: string) => t.replace(/^(MacBook Pro|GIGABYTE)\s*:\s*/i, '').replace(/\n+/g, ' | ').trim()

// ---------- baca excel ----------
const wb = XLSX.read(readFileSync(FILE), { sheetRows: 620 })
const ws = wb.Sheets[SHEET]
if (!ws) throw new Error(`Sheet "${SHEET}" tidak ditemukan`)
const cell = (c: number, r: number) => ws[XLSX.utils.encode_cell({ c, r: r - 1 })]
const cv = (c: number, r: number) => s(cell(c, r)?.v)
const cc = (c: number, r: number) => (cell(c, r)?.c as { t: string }[] | undefined)?.map(x => stripAuthor(x.t)).join(' | ') ?? ''
const endRow = Math.min(XLSX.utils.decode_range(ws['!ref']!).e.r + 1, 620)

type Row = { r: number; master: LembagaImport; rawPengasuh: string; years: RiwayatImport[]; key: string }
const rows: Row[] = []; const errors: { r: number; nama: string; msg: string }[] = []
let placeholder = 0
for (let r = 3; r <= endRow; r++) {
  const nama = cv(0, r)
  if (cv(5, r) === 'TAHUN KE TAHUN' || nama.toUpperCase().startsWith('LEMBAGA') || cv(7, r) === 'PERMOHONAN') continue
  const masterEmpty = [1, 2, 3, 4].every(c => !cv(c, r))
  const numsZero = [5, 6, ...YEARS.flatMap(y => [y.p, y.d])].every(c => (num(cv(c, r)) ?? 0) === 0)
  if (!nama && masterEmpty && numsZero) { placeholder++; continue }
  if (!nama) { errors.push({ r, nama: '(kosong)', msg: `nama lembaga kosong — alamat: ${cv(1, r).slice(0, 50)}` }); continue }

  const alamat = cv(1, r), pengasuh = cv(3, r), ket = cv(4, r)
  const { provinsi, kabupaten } = wilayah(cv(2, r), alamat)
  const nn = normName(nama)
  const parsed = lembagaImportSchema.safeParse({
    namaLembaga: nama, namaPimpinan: pengasuh || undefined, alamatLengkap: alamat || undefined,
    provinsi, kabupaten,
    kategori: /cabang\s+(vi|vii|ix|xxiii|\d+)|lirboyo bulu/i.test(nama) ? 'INTERNAL' : 'EKSTERNAL',
    jenisLembaga: jenis(nama), pimpinanAlumniTahun: alumniTahun(pengasuh, ket),
    isDzuriyyah: DZURIYYAH.some(d => nn.includes(d)),
    isBlacklist: /blacklist|tidak sambung/i.test(ket),
    catatanKhusus: ket || undefined,
  })
  if (!parsed.success) { errors.push({ r, nama, msg: parsed.error.issues.map(i => i.message).join('; ') }); continue }

  const years: RiwayatImport[] = []
  for (const y of YEARS) {
    const p = cv(y.p, r).toLowerCase(), d = num(cv(y.d, r))
    const cellNote = y.c >= 0 ? cv(y.c, r) : ''
    const permNote = cc(y.p, r), dapatNote = cc(y.d, r)
    if (!p && d === null && !cellNote && !permNote && !dapatNote) continue
    let status: RiwayatImport['status']
    if (p === 'rekom') status = 'REKOMENDASI'
    else if (d !== null && d > 0) status = 'DIPENUHI'
    else if (p === 'y' || p === 'iya' || p === 'xxx') status = 'TIDAK_DIPENUHI'
    else status = 'DIAJUKAN'
    const notesL = [cellNote && !isGbNote(cellNote) ? cellNote : '', permNote].filter(Boolean).join(' | ') || null
    const notesG = [cellNote && isGbNote(cellNote) ? cellNote : '', dapatNote].filter(Boolean).join(' | ') || null
    const ry = riwayatImportSchema.safeParse({
      tahun: y.tahun, jumlahDiminta: num(p), jumlahDisetujui: d, status,
      catatanLembaga: notesL, catatanGb: notesG,
    })
    if (ry.success) years.push(ry.data)
  }
  let key = `${nn}|${(kabupaten ?? '').toLowerCase()}`
  key = MANUAL_MERGE[key] ?? key
  rows.push({ r, master: parsed.data, rawPengasuh: pengasuh, years, key })
}

// ---------- dedup / merge ----------
const groups = new Map<string, Row[]>()
for (const row of rows) { const g = groups.get(row.key) ?? []; g.push(row); groups.set(row.key, g) }
const merged: { nama: string; dari: number[] }[] = []; const review: string[] = []
const finalLembaga: { master: LembagaImport; years: RiwayatImport[]; srcRows: number[] }[] = []
for (const [, g] of groups) {
  const compatible = g.every(x => personCompatible(x.rawPengasuh, g[0].rawPengasuh))
  if (!compatible) {
    review.push(`pengasuh berbeda, TIDAK di-merge: ${g.map(x => `${x.master.namaLembaga} (baris ${x.r})`).join(' vs ')}`)
    for (const x of g) finalLembaga.push({ master: x.master, years: x.years, srcRows: [x.r] })
    continue
  }
  const base = [...g].sort((a, b) =>
    (b.master.alamatLengkap !== PLACEHOLDER ? 1 : 0) - (a.master.alamatLengkap !== PLACEHOLDER ? 1 : 0)
    || b.master.alamatLengkap.length - a.master.alamatLengkap.length)[0]
  const yearMap = new Map<string, RiwayatImport>()
  for (const x of g) for (const y of x.years) {
    const ex = yearMap.get(y.tahun)
    if (ex && (ex.jumlahDisetujui ?? 0) !== (y.jumlahDisetujui ?? 0))
      review.push(`konflik tahun ${y.tahun} pada "${base.master.namaLembaga}": ${ex.jumlahDisetujui} vs ${y.jumlahDisetujui}`)
    if (!ex || (y.jumlahDisetujui ?? 0) > (ex.jumlahDisetujui ?? 0)) yearMap.set(y.tahun, y)
  }
  const master: LembagaImport = { ...base.master }
  master.isDzuriyyah = g.some(x => x.master.isDzuriyyah)
  master.isBlacklist = g.some(x => x.master.isBlacklist)
  master.catatanKhusus = [...new Set(g.map(x => x.master.catatanKhusus).filter(Boolean))].join(' | ') || null
  const years = [...yearMap.values()]
  master.status = master.isBlacklist ? 'NON_AKTIF'
    : years.some(y => (y.jumlahDisetujui ?? 0) > 0) ? 'MITRA_AKTIF' : 'CALON'
  if (g.length > 1) merged.push({ nama: master.namaLembaga, dari: g.map(x => x.r) })
  finalLembaga.push({ master, years, srcRows: g.map(x => x.r) })
}

// ---------- laporan dry-run ----------
const perYear = new Map<string, { ajuan: number; orang: number }>()
const statusTally: Record<string, number> = {}
let totalOrang = 0, totalRiwayat = 0
for (const l of finalLembaga) for (const y of l.years) {
  totalRiwayat++; statusTally[y.status] = (statusTally[y.status] ?? 0) + 1
  const py = perYear.get(y.tahun) ?? { ajuan: 0, orang: 0 }; py.ajuan++
  py.orang += y.jumlahDisetujui ?? 0; totalOrang += y.jumlahDisetujui ?? 0; perYear.set(y.tahun, py)
}
console.log('=== DRY-RUN IMPORT LEGACY LIM ===')
console.log(`Baris valid: ${rows.length} | placeholder dilewati: ${placeholder} | error: ${errors.length}`)
console.log(`Lembaga unik final: ${finalLembaga.length} | grup di-merge: ${merged.length} | perlu review: ${review.length}`)
console.log(`Riwayat: ${totalRiwayat} baris | total orang disetujui: ${totalOrang}`)
console.log('Status riwayat:', statusTally)
console.log('Per tahun:', Object.fromEntries(perYear))
console.log('Dzuriyyah:', finalLembaga.filter(l => l.master.isDzuriyyah).length,
  '| Blacklist:', finalLembaga.filter(l => l.master.isBlacklist).length,
  '| Placeholder pimpinan/alamat:', finalLembaga.filter(l => l.master.namaPimpinan === PLACEHOLDER || l.master.alamatLengkap === PLACEHOLDER).length)
console.table(errors); console.table(merged); review.forEach(w => console.warn('REVIEW:', w))

// ---------- commit (opsional) ----------
if (COMMIT) {
  const { prisma } = await import('../lib/prisma')
  const { runWithTenantContext } = await import('../lib/tenant-context')
  await runWithTenantContext({ scope: 'PUSAT', unitId: null, userId: null }, async () => {
    const ta = new Map<string, string>()
    for (const t of TAHUN_AJARAN_SEED) {
      const rec = await prisma.tahunAjaran.upsert({ where: { tahun: t.tahun }, create: t, update: {} })
      ta.set(t.tahun, rec.id)
    }
    let n = 0
    for (const l of finalLembaga) {
      await prisma.$transaction(async tx => {
        const found = await tx.lembaga.findFirst({
          where: { namaLembaga: l.master.namaLembaga, kabupaten: l.master.kabupaten },
        })
        const data = { ...l.master, sumber: undefined } as never
        const lembaga = found
          ? await tx.lembaga.update({ where: { id: found.id }, data })
          : await tx.lembaga.create({ data: { ...l.master } })
        for (const y of l.years) {
          await tx.riwayatPermohonan.upsert({
            where: { lembagaId_tahunAjaranId: { lembagaId: lembaga.id, tahunAjaranId: ta.get(y.tahun)! } },
            create: { lembagaId: lembaga.id, tahunAjaranId: ta.get(y.tahun)!, ...y, tahun: undefined, sumber: 'EXCEL_LEGACY' } as never,
            update: { ...y, tahun: undefined, sumber: 'EXCEL_LEGACY' } as never,
          })
        }
      })
      n++
    }
    console.log(`COMMIT selesai: ${n} lembaga + ${totalRiwayat} riwayat ditulis.`)
  })
  await prisma.$disconnect()
} else {
  console.log('DRY-RUN saja. Tambahkan --commit untuk menulis ke Neon.')
}