# Settings API

**Project:** LIM Digital Platform

**Domain:** Settings

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar REST API pada Domain Settings.

API Settings digunakan untuk mengelola konfigurasi aplikasi, organisasi, keamanan, notifikasi, storage, integrasi, feature flag, dan parameter sistem.

---

# Base URL

```text id="setapi01"
/api/v1/settings
```

---

# Authentication

Seluruh endpoint memerlukan:

* Authentication
* Session Valid
* Authorization

Hanya Super Administrator dan Administrator yang dapat mengakses API Settings.

---

# API Modules

Domain Settings terdiri dari:

* Settings
* Categories
* Feature Flags
* Integrations
* Organization
* Security
* Notification
* Storage

---

# Settings Endpoints

## Get Settings

```http id="setapi02"
GET /api/v1/settings
```

Query Parameter

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| page      | Number | Halaman     |
| limit     | Number | Jumlah data |
| search    | String | Kata kunci  |
| category  | String | Kategori    |
| status    | Enum   | Status      |

---

## Get Setting Detail

```http id="setapi03"
GET /api/v1/settings/{id}
```

---

## Create Setting

```http id="setapi04"
POST /api/v1/settings
```

---

## Update Setting

```http id="setapi05"
PUT /api/v1/settings/{id}
```

---

## Delete Setting

```http id="setapi06"
DELETE /api/v1/settings/{id}
```

Soft Delete.

---

# Category Endpoints

## Get Categories

```http id="setapi07"
GET /api/v1/settings/categories
```

---

## Create Category

```http id="setapi08"
POST /api/v1/settings/categories
```

---

## Update Category

```http id="setapi09"
PUT /api/v1/settings/categories/{id}
```

---

## Delete Category

```http id="setapi10"
DELETE /api/v1/settings/categories/{id}
```

---

# Feature Flag Endpoints

## Get Feature Flags

```http id="setapi11"
GET /api/v1/settings/feature-flags
```

---

## Update Feature Flag

```http id="setapi12"
PATCH /api/v1/settings/feature-flags/{id}
```

Mengaktifkan atau menonaktifkan Feature Flag.

---

# Integration Endpoints

## Get Integrations

```http id="setapi13"
GET /api/v1/settings/integrations
```

---

## Update Integration

```http id="setapi14"
PUT /api/v1/settings/integrations/{id}
```

---

## Test Integration

```http id="setapi15"
POST /api/v1/settings/integrations/{id}/test
```

---

# Organization Settings Endpoints

## Get Organization Settings

```http id="setapi16"
GET /api/v1/settings/organization
```

---

## Update Organization Settings

```http id="setapi17"
PUT /api/v1/settings/organization
```

---

# Security Settings Endpoints

## Get Security Settings

```http id="setapi18"
GET /api/v1/settings/security
```

---

## Update Security Settings

```http id="setapi19"
PUT /api/v1/settings/security
```

---

# Notification Settings Endpoints

## Get Notification Settings

```http id="setapi20"
GET /api/v1/settings/notification
```

---

## Update Notification Settings

```http id="setapi21"
PUT /api/v1/settings/notification
```

---

# Storage Settings Endpoints

## Get Storage Settings

```http id="setapi22"
GET /api/v1/settings/storage
```

---

## Update Storage Settings

```http id="setapi23"
PUT /api/v1/settings/storage
```

---

# Response Format

Response berhasil

```json id="setapi24"
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Response gagal

```json id="setapi25"
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

* Seluruh endpoint memerlukan Authentication.
* Hanya Administrator yang dapat mengubah konfigurasi.
* Key konfigurasi harus unik.
* Credential integrasi disimpan dalam bentuk terenkripsi.
* Delete menggunakan Soft Delete.
* Seluruh perubahan dicatat pada Audit Log.

---

# Security

API Settings wajib:

* Memvalidasi Session.
* Memvalidasi Permission.
* Mengenkripsi data sensitif.
* Menggunakan HTTPS pada Production.
* Menyembunyikan credential pada response API.

---

# Performance

Seluruh endpoint mendukung:

* Pagination
* Search
* Filtering
* Sorting
* Configuration Cache
* Database Index

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

* Seluruh endpoint CRUD tersedia.
* Feature Flag dapat diaktifkan dan dinonaktifkan.
* Integration Test berjalan dengan baik.
* Response mengikuti standar API proyek.
* Seluruh endpoint mengikuti Business Rules, Security Policy, dan Repository Pattern.
