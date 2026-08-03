# Desain — Integrasi Google Sheets & Docs (LIM Digital Platform)

**Tanggal:** 2026-07-31
**Status:** Draft untuk review
**Modul terdampak:** `modules/secretariat`, `modules/falak`, `modules/shared`, `app/(dashboard)/admin/secretariat`, `app/(dashboard)/admin/falak`

---

## 1. Latar Belakang & Tujuan

Saat ini seluruh data disimpan di PostgreSQL (Prisma). Organisasi ingin memanfaatkan Google Workspace:

- **Google Sheets** menjadi database utama untuk **pendataan** (sekretariat) dan **data falak**.
- **Google Docs** menjadi dokumen surat yang **editable** (surat keluar & dokumen administrasi), dibuat dari template dengan placeholder terisi otomatis.
- **Hybrid:** data non-pendataan tetap di PostgreSQL (auth, user, roles, CMS, settings, media, program, dan **hisab** falak).

Tujuan:

1. Data sekretariat (surat masuk/keluar, disposisi, dokumen administrasi, arsip, agenda) dapat dikelola dari UI admin dengan penyimpanan di Google Sheets.
2. Data falak (prayer time, qibla, hijri calendar, rukyat, eclipse) tersimpan di Google Sheets; hisab tetap di PostgreSQL.
3. Surat keluar & dokumen administrasi menghasilkan dokumen Google Docs dari template (copy template + isi placeholder).
4. Arsitektur DDD tetap terjaga: domain, service, queries, dan UI tidak berubah — hanya implementasi infrastruktur repository yang diganti.
5. Fallback ke PostgreSQL tersedia via env (`DATA_SOURCE=postgres`).

---

## 2. Cakupan (Scope)

### Masuk cakupan

- Modul infra Google bersama: `modules/shared/infrastructure/google/`.
- Implementasi repository Sheets untuk:
  - Sekretariat: IncomingMail, OutgoingMail, Disposition, AdministrativeDocument, AgendaBook, DocumentArchive.
  - Falak: PrayerTime, Qibla, HijriCalendar, Rukyat, Eclipse.
- Pemilihan implementasi via `DATA_SOURCE` (default `sheets`).
- Generate dokumen Google Docs dari template untuk surat keluar & dokumen administrasi.
- UI admin pendukung minimal:
  - Tombol "Buka di Google Docs" pada detail surat.
  - Indikator sinkronisasi Google Sheets (opsional, badge status).
  - Kolom tautan dokumen pada form/list yang relevan.
- Panduan setup: service account, share spreadsheet/template, env vars.
- Pengujian manual + `npm run check`.

### Tidak masuk cakupan (spec terpisah)

- Perombakan UI/UX seluruh platform (spec lanjutan: Phase 1–2 DESIGN.md, lalu Phase 3–4).
- Migrasi data historis dari PostgreSQL ke Sheets.
- Sinkronisasi dua arah otomatis saat spreadsheet diedit manual di luar sistem.

---

## 3. Arsitektur

### 3.1 Modul baru: `modules/shared/infrastructure/google/`

```
modules/shared/infrastructure/google/
  config.ts          # env: service account, spreadsheet IDs, template doc IDs, DATA_SOURCE
  client.ts          # auth JWT service account via googleapis → exports sheets, docs, drive
  errors.ts          # GoogleApiError (UNAUTHENTICATED, NOT_FOUND, RATE_LIMITED, TIMEOUT, CONFLICT)
  spreadsheet.ts     # helper generik: readRows<T>, appendRow, updateRow, deleteRow, findRowById
  google-doc.ts      # createDocumentFromTemplate(templateId, values) → { id, url }
```

Aturan:

- Prisma tetap hanya disentuh di `infrastructure/`; pemanggilan Google juga **hanya** di lapisan ini.
- `spreadsheet.ts` menyediakan mapping baris ↔ entitas (header baris pertama, 1 tab = 1 entitas).

### 3.2 Implementasi repository baru

- `modules/falak/infrastructure/repository.sheets.ts`:
  - `SheetsFalakPrayerTimeRepository`, `SheetsFalakQiblaRepository`, `SheetsFalakHijriCalendarRepository`, `SheetsFalakRukyatRepository`, `SheetsFalakEclipseRepository` — mengimplementasikan interface dari `modules/falak/domain/repository.ts`.
