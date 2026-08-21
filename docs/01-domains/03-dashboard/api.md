# Dashboard API

**Project:** LIM Digital Platform

**Domain:** Dashboard

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan endpoint API yang digunakan oleh Domain Dashboard.

API Dashboard hanya digunakan untuk mengambil data yang akan ditampilkan pada Dashboard. API ini tidak melakukan operasi Create, Update, Delete, maupun Restore.

---

# Base URL

```text
/api/v1/dashboard
```

---

# Authentication

Seluruh endpoint Dashboard memerlukan autentikasi.

Pengguna harus memiliki session yang valid sebelum dapat mengakses endpoint.

---

# Authorization

Data yang dikembalikan harus mengikuti Role dan Permission pengguna.

Pengguna tidak boleh menerima data di luar hak aksesnya.

---

# Endpoints

## Get Dashboard

Mengambil seluruh data Dashboard.

```http
GET /api/v1/dashboard
```

Response:

```json
{
  "statistics": {},
  "activities": [],
  "announcements": [],
  "quickAccess": [],
  "systemInfo": {}
}
```

---

## Get Statistics

Mengambil statistik Dashboard.

```http
GET /api/v1/dashboard/statistics
```

Response:

```json
{
  "users": 120,
  "programs": 35,
  "posts": 87,
  "certificates": 420
}
```

---

## Get Recent Activities

Mengambil aktivitas terbaru.

```http
GET /api/v1/dashboard/activities
```

Parameter:

| Name  | Type   | Default |
| ----- | ------ | ------- |
| limit | number | 10      |

---

## Get Announcements

Mengambil pengumuman aktif.

```http
GET /api/v1/dashboard/announcements
```

Parameter:

| Name  | Type   | Default |
| ----- | ------ | ------- |
| limit | number | 5       |

---

## Get Quick Access

Mengambil shortcut menu sesuai Permission.

```http
GET /api/v1/dashboard/quick-access
```

---

## Get System Information

Mengambil informasi sistem.

```http
GET /api/v1/dashboard/system
```

Endpoint ini hanya dapat diakses oleh Role yang memiliki permission.

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
  "message": "Unauthorized"
}
```

---

# Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 500  | Internal Server Error |

---

# Business Rules

- Dashboard hanya menyediakan operasi Read.
- Tidak ada endpoint Create, Update, Delete.
- Seluruh data berasal dari Service Layer.
- Seluruh endpoint mengikuti Permission pengguna.

---

# Performance

Endpoint harus:

- Menggunakan query yang efisien.
- Menghindari N+1 Query.
- Membatasi jumlah data.
- Mendukung caching apabila diperlukan.

---

# Security

Seluruh endpoint wajib:

- Memvalidasi Session.
- Memvalidasi Permission.
- Tidak mengembalikan informasi sensitif.
- Menggunakan HTTPS pada Production.

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

API Dashboard dianggap selesai apabila:

- Seluruh endpoint dapat diakses oleh pengguna yang berwenang.
- Response konsisten.
- Tidak ada operasi penulisan data.
- Seluruh endpoint mengikuti Business Rules dan Architecture proyek.
