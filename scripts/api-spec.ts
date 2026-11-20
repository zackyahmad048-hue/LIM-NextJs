import fs from 'node:fs/promises'
import path from 'node:path'
import YAML from 'yaml'
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import { registry } from '../lib/openapi/registry'
import { registerCommonComponents } from '../lib/openapi/common'
import { generateOpenApiDocument } from '../lib/openapi/document'
import { registerLetterOpenApi } from '../modules/letter/presentation/api/openapi'
import { registerWajibKhidmahOpenApi } from '../modules/wajib-khidmah/presentation/api/openapi'
import { registerSafariOpenApi } from '../modules/safari/presentation/api/openapi'
import { registerFalakOpenApi } from '../modules/falak/presentation/api/openapi'
import { registerCmsOpenApi } from '../modules/cms/presentation/api/openapi'
import { registerDakwahOpenApi } from '../modules/dakwah-digital/presentation/api/openapi'
import { registerDaerahBinaanOpenApi } from '../modules/daerah-binaan/presentation/api/openapi'
import { registerAuditOpenApi } from '../modules/audit/presentation/api/openapi'
import { registerPublicOpenApi } from '../modules/letter/presentation/api/public-openapi'
import { registerPesantrenOpenApi } from '../modules/pesantren-ramadan/presentation/api/openapi'

extendZodWithOpenApi(z)

async function writeSpec(filePath: string, doc: unknown, format: 'json' | 'yaml') {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  const content = format === 'json' ? JSON.stringify(doc, null, 2) + '\n' : YAML.stringify(doc)
  await fs.writeFile(filePath, content, 'utf8')
  console.log(`[api-spec] generated ${path.relative(process.cwd(), filePath)}`)
}

function addSecuritySchemes(modRegistry: OpenAPIRegistry) {
  modRegistry.registerComponent('securitySchemes', 'BearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'API Key',
    description: 'Kirim API key sebagai Bearer token, atau gunakan session cookie untuk klien web first-party.',
  })
  modRegistry.registerComponent('securitySchemes', 'CookieAuth', {
    type: 'apiKey',
    in: 'cookie',
    name: 'better-auth.session_token',
    description: 'Session cookie Better Auth (khusus origin first-party).',
  })
}

async function generateModuleSpec(opts: {
  title: string
  description: string
  out: string
  tags: Array<{ name: string; description: string }>
  register: (r: OpenAPIRegistry) => void
}) {
  const modRegistry = new OpenAPIRegistry()
  addSecuritySchemes(modRegistry)
  opts.register(modRegistry)
  const doc = generateOpenApiDocument(modRegistry, {
    title: opts.title,
    version: '1.0.0',
    description: opts.description,
    servers: [{ url: '/api/v1', description: 'API v1' }],
  })
  doc.tags = opts.tags
  await writeSpec(path.join(process.cwd(), 'openapi', opts.out), doc, 'yaml')
}

