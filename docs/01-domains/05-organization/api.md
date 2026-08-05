# Organization API

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 2.0

**Status:** Draft

---

# Purpose

Dokumen ini mendefinisikan standar REST API untuk Domain Organization.

API Organization digunakan sebagai sumber data resmi struktur kepengurusan organisasi yang akan digunakan oleh Admin Portal, Website, Mobile Application, dan domain lainnya.

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

- Organization
- Branch
- Central Board
- Regional Board
- Branch Board
- Member

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
| status    | Enum   | Active / Inactive |

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

# Branch Endpoints

## Get Branches

```http
GET /api/v1/organization/branches
```

Query Parameter

| Parameter    | Type   | Description            |
| ------------ | ------ | ---------------------- |
| page         | Number | Halaman                |
| limit        | Number | Jumlah data            |
| search       | String | Pencarian              |
| province     | String | Filter provinsi        |
| regency      | String | Filter kabupaten/kota  |
| status       | Enum   | Active / Inactive      |

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

Menggunakan Soft Delete.

---

# Central Board Endpoints

## Get Central Board

```http
GET /api/v1/organization/central-board
```

Query Parameter

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| page      | Number | Halaman     |
| limit     | Number | Jumlah data |
| search    | String | Pencarian   |
| status    | Enum   | Active / Inactive |

---

## Get Central Board Detail

```http
GET /api/v1/organization/central-board/{id}
```

---

## Assign Central Board

```http
POST /api/v1/organization/central-board
```

Body:

```json
{
  "user_id": "uuid",
  "organization_id": "uuid"
}
```

---

## Update Central Board

```http
PUT /api/v1/organization/central-board/{id}
```

---

## Remove Central Board

```http
DELETE /api/v1/organization/central-board/{id}
```

Menggunakan Soft Delete.

---

# Regional Board Endpoints

## Get Regional Board

```http
GET /api/v1/organization/regional-board
```

Query Parameter

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| page      | Number | Halaman     |
| limit     | Number | Jumlah data |
| search    | String | Pencarian   |
| province  | String | Filter provinsi |
| status    | Enum   | Active / Inactive |

---

## Get Regional Board Detail

```http
GET /api/v1/organization/regional-board/{id}
```

---

## Assign Regional Board

```http
POST /api/v1/organization/regional-board
```

Body:

```json
{
  "user_id": "uuid",
  "organization_id": "uuid",
  "province": "string"
}
```

---

## Update Regional Board

```http
PUT /api/v1/organization/regional-board/{id}
```

---

## Remove Regional Board

```http
DELETE /api/v1/organization/regional-board/{id}
```

Menggunakan Soft Delete.

---

# Branch Board Endpoints

## Get Branch Board

```http
GET /api/v1/organization/branch-board
```

Query Parameter

| Parameter  | Type   | Description |
| ---------- | ------ | ----------- |
| page       | Number | Halaman     |
| limit      | Number | Jumlah data |
| search     | String | Pencarian   |
| branch_id  | UUID   | Filter cabang |
| status     | Enum   | Active / Inactive |

---

## Get Branch Board Detail

```http
GET /api/v1/organization/branch-board/{id}
```

---

## Assign Branch Board

```http
POST /api/v1/organization/branch-board
```

Body:

```json
{
  "user_id": "uuid",
  "organization_id": "uuid",
  "branch_id": "uuid"
}
```

---

## Update Branch Board

```http
PUT /api/v1/organization/branch-board/{id}
```

---

## Remove Branch Board

```http
DELETE /api/v1/organization/branch-board/{id}
```

Menggunakan Soft Delete.

---

# Member Endpoints

## Get Members

```http
GET /api/v1/organization/members
```

Query Parameter

| Parameter  | Type   | Description |
| ---------- | ------ | ----------- |
| page       | Number | Halaman     |
| limit      | Number | Jumlah data |
| search     | String | Pencarian   |
| branch_id  | UUID   | Filter cabang |
| status     | Enum   | Active / Inactive |

---

## Get Member Detail

```http
GET /api/v1/organization/members/{id}
```

---

## Add Member

```http
POST /api/v1/organization/members
```

Body:

```json
{
  "user_id": "uuid",
  "organization_id": "uuid",
  "branch_id": "uuid"
}
```

---

## Update Member

```http
PUT /api/v1/organization/members/{id}
```

---

## Remove Member

```http
DELETE /api/v1/organization/members/{id}
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

## Central Board List

```http
GET /api/v1/public/organization/central-board
```

---

## Regional Board List

```http
GET /api/v1/public/organization/regional-board
```

---

## Branch Board List

```http
GET /api/v1/public/organization/branch-board
```

---

## Active Member List

```http
GET /api/v1/public/organization/members
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

- Seluruh endpoint Admin memerlukan Authentication.
- Seluruh endpoint memerlukan Permission sesuai aksi.
- Endpoint Public hanya menampilkan data yang berstatus Active.
- Delete menggunakan Soft Delete.
- Seluruh perubahan dicatat pada Audit Log.

---

# Security

API Organization wajib:

- Memvalidasi Session.
- Memvalidasi Permission.
- Memvalidasi seluruh input.
- Menggunakan HTTPS pada Production.
- Menolak akses tanpa hak.

---

# Performance

Seluruh endpoint harus mendukung:

- Pagination
- Search
- Filtering
- Sorting
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

API Organization dianggap selesai apabila:

- Seluruh endpoint CRUD tersedia untuk Organization, Branch, Central Board, Regional Board, Branch Board, dan Member.
- Endpoint Public hanya menampilkan data aktif.
- Response mengikuti standar API proyek.
- Seluruh endpoint mengikuti Business Rules, Security Policy, dan Repository Pattern.