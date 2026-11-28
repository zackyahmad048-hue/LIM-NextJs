import { Prisma } from '@/generated/client'
import { prisma } from '@/lib/prisma' // sesuaikan jika export singleton-mu default
import { PLACEHOLDER } from '../../domain/import-legacy.schema'

// ---------- 1. Rekap per tahun ajaran/angkatan (dashboard utama + chart tren) ----------
export interface RekapTahun {
  tahun: string; namaAngkatan: string | null
  lembagaMengajukan: number; lembagaDapat: number; tidakDapat: number; jalurRekomendasi: number
  totalGbDisetujui: number; totalDiminta: number; persenDapat: number | null
}
export function rekapPerTahun() {
  return prisma.$transaction((tx) => tx.$queryRaw<RekapTahun[]>(Prisma.sql`
    SELECT ta."tahun", ta."namaAngkatan",
      COUNT(r."id")::int                                            AS "lembagaMengajukan",
      COUNT(r."id") FILTER (WHERE r."jumlahDisetujui" > 0)::int     AS "lembagaDapat",
      COUNT(r."id") FILTER (WHERE r."status" = 'TIDAK_DIPENUHI')::int AS "tidakDapat",
      COUNT(r."id") FILTER (WHERE r."status" = 'REKOMENDASI')::int  AS "jalurRekomendasi",
      COALESCE(SUM(r."jumlahDisetujui"), 0)::int                    AS "totalGbDisetujui",
      COALESCE(SUM(r."jumlahDiminta"), 0)::int                      AS "totalDiminta",
      ROUND(COUNT(r."id") FILTER (WHERE r."jumlahDisetujui" > 0)::numeric
        / NULLIF(COUNT(r."id"), 0) * 100, 1)::float8                AS "persenDapat"
    FROM "TahunAjaran" ta
    LEFT JOIN "RiwayatPermohonan" r ON r."tahunAjaranId" = ta."id"
    GROUP BY ta."id", ta."tahun", ta."namaAngkatan"
    ORDER BY ta."tahunMulai" ASC`))
}

// ---------- 2. Rekap wilayah (provinsi → drill-down kabupaten, opsional per tahun) ----------
export interface RekapWilayah {
  wilayah: string; jumlahLembaga: number; lembagaPernahDapat: number
  totalPengajuan: number; totalGb: number
}
export function rekapWilayah(opts: { provinsi?: string; kabupaten?: string; tahun?: string } = {}) {
  const col = opts.provinsi ? Prisma.sql`l."kabupaten"` : Prisma.sql`l."provinsi"`
  const fProv = opts.provinsi ? Prisma.sql`AND l."provinsi" = ${opts.provinsi}` : Prisma.empty
  const fKab = opts.kabupaten ? Prisma.sql`AND l."kabupaten" = ${opts.kabupaten}` : Prisma.empty
  const fTahun = opts.tahun
    ? Prisma.sql`AND r."tahunAjaranId" = (SELECT "id" FROM "TahunAjaran" WHERE "tahun" = ${opts.tahun})`
    : Prisma.empty
  return prisma.$transaction((tx) => tx.$queryRaw<RekapWilayah[]>(Prisma.sql`
    SELECT COALESCE(${col}, '(tidak diketahui)') AS "wilayah",
      COUNT(DISTINCT l."id")::int AS "jumlahLembaga",
      COUNT(DISTINCT l."id") FILTER (WHERE r."jumlahDisetujui" > 0)::int AS "lembagaPernahDapat",
      COUNT(r."id")::int AS "totalPengajuan",
      COALESCE(SUM(r."jumlahDisetujui"), 0)::int AS "totalGb"
    FROM "Lembaga" l
    LEFT JOIN "RiwayatPermohonan" r ON r."lembagaId" = l."id" ${fTahun}
    WHERE 1=1 ${fProv} ${fKab}
    GROUP BY 1
    ORDER BY "totalGb" DESC, "jumlahLembaga" DESC`))
}

