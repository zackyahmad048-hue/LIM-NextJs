# API Contract — Modul Persuratan (Letter)

**Status:** Batch 1 (pilot)  
**Base path:** `/api/v1`  
**Tag:** `Letters`, `Uploads`  
**Spec:** `openapi/letter.yaml`, gabungan `openapi/v1.json`

## Tujuan

Kontrak REST untuk pengelolaan surat (draft → review → approved → sent), log transisi, dan unggah lampiran. Server Action web tetap dipakai UI internal; route `/api/v1/letters*` melayani klien non-browser (mobile, integrasi, agen) dengan perilaku bisnis yang sama (use case bersama).

## Autentikasi & otorisasi

- **Auth:** session cookie (first-party) atau `Authorization: Bearer <api_key>` / `X-API-Key`.
- **Permission API key:** `letters:read`, `letters:write`, `uploads:write`.
- **RBAC (x-lim-auth):** OWNER/ADMIN_SEKRETARIAT (penuh), ADMIN_BIDANG_SAFARI & ADMIN_BIDANG_PESANTREN_RAMADAN (read/create), PW/PC (read/create/update sesuai scope). Guard runtime memakai matriks `modules/authorization/`.
- **Scope data:** pusat global. `shortcut:` model `Letter` belum memiliki `organizationId`, sehingga PW/PC saat ini dibatasi ke surat milik akun sendiri (`createdById`) sampai skema mendukung scope organisasi.
- **Identitas pengisi (akun organisasi):** tidak diterima dari client; diturunkan server dari sesi/akun saat relevan (audit/identitas). Route menolak field identitas pengisi dari payload.

## Endpoint

| Method | Path | Deskripsi | Idempotensi | Auth |
|---|---|---|---|---|
| GET | `/letters` | Daftar surat (offset `page`,`limit`, filter `status`,`type`,`q`) | - | wajib |
| POST | `/letters` | Buat surat (status awal `DIKETIK`) | - | wajib |
| GET | `/letters/{id}` | Detail surat (termasuk `isiSurat`) | - | wajib |
| PATCH | `/letters/{id}` | Ubah surat (hanya `DIKETIK`) | - | wajib |
| DELETE | `/letters/{id}` | Soft delete + audit | - | wajib |
| POST | `/letters/{id}/submit` | `DIKETIK` → `REVIEW` | `Idempotency-Key` | wajib |
| POST | `/letters/{id}/approve` | `REVIEW` → `APPROVED` | `Idempotency-Key` | wajib |
| POST | `/letters/{id}/send` | → `SENT` + nomor surat (transaksi serializable, counter per periode/level/kategori) | `Idempotency-Key` | wajib |
| GET | `/letters/{id}/logs` | Riwayat log status | - | wajib |
| POST | `/uploads/presign` | Presigned PUT URL S3-compatible (R2/Supabase Storage, 1 jam) | `Idempotency-Key` | wajib |

## Aturan bisnis penting

- Nomor surat dihasilkan **hanya** saat transisi ke `SENT`, via counter `LetterNumberCounter` (upsert + increment) dalam transaksi `Serializable`.
- `shortcut:` `categoryCode` surat saat ini `'H'` dan `levelCode` `'PP'` (pusat) sampai model surat memiliki kategori/level eksplisit.
- Periode: pakai `periodId` surat atau periode aktif.
- Perubahan isi hanya saat `DIKETIK`. Audit log dicatat untuk submit/approve/send/delete.

## Request/response (ringkas)

- **Create:** `{ type?, pengirim, penerima?, perihal, isiSurat }`
- **Update (PATCH):** subset `{ pengirim, penerima, perihal, isiSurat, fileUrl }`
- **List response:** `data: LetterSummary[]` + `meta: {page,limit,total,totalPages}` (tanpa `isiSurat`)
- **Detail response:** `data: Letter` (termasuk `isiSurat`)
- **Logs:** `data: LetterLog[]`
- **Envelope:** `{ success, data?, meta?, error?, errors?, code?, requestId }`
- **Presign:** `{ filename?, contentType, size, purpose }` → `{ key, uploadUrl, expiresIn, method, headers, maxBytes }` (PDF ≤5MB, JPEG/PNG ≤2MB). Butuh env `R2_*` (S3-compatible: R2 atau Supabase Storage — endpoint, region, access key/secret, bucket); jika belum dikonfigurasi mengembalikan `503`. `forcePathStyle` otomatis untuk endpoint non-R2.

## Kode error stabil

`UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `VALIDATION_ERROR`, `RATE_LIMITED`, `INTERNAL_ERROR`, `BAD_REQUEST`.

## Contoh

```bash
# List
curl -H "Authorization: Bearer <key>" "/api/v1/letters?page=1&limit=20"

# Create
curl -X POST -H "Authorization: Bearer <key>" -H "Content-Type: application/json" \
  -d '{"pengirim":"PP LIM","perihal":"Undangan","isiSurat":"Isi surat minimal sepuluh karakter"}' \
  "/api/v1/letters"

# Send (idempotent)
curl -X POST -H "Authorization: Bearer <key>" -H "Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  "/api/v1/letters/<id>/send"
```

## Catatan implementasi

- Route handler memanggil use case bersama `modules/letter/application/letter-operations.ts` (→ `infrastructure/letter.service.ts`), bukan Prisma langsung.
- UI web tetap memakai Server Action di `modules/letter/presentation/actions/*` yang kini juga memanggil use case bersama.