async function main() {
  registerCommonComponents()
  registerLetterOpenApi(registry)
  registerWajibKhidmahOpenApi(registry)
  registerSafariOpenApi(registry)
  registerFalakOpenApi(registry)
  registerCmsOpenApi(registry)
  registerDakwahOpenApi(registry)
  registerDaerahBinaanOpenApi(registry)
  registerAuditOpenApi(registry)
  registerPublicOpenApi(registry)
  registerPesantrenOpenApi(registry)

  const doc = generateOpenApiDocument(registry, {
    title: 'LIM Digital Platform API',
    version: '1.0.0',
    description: 'Kontrak API v1 LIM Digital Platform. Spec dihasilkan dari Zod (sumber kebenaran).',
    servers: [{ url: '/api/v1', description: 'API v1' }],
  })
  doc.tags = [
    { name: 'Letters', description: 'Persuratan (draft, review, approve, send, verifikasi)' },
    { name: 'Uploads', description: 'Upload lampiran via presigned URL' },
    { name: 'Wajib Khidmah', description: 'Penugasan, laporan mingguan, evaluasi kasus & induk' },
    { name: 'Safari', description: 'Titik, delegasi, jurnal harian, approval, laporan sidak' },
    { name: 'Falak', description: 'Jadwal shalat, konfigurasi, generate (publik/OWNER)' },
    { name: 'CMS', description: 'Kategori, artikel, publikasi (publik read untuk PUBLISHED)' },
    { name: 'Dakwah Digital', description: 'Konten dakwah, approval/publish, pendaftaran event' },
    { name: 'Daerah Binaan', description: 'Daerah binaan dan laporan bulanan' },
    { name: 'Pesantren Ramadan', description: 'Sekolah mitra, bank materi, penugasan, laporan harian, umpan balik' },
    { name: 'Audit', description: 'Audit log (admin)' },
    { name: 'Public', description: 'Endpoint publik (verifikasi surat, event, jadwal, artikel)' },
  ]

  await writeSpec(path.join(process.cwd(), 'openapi', 'v1.json'), doc, 'json')

  await generateModuleSpec({ title: 'LIM API — Letters', description: 'Kontrak API modul persuratan (letter).', out: 'letter.yaml', tags: [{ name: 'Letters', description: 'Persuratan' }, { name: 'Uploads', description: 'Upload lampiran (presign R2/S3)' }], register: registerLetterOpenApi })
  await generateModuleSpec({ title: 'LIM API — Wajib Khidmah', description: 'Kontrak API modul Wajib Khidmah.', out: 'wajib-khidmah.yaml', tags: [{ name: 'Wajib Khidmah', description: 'Penugasan, laporan mingguan, evaluasi kasus & induk' }], register: registerWajibKhidmahOpenApi })
  await generateModuleSpec({ title: 'LIM API — Safari', description: 'Kontrak API modul Safari Ramadan.', out: 'safari.yaml', tags: [{ name: 'Safari', description: 'Titik, delegasi, jurnal harian, approval, laporan sidak' }], register: registerSafariOpenApi })
  await generateModuleSpec({ title: 'LIM API — Falak', description: 'Kontrak API modul Digital Falak.', out: 'falak.yaml', tags: [{ name: 'Falak', description: 'Jadwal shalat, konfigurasi, generate' }], register: registerFalakOpenApi })
  await generateModuleSpec({ title: 'LIM API — CMS', description: 'Kontrak API modul CMS/Portal.', out: 'cms.yaml', tags: [{ name: 'CMS', description: 'Kategori dan artikel' }], register: registerCmsOpenApi })
  await generateModuleSpec({ title: 'LIM API — Dakwah Digital', description: 'Kontrak API modul Dakwah Digital.', out: 'dakwah-digital.yaml', tags: [{ name: 'Dakwah Digital', description: 'Konten dan pendaftaran event' }], register: registerDakwahOpenApi })
  await generateModuleSpec({ title: 'LIM API — Daerah Binaan', description: 'Kontrak API modul Daerah Binaan.', out: 'daerah-binaan.yaml', tags: [{ name: 'Daerah Binaan', description: 'Daerah binaan dan laporan bulanan' }], register: registerDaerahBinaanOpenApi })
  await generateModuleSpec({ title: 'LIM API — Pesantren Ramadan', description: 'Kontrak API modul Pesantren Ramadan.', out: 'pesantren-ramadan.yaml', tags: [{ name: 'Pesantren Ramadan', description: 'Sekolah, materi, penugasan, laporan, umpan balik' }], register: registerPesantrenOpenApi })
  await generateModuleSpec({ title: 'LIM API — Audit', description: 'Kontrak API audit log.', out: 'audit.yaml', tags: [{ name: 'Audit', description: 'Audit log (admin)' }], register: registerAuditOpenApi })
  await generateModuleSpec({ title: 'LIM API — Public', description: 'Endpoint publik.', out: 'public.yaml', tags: [{ name: 'Public', description: 'Verifikasi surat dan endpoint publik lain' }], register: registerPublicOpenApi })
}

main().catch((err) => {
  console.error('[api-spec] failed', err)
  process.exit(1)
})
