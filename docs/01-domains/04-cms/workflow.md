# CMS Workflow

**Project:** LIM Digital Platform

**Domain:** Content Management System (CMS)

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan alur kerja (workflow) Domain Content Management System (CMS).

Workflow ini menjadi acuan implementasi Website, Admin Portal, API, dan Mobile Application.

---

# Overview

CMS mengelola seluruh siklus hidup konten mulai dari pembuatan hingga pengarsipan.

Setiap perubahan konten harus melalui proses validasi, pemeriksaan hak akses, dan pencatatan Audit Log.

---

# Content Lifecycle

```text id="cmswf01"
Draft

↓

Review (Opsional)

↓

Published

↓

Archived

↓

Restore (Opsional)

↓

Published
```

---

# Create Content Workflow

```text id="cmswf02"
Administrator

↓

Create Content

↓

Input Data

↓

Validation

↓

Generate Slug

↓

Save Draft

↓

Audit Log
```

Status awal seluruh konten adalah **Draft**.

---

# Edit Content Workflow

```text id="cmswf03"
Open Content

↓

Edit

↓

Validation

↓

Save

↓

Audit Log
```

Konten Published tetap dapat diperbarui sesuai Permission pengguna.

---

# Publish Workflow

```text id="cmswf04"
Draft

↓

Validation

↓

Permission Check

↓

Publish

↓

Set Published At

↓

Audit Log
```

Konten yang dipublikasikan langsung tersedia pada Website dan Mobile.

---

# Archive Workflow

```text id="cmswf05"
Published

↓

Archive

↓

Hidden From Public

↓

Audit Log
```

Konten Archived tidak dapat diakses oleh publik.

---

# Restore Workflow

```text id="cmswf06"
Archived

↓

Restore

↓

Draft

↓

Edit (Opsional)

↓

Publish
```

Restore mengembalikan konten ke status Draft agar dapat ditinjau kembali sebelum dipublikasikan.

---

# Delete Workflow

```text id="cmswf07"
Delete Request

↓

Permission Check

↓

Soft Delete

↓

Audit Log
```

Konten tidak dihapus secara permanen.

---

# Category Workflow

```text id="cmswf08"
Create Category

↓

Validation

↓

Generate Slug

↓

Save
```

Category dapat digunakan oleh banyak konten.

---

# Tag Workflow

```text id="cmswf09"
Create Tag

↓

Validation

↓

Save
```

Tag dapat digunakan kembali oleh berbagai Post.

---

# Search Workflow

```text id="cmswf10"
Search Keyword

↓

Filter Data

↓

Sort Result

↓

Return Result
```

Pencarian dapat menggunakan:

- Judul
- Slug
- Category
- Tag
- Status

---

# Slug Generation Workflow

```text id="cmswf11"
Input Title

↓

Generate Slug

↓

Check Duplicate

↓

Unique

↓

Save
```

Apabila slug sudah digunakan, sistem harus menghasilkan slug yang tetap unik.

---

# Permission Workflow

```text id="cmswf12"
User Action

↓

Authentication

↓

Authorization

↓

Permission Check

↓

Execute Action
```

Seluruh aksi CMS wajib melalui proses otorisasi.

---

# Error Workflow

```text id="cmswf13"
Validation Failed

↓

Display Error

↓

User Corrects Data

↓

Save Again
```

Error harus ditampilkan dengan pesan yang mudah dipahami.

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

Workflow CMS dianggap selesai apabila:

- Konten mengikuti siklus Draft → Published → Archived.
- Slug selalu unik.
- Seluruh aksi melalui validasi dan Permission Check.
- Soft Delete digunakan untuk penghapusan.
- Seluruh aktivitas tercatat pada Audit Log.
