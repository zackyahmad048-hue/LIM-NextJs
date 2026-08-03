# Media Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `media-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Media Domain**.

Media Domain bertanggung jawab mengelola seluruh aset digital yang digunakan oleh LIM Digital Platform, seperti gambar, dokumen, video, audio, serta file lampiran yang digunakan oleh domain lain.

Media Domain berfungsi sebagai **single source of truth** untuk seluruh file yang tersimpan di Object Storage.

---

# Objectives

Media harus mampu:

- Upload File.
- Download File.
- Preview File.
- Mengelola Metadata.
- Mengelola Folder.
- Mengelola Versi File.
- Menghapus dan Mengarsipkan File.

---

# Actors

| Actor               | Description                         |
| ------------------- | ----------------------------------- |
| Super Administrator | Mengelola seluruh media             |
| Administrator       | Mengelola media organisasi          |
| Operator            | Upload dan Update media             |
| User                | Mengakses media sesuai hak akses    |
| System              | Menggunakan media untuk domain lain |

---

# Functional Requirements

## File Upload

Mendukung:

- Image
- PDF
- DOCX
- XLSX
- PPTX
- ZIP
- Video
- Audio

---

## Metadata Management

Setiap file memiliki:

- Filename
- Original Filename
- MIME Type
- File Size
- Checksum
- Storage Path
- Uploaded By
- Uploaded At

---

## Folder Management

Mengelola:

- Folder
- Sub Folder
- Tags
- Category

---

## File Versioning

Mendukung:

- Version History
- Restore Previous Version
- Latest Version

---

## File Sharing

Mendukung:

- Internal Link
- Temporary Link
- Public Link (Opsional)

---

# Non Functional Requirements

Media harus:

- Upload < 5 detik (10 MB).
- Download < 2 detik.
- Highly Available.
- Audit Enabled.
- Scalable.

---

# Preconditions

- User telah Login.
- Permission sesuai.
- File memenuhi validasi.

---

# Postconditions

- File tersimpan di Object Storage.
- Metadata tersimpan di Database.
- Audit Log dibuat.
- Domain Event diterbitkan.

---

# Main Flow

```text id="media01"
Upload Request

↓

Authentication

↓

Authorization

↓

Validate File

↓

Upload Storage

↓

Save Metadata

↓

Publish Event

↓

Response
```

---

# Alternative Flow

```text id="media02"
Duplicate File

↓

Create New Version

↓

Update Metadata
```

---

# Exception Flow

- File terlalu besar.
- MIME Type tidak didukung.
- Storage gagal.
- Permission ditolak.
- Metadata gagal disimpan.

---

# Sequence Diagram

```text id="media03"
Client

↓

Media API

↓

Application

↓

Storage Adapter

↓

Object Storage

↓

Repository

↓

Database
```

---

# State Diagram

```text id="media04"
Uploading

↓

Uploaded

↓

Archived

↓

Deleted
```

---

# Domain Model

Entity:

- MediaFile
- MediaFolder
- MediaVersion

Aggregate:

- Media

Value Object:

- FileName
- MimeType
- StoragePath
- FileChecksum

---

# Database Mapping

Tables:

```text id="media05"
media_files

media_folders

media_versions
```

---

# API Specification

| Method | Endpoint                    |
| ------ | --------------------------- |
| POST   | /api/v1/media/upload        |
| GET    | /api/v1/media               |
| GET    | /api/v1/media/{id}          |
| GET    | /api/v1/media/{id}/download |
| PATCH  | /api/v1/media/{id}          |
| DELETE | /api/v1/media/{id}          |

---

# Validation Matrix

| Field    | Rule                   |
| -------- | ---------------------- |
| file     | Required               |
| size     | Max sesuai konfigurasi |
| mimeType | Allowed MIME Types     |
| folderId | Optional               |
| category | Optional               |

---

# Permission Matrix

| Action          | Admin | Operator |       User       |
| --------------- | :---: | :------: | :--------------: |
| Upload          |  ✅   |    ✅    |        ✅        |
| Download        |  ✅   |    ✅    | Sesuai Hak Akses |
| Update Metadata |  ✅   |    ✅    |        ❌        |
| Delete          |  ✅   |    ❌    |        ❌        |

---

# Error Catalog

| Code      | Description         |
| --------- | ------------------- |
| MEDIA_001 | File Not Found      |
| MEDIA_002 | Invalid File Type   |
| MEDIA_003 | File Too Large      |
| MEDIA_004 | Upload Failed       |
| MEDIA_005 | Storage Unavailable |
| MEDIA_006 | Duplicate File      |

---

# Notification Matrix

| Event            | Notification  |
| ---------------- | ------------- |
| Upload Completed | Optional      |
| Upload Failed    | User          |
| Storage Error    | Administrator |

---

# Domain Events

```text id="media06"
MediaUploaded

MediaUpdated

MediaVersionCreated

MediaArchived

MediaDeleted
```

---

# Acceptance Test

- File berhasil diunggah.
- Metadata tersimpan.
- File berhasil diunduh.
- Versioning berjalan.
- MIME Type tervalidasi.
- Audit Log tercatat.
- Domain Event diterbitkan.

---

# Performance Requirement

- Upload 10 MB < 5 detik.
- Download < 2 detik.
- Metadata Query < 300 ms.

---

# Security Requirement

- RBAC diterapkan.
- MIME Type divalidasi.
- Ukuran file divalidasi.
- Nama file diacak (UUID).
- File disimpan pada Object Storage.
- Signed URL digunakan untuk akses sementara (jika diterapkan).
- Audit Log aktif.
- Seluruh endpoint menggunakan HTTPS.

---

# Acceptance Criteria

- Seluruh file tersimpan pada Object Storage.
- Metadata tersimpan secara konsisten.
- Versioning berjalan dengan baik.
- Domain Event dan Audit Log aktif.
- Specification siap digunakan sebagai dasar implementasi Media Domain.
