# CMS API

**Project:** LIM Digital Platform

**Domain:** Content Management System (CMS)

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar REST API untuk Domain CMS.

API CMS digunakan oleh:

* Admin Portal
* Website
* Mobile Application
* Internal Services

Seluruh endpoint mengikuti standar API LIM Digital Platform.

---

# Base URL

```text
/api/v1/cms
```

---

# Authentication

Endpoint Admin wajib:

* Authentication
* Authorization
* Permission Check

Endpoint Public tidak memerlukan autentikasi.

---

# API Groups

CMS terdiri dari beberapa kelompok endpoint:

* Posts
* Pages
* Categories
* Tags
* Public Content

---

# Post Endpoints

## Get Posts

```http
GET /api/v1/cms/posts
```

Query Parameter

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| page      | Number | Halaman         |
| limit     | Number | Jumlah data     |
| search    | String | Kata kunci      |
| category  | UUID   | Filter kategori |
| status    | Enum   | Filter status   |
| sort      | String | Pengurutan      |

---

## Get Post Detail

```http
GET /api/v1/cms/posts/{id}
```

---

## Create Post

```http
POST /api/v1/cms/posts
```

---

## Update Post

```http
PUT /api/v1/cms/posts/{id}
```

---

## Delete Post

```http
DELETE /api/v1/cms/posts/{id}
```

Menggunakan Soft Delete.

---

## Publish Post

```http
POST /api/v1/cms/posts/{id}/publish
```

---

## Archive Post

```http
POST /api/v1/cms/posts/{id}/archive
```

---

# Page Endpoints

## Get Pages

```http
GET /api/v1/cms/pages
```

---

## Get Page Detail

```http
GET /api/v1/cms/pages/{id}
```

---

## Create Page

```http
POST /api/v1/cms/pages
```

---

## Update Page

```http
PUT /api/v1/cms/pages/{id}
```

---

## Delete Page

```http
DELETE /api/v1/cms/pages/{id}
```

---

# Category Endpoints

## Get Categories

```http
GET /api/v1/cms/categories
```

---

## Create Category

```http
POST /api/v1/cms/categories
```

---

## Update Category

```http
PUT /api/v1/cms/categories/{id}
```

---

## Delete Category

```http
DELETE /api/v1/cms/categories/{id}
```

---

# Tag Endpoints

## Get Tags

```http
GET /api/v1/cms/tags
```

---

## Create Tag

```http
POST /api/v1/cms/tags
```

---

## Update Tag

```http
PUT /api/v1/cms/tags/{id}
```

---

## Delete Tag

```http
DELETE /api/v1/cms/tags/{id}
```

---

# Public API

Endpoint berikut dapat diakses publik.

## Latest Posts

```http
GET /api/v1/public/posts
```

---

## Post Detail

```http
GET /api/v1/public/posts/{slug}
```

---

## Categories

```http
GET /api/v1/public/categories
```

---

## Pages

```http
GET /api/v1/public/pages/{slug}
```

---

# Response Format

Response berhasil:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Response gagal:

```json
{
  "success": false,
  "message": "Validation failed"
}
```

---

# HTTP Status Codes

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

* Seluruh endpoint Admin memerlukan autentikasi.
* Endpoint Public hanya menampilkan konten **Published**.
* Slug digunakan sebagai identifier pada endpoint publik.
* Endpoint Delete menggunakan Soft Delete.
* Seluruh operasi Create, Update, Delete dicatat pada Audit Log.

---

# Security

API CMS wajib:

* Memvalidasi Session.
* Memvalidasi Permission.
* Memvalidasi seluruh input.
* Menggunakan HTTPS pada Production.

---

# Performance

Endpoint harus:

* Mendukung Pagination.
* Mendukung Filtering.
* Mendukung Sorting.
* Menggunakan Index Database.
* Menghindari N+1 Query.

---

# Related Documents

* README.md
* business-rules.md
* workflow.md
* database.md
* permissions.md
* validation.md
* ui.md
* roadmap.md

---

# Acceptance Criteria

API CMS dianggap selesai apabila:

* Seluruh endpoint CRUD tersedia.
* Public API hanya menampilkan konten Published.
* Response mengikuti standar proyek.
* Seluruh endpoint mengikuti Business Rules dan Security Policy.
