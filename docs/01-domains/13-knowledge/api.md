# Knowledge API

**Project:** LIM Digital Platform

**Domain:** Knowledge

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar REST API pada Domain Knowledge.

API Knowledge digunakan untuk mengelola artikel, dokumentasi, SOP, FAQ, kategori, tag, review, publikasi, pencarian, dan arsip Knowledge Base.

---

# Base URL

```text id="knwapi01"
/api/v1/knowledge
```

---

# Authentication

Seluruh endpoint Admin memerlukan:

- Authentication
- Session Valid
- Authorization

Endpoint publik hanya dapat mengakses konten yang berstatus **Published**.

---

# API Modules

Domain Knowledge terdiri dari:

- Knowledge
- Category
- Tag
- Review
- Archive
- Search

---

# Knowledge Endpoints

## Get Knowledge

```http id="knwapi02"
GET /api/v1/knowledge
```

Query Parameter

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| page      | Number | Halaman         |
| limit     | Number | Jumlah data     |
| search    | String | Kata kunci      |
| category  | UUID   | Filter kategori |
| tag       | UUID   | Filter tag      |
| type      | Enum   | Jenis konten    |
| status    | Enum   | Status          |

---

## Get Knowledge Detail

```http id="knwapi03"
GET /api/v1/knowledge/{id}
```

---

## Create Knowledge

```http id="knwapi04"
POST /api/v1/knowledge
```

---

## Update Knowledge

```http id="knwapi05"
PUT /api/v1/knowledge/{id}
```

---

## Delete Knowledge

```http id="knwapi06"
DELETE /api/v1/knowledge/{id}
```

Soft Delete.

---

## Submit Review

```http id="knwapi07"
POST /api/v1/knowledge/{id}/submit
```

---

## Approve Knowledge

```http id="knwapi08"
POST /api/v1/knowledge/{id}/approve
```

---

## Reject Knowledge

```http id="knwapi09"
POST /api/v1/knowledge/{id}/reject
```

---

## Publish Knowledge

```http id="knwapi10"
POST /api/v1/knowledge/{id}/publish
```

---

## Archive Knowledge

```http id="knwapi11"
POST /api/v1/knowledge/{id}/archive
```

---

# Category Endpoints

## Get Categories

```http id="knwapi12"
GET /api/v1/knowledge/categories
```

---

## Create Category

```http id="knwapi13"
POST /api/v1/knowledge/categories
```

---

## Update Category

```http id="knwapi14"
PUT /api/v1/knowledge/categories/{id}
```

---

## Delete Category

```http id="knwapi15"
DELETE /api/v1/knowledge/categories/{id}
```

---

# Tag Endpoints

## Get Tags

```http id="knwapi16"
GET /api/v1/knowledge/tags
```

---

## Create Tag

```http id="knwapi17"
POST /api/v1/knowledge/tags
```

---

## Update Tag

```http id="knwapi18"
PUT /api/v1/knowledge/tags/{id}
```

---

## Delete Tag

```http id="knwapi19"
DELETE /api/v1/knowledge/tags/{id}
```

---

# Search Endpoint

## Full Text Search

```http id="knwapi20"
GET /api/v1/knowledge/search
```

Mendukung pencarian berdasarkan:

- Judul
- Isi Artikel
- Tag
- Kategori
- Penulis

---

# Archive Endpoints

## Get Archives

```http id="knwapi21"
GET /api/v1/knowledge/archives
```

---

## Restore Knowledge

```http id="knwapi22"
POST /api/v1/knowledge/{id}/restore
```

---

# Response Format

Response berhasil

```json id="knwapi23"
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Response gagal

```json id="knwapi24"
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
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

# Business Rules

- Seluruh endpoint Admin memerlukan Authentication.
- Publish hanya dapat dilakukan setelah Review.
- Endpoint publik hanya menampilkan konten Published.
- Delete menggunakan Soft Delete.
- Seluruh perubahan dicatat pada Audit Log.

---

# Security

API Knowledge wajib:

- Memvalidasi Session.
- Memvalidasi Permission.
- Memvalidasi seluruh input.
- Menggunakan HTTPS pada Production.

---

# Performance

Seluruh endpoint mendukung:

- Pagination
- Search
- Filtering
- Sorting
- Full Text Search
- Database Index

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

- Seluruh endpoint CRUD tersedia.
- Workflow Review dan Publish berjalan dengan baik.
- Full Text Search berfungsi.
- Response mengikuti standar API proyek.
- Seluruh endpoint mengikuti Business Rules, Security Policy, dan Repository Pattern.
