# Certificate Database

**Project:** LIM Digital Platform

**Domain:** Certificate

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan struktur database pada Domain Certificate.

Domain Certificate menyimpan seluruh data sertifikat digital, template, penomoran, QR Verification, penandatanganan, distribusi, dan arsip sertifikat.

---

# Overview

Domain Certificate menjadi pusat pengelolaan sertifikat digital organisasi.

Seluruh data sertifikat dapat digunakan oleh Domain Program, Dashboard, Notification, Knowledge, dan Organization.

---

# Entity Relationship

```text id="crtdb01"
Program
    │
    ▼
Certificate
    │
    ├──────────────┬─────────────┬──────────────┐
    ▼              ▼             ▼              ▼
Template      Signature    Distribution    Verification
    │
    ▼
Archive
```

---

# Main Tables

## certificate

Menyimpan data utama sertifikat.

| Field            | Type      | Description        |
| ---------------- | --------- | ------------------ |
| id               | UUID      | Primary Key        |
| programId        | UUID      | Program            |
| userId           | UUID      | Pemilik Sertifikat |
| templateId       | UUID      | Template           |
| number           | String    | Nomor Sertifikat   |
| title            | String    | Judul Sertifikat   |
| issueDate        | Date      | Tanggal Terbit     |
| status           | Enum      | Status             |
| qrCode           | String    | QR Code            |
| verificationCode | String    | Verification Code  |
| createdAt        | Timestamp | Dibuat             |
| updatedAt        | Timestamp | Diubah             |
| deletedAt        | Timestamp | Soft Delete        |

---

## certificate_template

Template sertifikat.

| Field             | Type   |
| ----------------- | ------ |
| id                | UUID   |
| name              | String |
| code              | String |
| backgroundMediaId | UUID   |
| status            | Enum   |

---

## certificate_signature

Riwayat penandatanganan.

| Field         | Type      |
| ------------- | --------- |
| id            | UUID      |
| certificateId | UUID      |
| signerId      | UUID      |
| signatureType | Enum      |
| signedAt      | Timestamp |

---

## certificate_distribution

Riwayat distribusi sertifikat.

| Field         | Type      |
| ------------- | --------- |
| id            | UUID      |
| certificateId | UUID      |
| method        | Enum      |
| recipient     | String    |
| sentAt        | Timestamp |
| status        | Enum      |

---

## certificate_verification

Data verifikasi sertifikat.

| Field            | Type      |
| ---------------- | --------- |
| id               | UUID      |
| certificateId    | UUID      |
| verificationCode | String    |
| verifiedAt       | Timestamp |
| ipAddress        | String    |

---

## certificate_archive

Arsip sertifikat.

| Field         | Type      |
| ------------- | --------- |
| id            | UUID      |
| certificateId | UUID      |
| archivedBy    | UUID      |
| archivedAt    | Timestamp |

---

# Relationships

| Source      | Relation | Target       |
| ----------- | -------- | ------------ |
| Program     | 1 : N    | Certificate  |
| User        | 1 : N    | Certificate  |
| Template    | 1 : N    | Certificate  |
| Certificate | 1 : 1    | Signature    |
| Certificate | 1 : N    | Distribution |
| Certificate | 1 : N    | Verification |
| Certificate | 1 : 1    | Archive      |
| User        | 1 : N    | Signature    |

---

# Indexes

Index dibuat pada:

```text id="crtdb02"
certificate.number

certificate.userId

certificate.programId

certificate.status

certificate.verificationCode

certificate.issueDate
```

---

# Constraints

## Certificate

- Nomor sertifikat wajib unik.
- Program wajib ada.
- User wajib ada.
- Template wajib dipilih.

---

## Verification

- Verification Code wajib unik.

---

## Signature

- Hanya dapat dibuat apabila status = Generated.

---

## Distribution

- Hanya dapat dilakukan apabila status = Published.

---

# Soft Delete

Menggunakan Soft Delete:

- certificate
- certificate_template

Signature, Distribution, Verification, dan Archive bersifat permanen.

---

# Status Enum

## Certificate

```text id="crtdb03"
Draft

Generated

Signed

Published

Downloaded

Revoked

Archived
```

---

## Signature Type

```text id="crtdb04"
Digital

Manual
```

---

## Distribution Method

```text id="crtdb05"
Download

Email

WhatsApp
```

---

# Database Rules

- Nomor sertifikat selalu unik.
- Verification Code selalu unik.
- QR Code dibuat otomatis.
- Template menjadi referensi sertifikat.
- Arsip bersifat Read Only.
- Seluruh akses database menggunakan Repository Pattern.

---

# Future Tables

Versi berikutnya dapat menambahkan:

```text id="crtdb06"
certificate_revision

certificate_batch

certificate_template_version

certificate_download_log

certificate_print_log
```

---

# Related Documents

- README.md
- business-rules.md
- workflow.md
- api.md
- permissions.md
- validation.md
- ui.md
- roadmap.md

---

# Acceptance Criteria

Database Certificate dianggap selesai apabila:

- Struktur database mendukung seluruh lifecycle sertifikat.
- Nomor sertifikat dan Verification Code selalu unik.
- Relasi antar tabel konsisten.
- Arsip bersifat permanen (Read Only).
- Seluruh akses database menggunakan Repository Pattern.
