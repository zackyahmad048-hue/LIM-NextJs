# Media Workflow

**Project:** LIM Digital Platform

**Domain:** Media

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan alur proses (Workflow) pada Domain Media.

Workflow menjadi acuan implementasi upload, penyimpanan, pemrosesan, penggunaan, pengarsipan, dan penghapusan file.

---

# Overview

Domain Media mengelola seluruh lifecycle aset digital pada LIM Digital Platform.

Seluruh file diproses melalui validasi, penyimpanan metadata, dan pencatatan Audit Log.

---

# Media Lifecycle

```text id="medwf01"
Upload

↓

Validation

↓

Store File

↓

Generate Metadata

↓

Available

↓

Referenced

↓

Archived

↓

Deleted
```

---

# Upload Workflow

```text id="medwf02"
Select File

↓

Validation

↓

Virus Scan (Optional)

↓

Store File

↓

Generate Metadata

↓

Generate Thumbnail

↓

Save Database

↓

Audit Log
```

---

# Download Workflow

```text id="medwf03"
Request File

↓

Authentication

↓

Permission Check

↓

Generate URL

↓

Download

↓

Audit Log
```

---

# Preview Workflow

```text id="medwf04"
Request Preview

↓

Check File Type

↓

Generate Preview

↓

Display
```

Preview didukung untuk Image, PDF, dan Video.

---

# Thumbnail Workflow

```text id="medwf05"
Upload Image

↓

Resize

↓

Generate Thumbnail

↓

Store Thumbnail

↓

Update Metadata
```

---

# Reference Workflow

```text id="medwf06"
Upload File

↓

Create Media ID

↓

Referenced by Domain

↓

Organization

Program

Letter

Certificate

CMS
```

Seluruh domain hanya menyimpan **mediaId**.

---

# Archive Workflow

```text id="medwf07"
Archive Request

↓

Archive File

↓

Read Only

↓

Audit Log
```

---

# Restore Workflow

```text id="medwf08"
Archived File

↓

Restore

↓

Available
```

---

# Delete Workflow

```text id="medwf09"
Delete Request

↓

Reference Check

↓

Soft Delete

↓

Audit Log
```

File yang masih direferensikan tidak dapat dihapus.

---

# Search Workflow

```text id="medwf10"
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

```text id="medwf11"
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

```text id="medwf12"
Validation Failed

↓

Display Error

↓

Retry
```

---

# Workflow Rules

- Seluruh upload melalui validasi.
- Metadata dibuat otomatis.
- Thumbnail hanya untuk gambar.
- File hanya dihapus jika tidak memiliki referensi.
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

Workflow Media dianggap selesai apabila:

- Upload berjalan sesuai alur.
- Metadata dibuat otomatis.
- Thumbnail berhasil dibuat untuk gambar.
- File yang masih direferensikan tidak dapat dihapus.
- Seluruh aktivitas mengikuti Business Rules dan tercatat pada Audit Log.
