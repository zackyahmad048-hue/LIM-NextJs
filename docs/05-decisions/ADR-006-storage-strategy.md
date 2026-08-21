# ADR-006: Storage Strategy

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Accepted

**Date:** 2026-07-14

---

# Context

LIM Digital Platform mengelola berbagai jenis data, antara lain:

- Data transaksional
- Dokumen
- Sertifikat
- Gambar
- Lampiran surat
- Media CMS
- Backup
- Audit Log

Setiap jenis data memiliki karakteristik penyimpanan yang berbeda sehingga tidak tepat apabila seluruh data disimpan menggunakan pendekatan yang sama.

Diperlukan strategi penyimpanan yang terstruktur, aman, dan mudah dikembangkan.

---

# Decision

LIM Digital Platform menggunakan **Hybrid Storage Strategy**.

Jenis penyimpanan:

- Relational Database
- Object Storage
- Cache Storage
- Backup Storage

Setiap jenis data disimpan pada media yang sesuai dengan karakteristiknya.

---

# Rationale

Strategi ini dipilih karena:

- Database lebih optimal untuk data relasional.
- Object Storage lebih efisien untuk file besar.
- Cache meningkatkan performa.
- Backup dipisahkan dari data operasional.

---

# Storage Architecture

```text id="adr00601"
Application

├── PostgreSQL
├── Object Storage
├── Redis
└── Backup Storage
```

---

# Storage Allocation

## PostgreSQL

Digunakan untuk:

- User
- Organization
- Program
- Letter
- Certificate
- Knowledge
- Notification
- Falak
- Audit Log
- Settings

---

## Object Storage

Digunakan untuk:

- Images
- Documents
- Certificate PDF
- Letter Attachment
- CMS Media
- Backup File

---

## Redis

Digunakan untuk:

- Cache
- Session
- Queue
- Rate Limiting
- Temporary Data

---

## Backup Storage

Digunakan untuk:

- Database Backup
- Storage Backup
- Configuration Backup
- Disaster Recovery

---

# File Storage Rules

File yang diunggah:

- Menggunakan UUID sebagai nama file.
- Metadata disimpan di Database.
- File fisik disimpan di Object Storage.
- MIME Type divalidasi.
- Ukuran file divalidasi.

---

# Storage Provider

Provider bersifat abstrak melalui **Storage Port**.

Implementasi dapat berupa:

```text id="adr00602"
Local Storage

S3 Compatible Storage

MinIO

Azure Blob Storage

Google Cloud Storage
```

Business Rules tidak mengetahui provider yang digunakan.

---

# Cache Strategy

Cache digunakan untuk:

- Dashboard
- Settings
- Permission
- Frequently Accessed Data

Cache bukan merupakan **Source of Truth**.

---

# Security

Storage wajib menerapkan:

- Encryption at Rest (jika didukung).
- HTTPS saat transfer.
- Access Control.
- Audit Logging.
- Backup berkala.

---

# Alternatives Considered

## Database Only

Kelebihan:

- Sederhana.

Kekurangan:

- Tidak efisien untuk file besar.
- Database cepat membesar.

---

## File System Only

Kelebihan:

- Mudah diimplementasikan.

Kekurangan:

- Sulit diskalakan.
- Metadata tidak terstruktur.

---

## Cloud Storage Only

Kelebihan:

- Sangat scalable.

Kekurangan:

- Ketergantungan tinggi pada provider.
- Biaya operasional lebih besar.

---

# Consequences

Keuntungan:

- Performa lebih baik.
- Mudah mengganti Storage Provider.
- Skalabilitas tinggi.
- Selaras dengan Hexagonal Architecture.

Konsekuensi:

- Memerlukan sinkronisasi metadata.
- Membutuhkan strategi backup yang baik.
- Pengelolaan Storage menjadi lebih kompleks.

---

# Related Decisions

- ADR-002 Clean Architecture
- ADR-003 Repository Pattern
- ADR-007 Notification Architecture

---

# References

- Architecture Documentation (`02-architecture/hexagonal-architecture.md`)
- AWS Well-Architected Framework – Storage Best Practices

---

# Status

**Accepted**

---

# Amendments

**Tanggal:** 2026-08-06

Hasil grilling backend/database/storage disepakati sebagai berikut:

1. **Implementasi awal Object Storage = Google Drive** (bukan S3/MinIO). Provider diakses melalui **Storage Port** abstrak sehingga tetap bisa diganti tanpa mengubah Business Rules.
2. **Metadata file disimpan di PostgreSQL** melalui tabel `media` (Media Domain): originalName, mimeType, size, checksum, storageKey, driveFileId, access, uploadedBy, deletedAt.
3. **File privat default**: file privat (surat, sertifikat, lampiran) diserve lewat **proxy route aplikasi** dengan session + RBAC. File publik (media situs, logo, avatar) diserve lewat link share Drive "anyone with link".
4. **Artefak verifikasi surat** diserve lewat **route code-gated** (`/api/v1/verifikasi/surat/[kode]/file`): kode verifikasi berperan sebagai bearer credential; file asli tetap privat di belakang RBAC.
5. **Penamaan file = UUID** + folder per entitas; nama asli disimpan di metadata.
6. **Cache**: implementasi awal memakai Next.js Data Cache (`unstable_cache` + `revalidateTag`). Redis ditunda ke roadmap (hanya diperlukan saat ada queue/background job/rate-limit skala besar).

---

**Tanggal:** 2026-08-07

1. **Provider Object Storage diganti dari Google Drive → Vercel Blob.** Service account tidak punya storage quota di Google Drive konsumen (kebijakan Google April 2025), sehingga `files.create` selalu gagal 403. Adapter Blob dipakai via Storage Port yang sama (`modules/shared/infrastructure/storage/`).
2. **Blob disimpan `access: "private"` + `addRandomSuffix: true`.** `fileId` yang tersimpan di DB = pathname blob (mis. `nama_xxxx.pdf`). Seluruh baca/unduh lewat proxy route aplikasi (media + verifikasi), tidak pernah akses publik ke store.
3. **Template Google Docs dihapus.** Pembuatan doc = `files.copy` = membuat file → ikut terblokir kuota. Penggantinya **tampilan cetak in-app** (`/admin/secretariat/.../[id]/cetak`, `print:` CSS + `window.print()`).
4. **Google tersisa hanya Sheets** untuk reporting (`reporting-sync`): tulis `values.update`/`addSheet` ke spreadsheet yang di-share, tidak membuat file baru → tetap berfungsi dengan SA.
5. **Kolom `*DriveFileId` di-rename menjadi `*FileId`** (`originalFileId`, `processedFileId`, `qrFileId`); kolom `googleDocId`/`googleDocUrl` dihapus dari `OutgoingMail` & `AdministrativeDocument`.

---

# Acceptance Criteria

- Data relasional disimpan di PostgreSQL.
- File disimpan di Object Storage.
- Cache menggunakan Redis.
- Storage Provider dapat diganti tanpa mengubah Business Rules.
- Storage Strategy menjadi standar penyimpanan LIM Digital Platform.
