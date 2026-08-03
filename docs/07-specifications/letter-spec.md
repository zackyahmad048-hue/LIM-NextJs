# Letter Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `letter-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Letter Domain**.

Letter Domain bertanggung jawab mengelola seluruh proses surat dinas organisasi, mulai dari pembuatan draft, review, approval, penomoran, penerbitan, hingga pengarsipan.

Domain ini terintegrasi dengan Organization, Secretariat, Notification, Media, dan Certificate Domain.

---

# Objectives

Letter harus mampu:

- Mengelola Surat.
- Mengelola Template Surat.
- Menghasilkan Nomor Surat.
- Mengelola Approval.
- Mengelola Lampiran.
- Mengelola Riwayat Revisi.
- Mengarsipkan Surat.

---

# Actors

| Actor               | Description                    |
| ------------------- | ------------------------------ |
| Super Administrator | Mengelola seluruh surat        |
| Administrator       | Menyetujui surat               |
| Secretariat Staff   | Mengelola surat                |
| Author              | Membuat draft surat            |
| User                | Melihat surat sesuai hak akses |

---

# Functional Requirements

## Letter Management

Mengelola:

- Create Letter
- Update Letter
- Delete Letter
- Archive Letter

---

## Template Management

Template meliputi:

- Surat Keputusan
- Surat Tugas
- Surat Undangan
- Surat Keterangan
- Surat Edaran
- Template Khusus

---

## Number Generation

Sistem menghasilkan:

- Nomor Surat
- Tahun
- Kode Organisasi
- Kode Jenis Surat
- Running Number

Nomor surat harus unik.

---

## Approval Workflow

Tahapan:

- Draft
- Review
- Approved
- Signed
- Published

---

## Attachment

Surat mendukung:

- PDF
- DOCX
- Image
- Lampiran Tambahan

---

# Non Functional Requirements

Letter harus:

- Response < 500 ms.
- Audit Enabled.
- Full Text Search.
- Highly Available.

---

# Preconditions

- User telah Login.
- Permission sesuai.
- Data surat valid.

---

# Postconditions

- Surat tersimpan.
- Nomor surat dibuat.
- Audit Log dibuat.
- Notification dikirim.
- Domain Event diterbitkan.

---

# Main Flow

```text id="letter01"
Request

↓

Authentication

↓

Authorization

↓

Validation

↓

Letter Service

↓

Repository

↓

Generate Number

↓

Database

↓

Publish Event

↓

Response
```

---

# Alternative Flow

```text id="letter02"
Save Draft

↓

Review

↓

Approval

↓

Publish
```

---

# Exception Flow

- Surat tidak ditemukan.
- Nomor surat duplikat.
- Template tidak ditemukan.
- Approval ditolak.
- Lampiran tidak valid.

---

# Sequence Diagram

```text id="letter03"
Client

↓

Letter API

↓

Application

↓

Letter Aggregate

↓

Repository

↓

Number Generator

↓

Database

↓

Notification
```

---

# State Diagram

```text id="letter04"
Draft

↓

Under Review

↓

Approved

↓

Signed

↓

Published

↓

Archived
```

---

# Domain Model

Entity:

- Letter
- LetterTemplate
- Attachment
- Approval

Aggregate:

- Letter

Value Object:

- LetterNumber
- LetterStatus
- LetterType

---

# Database Mapping

Tables:

```text id="letter05"
letters

letter_templates

letter_attachments

letter_approvals
```

---

# API Specification

| Method | Endpoint                     |
| ------ | ---------------------------- |
| GET    | /api/v1/letters              |
| GET    | /api/v1/letters/{id}         |
| POST   | /api/v1/letters              |
| PATCH  | /api/v1/letters/{id}         |
| DELETE | /api/v1/letters/{id}         |
| POST   | /api/v1/letters/{id}/approve |
| POST   | /api/v1/letters/{id}/publish |

---

# Validation Matrix

| Field          | Rule     |
| -------------- | -------- |
| subject        | Required |
| letterType     | Required |
| templateId     | Required |
| organizationId | Required |
| attachments    | Optional |

---

# Permission Matrix

| Action  | Admin | Secretariat |  Author   |  User   |
| ------- | :---: | :---------: | :-------: | :-----: |
| View    |  ✅   |     ✅      |    Own    | Limited |
| Create  |  ✅   |     ✅      |    ✅     |   ❌    |
| Update  |  ✅   |     ✅      | Own Draft |   ❌    |
| Approve |  ✅   |     ❌      |    ❌     |   ❌    |
| Publish |  ✅   |     ❌      |    ❌     |   ❌    |

---

# Error Catalog

| Code       | Description               |
| ---------- | ------------------------- |
| LETTER_001 | Letter Not Found          |
| LETTER_002 | Duplicate Letter Number   |
| LETTER_003 | Invalid Status Transition |
| LETTER_004 | Template Not Found        |
| LETTER_005 | Attachment Invalid        |
| LETTER_006 | Approval Required         |

---

# Notification Matrix

| Event            | Notification  |
| ---------------- | ------------- |
| Letter Submitted | Approver      |
| Letter Approved  | Author        |
| Letter Rejected  | Author        |
| Letter Published | Related Users |

---

# Domain Events

```text id="letter06"
LetterCreated

LetterSubmitted

LetterApproved

LetterRejected

LetterPublished

LetterArchived
```

---

# Acceptance Test

- Surat berhasil dibuat.
- Draft berhasil disimpan.
- Nomor surat dibuat otomatis.
- Approval berjalan sesuai workflow.
- Surat berhasil dipublikasikan.
- Notification terkirim.
- Audit Log tercatat.
- Domain Event diterbitkan.

---

# Performance Requirement

- Create Letter < 500 ms.
- Generate Letter Number < 100 ms.
- Search Letter < 300 ms.
- Publish Letter < 500 ms.

---

# Security Requirement

- RBAC diterapkan.
- Audit Log aktif.
- Nomor surat tidak dapat diubah setelah diterbitkan.
- Lampiran divalidasi.
- Soft Delete digunakan.
- Seluruh endpoint menggunakan HTTPS.

---

# Acceptance Criteria

- Seluruh Business Rules Letter berjalan sesuai spesifikasi.
- Workflow Approval berjalan sesuai State Diagram.
- Nomor surat unik dan otomatis.
- Notification dan Domain Event berjalan sesuai desain.
- Specification siap digunakan sebagai dasar implementasi Letter Domain.
