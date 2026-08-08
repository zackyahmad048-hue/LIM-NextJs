# Secretariat Workflow

**Project:** LIM Digital Platform

**Domain:** Secretariat

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan alur proses (Workflow) pada Domain Secretariat.

Workflow menjadi acuan implementasi pengelolaan administrasi organisasi mulai dari penerimaan surat, disposisi, pengarsipan, hingga penyelesaian dokumen.

---

# Overview

Domain Secretariat mengelola seluruh siklus administrasi organisasi.

Seluruh aktivitas administrasi harus melalui proses validasi, otorisasi, dan pencatatan Audit Log.

---

# Administrative Lifecycle (Dokumen Administrasi)

```text id="secwf01"
Draft

↓

Submitted

↓

Approved

↓

Archived
```

Apabila dokumen tidak disetujui, status berubah menjadi **Rejected** dan dapat
dikembalikan ke **Draft** untuk diperbaiki.

---

# Incoming Mail Workflow

```text id="secwf02"
Receive Mail

↓

Input Mail Data

↓

Validation

↓

Generate Agenda Number

↓

Save

↓

Audit Log
```

---

# Outgoing Mail Workflow

```text id="secwf03"
Create Mail
    │
    ▼
Validate & Save (Draft)
    │
    ▼
Tandai Terkirim (SENT)
    ├── terbit nomor surat otomatis
    ├── terbit QR verifikasi otomatis
    └── catat sentAt
    │
    ▼
Arsipkan (ARCHIVED) — Read Only
```

**State Machine Outgoing Mail:**

```text id="secwf03b"
DRAFT ──Tandai Terkirim──▶ SENT ──Arsipkan──▶ ARCHIVED
  ▲                        │
  └─────Kembalikan ke Draft┘        (ARCHIVED: terminal)
```

- Nomor surat dan QR verifikasi **hanya** diterbitkan saat transisi `DRAFT → SENT`.
- Transisi `SENT → DRAFT` membatalkan status terkirim (nomor & QR dipertahankan untuk dipakai ulang).
- `ARCHIVED` bersifat terminal: surat tidak dapat diubah atau dihapus.
- Pengaturan format penomoran, digit urut, periode, dan kode tingkat dikelola super admin di halaman **Penomoran Surat**.

---

# Disposition Workflow

```text id="secwf04"
Incoming Mail

↓

Create Disposition

↓

Assign Recipient

↓

Notification

↓

Process

↓

Completed
```

---

# Archive Workflow

```text id="secwf05"
Completed Document

↓

Archive

↓

Read Only

↓

Audit Log
```

Dokumen yang telah diarsipkan tidak dapat diubah.

---

# Administrative Document Workflow

```text id="secwf06"
Create Document

↓

Validation

↓

Submit (Submitted)

↓

Approval

↓

Archive
```

---

# Attachment Workflow

```text id="secwf07"
Upload Attachment

↓

Media Validation

↓

Store Media

↓

Link To Document
```

Seluruh lampiran menggunakan Domain Media.

---

# Search Workflow

```text id="secwf08"
Search

↓

Filter

↓

Sort

↓

Pagination

↓

Result
```

---

# Restore Workflow

```text id="secwf09"
Archived Document

↓

Restore

↓

Validation

↓

Active Document

↓

Audit Log
```

---

# Delete Workflow

```text id="secwf10"
Delete Request

↓

Dependency Check

↓

Soft Delete

↓

Audit Log
```

Dokumen yang memiliki relasi aktif tidak dapat dihapus.

---

# Permission Workflow

```text id="secwf11"
Authentication

↓

Authorization

↓

Permission Check

↓

Execute Action
```

---

# Error Workflow

```text id="secwf12"
Validation Failed

↓

Display Error

↓

Correct Data

↓

Retry
```

---

# Workflow Rules

- Seluruh surat memperoleh nomor agenda atau nomor surat secara otomatis.
- Nomor surat keluar dan QR verifikasi diterbitkan otomatis saat surat ditandai terkirim.
- Surat keluar yang diarsipkan bersifat Read Only.
- Disposisi hanya dapat dibuat dari Surat Masuk.
- Arsip bersifat Read Only.
- Penghapusan menggunakan Soft Delete.
- Seluruh aktivitas dicatat pada Audit Log.

---

# Related Documents

- README.md
- business-rules.md
- database.md
- api.md
- permissions.md
- validation.md
- ui.md
- roadmap.md

---

# Acceptance Criteria

Workflow Secretariat dianggap selesai apabila:

- Surat masuk mengikuti alur penerimaan.
- Surat keluar diterbitkan nomor & QR saat ditandai terkirim, lalu dapat diarsipkan.
- Disposisi berjalan sesuai alur.
- Arsip bersifat Read Only.
- Seluruh aktivitas mengikuti Business Rules dan tercatat pada Audit Log.
