# Organization API

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar REST API untuk Domain Organization.

API Organization digunakan sebagai sumber data resmi struktur organisasi yang akan digunakan oleh Admin Portal, Website, Mobile Application, dan domain lainnya.

---

# Base URL

```text
/api/v1/organization
```

---

# Authentication

Seluruh endpoint memerlukan Authentication.

Pengguna harus memiliki Session yang valid sebelum mengakses endpoint.

---

# Authorization

Seluruh endpoint memerlukan Permission sesuai aksi yang dilakukan.

Hak akses mengikuti Role Based Access Control (RBAC).

---

# API Modules

Domain Organization terdiri dari:

* Organization
* Region
* Branch
* Department
* Position
* Management
* Management Period

---

# Organization Endpoints

## Get Organizations

```http
GET /api/v1/organization
```

Query Parameter

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| page      | Number | Halaman     |
| limit     | Number | Jumlah data |
| search    | String | Pencarian   |
| status    | Enum   | Status      |

---

## Get Organization Detail

```http
GET /api/v1/organization/{id}
```

---

## Create Organization

```http
POST /api/v1/organization
```

---

## Update Organization

```http
PUT /api/v1/organization/{id}
```

---

## Delete Organization

```http
DELETE /api/v1/organization/{id}
```

Menggunakan Soft Delete.

---

# Region Endpoints

## Get Regions

```http
GET /api/v1/organization/regions
```

---

## Get Region Detail

```http
GET /api/v1/organization/regions/{id}
```

---

## Create Region

```http
POST /api/v1/organization/regions
```

---

## Update Region

```http
PUT /api/v1/organization/regions/{id}
```

---

## Delete Region

```http
DELETE /api/v1/organization/regions/{id}
```

---

# Branch Endpoints

## Get Branches

```http
GET /api/v1/organization/branches
```

---

## Get Branch Detail

```http
GET /api/v1/organization/branches/{id}
```

---

## Create Branch

```http
POST /api/v1/organization/branches
```

---

## Update Branch

```http
PUT /api/v1/organization/branches/{id}
```

---

## Delete Branch

```http
DELETE /api/v1/organization/branches/{id}
```

---

# Department Endpoints

## Get Departments

```http
GET /api/v1/organization/departments
```

---

## Get Department Detail

```http
GET /api/v1/organization/departments/{id}
```

---

## Create Department

```http
POST /api/v1/organization/departments
```

---

## Update Department

```http
PUT /api/v1/organization/departments/{id}
```

---

## Delete Department

```http
DELETE /api/v1/organization/departments/{id}
```

---

# Position Endpoints

## Get Positions

```http
GET /api/v1/organization/positions
```

---

## Get Position Detail

```http
GET /api/v1/organization/positions/{id}
```

---

## Create Position

```http
POST /api/v1/organization/positions
```

---

## Update Position

```http
PUT /api/v1/organization/positions/{id}
```

---

## Delete Position

```http
DELETE /api/v1/organization/positions/{id}
```

---

# Management Period Endpoints

## Get Periods

```http
GET /api/v1/organization/periods
```

---

## Get Period Detail

```http
GET /api/v1/organization/periods/{id}
```

---

## Create Period

```http
POST /api/v1/organization/periods
```

---

## Update Period

```http
PUT /api/v1/organization/periods/{id}
```

---

## Activate Period

```http
POST /api/v1/organization/periods/{id}/activate
```

---

## Close Period

```http
POST /api/v1/organization/periods/{id}/close
```

---

# Management Endpoints

## Get Management

```http
GET /api/v1/organization/management
```

---

## Get Management Detail

```http
GET /api/v1/organization/management/{id}
```

---

## Assign Management

```http
POST /api/v1/organization/management
```

---

## Update Management

```http
PUT /api/v1/organization/management/{id}
```

---

## Remove Management

```http
DELETE /api/v1/organization/management/{id}
```

Menggunakan Soft Delete.

---

# Public API

Endpoint berikut dapat digunakan oleh Website atau Mobile untuk menampilkan informasi organisasi.

## Organization Profile

```http
GET /api/v1/public/organization
```

---

## Branch List

```http
GET /api/v1/public/organization/branches
```

---

## Active Management

```http
GET /api/v1/public/organization/management
```

---

# Response Format

Response berhasil

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Response gagal

```json
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

* Seluruh endpoint Admin memerlukan Authentication.
* Seluruh endpoint memerlukan Permission sesuai aksi.
* Endpoint Public hanya menampilkan data yang berstatus Active.
* Delete menggunakan Soft Delete.
* Aktivasi periode otomatis menonaktifkan periode aktif sebelumnya.
* Seluruh perubahan dicatat pada Audit Log.

---

# Security

API Organization wajib:

* Memvalidasi Session.
* Memvalidasi Permission.
* Memvalidasi seluruh input.
* Menggunakan HTTPS pada Production.
* Menolak akses tanpa hak.

---

# Performance

Seluruh endpoint harus mendukung:

* Pagination
* Search
* Filtering
* Sorting
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

API Organization dianggap selesai apabila:

* Seluruh endpoint CRUD tersedia.
* Endpoint Public hanya menampilkan data aktif.
* Response mengikuti standar API proyek.
* Seluruh endpoint mengikuti Business Rules, Security Policy, dan Repository Pattern.
