import { z } from 'zod'
import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { sekolahMitraDtoSchema, bankMateriDtoSchema, penugasanPesantrenDtoSchema, laporanPengajarDtoSchema, laporanKoordinatorDtoSchema, umpanBalikPusatDtoSchema, umpanBalikPesertaDtoSchema, createSekolahRequestSchema, createBankMateriRequestSchema, createPenugasanPesantrenRequestSchema, createLaporanPengajarRequestSchema, createLaporanKoordinatorRequestSchema, createUmpanBalikPusatRequestSchema, createUmpanBalikPesertaRequestSchema } from '@/modules/pesantren-ramadan/presentation/dto/pesantren.dto'
import { xLimAuthForPesantren } from '@/modules/authorization/domain/matrix'

extendZodWithOpenApi(z)
function envelope<T extends z.ZodTypeAny>(data: T, meta?: z.ZodTypeAny) { const base = z.object({ success: z.literal(true), data, requestId: z.string().optional(), code: z.string().optional() }); return meta ? base.extend({ meta }) : base }
const PaginationMeta = z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }).openapi('PaginationMeta')
const ErrorResponse = z.object({ success: z.literal(false), error: z.string().optional(), errors: z.record(z.string(), z.array(z.string())).optional(), code: z.string().optional(), requestId: z.string().optional() }).openapi('ErrorResponse')

export function registerPesantrenOpenApi(registry: OpenAPIRegistry) {
  const Sekolah = registry.register('PesantrenSekolahMitra', sekolahMitraDtoSchema)
  const Materi = registry.register('PesantrenBankMateri', bankMateriDtoSchema)
  const Penugasan = registry.register('PesantrenPenugasan', penugasanPesantrenDtoSchema)
  const LapPengajar = registry.register('PesantrenLaporanPengajar', laporanPengajarDtoSchema)
  const LapKoordinator = registry.register('PesantrenLaporanKoordinator', laporanKoordinatorDtoSchema)
  const UBPusat = registry.register('PesantrenUmpanBalikPusat', umpanBalikPusatDtoSchema)
  const UBPeserta = registry.register('PesantrenUmpanBalikPeserta', umpanBalikPesertaDtoSchema)
  const R1 = registry.register('PesantrenCreateSekolahRequest', createSekolahRequestSchema)
  const R2 = registry.register('PesantrenCreateBankMateriRequest', createBankMateriRequestSchema)
  const R3 = registry.register('PesantrenCreatePenugasanRequest', createPenugasanPesantrenRequestSchema)
  const R4 = registry.register('PesantrenCreateLaporanPengajarRequest', createLaporanPengajarRequestSchema)
  const R5 = registry.register('PesantrenCreateLaporanKoordinatorRequest', createLaporanKoordinatorRequestSchema)
  const R6 = registry.register('PesantrenCreateUmpanBalikPusatRequest', createUmpanBalikPusatRequestSchema)
  const R7 = registry.register('PesantrenCreateUmpanBalikPesertaRequest', createUmpanBalikPesertaRequestSchema)
  registry.register('PaginationMeta', PaginationMeta); registry.register('ErrorResponse', ErrorResponse)
  const security: Array<Record<string, string[]>> = [{ BearerAuth: [] }, { CookieAuth: [] }]
  const json = (schema: z.ZodTypeAny, description = 'OK') => ({ description, content: { 'application/json': { schema } } })
  const q = z.object({ page: z.coerce.number().int().positive().default(1).optional(), limit: z.coerce.number().int().min(1).max(100).default(20).optional(), penugasanId: z.string().optional(), sekolahId: z.string().optional(), targetJenjang: z.string().optional() })

  const reg = (method: 'get'|'post', path: string, summary: string, data: z.ZodTypeAny, req?: { body?: z.ZodTypeAny; meta?: boolean }, auth: ReturnType<typeof xLimAuthForPesantren> = xLimAuthForPesantren('read')) => {
    registry.registerPath({ method, path, tags: ['Pesantren Ramadan'], summary, security, request: method === 'get' ? { query: q } : (req?.body ? { body: { content: { 'application/json': { schema: req.body } } } } : undefined), responses: { [method === 'post' ? 201 : 200]: json(req?.meta ? envelope(data, PaginationMeta) : envelope(data)), 401: json(ErrorResponse), 403: json(ErrorResponse), 404: json(ErrorResponse), 422: json(ErrorResponse) }, 'x-lim-auth': auth } as Parameters<typeof registry.registerPath>[0])
  }

  reg('get', '/pesantren/sekolah', 'Daftar sekolah mitra', z.array(Sekolah), { meta: true }, xLimAuthForPesantren('read'))
  reg('post', '/pesantren/sekolah', 'Buat sekolah mitra', Sekolah, { body: R1 }, xLimAuthForPesantren('create'))
  reg('get', '/pesantren/materi', 'Daftar bank materi', z.array(Materi), { meta: true }, xLimAuthForPesantren('read'))
  reg('post', '/pesantren/materi', 'Buat bank materi', Materi, { body: R2 }, xLimAuthForPesantren('create'))
  reg('get', '/pesantren/penugasan', 'Daftar penugasan pesantren', z.array(Penugasan), { meta: true }, xLimAuthForPesantren('read'))
  reg('post', '/pesantren/penugasan', 'Buat penugasan pesantren', Penugasan, { body: R3 }, xLimAuthForPesantren('create'))
  reg('get', '/pesantren/laporan-pengajar', 'Daftar laporan harian pengajar', z.array(LapPengajar), { meta: true }, xLimAuthForPesantren('read'))
  reg('post', '/pesantren/laporan-pengajar', 'Buat laporan harian pengajar', LapPengajar, { body: R4 }, xLimAuthForPesantren('create'))
  reg('get', '/pesantren/laporan-koordinator', 'Daftar laporan harian koordinator', z.array(LapKoordinator), { meta: true }, xLimAuthForPesantren('read'))
  reg('post', '/pesantren/laporan-koordinator', 'Buat laporan harian koordinator', LapKoordinator, { body: R5 }, xLimAuthForPesantren('create'))
  reg('get', '/pesantren/umpan-balik-pusat', 'Daftar umpan balik pusat', z.array(UBPusat), { meta: true }, xLimAuthForPesantren('read'))
  reg('post', '/pesantren/umpan-balik-pusat', 'Buat umpan balik pusat', UBPusat, { body: R6 }, xLimAuthForPesantren('create'))
  reg('get', '/pesantren/umpan-balik-peserta', 'Daftar umpan balik peserta', z.array(UBPeserta), { meta: true }, xLimAuthForPesantren('read'))
  reg('post', '/pesantren/umpan-balik-peserta', 'Buat umpan balik peserta', UBPeserta, { body: R7 }, xLimAuthForPesantren('create'))
}
