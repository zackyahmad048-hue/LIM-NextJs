# Letter API

**Project:** LIM Digital Platform

**Domain:** Letter

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar REST API pada Domain Letter.

API Letter digunakan untuk mengelola seluruh proses pembuatan surat, persetujuan, penomoran, penandatanganan, distribusi, dan pengarsipan surat resmi organisasi.

---

# Base URL

```text id="ltrapi01"
/api/v1/letters
```

---

# Authentication

Seluruh endpoint Admin memerlukan:

* Authentication
* Session Valid
* Authorization

Endpoint Public tidak tersedia pada versi 1.0.

---

# API Modules

Domain Letter terdiri dari:

* Letter
* Template
* Approval
* Signature
* Distribution
* Archive

---

# Letter Endpoints

## Get Letters

```http id="ltrapi02"
GET /api/v1/letters
```

Query Parameter

| Parameter | Type   | Description    |
| --------- | ------ | -------------- |
| page      | Number | Halaman        |
| limit     | Number | Jumlah data    |
| search    | String | Kata kunci     |
| status    | Enum   | Status Surat   |
| startDate | Date   | Filter tanggal |
| endDate   | Date   | Filter tanggal |

---

## Get Letter Detail

```http id="ltrapi03"
GET /api/v1/letters/{id}
```

---

## Create Letter

```http id="ltrapi04"
POST /api/v1/letters
```

---

## Update Letter

```http id="ltrapi05"
PUT /api/v1/letters/{id}
```

---

## Delete Letter

```http id="ltrapi06"
DELETE /api/v1/letters/{id}
```

Soft Delete.

---

## Submit Letter

```http id="ltrapi07"
POST /api/v1/letters/{id}/submit
```

---

## Approve Letter

```http id="ltrapi08"
POST /api/v1/letters/{id}/approve
```

---

## Reject Letter

```http id="ltrapi09"
POST /api/v1/letters/{id}/reject
```

---

## Generate Number

```http id="ltrapi10"
POST /api/v1/letters/{id}/generate-number
```

---

## Sign Letter

```http id="ltrapi11"
POST /api/v1/letters/{id}/sign
```

---

## Send Letter

```http id="ltrapi12"
POST /api/v1/letters/{id}/send
```

---

## Archive Letter

```http id="ltrapi13"
POST /api/v1/letters/{id}/archive
```

---

# Template Endpoints

## Get Templates

```http id="ltrapi14"
GET /api/v1/letters/templates
```

---

## Create Template

```http id="ltrapi15"
POST /api/v1/letters/templates
```

---

## Update Template

```http id="ltrapi16"
PUT /api/v1/letters/templates/{id}
```

---

## Delete Template

```http id="ltrapi17"
DELETE /api/v1/letters/templates/{id}
```

---

# Distribution Endpoints

## Get Distribution History

```http id="ltrapi18"
GET /api/v1/letters/{id}/distribution
```

---

## Resend Letter

```http id="ltrapi19"
POST /api/v1/letters/{id}/distribution/resend
```

---

# Archive Endpoints

## Get Archives

```http id="ltrapi20"
GET /api/v1/letters/archives
```

---

## Restore Letter

```http id="ltrapi21"
POST /api/v1/letters/{id}/restore
```

---

# Response Format

Response berhasil

```json id="ltrapi22"
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Response gagal

```json id="ltrapi23"
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
* Seluruh endpoint memerlukan Permission.
* Nomor surat hanya dapat dibuat setelah Approval.
* Surat hanya dapat ditandatangani setelah nomor surat tersedia.
* Surat hanya dapat dikirim setelah Signed.
* Delete menggunakan Soft Delete.
* Seluruh aktivitas dicatat pada Audit Log.

---

# Security

API Letter wajib:

* Memvalidasi Session.
* Memvalidasi Permission.
* Memvalidasi seluruh input.
* Menggunakan HTTPS pada Production.

---

# Performance

Seluruh endpoint mendukung:

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

API Letter dianggap selesai apabila:

* Seluruh endpoint CRUD tersedia.
* Approval, Signature, dan Distribution berjalan sesuai workflow.
* Response mengikuti standar API proyek.
* Seluruh endpoint mengikuti Business Rules, Security Policy, dan Repository Pattern.
