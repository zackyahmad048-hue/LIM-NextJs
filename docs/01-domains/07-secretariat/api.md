# Secretariat API

**Project:** LIM Digital Platform

**Domain:** Secretariat

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar REST API pada Domain Secretariat.

API Secretariat digunakan untuk mengelola administrasi organisasi meliputi surat masuk, surat keluar, disposisi, dokumen administrasi, agenda, dan arsip.

---

# Base URL

```text id="secapi01"
/api/v1/secretariat
```

---

# Authentication

Seluruh endpoint Admin memerlukan:

- Authentication
- Session Valid
- Authorization

---

# API Modules

Domain Secretariat terdiri dari:

- Incoming Mail
- Outgoing Mail
- Disposition
- Administrative Document
- Agenda Book
- Archive

---

# Incoming Mail Endpoints

## Get Incoming Mail

```http id="secapi02"
GET /api/v1/secretariat/incoming-mails
```

Query Parameter

| Parameter | Type   | Description    |
| --------- | ------ | -------------- |
| page      | Number | Halaman        |
| limit     | Number | Jumlah data    |
| search    | String | Kata kunci     |
| status    | Enum   | Status         |
| startDate | Date   | Filter tanggal |
| endDate   | Date   | Filter tanggal |

---

## Get Incoming Mail Detail

```http id="secapi03"
GET /api/v1/secretariat/incoming-mails/{id}
```

---

## Create Incoming Mail

```http id="secapi04"
POST /api/v1/secretariat/incoming-mails
```

---

## Update Incoming Mail

```http id="secapi05"
PUT /api/v1/secretariat/incoming-mails/{id}
```

---

## Delete Incoming Mail

```http id="secapi06"
DELETE /api/v1/secretariat/incoming-mails/{id}
```

Soft Delete.

---

# Outgoing Mail Endpoints

## Get Outgoing Mail

```http id="secapi07"
GET /api/v1/secretariat/outgoing-mails
```

---

## Get Outgoing Mail Detail

```http id="secapi08"
GET /api/v1/secretariat/outgoing-mails/{id}
```

---

## Create Outgoing Mail

```http id="secapi09"
POST /api/v1/secretariat/outgoing-mails
```

---

## Update Outgoing Mail

```http id="secapi10"
PUT /api/v1/secretariat/outgoing-mails/{id}
```

---

## Delete Outgoing Mail

```http id="secapi11"
DELETE /api/v1/secretariat/outgoing-mails/{id}
```

---

# Outgoing Mail Transition & Numbering

Implementasi saat ini menggunakan **Server Actions** (bukan REST) di
`modules/secretariat/presentation/secretariat.action.ts`:

- `transitionOutgoingMailStatus(id, status)` — transisi `DRAFT → SENT`, `SENT → DRAFT | ARCHIVED`. Nomor & QR diterbitkan saat transisi ke `SENT`.
- `createOutgoingMail(formData)` — simpan surat (status awal `DRAFT`). Menyimpan penanda tangan (ketua/sekretaris) dan posisi QR (mm).
- `updateOutgoingMail(id, formData)` — ubah surat (ditunda untuk `ARCHIVED`). Saat level/kategori berubah pada surat `SENT`, nomor & QR diterbitkan ulang (`re-sign`).
- `updateLetterNumberingSettings(prevState, formData)` — pengaturan penomoran (khusus super admin).
- `setLetterNextSequence(formData)` — koreksi manual nomor urut berikutnya per periode.

Status surat keluar yang berlaku: `DRAFT`, `SENT`, `ARCHIVED`.

## QR Position Editor Endpoint

```http
GET /api/admin/secretariat/qr-editor?fileId={fileId}
GET /api/admin/secretariat/qr-editor?fileId={fileId}&detect=1
```

Merender setiap halaman dokumen (PDF) menjadi gambar PNG untuk editor posisi
QR. Memerlukan sesi admin dengan izin `secretariat.outgoing-mail.update`.
Query param `detect=1` juga menjalankan **deteksi simbol fiducial** dan
mengembalikan posisinya. Respon:

```json
{
  "success": true,
  "pages": [
    {
      "page": 1,
      "widthPt": 595.28,
      "heightPt": 841.89,
      "width": 893,
      "height": 1263,
      "dataUrl": "data:image/png;base64,..."
    }
  ],
  "fiducial": {
    "ketua": { "page": 1, "x": 78.5, "y": 71.5 },
    "sekretaris": { "page": 1, "x": 118.5, "y": 71.5 },
    "verifikasi": { "x": 162.5, "y": 0 }
  }
}
```

`fiducial` hanya ada bila `detect=1`; setiap nilai `null` berarti simbol tidak
terdeteksi pada halaman mana pun. Posisi hasil deteksi sudah **di-center** ke
pojok kiri-bawah QR (centroid simbol digeser setengah ukuran QR), sehingga QR
menutupi simbol di tengah. Koordinat disimpan dalam **mm** dari pojok kiri-bawah
halaman.

# Disposition Endpoints

## Get Dispositions

```http id="secapi12"
GET /api/v1/secretariat/dispositions
```

---

## Get Disposition Detail

```http id="secapi13"
GET /api/v1/secretariat/dispositions/{id}
```

---

## Create Disposition

```http id="secapi14"
POST /api/v1/secretariat/dispositions
```

---

## Update Disposition

```http id="secapi15"
PUT /api/v1/secretariat/dispositions/{id}
```

---

## Complete Disposition

```http id="secapi16"
POST /api/v1/secretariat/dispositions/{id}/complete
```

---

# Administrative Document Endpoints

## Get Documents

```http id="secapi17"
GET /api/v1/secretariat/documents
```

---

## Get Document Detail

```http id="secapi18"
GET /api/v1/secretariat/documents/{id}
```

---

## Create Document

```http id="secapi19"
POST /api/v1/secretariat/documents
```

---

## Update Document

```http id="secapi20"
PUT /api/v1/secretariat/documents/{id}
```

---

## Archive Document

```http id="secapi21"
POST /api/v1/secretariat/documents/{id}/archive
```

---

## Restore Document

```http id="secapi22"
POST /api/v1/secretariat/documents/{id}/restore
```

---

# Agenda Book Endpoints

## Get Agenda

```http id="secapi23"
GET /api/v1/secretariat/agenda
```

---

## Get Agenda Detail

```http id="secapi24"
GET /api/v1/secretariat/agenda/{id}
```

Agenda dibuat otomatis dan bersifat Read Only.

---

# Archive Endpoints

## Get Archives

```http id="secapi25"
GET /api/v1/secretariat/archives
```

---

## Get Archive Detail

```http id="secapi26"
GET /api/v1/secretariat/archives/{id}
```

---

# Response Format

Response berhasil

```json id="secapi27"
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Response gagal

```json id="secapi28"
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
- Nomor agenda dibuat otomatis.
- Nomor surat harus unik.
- Arsip bersifat Read Only.
- Delete menggunakan Soft Delete.
- Seluruh perubahan dicatat pada Audit Log.

---

# Security

API Secretariat wajib:

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

API Secretariat dianggap selesai apabila:

- Seluruh endpoint CRUD tersedia.
- Response mengikuti standar API proyek.
- Nomor agenda dibuat otomatis.
- Arsip hanya dapat dibaca.
- Seluruh endpoint mengikuti Business Rules, Security Policy, dan Repository Pattern.
