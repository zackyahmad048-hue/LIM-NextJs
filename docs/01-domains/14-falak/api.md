# Falak API

**Project:** LIM Digital Platform

**Domain:** Falak

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar REST API pada Domain Falak.

API Falak digunakan untuk mengelola perhitungan waktu salat, arah kiblat, kalender Hijriah, hisab, rukyat, gerhana, dan layanan astronomi Islam.

---

# Base URL

```text id="flkapi01"
/api/v1/falak
```

---

# Authentication

Endpoint administrasi memerlukan:

- Authentication
- Session Valid
- Authorization

Endpoint publik tersedia untuk:

- Prayer Time
- Qibla Direction
- Hijri Calendar
- Eclipse Information

---

# API Modules

Domain Falak terdiri dari:

- Prayer Time
- Qibla
- Hijri Calendar
- Hisab
- Rukyat
- Eclipse

---

# Prayer Time Endpoints

## Get Prayer Time

```http id="flkapi02"
GET /api/v1/falak/prayer-times
```

Query Parameter

| Parameter | Type    | Description        |
| --------- | ------- | ------------------ |
| latitude  | Decimal | Latitude           |
| longitude | Decimal | Longitude          |
| date      | Date    | Tanggal            |
| method    | String  | Metode Perhitungan |

---

## Generate Prayer Time

```http id="flkapi03"
POST /api/v1/falak/prayer-times
```

---

# Qibla Endpoints

## Calculate Qibla

```http id="flkapi04"
GET /api/v1/falak/qibla
```

Query Parameter

| Parameter | Type    |
| --------- | ------- |
| latitude  | Decimal |
| longitude | Decimal |

---

# Hijri Calendar Endpoints

## Get Hijri Calendar

```http id="flkapi05"
GET /api/v1/falak/hijri-calendar
```

---

## Generate Hijri Calendar

```http id="flkapi06"
POST /api/v1/falak/hijri-calendar
```

---

# Hisab Endpoints

## Get Hisab

```http id="flkapi07"
GET /api/v1/falak/hisab
```

---

## Calculate Hisab

```http id="flkapi08"
POST /api/v1/falak/hisab
```

---

# Rukyat Endpoints

## Get Observations

```http id="flkapi09"
GET /api/v1/falak/rukyat
```

---

## Create Observation

```http id="flkapi10"
POST /api/v1/falak/rukyat
```

---

## Verify Observation

```http id="flkapi11"
POST /api/v1/falak/rukyat/{id}/verify
```

---

## Confirm Observation

```http id="flkapi12"
POST /api/v1/falak/rukyat/{id}/confirm
```

---

# Eclipse Endpoints

## Get Eclipse Data

```http id="flkapi13"
GET /api/v1/falak/eclipse
```

---

## Calculate Eclipse

```http id="flkapi14"
POST /api/v1/falak/eclipse
```

---

# Archive Endpoints

## Get Archives

```http id="flkapi15"
GET /api/v1/falak/archives
```

---

## Restore Archive

```http id="flkapi16"
POST /api/v1/falak/{id}/restore
```

---

# Response Format

Response berhasil

```json id="flkapi17"
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Response gagal

```json id="flkapi18"
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

- Endpoint publik hanya menyediakan data yang dapat diakses umum.
- Seluruh endpoint administrasi memerlukan Authentication.
- Perhitungan menggunakan parameter yang tervalidasi.
- Observasi harus melalui proses Verify sebelum Confirm.
- Delete menggunakan Soft Delete.
- Seluruh aktivitas dicatat pada Audit Log.

---

# Security

API Falak wajib:

- Memvalidasi Session.
- Memvalidasi Permission.
- Memvalidasi parameter astronomi.
- Menggunakan HTTPS pada Production.

---

# Performance

Seluruh endpoint mendukung:

- Pagination
- Search
- Filtering
- Database Index
- Calculation Cache

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

- Seluruh endpoint tersedia sesuai modul.
- Perhitungan astronomi berjalan konsisten.
- Endpoint publik berjalan tanpa Authentication (sesuai kebutuhan).
- Response mengikuti standar API proyek.
- Seluruh endpoint mengikuti Business Rules, Security Policy, dan Repository Pattern.
