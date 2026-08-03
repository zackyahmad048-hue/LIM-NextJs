# API Reference

**Project:** LIM Digital Platform

**Folder:** `06-references`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjadi referensi utama implementasi REST API pada LIM Digital Platform.

Dokumen ini melengkapi standar API dengan menyediakan ringkasan endpoint, struktur request/response, authentication, versioning, pagination, serta error handling yang digunakan oleh seluruh domain.

---

# API Overview

Seluruh layanan menggunakan:

- REST API
- JSON
- HTTPS
- UTF-8 Encoding
- OpenAPI 3.x Documentation

Base URL:

```text id="api01"
https://api.example.com/api/v1
```

---

# API Versioning

Seluruh endpoint menggunakan URL Versioning.

Format:

```text id="api02"
/api/v1/
```

Contoh:

```text id="api03"
/api/v1/programs

/api/v1/letters

/api/v1/certificates

/api/v1/prayer-times
```

---

# Authentication

API privat menggunakan:

```text id="api04"
Authorization: Bearer <JWT_TOKEN>
```

Token dikirim melalui HTTP Header.

---

# HTTP Methods

| Method | Purpose          |
| ------ | ---------------- |
| GET    | Read Resource    |
| POST   | Create Resource  |
| PUT    | Replace Resource |
| PATCH  | Partial Update   |
| DELETE | Delete Resource  |

---

# Standard Response

## Success Response

```text id="api05"
success

message

data

meta
```

---

## Error Response

```text id="api06"
success

message

errors

code
```

---

# HTTP Status Code

| Status | Meaning               |
| ------ | --------------------- |
| 200    | OK                    |
| 201    | Created               |
| 204    | No Content            |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 403    | Forbidden             |
| 404    | Not Found             |
| 409    | Conflict              |
| 422    | Validation Error      |
| 429    | Too Many Requests     |
| 500    | Internal Server Error |

---

# Pagination

Request:

```text id="api07"
page

limit

sort

search

filter
```

Response Metadata:

```text id="api08"
currentPage

totalPages

total

limit

hasNextPage

hasPreviousPage
```

---

# Filtering

Contoh parameter:

```text id="api09"
status

category

organizationId

createdFrom

createdTo
```

Filter hanya digunakan pada endpoint yang mendukung pencarian data.

---

# Sorting

Format:

```text id="api10"
sort=field

order=asc|desc
```

Contoh:

```text id="api11"
sort=createdAt

order=desc
```

---

# Error Code Convention

Format:

```text id="api12"
MODULE_ERROR_CODE
```

Contoh:

```text id="api13"
AUTH_001

PROGRAM_002

LETTER_005

CERTIFICATE_004

FALAK_001
```

---

# Rate Limiting

API mendukung pembatasan request.

Header:

```text id="api14"
X-RateLimit-Limit

X-RateLimit-Remaining

Retry-After
```

---

# Idempotency

Endpoint yang memerlukan idempotensi dapat menggunakan:

```text id="api15"
Idempotency-Key
```

Contoh penggunaan:

- Payment (Future)
- File Upload
- Retry Request

---

# Common Headers

```text id="api16"
Authorization

Content-Type

Accept

Accept-Language

X-Request-ID
```

---

# API Documentation

Seluruh endpoint didokumentasikan menggunakan:

```text id="api17"
OpenAPI 3.x

Swagger UI
```

Dokumentasi harus selalu sinkron dengan implementasi.

---

# Security Reference

Seluruh endpoint wajib menerapkan:

- HTTPS
- JWT Authentication
- RBAC Authorization
- Input Validation
- Rate Limiting
- Audit Log

---

# Best Practices

- Gunakan Resource Name berbentuk jamak (plural).
- Hindari endpoint berbasis kata kerja.
- Gunakan HTTP Status Code yang sesuai.
- Gunakan Response yang konsisten.
- Hindari Breaking Change tanpa Versioning.

---

# Related Documents

- README.md
- glossary.md
- coding-reference.md
- database-reference.md
- external-references.md

---

# Acceptance Criteria

- Seluruh API mengikuti standar REST.
- Response konsisten.
- Versioning diterapkan.
- Dokumentasi OpenAPI tersedia.
- API Reference menjadi referensi resmi seluruh layanan LIM Digital Platform.
