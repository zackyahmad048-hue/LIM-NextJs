# ADR-006: Storage Strategy

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Accepted

**Date:** 2026-07-14

---

# Context

LIM Digital Platform mengelola berbagai jenis data, antara lain:

* Data transaksional
* Dokumen
* Sertifikat
* Gambar
* Lampiran surat
* Media CMS
* Backup
* Audit Log

Setiap jenis data memiliki karakteristik penyimpanan yang berbeda sehingga tidak tepat apabila seluruh data disimpan menggunakan pendekatan yang sama.

Diperlukan strategi penyimpanan yang terstruktur, aman, dan mudah dikembangkan.

---

# Decision

LIM Digital Platform menggunakan **Hybrid Storage Strategy**.

Jenis penyimpanan:

* Relational Database
* Object Storage
* Cache Storage
* Backup Storage

Setiap jenis data disimpan pada media yang sesuai dengan karakteristiknya.

---

# Rationale

Strategi ini dipilih karena:

* Database lebih optimal untuk data relasional.
* Object Storage lebih efisien untuk file besar.
* Cache meningkatkan performa.
* Backup dipisahkan dari data operasional.

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

* User
* Organization
* Program
* Letter
* Certificate
* Knowledge
* Notification
* Falak
* Audit Log
* Settings

---

## Object Storage

Digunakan untuk:

* Images
* Documents
* Certificate PDF
* Letter Attachment
* CMS Media
* Backup File

---

## Redis

Digunakan untuk:

* Cache
* Session
* Queue
* Rate Limiting
* Temporary Data

---

## Backup Storage

Digunakan untuk:

* Database Backup
* Storage Backup
* Configuration Backup
* Disaster Recovery

---

# File Storage Rules

File yang diunggah:

* Menggunakan UUID sebagai nama file.
* Metadata disimpan di Database.
* File fisik disimpan di Object Storage.
* MIME Type divalidasi.
* Ukuran file divalidasi.

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

* Dashboard
* Settings
* Permission
* Frequently Accessed Data

Cache bukan merupakan **Source of Truth**.

---

# Security

Storage wajib menerapkan:

* Encryption at Rest (jika didukung).
* HTTPS saat transfer.
* Access Control.
* Audit Logging.
* Backup berkala.

---

# Alternatives Considered

## Database Only

Kelebihan:

* Sederhana.

Kekurangan:

* Tidak efisien untuk file besar.
* Database cepat membesar.

---

## File System Only

Kelebihan:

* Mudah diimplementasikan.

Kekurangan:

* Sulit diskalakan.
* Metadata tidak terstruktur.

---

## Cloud Storage Only

Kelebihan:

* Sangat scalable.

Kekurangan:

* Ketergantungan tinggi pada provider.
* Biaya operasional lebih besar.

---

# Consequences

Keuntungan:

* Performa lebih baik.
* Mudah mengganti Storage Provider.
* Skalabilitas tinggi.
* Selaras dengan Hexagonal Architecture.

Konsekuensi:

* Memerlukan sinkronisasi metadata.
* Membutuhkan strategi backup yang baik.
* Pengelolaan Storage menjadi lebih kompleks.

---

# Related Decisions

* ADR-002 Clean Architecture
* ADR-003 Repository Pattern
* ADR-007 Notification Architecture

---

# References

* Architecture Documentation (`02-architecture/hexagonal-architecture.md`)
* AWS Well-Architected Framework – Storage Best Practices

---

# Status

**Accepted**

---

# Acceptance Criteria

* Data relasional disimpan di PostgreSQL.
* File disimpan di Object Storage.
* Cache menggunakan Redis.
* Storage Provider dapat diganti tanpa mengubah Business Rules.
* Storage Strategy menjadi standar penyimpanan LIM Digital Platform.