// ---------- 3. Pola pengajuan (retensi: 1×, 2×, ... 5× berturut) ----------
export function polaPengajuan() {
  return prisma.$transaction((tx) => tx.$queryRaw<{ frekuensi: number; jumlahLembaga: number; pernahDapat: number }[]>(Prisma.sql`
    WITH per_lembaga AS (
      SELECT r."lembagaId",
        COUNT(*)::int AS frekuensi,
        COUNT(*) FILTER (WHERE r."jumlahDisetujui" > 0)::int AS tahun_dapat
      FROM "RiwayatPermohonan" r GROUP BY r."lembagaId")
    SELECT frekuensi, COUNT(*)::int AS "jumlahLembaga",
      COUNT(*) FILTER (WHERE tahun_dapat > 0)::int AS "pernahDapat"
    FROM per_lembaga GROUP BY frekuensi ORDER BY frekuensi ASC`))
}

// ---------- 4. Top lembaga (paling banyak menerima GB / paling loyal) ----------
export interface TopLembaga {
  id: string; namaLembaga: string; kabupaten: string | null; provinsi: string | null
  tahunMengajukan: number; tahunDapat: number; totalGb: number
}
export function topLembaga(limit = 20, tahun?: string) {
  const fTahun = tahun
    ? Prisma.sql`AND r."tahunAjaranId" = (SELECT "id" FROM "TahunAjaran" WHERE "tahun" = ${tahun})`
    : Prisma.empty
  return prisma.$transaction((tx) => tx.$queryRaw<TopLembaga[]>(Prisma.sql`
    SELECT l."id", l."namaLembaga", l."kabupaten", l."provinsi",
      COUNT(r."id")::int AS "tahunMengajukan",
      COUNT(r."id") FILTER (WHERE r."jumlahDisetujui" > 0)::int AS "tahunDapat",
      COALESCE(SUM(r."jumlahDisetujui"), 0)::int AS "totalGb"
    FROM "Lembaga" l
    JOIN "RiwayatPermohonan" r ON r."lembagaId" = l."id" ${fTahun}
    GROUP BY l."id"
    ORDER BY "totalGb" DESC, "tahunDapat" DESC
    LIMIT ${limit}`))
}

// ---------- 5. Daftar GB per tahun (workflow: lembaga dapat → nama GB tercatat) ----------
export async function daftarGbPerTahun(tahun: string) {
  const ta = await prisma.tahunAjaran.findUnique({
    where: { tahun },
    include: {
      riwayat: {
        where: { jumlahDisetujui: { gt: 0 } },
        orderBy: { lembaga: { namaLembaga: 'asc' } },
        include: {
          lembaga: { select: { id: true, namaLembaga: true, kabupaten: true, provinsi: true } },
          guruBantu: {
            include: {
              guruBantu: { select: { id: true, user: { select: { name: true } } } },
              penugasan: { select: { id: true, status: true, tanggalMulai: true } },
            },
          },
        },
      },
    },
  })
  if (!ta) return null
  const rows: Array<{
    lembagaId: string; lembaga: string; kabupaten: string | null
    namaGuruBantu: string | null; jumlah: number | null
    statusPenugasan: string | null; penugasanId: string | null; catatanGb: string | null
  }> = []
  let totalGb = 0, gbTanpaNama = 0
  for (const r of ta.riwayat) {
    totalGb += r.jumlahDisetujui ?? 0
    if (r.guruBantu.length === 0) {
      // Legacy Excel: jumlah diketahui, nama GB belum tercatat
      gbTanpaNama += r.jumlahDisetujui ?? 0
      rows.push({
        lembagaId: r.lembaga.id, lembaga: r.lembaga.namaLembaga, kabupaten: r.lembaga.kabupaten,
        namaGuruBantu: null, jumlah: r.jumlahDisetujui,
        statusPenugasan: null, penugasanId: null, catatanGb: r.catatanGb,
      })
    } else {
      for (const g of r.guruBantu) rows.push({
        lembagaId: r.lembaga.id, lembaga: r.lembaga.namaLembaga, kabupaten: r.lembaga.kabupaten,
        namaGuruBantu: g.namaGuruBantu, jumlah: null,
        statusPenugasan: g.penugasan?.status ?? null, penugasanId: g.penugasanId, catatanGb: r.catatanGb,
      })
    }
  }
  return { tahun: ta.tahun, angkatan: ta.namaAngkatan, totalGb, gbTanpaNama, rows }
}

