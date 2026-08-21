# Certificate API

**Project:** LIM Digital Platform

**Domain:** Certificate

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar REST API pada Domain Certificate.

API Certificate digunakan untuk mengelola template sertifikat, penerbitan, penomoran, QR Verification, penandatanganan, distribusi, dan pengarsipan sertifikat digital.

---

# Base URL

```text id="crtapi01"
/api/v1/certificates
```

---

# Authentication

Seluruh endpoint Admin memerlukan:

- Authentication
- Session Valid
- Authorization

Endpoint verifikasi sertifikat dapat diakses secara publik.

---

# API Modules

Domain Certificate terdiri dari:

- Certificate
- Template
- Signature
- Distribution
- Verification
- Archive

---

# Certificate Endpoints

## Get Certificates

```http id="crtapi02"
GET /api/v1/certificates
```

Query Parameter

| Parameter | Type   | Description    |
| --------- | ------ | -------------- |
| page      | Number | Halaman        |
| limit     | Number | Jumlah data    |
| search    | String | Kata kunci     |
| status    | Enum   | Status         |
| programId | UUID   | Filter Program |
| userId    | UUID   | Filter Pemilik |

---

## Get Certificate Detail

```http id="crtapi03"
GET /api/v1/certificates/{id}
```

---

## Generate Certificate

```http id="crtapi04"
POST /api/v1/certificates
```

---

## Update Certificate

```http id="crtapi05"
PUT /api/v1/certificates/{id}
```

---

## Delete Certificate

```http id="crtapi06"
DELETE /api/v1/certificates/{id}
```

Soft Delete.

---

## Generate Number

```http id="crtapi07"
POST /api/v1/certificates/{id}/generate-number
```

---

## Generate QR Code

```http id="crtapi08"
POST /api/v1/certificates/{id}/generate-qr
```

---

## Sign Certificate

```http id="crtapi09"
POST /api/v1/certificates/{id}/sign
```

---

## Publish Certificate

```http id="crtapi10"
POST /api/v1/certificates/{id}/publish
```

---

## Revoke Certificate

```http id="crtapi11"
POST /api/v1/certificates/{id}/revoke
```

---

## Archive Certificate

```http id="crtapi12"
POST /api/v1/certificates/{id}/archive
```

---

# Template Endpoints

## Get Templates

```http id="crtapi13"
GET /api/v1/certificates/templates
```

---

## Create Template

```http id="crtapi14"
POST /api/v1/certificates/templates
```

---

## Update Template

```http id="crtapi15"
PUT /api/v1/certificates/templates/{id}
```

---

## Delete Template

```http id="crtapi16"
DELETE /api/v1/certificates/templates/{id}
```

---

# Distribution Endpoints

## Get Distribution History

```http id="crtapi17"
GET /api/v1/certificates/{id}/distribution
```

---

## Send Certificate

```http id="crtapi18"
POST /api/v1/certificates/{id}/send
```

---

## Resend Certificate

```http id="crtapi19"
POST /api/v1/certificates/{id}/distribution/resend
```

---

# Verification Endpoints

## Verify Certificate

```http id="crtapi20"
GET /api/v1/certificates/verify/{verificationCode}
```

Endpoint publik untuk memverifikasi keaslian sertifikat.

---

# Archive Endpoints

## Get Archives

```http id="crtapi21"
GET /api/v1/certificates/archives
```

---

## Restore Certificate

```http id="crtapi22"
POST /api/v1/certificates/{id}/restore
```

---

# Response Format

Response berhasil

```json id="crtapi23"
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Response gagal

```json id="crtapi24"
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
- Seluruh endpoint memerlukan Permission.
- Sertifikat hanya dapat dibuat dari Program berstatus **Completed**.
- Nomor sertifikat dibuat otomatis.
- QR Code dibuat sebelum Publish.
- Endpoint Verify bersifat Public.
- Delete menggunakan Soft Delete.
- Seluruh perubahan dicatat pada Audit Log.

---

# Security

API Certificate wajib:

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

API Certificate dianggap selesai apabila:

- Seluruh endpoint CRUD tersedia.
- QR Verification dapat diakses publik.
- Response mengikuti standar API proyek.
- Seluruh endpoint mengikuti Business Rules, Security Policy, dan Repository Pattern.
