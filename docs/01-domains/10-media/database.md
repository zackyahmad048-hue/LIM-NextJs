# Media Database

**Project:** LIM Digital Platform

**Domain:** Media

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan struktur database pada Domain Media.

Domain Media menyimpan metadata seluruh aset digital yang digunakan oleh LIM Digital Platform.

---

# Overview

Domain Media hanya menyimpan metadata file.

File fisik disimpan pada Storage Provider (Local, S3, Cloud Storage), sedangkan database menyimpan informasi file dan referensinya.

---

# Entity Relationship

```text id="meddb01"
Media
   │
   ├────────────┐
   ▼            ▼
Folder      Thumbnail
   │
   ▼
Reference
```

---

# Main Tables

## media

Metadata file.

| Field        | Type      | Description      |
| ------------ | --------- | ---------------- |
| id           | UUID      | Primary Key      |
| folderId     | UUID      | Folder           |
| fileName     | String    | Nama File        |
| originalName | String    | Nama Asli        |
| mimeType     | String    | MIME Type        |
| extension    | String    | Ekstensi         |
| size         | BigInt    | Ukuran File      |
| storage      | String    | Storage Provider |
| path         | String    | Lokasi File      |
| url          | String    | URL File         |
| uploadedBy   | UUID      | User             |
| status       | Enum      | Status           |
| createdAt    | Timestamp | Dibuat           |
| updatedAt    | Timestamp | Diubah           |
| deletedAt    | Timestamp | Soft Delete      |

---

## media_folder

Folder media.

| Field       | Type   |
| ----------- | ------ |
| id          | UUID   |
| name        | String |
| parentId    | UUID   |
| description | Text   |

---

## media_thumbnail

Thumbnail gambar.

| Field   | Type   |
| ------- | ------ |
| id      | UUID   |
| mediaId | UUID   |
| size    | String |
| path    | String |
| url     | String |

---

## media_reference

Referensi penggunaan file.

| Field       | Type      |
| ----------- | --------- |
| id          | UUID      |
| mediaId     | UUID      |
| domain      | String    |
| referenceId | UUID      |
| createdAt   | Timestamp |

---

# Relationships

| Source | Relation | Target    |
| ------ | -------- | --------- |
| Folder | 1 : N    | Media     |
| Media  | 1 : N    | Thumbnail |
| Media  | 1 : N    | Reference |
| User   | 1 : N    | Media     |

---

# Indexes

```text id="meddb02"
media.fileName

media.mimeType

media.status

media.uploadedBy

media_reference.mediaId

media_folder.name
```

---

# Constraints

## Media

- fileName wajib.
- path unik.
- url unik.

---

## Folder

- name wajib.
- parentId opsional.

---

## Reference

- mediaId wajib.
- referenceId wajib.

---

# Soft Delete

Menggunakan Soft Delete:

- media
- media_folder

Thumbnail dan Reference bersifat permanen.

---

# Status Enum

```text id="meddb03"
Uploading

Available

Archived

Deleted
```

---

# Database Rules

- Metadata disimpan di database.
- File fisik disimpan di Storage Provider.
- Domain lain hanya menyimpan mediaId.
- File tidak boleh dihapus jika masih memiliki Reference.
- Seluruh akses menggunakan Repository Pattern.

---

# Future Tables

```text id="meddb04"
media_version

media_tag

media_collection

media_processing

media_access_log
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

- Metadata tersimpan dengan benar.
- File memiliki path dan URL unik.
- Relasi media valid.
- File yang direferensikan tidak dapat dihapus.
- Seluruh akses database menggunakan Repository Pattern.