- `modules/secretariat/infrastructure/repository.sheets.ts`:
  - `SheetsSecretariatRepository` — mengimplementasikan `SecretariatRepository` dari `modules/secretariat/domain/repository.ts`.

### 3.3 Pemilihan implementasi

- Di `modules/falak/infrastructure/repository.ts` dan `modules/secretariat/infrastructure/repository.ts`, ekspor singleton repo memilih implementasi:

```ts
const useSheets = process.env.DATA_SOURCE === "sheets"; // default "sheets"
export const falakRukyatRepository = useSheets
  ? new SheetsFalakRukyatRepository()
  : new PrismaFalakRukyatRepository();
```

- Kelas implementasi Prisma tetap diekspor (fallback/testing).
- Hisab falak selalu Prisma (tidak ikut switch).
- Domain interface, service, queries, validations **tidak berubah**.

---

## 4. Model Data Google Sheets

### 4.1 Dua spreadsheet (ID via env)

| Spreadsheet                       | Tab                                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
| `GOOGLE_SPREADSHEET_PENDATAAN_ID` | `SuratMasuk`, `SuratKeluar`, `Disposisi`, `DokumenAdministrasi`, `ArsipDokumen`, `Agenda` |
| `GOOGLE_SPREADSHEET_FALAK_ID`     | `PrayerTime`, `Qibla`, `HijriCalendar`, `Rukyat`, `Eclipse`                               |

### 4.2 Format tab

- Baris pertama = header kolom (nama field entitas).
- Tiap baris berikutnya = satu record.
- Kolom pertama selalu `id` (string unik; tetap dipakai ID Prisma-style bila perlu kompatibilitas).
- Kolom `createdAt`, `updatedAt`, `deletedAt` untuk soft-delete bila entitas punya.
- Kolom `status` untuk transisi status (mis. rukyat: `DRAFT` → `VERIFIED` → `CONFIRMED` → `ARCHIVED`).

### 4.3 Konvensi nilai

- `Date` → string ISO 8601.
- JSON (notes/details/parameters) → string JSON.
- Nilai kosong → sel kosong; dibaca sebagai `null`.

### 4.4 Filtering, search, paginasi

- Tidak ada SQL; semua pembacaan dilakukan via `spreadsheet.values.get` (baca kolom yang perlu), lalu filter/search in-memory, lalu paginasi manual (`slice`).
- Skala data sekretariat/falak kecil (ratusan–ribuan baris) → kinerja memadai.
- Optional: `readRows` hanya membaca rentang kolom yang diperlukan untuk performa.

---

## 5. Alur Surat Google Docs

### 5.1 Template

- 1 master template per jenis surat (Google Doc), berisi placeholder `{{key}}`:
  - Surat keluar: `GOOGLE_DOC_TEMPLATE_SURAT_KELUAR_ID`.
  - Dokumen administrasi: `GOOGLE_DOC_TEMPLATE_DOK_ADMIN_ID`.
- Template dibagikan (share edit/view) ke email service account saat setup.

### 5.2 Alur `buatSurat`/`buatDokumen`

1. Server action → service → repository: simpan record (nomor, perihal, dst.) ke Sheets.
2. Service memanggil `createGoogleDocFromTemplate(templateId, values)`:
   - Drive API `files.copy` → dokumen baru (judul: nomor/perihal surat).
   - Docs API baca konten template → identifikasi `{{placeholder}}` → `documents.batchUpdate` (replaceAllText) dengan nilai dari record.
   - (Opsional) `permissions.create` untuk mengatur akses dokumen.
3. `googleDocId` & `googleDocUrl` disimpan ke kolom record di Sheets (update baris).
4. UI detail menampilkan tombol **"Buka di Google Docs"** (target `_blank`).

### 5.3 Penanganan placeholder hilang

- Placeholder yang tidak terisi nilainya dibiarkan apa adanya (tidak dihapus), agar operator bisa melengkapi manual di Google Docs.

---

## 6. Konfigurasi & Kredensial

