# Modul Integrasi Google (Sheets)

Infrastruktur bersama untuk integrasi Google Workspace. Peran per layanan:

- **Google Sheets** → _reporting projection_ (satu arah PG → Sheets) untuk dashboard & laporan tim non-teknis, diurus modul `reporting-sync`. **Bukan** database operasional.

> Integrasi **Google Docs** (template surat) dan **Google Drive** (storage) dihapus. Dokumen surat kini dicetak/di-PDF in-app (`/admin/secretariat/.../[id]/cetak`), dan penyimpanan file memakai **Vercel Blob** — lihat `docs/09-infrastructure/storage-infrastructure.md`.

Lokasi: `modules/shared/infrastructure/google/`

## Isi Modul

| File             | Fungsi                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `config.ts`      | Baca env: service account, spreadsheet ID.                                                                                   |
| `client.ts`      | Auth JWT service account via `googleapis` → klien `sheets`.                                                                  |
| `errors.ts`      | `GoogleApiError` dengan kode terstruktur (`UNAUTHENTICATED`, `NOT_FOUND`, `RATE_LIMITED`, `TIMEOUT`, `CONFLICT`, `UNKNOWN`). |
| `spreadsheet.ts` | Helper generik: `readRows`, `appendRow`, `updateRowById`, `findRowIndexById`, `ensureSheetTab`, `overwriteSheetValues`.      |

Aturan:

- Pemanggilan Google hanya di lapisan ini dan di modul `reporting-sync`.
- Prisma tetap hanya disentuh di `infrastructure/`.

## Arsitektur

- **Single Source of Truth**: PostgreSQL (Neon). Aplikasi adalah satu-satunya penulis.
- **Reporting**: modul `reporting-sync` memproyeksikan laporan (PG → Sheets) sesuai definisi per-laporan, dijalankan via Vercel Cron + trigger manual di admin.
- **Storage**: Storage Port di `modules/shared/infrastructure/storage/` dengan adapter Vercel Blob.

## Setup

### 1. Buat service account di Google Cloud

1. Buka [Google Cloud Console](https://console.cloud.google.com/) → buat/pilih project.
2. Aktifkan API berikut: **Google Sheets API**.
3. IAM & Admin → Service Accounts → Buat service account (mis. `lim-integration`).
4. Buat & unduh key JSON (Keys → Add Key → Create new key → JSON).

> Catatan: service account **tidak bisa membuat file di Google Drive** konsumen (tidak ada storage quota, kebijakan Google). Karena reporting hanya menulis `values.update`/`addSheet` ke spreadsheet yang di-share (bukan membuat file baru), Sheets tetap berfungsi.

### 2. Siapkan spreadsheet

1. Buat spreadsheet **Pendataan** dan **Falak** untuk laporan (dikelola modul `reporting-sync`).

### 3. Share akses

- Share spreadsheet ke `GOOGLE_SERVICE_ACCOUNT_EMAIL` sebagai **Editor**.

### 4. Isi env (`.env`)

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL="nama@project.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_PENDATAAN_ID="<id spreadsheet pendataan>"
GOOGLE_SPREADSHEET_FALAK_ID="<id spreadsheet falak>"
BLOB_READ_WRITE_TOKEN="<token Vercel Blob untuk storage file>"
CRON_SECRET="<secret untuk route /api/cron/reporting-sync>"
```

## Reporting-sync (modul `modules/reporting`)

- Proyeksi ringkasan (PG → Sheets) ditulis ke tab `Ringkasan` di tiap spreadsheet, satu arah & idempotent (clear + overwrite).
- Pemicu: Vercel Cron setiap hari 06:00 UTC (`vercel.json` → `/api/cron/reporting-sync?secret=$CRON_SECRET`) dan tombol manual di Admin → Laporan (permission `reports.sync`).
- Jika `CRON_SECRET` diisi, route cron mewajibkan secret (via header `Authorization: Bearer …` / `x-cron-secret` / query `?secret=`). Tanpa secret, route terbuka — khusus dev.

Catatan:

- ID spreadsheet = bagian dari URL (`https://docs.google.com/spreadsheets/d/<ID>/...`).
- Private key: salin dari file JSON service account; pastikan `\n` tersimpan literal `\n` (bukan newline asli).
- Tanpa kredensial, aplikasi tetap berjalan memakai PostgreSQL; fitur reporting-sync nonaktif (opsional).

## Format Nilai di Sheets (reporting)

- `Date` → string ISO 8601.
- JSON (notes/details/parameters) → string JSON.

## Error Handling

- Semua pemanggilan lewat `client.ts`; kesalahan dibungkus `GoogleApiError`.
- Retry 1× dengan backoff untuk `RATE_LIMITED` dan `TIMEOUT`.

## Referensi

- ADR-006 Storage Strategy
- docs/09-infrastructure/storage-infrastructure.md
