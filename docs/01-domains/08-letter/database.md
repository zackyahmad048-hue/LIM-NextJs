# Letter Database

**Project:** LIM Digital Platform

**Domain:** Letter

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan struktur database pada Domain Letter.

Domain Letter menyimpan seluruh data surat resmi organisasi mulai dari draft, template, penomoran, persetujuan, penandatanganan, distribusi, hingga arsip.

---

# Overview

Domain Letter menjadi pusat pengelolaan surat resmi organisasi.

Seluruh data surat dapat digunakan oleh Domain Secretariat, Dashboard, Notification, Knowledge, dan Certificate.

---

# Entity Relationship

```text id="ltrdb01"
Letter
   │
   ├──────────────┐
   ▼              ▼
Template      Attachment
   │
   ▼
Approval
   │
   ▼
Signature
   │
   ▼
Distribution
   │
   ▼
Archive
```

---

# Main Tables

## letter

Menyimpan data utama surat.

| Field      | Type      | Description    |
| ---------- | --------- | -------------- |
| id         | UUID      | Primary Key    |
| templateId | UUID      | Template Surat |
| number     | String    | Nomor Surat    |
| subject    | String    | Perihal        |
| recipient  | String    | Tujuan         |
| content    | Long Text | Isi Surat      |
| signerId   | UUID      | Penandatangan  |
| status     | Enum      | Status Surat   |
| issuedDate | Date      | Tanggal Surat  |
| createdAt  | Timestamp | Dibuat         |
| updatedAt  | Timestamp | Diubah         |
| deletedAt  | Timestamp | Soft Delete    |

---

## letter_template

Template surat.

| Field  | Type   |
| ------ | ------ |
| id     | UUID   |
| name   | String |
| code   | String |
| header | Text   |
| footer | Text   |
| status | Enum   |

---

## letter_approval

Riwayat persetujuan.

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| letterId   | UUID      |
| reviewerId | UUID      |
| status     | Enum      |
| note       | Text      |
| reviewedAt | Timestamp |

---

## letter_signature

Riwayat penandatanganan.

| Field         | Type      |
| ------------- | --------- |
| id            | UUID      |
| letterId      | UUID      |
| signerId      | UUID      |
| signatureType | Enum      |
| signedAt      | Timestamp |

---

## letter_distribution

Riwayat distribusi.

| Field     | Type      |
| --------- | --------- |
| id        | UUID      |
| letterId  | UUID      |
| method    | Enum      |
| recipient | String    |
| sentAt    | Timestamp |
| status    | Enum      |

---

## letter_attachment

Lampiran surat.

| Field       | Type |
| ----------- | ---- |
| id          | UUID |
| letterId    | UUID |
| mediaId     | UUID |
| description | Text |

---

## letter_archive

Arsip surat.

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| letterId   | UUID      |
| archivedBy | UUID      |
| archivedAt | Timestamp |

---

# Relationships

| Source   | Relation | Target       |
| -------- | -------- | ------------ |
| Letter   | 1 : N    | Approval     |
| Letter   | 1 : 1    | Signature    |
| Letter   | 1 : N    | Distribution |
| Letter   | 1 : N    | Attachment   |
| Letter   | 1 : 1    | Archive      |
| Template | 1 : N    | Letter       |
| Media    | 1 : N    | Attachment   |
| User     | 1 : N    | Approval     |
| User     | 1 : N    | Signature    |

---

# Indexes

Index dibuat pada:

```text id="ltrdb02"
letter.number

letter.status

letter.issuedDate

letter.subject

letter_template.code

letter_distribution.sentAt
```

---

# Constraints

## Letter

- Nomor surat wajib unik.
- Template wajib dipilih.
- Penandatangan wajib tersedia.

---

## Approval

- Reviewer wajib aktif.
- Satu reviewer hanya dapat memberikan satu keputusan.

---

## Signature

- Hanya dapat dibuat apabila status = Approved.

---

## Distribution

- Hanya dapat dilakukan setelah surat Signed.

---

# Soft Delete

Menggunakan Soft Delete:

- letter
- letter_template

Approval, Signature, Distribution, dan Archive bersifat permanen.

---

# Status Enum

## Letter

```text id="ltrdb03"
Draft

Submitted

Reviewed

Approved

Signed

Sent

Archived

Rejected
```

---

## Signature Type

```text id="ltrdb04"
Digital

Manual
```

---

## Distribution Method

```text id="ltrdb05"
PDF

Email

WhatsApp

Print
```

---

# Database Rules

- Nomor surat selalu unik.
- Template menjadi referensi surat.
- Lampiran menggunakan Domain Media.
- Arsip bersifat Read Only.
- Seluruh akses database menggunakan Repository Pattern.

---

# Future Tables

Versi berikutnya dapat menambahkan:

```text id="ltrdb06"
letter_revision

letter_comment

letter_tracking

letter_delivery_receipt

letter_template_version
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

Database Letter dianggap selesai apabila:

- Struktur database mendukung seluruh lifecycle surat.
- Nomor surat selalu unik.
- Relasi antar tabel konsisten.
- Arsip bersifat permanen (Read Only).
- Seluruh akses database menggunakan Repository Pattern.