### 6.1 Env vars (`.env`)

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
GOOGLE_SPREADSHEET_PENDATAAN_ID=
GOOGLE_SPREADSHEET_FALAK_ID=
GOOGLE_DOC_TEMPLATE_SURAT_KELUAR_ID=
GOOGLE_DOC_TEMPLATE_DOK_ADMIN_ID=
DATA_SOURCE=sheets
```

- Private key dari JSON service account (ganti `\n` literal sesuai format).
- `.env.example` diperbarui; dokumen env disertakan di README modul.

### 6.2 Dependensi

- Tambah `googleapis` (official Google API Node client) ke `dependencies`.
- `@types/googleapis` tidak diperlukan (bundle types).

### 6.3 Setup Google Cloud (panduan di spec implementasi)

1. Aktifkan API: Google Sheets API, Google Docs API, Google Drive API.
2. Buat service account + unduh JSON key.
3. Share spreadsheet & template doc ke `GOOGLE_SERVICE_ACCOUNT_EMAIL` (editor).
4. Isi env vars.

---

## 7. Error Handling & Caching

### 7.1 Error handling

- Semua panggilan Google lewat `client.ts`; kesalahan dibungkus `GoogleApiError` dengan kode terstruktur.
- Service menerjemahkan `GoogleApiError` menjadi pesan ramah pengguna (dikembalikan server action → toast sonner).
- Retry 1× dengan backoff singkat untuk `RATE_LIMITED` dan `TIMEOUT`.
- Jika Google tidak tersedia saat write: gagal dengan pesan jelas; data tidak ditulis parsial (urutan: tulis Sheets sukses → baru generate doc; kegagalan doc tidak menggagalkan penyimpanan record, hanya menandai `googleDocId` kosong).

### 7.2 Caching

- Data **publik falak** (prayer times, hijriah, gerhana, qibla) di-cache di sisi server (`unstable_cache`/fetch `revalidateTag`) untuk mengurangi round-trip ke Sheets.
- Data admin dibaca langsung (butuh fresh).

---

## 8. UI Admin Pendukung (minimal)

- Detail surat keluar & dokumen administrasi: menampilkan tombol "Buka di Google Docs" bila `googleDocUrl` ada; tombol "Buat Dokumen" bila belum.
- List pages sekretariat & falak: tidak ada perubahan struktural besar; kolom status tetap seperti sekarang.
- Badge kecil "Sheets" pada header modul yang memakai Sheets (opsional).

> Perombakan UI/UX menyeluruh → spec terpisah.

---

## 9. Verifikasi & Pengujian

Gate: `npm run check` (lint + typecheck). Tidak ada test suite; verifikasi manual:

1. `npm run dev`, login admin.
2. Data sekretariat & falak muncul dari Sheets (baca).
3. Buat/ubah data → cek baris baru/update di Google Sheets UI.
4. Transisi status rukyat → kolom status berubah di Sheets.
5. Generate surat → dokumen Google Docs baru terbuat, placeholder terisi.
6. `DATA_SOURCE=postgres` → aplikasi tetap berfungsi (fallback).
7. Public API falak (`/api/v1/falak/*`) tetap mengembalikan data.

---

## 10. Risiko & Mitigasi

| Risiko                                  | Mitigasi                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------- |
| Sheets lambat (HTTP)                    | Cache data publik falak; baca hanya kolom yang perlu                      |
| Rate limit API                          | Retry + backoff; volume kecil                                             |
| Placeholder tidak cocok dengan template | Konvensi penamaan `{{key}}` didokumentasikan; nilai hilang dibiarkan utuh |
| Kredensial bocor                        | Private key hanya di env (server), bukan di repo; gitignore `.env`        |
| Skema tab berubah manual                | Header baris pertama = sumber kebenaran kolom; dokumentasi di README      |

---

## 11. Referensi

- Modul: `modules/secretariat/`, `modules/falak/`, `modules/shared/infrastructure/`
- Docs domain: `docs/01-domains/07-secretariat/`, `docs/01-domains/08-letter/`, `docs/01-domains/14-falak/`
- DESIGN.md (audit UI/UX) untuk spec lanjutan
