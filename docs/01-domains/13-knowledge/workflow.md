# Knowledge Workflow

**Project:** LIM Digital Platform

**Domain:** Knowledge

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan alur proses (Workflow) pada Domain Knowledge.

Workflow menjadi acuan implementasi pembuatan, review, publikasi, pencarian, pengarsipan, dan pengelolaan Knowledge Base.

---

# Overview

Domain Knowledge mengelola seluruh lifecycle pengetahuan organisasi.

Seluruh perubahan mengikuti Business Rules dan dicatat pada Audit Log.

---

# Knowledge Lifecycle

```text id="knwwf01"
Draft

↓

Review

↓

Published

↓

Archived
```

Apabila tidak disetujui:

```text id="knwwf02"
Review

↓

Rejected

↓

Draft
```

---

# Create Content Workflow

```text id="knwwf03"
Create Content

↓

Select Category

↓

Input Content

↓

Add Tags

↓

Save Draft

↓

Audit Log
```

---

# Submit Review Workflow

```text id="knwwf04"
Draft

↓

Submit

↓

Validation

↓

Assign Reviewer

↓

Review
```

---

# Review Workflow

```text id="knwwf05"
Review

↓

Approve
      │
      └────────→ Reject
```

Apabila ditolak, konten kembali menjadi **Draft**.

---

# Publish Workflow

```text id="knwwf06"
Approved

↓

Publish

↓

Search Index

↓

Visible To Users

↓

Notification
```

Setelah dipublikasikan, konten akan diindeks oleh mesin pencarian.

---

# Update Workflow

```text id="knwwf07"
Published

↓

Edit

↓

Save Draft

↓

Review

↓

Publish
```

Perubahan pada konten yang telah dipublikasikan harus melalui proses review kembali.

---

# Search Workflow

```text id="knwwf08"
Search

↓

Full Text Search

↓

Filter

↓

Sort

↓

Result
```

---

# Archive Workflow

```text id="knwwf09"
Published

↓

Archive

↓

Read Only

↓

Audit Log
```

---

# Restore Workflow

```text id="knwwf10"
Archived

↓

Restore

↓

Draft

↓

Review
```

---

# Delete Workflow

```text id="knwwf11"
Delete Request

↓

Dependency Check

↓

Soft Delete

↓

Audit Log
```

Konten yang menjadi referensi domain lain tidak dapat dihapus.

---

# Permission Workflow

```text id="knwwf12"
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

```text id="knwwf13"
Validation Failed

↓

Display Error

↓

Retry
```

---

# Workflow Rules

- Seluruh konten dimulai dari status **Draft**.
- Publish hanya dapat dilakukan setelah **Review**.
- Perubahan pada konten Published harus direview kembali.
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

Workflow Knowledge dianggap selesai apabila:

- Seluruh konten mengikuti lifecycle yang ditentukan.
- Publish hanya melalui proses review.
- Search menggunakan Full Text Search.
- Arsip bersifat Read Only.
- Seluruh perubahan mengikuti Business Rules dan tercatat pada Audit Log.
