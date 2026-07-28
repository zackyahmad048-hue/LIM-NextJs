# Certificate Workflow

**Project:** LIM Digital Platform

**Domain:** Certificate

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan alur proses (Workflow) pada Domain Certificate.

Workflow menjadi acuan implementasi penerbitan sertifikat mulai dari validasi peserta, pembuatan sertifikat, penandatanganan, publikasi, distribusi, hingga pengarsipan.

---

# Overview

Domain Certificate mengelola seluruh siklus hidup sertifikat digital organisasi.

Seluruh perubahan status mengikuti Business Rules dan dicatat pada Audit Log.

---

# Certificate Lifecycle

```text id="crtwf01"
Draft

↓

Generated

↓

Signed

↓

Published

↓

Downloaded

↓

Archived
```

Apabila diperlukan, sertifikat dapat berubah menjadi **Revoked**.

---

# Generate Certificate Workflow

```text id="crtwf02"
Completed Program

↓

Validate Participant

↓

Select Template

↓

Generate Certificate

↓

Audit Log
```

Sertifikat hanya dapat dibuat dari Program yang telah selesai.

---

# Number Generation Workflow

```text id="crtwf03"
Generated

↓

Generate Certificate Number

↓

Check Sequence

↓

Assign Number

↓

Lock Number
```

Nomor sertifikat tidak dapat diubah setelah dibuat.

---

# QR Code Workflow

```text id="crtwf04"
Generated

↓

Generate QR Code

↓

Generate Verification Code

↓

Attach To Certificate
```

---

# Signature Workflow

```text id="crtwf05"
Generated

↓

Certificate Number Available

↓

Digital Signature

↓

Signed
```

---

# Publish Workflow

```text id="crtwf06"
Signed

↓

Publish Certificate

↓

Enable Download

↓

Notification
```

---

# Distribution Workflow

```text id="crtwf07"
Published

↓

Email

│

├── Download

│

└── WhatsApp (Optional)

↓

Distribution Log
```

---

# Verification Workflow

```text id="crtwf08"
Scan QR Code

↓

Open Verification Page

↓

Check Verification Code

↓

Display Certificate Status
```

---

# Revoke Workflow

```text id="crtwf09"
Revoke Request

↓

Permission Check

↓

Update Status

↓

Revoked

↓

Audit Log
```

---

# Archive Workflow

```text id="crtwf10"
Published

↓

Archive

↓

Read Only

↓

Audit Log
```

---

# Delete Workflow

```text id="crtwf11"
Delete Request

↓

Dependency Check

↓

Soft Delete

↓

Audit Log
```

Sertifikat yang telah diterbitkan tidak dapat dihapus.

---

# Search Workflow

```text id="crtwf12"
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

```text id="crtwf13"
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

```text id="crtwf14"
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

* Sertifikat hanya dibuat dari Program **Completed**.
* Nomor sertifikat dibuat otomatis.
* QR Code selalu dibuat sebelum Publish.
* Sertifikat harus ditandatangani sebelum dipublikasikan.
* Sertifikat yang diarsipkan bersifat Read Only.
* Seluruh aktivitas dicatat pada Audit Log.

---

# Related Documents

* README.md
* business-rules.md
* database.md
* api.md
* permissions.md
* validation.md
* ui.md
* roadmap.md

---

# Acceptance Criteria

Workflow Certificate dianggap selesai apabila:

* Sertifikat mengikuti lifecycle yang ditentukan.
* Nomor sertifikat selalu unik.
* QR Verification berfungsi.
* Sertifikat tidak dapat dipublikasikan sebelum Signed.
* Seluruh perubahan mengikuti Business Rules dan tercatat pada Audit Log.