// ---------- 6. Daftar kasus/perhatian (SENSITIF — admin pusat saja) ----------
const KATEGORI_KASUS: [RegExp, string][] = [
  [/amoral/i, 'PELANGGARAN_AMORAL'],
  [/kabur/i, 'GB_KABUR'],
  [/khodim/i, 'PENYALAHGUNAAN_KHODIM'],
  [/tidak (ada|memiliki) santri|tanpa santri/i, 'TANPA_SANTRI'],
  [/makan|fasilitas|kamar mandi/i, 'FASILITAS_KURANG'],
  [/blacklist|tidak sambung/i, 'BLACKLIST'],
]
export async function daftarKasus() {
  const rows = await prisma.riwayatPermohonan.findMany({
    where: {
      OR: [
        { catatanGb: { not: null } },
        { lembaga: { isBlacklist: true } },
        { lembaga: { catatanKhusus: { contains: 'blacklist', mode: 'insensitive' } } },
      ],
    },
    select: {
      id: true, status: true, catatanGb: true, catatanLembaga: true,
      tahunAjaran: { select: { tahun: true } },
      lembaga: { select: { id: true, namaLembaga: true, kabupaten: true, isBlacklist: true, catatanKhusus: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return rows.flatMap(r => {
    const teks = [r.catatanGb, r.lembaga.catatanKhusus].filter(Boolean).join(' | ')
    const kategori = KATEGORI_KASUS.filter(([re]) => re.test(teks)).map(([, k]) => k)
    if (r.lembaga.isBlacklist && !kategori.includes('BLACKLIST')) kategori.push('BLACKLIST')
    if (kategori.length === 0) return [] // buang catatan benign ("rekomendasi dari GB")
    return [{
      riwayatId: r.id, tahun: r.tahunAjaran.tahun, lembagaId: r.lembaga.id,
      lembaga: r.lembaga.namaLembaga, kabupaten: r.lembaga.kabupaten,
      kategori, catatan: teks, isBlacklist: r.lembaga.isBlacklist,
    }]
  })
}

// ---------- 7. Kualitas data (widget admin: progres pembersihan legacy) ----------
export async function kualitasData() {
  const [tanpaAlamat, tanpaPimpinan, tanpaProvinsi, tanpaKabupaten, riwayatTanpaNamaGb, blacklist, dzuriyyah] =
    await Promise.all([
      prisma.lembaga.count({ where: { alamatLengkap: PLACEHOLDER } }),
      prisma.lembaga.count({ where: { namaPimpinan: PLACEHOLDER } }),
      prisma.lembaga.count({ where: { provinsi: null } }),
      prisma.lembaga.count({ where: { kabupaten: null } }),
      prisma.riwayatPermohonan.count({ where: { jumlahDisetujui: { gt: 0 }, guruBantu: { none: {} } } }),
      prisma.lembaga.count({ where: { isBlacklist: true } }),
      prisma.lembaga.count({ where: { isDzuriyyah: true } }),
    ])
  return { tanpaAlamat, tanpaPimpinan, tanpaProvinsi, tanpaKabupaten, riwayatTanpaNamaGb, blacklist, dzuriyyah }
}

// ---------- 8. Pengganti sheet SEARCH: cari + detail lembaga dengan riwayat ----------
export function cariLembaga(q: string, limit = 10) {
  return prisma.lembaga.findMany({
    where: { namaLembaga: { contains: q, mode: 'insensitive' } },
    select: { id: true, namaLembaga: true, kabupaten: true, provinsi: true, status: true },
    orderBy: { namaLembaga: 'asc' }, take: limit,
  })
}
export async function detailLembaga(id: string) {
  const l = await prisma.lembaga.findUnique({
    where: { id },
    include: {
      parent: { select: { id: true, namaLembaga: true } },
      children: { select: { id: true, namaLembaga: true } },
      riwayat: {
        orderBy: { tahunAjaran: { tahunMulai: 'asc' } },
        include: {
          tahunAjaran: { select: { tahun: true, namaAngkatan: true } },
          guruBantu: { select: { namaGuruBantu: true, penugasanId: true } },
        },
      },
    },
  })
  if (!l) return null
  // Kartu ala SEARCH Excel — tapi frekuensi DAN headcount dipisah (perbaikan semantik lama)
  const frekuensiMengajukan = l.riwayat.length
  const frekuensiDapat = l.riwayat.filter(r => (r.jumlahDisetujui ?? 0) > 0).length
  const totalGbDiterima = l.riwayat.reduce((a, r) => a + (r.jumlahDisetujui ?? 0), 0)
  return { ...l, ringkasan: { frekuensiMengajukan, frekuensiDapat, totalGbDiterima } }
}