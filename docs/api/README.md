# API Contract v1 — LIM Digital Platform

Dokumen ini adalah pintu masuk kontrak API REST `/api/v1` untuk integrasi web, mobile, pihak ketiga, dan agen AI.

## Prinsip

- **Sumber kebenaran:** Zod schema di `modules/<domain>/domain/` dan DTO di `modules/<domain>/presentation/dto/`.
- **Spec mesin:** OpenAPI 3.1 dihasilkan otomatis ke `openapi/v1.json` (gabungan) dan `openapi/<modul>.yaml` (per modul).
- **Bahasa:** spesifikasi OpenAPI berbahasa Inggris (konvensi tooling), penjelasan bisnis berbahasa Indonesia.
- **Tidak ada tipe Prisma mentah** di respons API; semua respons lewat DTO Zod.

## Autentikasi

- **Web (first-party):** session cookie Better Auth (`better-auth.session_token`).
- **Mobile/desktop/third-party/AI:** `Authorization: Bearer <api_key>` (API key Better Auth). Header `X-API-Key` juga diterima.
- Endpoint publik ditandai `security: []` dan memiliki rate limit lebih ketat.

## Envelope respons

Sukses:

```json
{ "success": true, "data": {}, "meta": {}, "requestId": "..." }
```

Gagal:

```json
{ "success": false, "error": "...", "code": "VALIDATION_ERROR", "errors": {"field": ["..."]}, "requestId": "..." }
```

`code` stabil dan dipakai klien untuk penanganan mesin. `requestId` untuk korelasi log.

## Pagination

Offset: `page` (mulai 1), `limit` (maks 100, default 20). Meta: `{ page, limit, total, totalPages }`.

## Idempotensi

Operasi transisi/publikasi sensitif menerima header `Idempotency-Key` (8–128 karakter). Replay mengembalikan respons tersimpan.

## Otorisasi

Izin dievaluasi dari `role` + `accountType` + scope organisasi (dan penugasan aktif bila relevan). Identitas pengisi akun organisasi (`namaPengisi`, `jabatanPengisi`) diturunkan server dari akun, bukan dari client.

## Rate limit

- Berbasis Upstash Redis (sliding window), per IP dan per principal.
- Endpoint publik: batas lebih ketat.
- Respons `429` disertai `Retry-After`.

## Versi & deprecation

Path `/api/v1`. Perubahan breaking → `v2`. Deprecation diumumkan lewat header `Deprecation`/`Sunset` dan catatan di dokumen modul.

## Di luar lingkup (saat ini)

- **Inbound webhooks:** belum ada konsumen; tidak diekspos di kontrak v1.
- **Realtime** (`/api/realtime`, SSE/WS): bukan kontrak request/response OpenAPI, didokumentasikan terpisah bila diimplementasikan.

## Dokumen per modul

- `letter.md` — persuratan, upload lampiran (presign), log transisi (Batch 1, pilot).
- `wajib-khidmah.md` — penugasan, laporan mingguan, evaluasi kasus & induk (Batch 2).
- `safari.md` — titik, delegasi, jurnal harian, approval, laporan sidak (Batch 2).
- `pesantren-ramadan.md` — sekolah mitra, bank materi, penugasan, laporan harian, umpan balik (Batch 3).
- `falak.md` — jadwal shalat, konfigurasi, generate (Batch 3).
- `cms.md` — kategori & artikel portal (Batch 4).
- `dakwah-digital.md` — konten dakwah & pendaftaran event (Batch 4).
- `daerah-binaan.md` — daerah binaan & laporan bulanan (Batch 4).
- `audit.md` — audit log read-only (Batch 4).
- `public.md` — konsolidasi endpoint publik & verifikasi (Batch 5).

## Regenerasi spec

```bash
bun run api:spec
bun run api:spec:check
```

Jangan edit `openapi/v1.json` manual; ubah Zod/registrasi lalu regenerate.
