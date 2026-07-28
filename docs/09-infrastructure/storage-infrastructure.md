# Storage Infrastructure

**Project:** LIM Digital Platform

**Folder:** `09-infrastructure`

**Document:** `storage-infrastructure.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar implementasi **Storage Infrastructure** pada LIM Digital Platform.

Storage digunakan untuk menyimpan seluruh aset digital aplikasi, termasuk dokumen, gambar, sertifikat, lampiran, arsip, backup, dan media lainnya.

Seluruh file disimpan menggunakan **Object Storage** sehingga Application Server tetap bersifat **Stateless**.

---

# Objectives

Storage Infrastructure bertujuan untuk:

* Menyimpan seluruh aset digital.
* Mendukung skalabilitas penyimpanan.
* Menjamin keamanan data.
* Mendukung Backup dan Recovery.
* Mempermudah integrasi dengan Media Domain.

---

# Storage Platform

Storage utama menggunakan:

* S3 Compatible Object Storage

Contoh implementasi:

* MinIO
* AWS S3
* Cloudflare R2
* DigitalOcean Spaces

Implementasi dapat disesuaikan tanpa mengubah aplikasi.

---

# Storage Architecture

```text id="storage01"
Application

↓

Media Service

↓

Object Storage

↓

Backup Storage
```

Application tidak mengakses file secara langsung melalui filesystem lokal.

---

# Stored Objects

Storage digunakan untuk:

* User Avatar
* Organization Logo
* CMS Media
* Letter Attachment
* Certificate PDF
* Knowledge Attachment
* Program Media
* Backup File
* Export Report

---

# Bucket Organization

Contoh struktur Bucket:

```text id="storage02"
avatars/

organizations/

programs/

letters/

certificates/

knowledge/

cms/

exports/

backups/
```

Setiap kategori memiliki namespace yang terpisah.

---

# File Naming Strategy

Nama file menggunakan:

* UUID
* Timestamp
* Extension asli

Contoh:

```text id="storage03"
6fd2d7e8-3a21.pdf

9bc18d21-image.jpg

certificate-2026-00001.pdf
```

Nama file asli disimpan sebagai Metadata.

---

# Metadata

Setiap file memiliki metadata:

* Original Filename
* MIME Type
* File Size
* Upload Time
* Uploaded By
* Checksum
* Storage Path

Metadata disimpan pada Database melalui Media Domain.

---

# Access Strategy

Jenis akses:

## Private

Digunakan untuk:

* Letter
* Certificate
* Internal Document
* Backup

---

## Public

Digunakan untuk:

* Logo
* Public CMS Media
* Public Images

---

## Signed URL

Digunakan untuk:

* Download sementara.
* File privat.
* Dokumen sensitif.

URL memiliki masa berlaku (Expiration).

---

# Upload Flow

```text id="storage04"
Client

↓

Media API

↓

Validation

↓

Object Storage

↓

Save Metadata

↓

Response
```

---

# Security

Storage wajib menerapkan:

* Private Bucket secara default.
* HTTPS/TLS.
* Server Side Encryption (bila tersedia).
* Signed URL untuk file privat.
* Antivirus Scan (Roadmap).
* Access Control berdasarkan RBAC.

---

# Backup Strategy

Backup meliputi:

* Metadata Database.
* Bucket Storage.
* Export Configuration.

Backup dilakukan secara berkala dan diuji proses pemulihannya.

---

# Monitoring

Parameter yang dipantau:

* Total Storage Usage.
* Bucket Size.
* Upload Rate.
* Download Rate.
* Failed Upload.
* Failed Download.
* Available Capacity.

---

# Retention Policy

File mengikuti kebijakan retensi.

Contoh:

| Data              | Retention            |
| ----------------- | -------------------- |
| Certificate       | Permanent            |
| Letter Attachment | Permanent            |
| CMS Media         | Until Deleted        |
| Temporary Upload  | 24 Jam               |
| Backup            | Sesuai Backup Policy |

---

# Best Practices

* Gunakan Object Storage, bukan Local Storage untuk Production.
* Gunakan UUID sebagai nama file.
* Simpan Metadata pada Database.
* Jangan menyimpan Secret di Storage.
* Gunakan Signed URL untuk file privat.
* Bersihkan file sementara secara berkala.

---

# Related Documents

* README.md
* media-spec.md
* database-infrastructure.md
* monitoring-infrastructure.md

---

# Acceptance Criteria

* Seluruh file disimpan pada Object Storage.
* Metadata dikelola oleh Media Domain.
* File privat menggunakan Signed URL.
* Monitoring dan Backup aktif.
* Storage Infrastructure menjadi acuan resmi implementasi penyimpanan LIM Digital Platform.
