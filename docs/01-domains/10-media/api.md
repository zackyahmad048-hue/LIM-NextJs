# Media API

**Project:** LIM Digital Platform

**Domain:** Media

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar REST API pada Domain Media.

API Media digunakan untuk mengelola upload, download, preview, folder, thumbnail, metadata, dan arsip file.

---

# Base URL

```text id="medapi01"
/api/v1/media
```

---

# Authentication

Seluruh endpoint Admin memerlukan:

- Authentication
- Session Valid
- Authorization

File Public hanya dapat diakses apabila status file adalah **Public**.

---

# API Modules

Domain Media terdiri dari:

- Media
- Folder
- Thumbnail
- Reference
- Archive

---

# Media Endpoints

## Get Media

```http id="medapi02"
GET /api/v1/media
```

Query Parameter

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| page      | Number | Halaman     |
| limit     | Number | Jumlah data |
| search    | String | Kata kunci  |
| folderId  | UUID   | Folder      |
| mimeType  | String | Jenis File  |
| status    | Enum   | Status      |

---

## Get Media Detail

```http id="medapi03"
GET /api/v1/media/{id}
```

---

## Upload Media

```http id="medapi04"
POST /api/v1/media
```

---

## Update Media

```http id="medapi05"
PUT /api/v1/media/{id}
```

---

## Delete Media

```http id="medapi06"
DELETE /api/v1/media/{id}
```

Soft Delete.

---

## Download Media

```http id="medapi07"
GET /api/v1/media/{id}/download
```

---

## Preview Media

```http id="medapi08"
GET /api/v1/media/{id}/preview
```

---

## Archive Media

```http id="medapi09"
POST /api/v1/media/{id}/archive
```

---

## Restore Media

```http id="medapi10"
POST /api/v1/media/{id}/restore
```

---

# Folder Endpoints

## Get Folders

```http id="medapi11"
GET /api/v1/media/folders
```

---

## Create Folder

```http id="medapi12"
POST /api/v1/media/folders
```

---

## Update Folder

```http id="medapi13"
PUT /api/v1/media/folders/{id}
```

---

## Delete Folder

```http id="medapi14"
DELETE /api/v1/media/folders/{id}
```

---

# Thumbnail Endpoints

## Get Thumbnail

```http id="medapi15"
GET /api/v1/media/{id}/thumbnail
```

---

## Regenerate Thumbnail

```http id="medapi16"
POST /api/v1/media/{id}/thumbnail
```

---

# Reference Endpoints

## Get References

```http id="medapi17"
GET /api/v1/media/{id}/references
```

---

# Response Format

Response berhasil

```json id="medapi18"
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Response gagal

```json id="medapi19"
{
  "success": false,
  "message": "Validation failed"
}
```

---

# HTTP Status Code

| Code | Description           |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 413  | Payload Too Large     |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

# Business Rules

- Seluruh endpoint Admin memerlukan Authentication.
- Upload wajib melalui validasi file.
- Thumbnail dibuat otomatis untuk gambar.
- File tidak dapat dihapus apabila masih memiliki Reference.
- Delete menggunakan Soft Delete.
- Seluruh aktivitas dicatat pada Audit Log.

---

# Security

API Media wajib:

- Memvalidasi Session.
- Memvalidasi Permission.
- Memvalidasi tipe file.
- Memvalidasi ukuran file.
- Menggunakan HTTPS pada Production.

---

# Performance

Seluruh endpoint mendukung:

- Pagination
- Search
- Filtering
- Sorting
- Database Index
- Streaming Download

---

# Related Documents

- README.md
- business-rules.md
- workflow.md
- database.md
- permissions.md
- validation.md
- ui.md
- roadmap.md

---

# Acceptance Criteria

API Media dianggap selesai apabila:

- Seluruh endpoint CRUD tersedia.
- Upload dan Download berjalan normal.
- Thumbnail otomatis dibuat.
- File yang masih direferensikan tidak dapat dihapus.
- Seluruh endpoint mengikuti Business Rules, Security Policy, dan Repository Pattern.
