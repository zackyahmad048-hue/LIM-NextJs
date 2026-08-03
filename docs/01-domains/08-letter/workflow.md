# Letter Workflow

**Project:** LIM Digital Platform

**Domain:** Letter

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan alur proses (Workflow) pada Domain Letter.

Workflow menjadi acuan implementasi pembuatan surat, persetujuan, penomoran, penandatanganan, distribusi, hingga pengarsipan surat resmi.

---

# Overview

Domain Letter mengelola seluruh siklus hidup surat resmi organisasi.

Seluruh perubahan status mengikuti Business Rules dan dicatat pada Audit Log.

---

# Letter Lifecycle

```text id="ltrwf01"
Draft

↓

Submitted

↓

Reviewed

↓

Approved

↓

Number Generated

↓

Signed

↓

Sent

↓

Archived
```

Apabila tidak disetujui, status berubah menjadi **Rejected**.

---

# Create Letter Workflow

```text id="ltrwf02"
Create Letter

↓

Select Template

↓

Input Content

↓

Validation

↓

Save Draft

↓

Audit Log
```

---

# Submit Workflow

```text id="ltrwf03"
Draft

↓

Submit

↓

Validation

↓

Reviewer Assigned

↓

Review Process
```

---

# Review Workflow

```text id="ltrwf04"
Review Letter

↓

Approve
     │
     └──────→ Reject
```

Jika ditolak, surat kembali ke status **Draft**.

---

# Number Generation Workflow

```text id="ltrwf05"
Approved

↓

Generate Letter Number

↓

Check Sequence

↓

Assign Number

↓

Lock Number
```

Nomor surat tidak dapat diubah setelah dibuat.

---

# Signature Workflow

```text id="ltrwf06"
Approved

↓

Letter Number Available

↓

Digital Signature

↓

Signed
```

---

# Distribution Workflow

```text id="ltrwf07"
Signed

↓

Select Delivery Method

↓

Send

↓

Save Delivery Log

↓

Sent
```

Metode distribusi:

- PDF
- Email
- WhatsApp
- Print

---

# Archive Workflow

```text id="ltrwf08"
Sent

↓

Archive

↓

Read Only

↓

Audit Log
```

---

# Restore Workflow

```text id="ltrwf09"
Archived

↓

Restore

↓

Draft

↓

Edit
```

Restore hanya dapat dilakukan oleh Role yang memiliki permission.

---

# Delete Workflow

```text id="ltrwf10"
Delete Request

↓

Dependency Check

↓

Soft Delete

↓

Audit Log
```

Surat yang telah ditandatangani atau dikirim tidak dapat dihapus.

---

# Search Workflow

```text id="ltrwf11"
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

# Permission Workflow

```text id="ltrwf12"
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

```text id="ltrwf13"
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

- Surat selalu dimulai dari status **Draft**.
- Nomor surat dibuat setelah **Approved**.
- Surat hanya dapat ditandatangani setelah nomor dibuat.
- Surat hanya dapat dikirim setelah ditandatangani.
- Arsip bersifat Read Only.
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

Workflow Letter dianggap selesai apabila:

- Seluruh surat mengikuti lifecycle yang ditentukan.
- Nomor surat selalu dibuat setelah persetujuan.
- Surat tidak dapat dikirim sebelum ditandatangani.
- Arsip bersifat Read Only.
- Seluruh perubahan mengikuti Business Rules dan tercatat pada Audit Log.
