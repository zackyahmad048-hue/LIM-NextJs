import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { loadAuthzSubject } from '@/lib/auth-subject'
import { runWithTenantContext, tenantContextFromSubject } from '@/lib/tenant-context'
import { laporanRiwayatQuerySchema } from '@/modules/wajib-khidmah/presentation/dto/laporan-riwayat.dto'
import * as Q from '@/modules/wajib-khidmah/presentation/queries/laporan-riwayat.query'

export const dynamic = 'force-dynamic'
const ROLE_PUSAT = ['OWNER', 'ADMIN_SEKRETARIAT', 'TIM_WAJIB_KHIDMAH']

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, role: true, accountType: true } })
  if (!user || !ROLE_PUSAT.includes(user.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const subject = await loadAuthzSubject(user)
  return runWithTenantContext(tenantContextFromSubject(subject), async () => {
    const parsed = laporanRiwayatQuerySchema.safeParse(Object.fromEntries(new URL(req.url).searchParams))
    if (!parsed.success) return NextResponse.json({ issues: parsed.error.issues }, { status: 400 })
    const p = parsed.data

    switch (p.jenis) {
      case 'rekap-tahun': return NextResponse.json(await Q.rekapPerTahun())
      case 'wilayah': return NextResponse.json(await Q.rekapWilayah(p))
      case 'pola': return NextResponse.json(await Q.polaPengajuan())
      case 'top': return NextResponse.json(await Q.topLembaga(p.limit, p.tahun))
      case 'gb': {
        if (!p.tahun) return NextResponse.json({ error: 'tahun wajib' }, { status: 400 })
        const data = await Q.daftarGbPerTahun(p.tahun)
        return data ? NextResponse.json(data) : NextResponse.json({ error: 'tahun tidak ditemukan' }, { status: 404 })
      }
      case 'kasus': return NextResponse.json(await Q.daftarKasus())
      case 'kualitas': return NextResponse.json(await Q.kualitasData())
      case 'cari': {
        if (!p.q) return NextResponse.json({ error: 'q wajib' }, { status: 400 })
        return NextResponse.json(await Q.cariLembaga(p.q, p.limit))
      }
      case 'detail': {
        if (!p.id) return NextResponse.json({ error: 'id wajib' }, { status: 400 })
        const data = await Q.detailLembaga(p.id)
        return data ? NextResponse.json(data) : NextResponse.json({ error: 'lembaga tidak ditemukan' }, { status: 404 })
      }
    }
  })
}