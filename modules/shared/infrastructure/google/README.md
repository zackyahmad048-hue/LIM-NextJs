# Modul Integrasi Google (Sheets & Docs)

Infrastruktur bersama untuk integrasi Google Workspace: Google Sheets sebagai database pendataan (sekretariat & falak) dan Google Docs untuk dokumen surat editable.

Lokasi: `modules/shared/infrastructure/google/`

## Isi Modul

| File | Fungsi |
|---|---|
| `config.ts` | Baca env: service account, spreadsheet ID, template doc ID. |
| `client.ts` | Auth JWT service account via `googleapis` → klien `sheets`, `docs`, `drive`. |
| `errors.ts` | `GoogleApiError` dengan kode terstruktur (`UNAUTHENTICATED`, `NOT_FOUND`, `RATE_LIMITED`, `TIMEOUT`, `CONFLICT`, `UNKNOWN`). |
| `spreadsheet.ts` | Helper generik: `readRows`, `appendRow`, `updateRowById`, `findRowIndexById`. |
| `sheet-repository.ts` | `SheetsBaseRepository` — konversi baris ↔ entitas (Date, number, nullable, JSON). |
| `google-doc.ts` | `createDocumentFromTemplate(templateId, values)` → copy template + isi placeholder `{{key}}`. |

Aturan:

- Pemanggilan Google hanya di lapisan ini dan di repository `.sheets.ts`.
- Prisma tetap hanya disentuh di `infrastructure/`.

## Arsitektur

- Repository Sheets mengimplementasikan interface domain yang sama dengan repository Prisma:
  - `modules/secretariat/infrastructure/repository.sheets.ts` → `SheetsSecretariatRepository`
  - `modules/falak/infrastructure/repository.sheets.ts` → `SheetsFalak*Repository` (5 entitas)
- Pemilihan implementasi via env `DATA_SOURCE`:
  - `sheets` → semua pendataan sekretariat & falak dibaca/ditulis ke Google Sheets.
  - `postgres` (default bila tidak diisi) → fallback ke Prisma/PostgreSQL.
- Hisab falak selalu di PostgreSQL (tidak ikut switch).
- **Imsakiyah** selalu di PostgreSQL — datanya diisi lewat impor dari Google Sheet (`npm run import:imsakiyah`, atau tombol di `/admin/falak/imsakiyah`), bukan dibaca langsung dari sheet.
- Data publik falak di-cache server (`unstable_cache`, tag `falak`, revalidate 3600s).

## Setup

### 1. Buat service account di Google Cloud

1. Buka [Google Cloud Console](https://console.cloud.google.com/) → buat/pilih project.
2. Aktifkan API berikut: **Google Sheets API**, **Google Docs API**, **Google Drive API**.
3. IAM & Admin → Service Accounts → Buat service account (mis. `lim-integration`).
4. Buat & unduh key JSON (Keys → Add Key → Create new key → JSON).

### 2. Siapkan spreadsheet & template

1. Buat 2 spreadsheet: **Pendataan** dan **Falak**.
2. Buat tab dengan nama & header sesuai konvensi (§ model data di spec):

   - Pendataan: `SuratMasuk`, `SuratKeluar`, `Disposisi`, `DokumenAdministrasi`, `ArsipDokumen`, `Agenda`.
   - Falak: `PrayerTime`, `Qibla`, `HijriCalendar`, `Rukyat`, `Eclipse`.

3. Baris pertama = header kolom (nama field entitas, kolom pertama `id`). Baris berikutnya = record.
4. Buat 2 template Google Docs (surat keluar & dokumen administrasi) berisi placeholder `{{key}}`, contoh: `{{nomorSurat}}`, `{{tanggalSurat}}`, `{{perihal}}`, `{{penerima}}`, `{{isi}}`.

### 3. Share akses

- Share **kedua spreadsheet** dan **kedua template doc** ke `GOOGLE_SERVICE_ACCOUNT_EMAIL` sebagai **Editor**.
- Service account juga butuh akses **Drive** (untuk `files.copy`) — beri akses via folder/shared drive jika template dibatasi.

### 4. Isi env (`.env`)

```env
DATA_SOURCE=sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL="nama@project.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_PENDATAAN_ID="<id spreadsheet pendataan>"
GOOGLE_SPREADSHEET_FALAK_ID="<id spreadsheet falak>"
GOOGLE_DOC_TEMPLATE_SURAT_KELUAR_ID="<id template doc surat keluar>"
GOOGLE_DOC_TEMPLATE_DOK_ADMIN_ID="<id template doc dokumen administrasi>"
```

Alias lama (tetap didukung, khusus untuk setup & impor Imsakiyah):

```env
GOOGLE_CLIENT_EMAIL="nama@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID="<id spreadsheet imsakiyah>"
```

Catatan:

- ID spreadsheet/doc = bagian dari URL (`https://docs.google.com/spreadsheets/d/<ID>/...`).
- Private key: salin dari file JSON service account; pastikan `\n` tersimpan literal `\n` (bukan newline asli).
- Tanpa kredensial, aplikasi tetap berjalan memakai PostgreSQL (`DATA_SOURCE` kosong → postgres).
- Imsakiyah: `GOOGLE_SHEET_ID` (atau `GOOGLE_SPREADSHEET_FALAK_ID`) menunjuk ke sheet jadwal imsakiyah; impor lewat `npm run import:imsakiyah` atau aksi admin.

## Format Nilai di Sheets

- `Date` → string ISO 8601.
- JSON (notes/details/parameters) → string JSON.
- Sel kosong → dibaca sebagai `null`.
- `createdAt`, `updatedAt`, `deletedAt` untuk soft-delete bila entitas punya.

## Error Handling

- Semua pemanggilan lewat `client.ts`; kesalahan dibungkus `GoogleApiError`.
- Retry 1× dengan backoff untuk `RATE_LIMITED` dan `TIMEOUT`.
- Kegagalan generate Google Docs tidak menggagalkan penyimpanan record — hanya `googleDocId`/`googleDocUrl` yang tetap kosong.

## Referensi

- Spec: `docs/superpowers/specs/2026-07-31-google-sheets-docs-integration-design.md`
