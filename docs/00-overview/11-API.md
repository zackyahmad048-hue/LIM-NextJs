# API

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

**Document Type:** API Specification

---

# Purpose

Dokumen ini mendefinisikan standar API resmi LIM Digital Platform.

Seluruh REST API harus mengikuti standar yang ditetapkan dalam dokumen ini agar konsisten, aman, dan mudah digunakan oleh Website, Mobile, maupun layanan pihak ketiga.

---

# API Principles

Seluruh API mengikuti prinsip berikut:

- Resource Oriented
- Stateless
- Consistent
- Version Ready
- Secure by Default
- Documentation First

---

# API Consumers

REST API digunakan oleh:

- Website
- Mobile Application
- Internal Services
- External Integration (apabila diizinkan)

---

# Base URL

Contoh:

```text id="api01"
/api/v1
```

Versi API ditambahkan pada path agar perubahan besar tidak merusak kompatibilitas.

---

# Authentication

API menggunakan Better Auth.

Endpoint yang memerlukan autentikasi wajib memverifikasi session atau token sebelum memproses request.

---

# Authorization

Endpoint yang bersifat privat wajib melakukan:

- Authentication
- Role Checking
- Permission Checking

Sebelum Business Rules dijalankan.

---

# Request Format

Request menggunakan JSON.

Contoh:

```json id="api02"
{
  "name": "Safari Ramadan",
  "slug": "safari-ramadan"
}
```

---

# Response Format

Seluruh response menggunakan format yang konsisten.

Response berhasil:

```json id="api03"
{
  "success": true,
  "message": "Data berhasil disimpan.",
  "data": {}
}
```

Response gagal:

```json id="api04"
{
  "success": false,
  "message": "Slug sudah digunakan."
}
```

---

# HTTP Status Code

Standar yang digunakan:

| Code | Arti                  |
| ---: | --------------------- |
|  200 | OK                    |
|  201 | Created               |
|  400 | Bad Request           |
|  401 | Unauthorized          |
|  403 | Forbidden             |
|  404 | Not Found             |
|  409 | Conflict              |
|  422 | Validation Error      |
|  500 | Internal Server Error |

---

# Validation

Seluruh request wajib divalidasi menggunakan Zod sebelum Business Rules dijalankan.

---

# Pagination

Endpoint daftar data menggunakan format berikut.

Request:

```text id="api05"
?page=1&limit=20
```

Response:

```json id="api06"
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "totalPages": 6
  }
}
```

---

# Filtering

Contoh:

```text id="api07"
?search=ramadan

?status=published

?category=artikel
```

---

# Sorting

Contoh:

```text id="api08"
?sort=name

?order=asc
```

---

# Resource Naming

Gunakan bentuk jamak.

Contoh:

```text id="api09"
/users

/categories

/programs

/certificates

/letters
```

---

# Endpoint Convention

Contoh:

```text id="api10"
GET     /categories

GET     /categories/{id}

POST    /categories

PUT     /categories/{id}

DELETE  /categories/{id}
```

---

# File Upload

Upload menggunakan multipart/form-data.

File wajib divalidasi:

- Tipe
- Ukuran
- Ekstensi

---

# Error Handling

Error harus:

- Konsisten.
- Mudah dipahami.
- Tidak membocorkan informasi sensitif.

Contoh:

```json id="api11"
{
  "success": false,
  "message": "Kategori tidak ditemukan."
}
```

---

# Business Rules

API tidak boleh berisi Business Rules.

Alur wajib:

```text id="api12"
Request

↓

Validation

↓

Authentication

↓

Authorization

↓

Service

↓

Repository

↓

Database

↓

Response
```

---

# Versioning

Versi API menggunakan URL.

Contoh:

```text id="api13"
/api/v1

/api/v2
```

Versi lama hanya dihapus setelah proses migrasi selesai.

---

# Documentation

Setiap endpoint harus memiliki dokumentasi yang memuat:

- Tujuan endpoint
- Request
- Response
- Authentication
- Permission
- Validation
- Error Response

---

# Security

API wajib:

- Menggunakan HTTPS.
- Memvalidasi seluruh input.
- Membatasi akses sesuai permission.
- Tidak mengembalikan data sensitif yang tidak diperlukan.

---

# Performance

Endpoint harus:

- Mendukung pagination.
- Menggunakan query yang efisien.
- Menghindari N+1 Query.
- Menggunakan index database yang sesuai.

---

# Future Development

API dirancang agar mendukung:

- Mobile Application
- Public API
- Internal API
- Integrasi dengan sistem eksternal

Tanpa mengubah struktur dasar.

---

# Related Documentation

Dokumen ini berkaitan dengan:

- Architecture
- Business Rules
- Database
- Security
- Coding Standards

---

# Governance

Seluruh endpoint REST API wajib mengikuti standar yang terdapat pada dokumen ini.

Perubahan terhadap standar API harus didokumentasikan dan ditinjau sebelum diterapkan.

---

# Closing

API menjadi jembatan komunikasi antar aplikasi dalam LIM Digital Platform.

Standar yang konsisten memastikan integrasi berjalan lebih mudah, aman, dan dapat dipelihara dalam jangka panjang.
