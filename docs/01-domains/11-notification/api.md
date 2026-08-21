# Notification API

**Project:** LIM Digital Platform

**Domain:** Notification

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar REST API pada Domain Notification.

API Notification digunakan untuk mengelola notifikasi, template, queue, riwayat pengiriman, preferensi pengguna, dan arsip notifikasi.

---

# Base URL

```text id="ntfapi01"
/api/v1/notifications
```

---

# Authentication

Seluruh endpoint memerlukan:

- Authentication
- Session Valid
- Authorization

---

# API Modules

Domain Notification terdiri dari:

- Notification
- Template
- Queue
- Delivery
- Preference
- Archive

---

# Notification Endpoints

## Get Notifications

```http id="ntfapi02"
GET /api/v1/notifications
```

Query Parameter

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| page      | Number | Halaman     |
| limit     | Number | Jumlah data |
| search    | String | Kata kunci  |
| status    | Enum   | Status      |
| type      | Enum   | Jenis       |
| channel   | Enum   | Kanal       |

---

## Get Notification Detail

```http id="ntfapi03"
GET /api/v1/notifications/{id}
```

---

## Create Notification

```http id="ntfapi04"
POST /api/v1/notifications
```

---

## Update Notification

```http id="ntfapi05"
PUT /api/v1/notifications/{id}
```

---

## Delete Notification

```http id="ntfapi06"
DELETE /api/v1/notifications/{id}
```

Soft Delete.

---

## Mark As Read

```http id="ntfapi07"
POST /api/v1/notifications/{id}/read
```

---

## Retry Notification

```http id="ntfapi08"
POST /api/v1/notifications/{id}/retry
```

---

# Template Endpoints

## Get Templates

```http id="ntfapi09"
GET /api/v1/notifications/templates
```

---

## Create Template

```http id="ntfapi10"
POST /api/v1/notifications/templates
```

---

## Update Template

```http id="ntfapi11"
PUT /api/v1/notifications/templates/{id}
```

---

## Delete Template

```http id="ntfapi12"
DELETE /api/v1/notifications/templates/{id}
```

---

# Queue Endpoints

## Get Queue

```http id="ntfapi13"
GET /api/v1/notifications/queue
```

---

## Retry Queue

```http id="ntfapi14"
POST /api/v1/notifications/queue/{id}/retry
```

---

# Delivery Endpoints

## Get Delivery History

```http id="ntfapi15"
GET /api/v1/notifications/delivery
```

---

## Get Delivery Detail

```http id="ntfapi16"
GET /api/v1/notifications/delivery/{id}
```

---

# Preference Endpoints

## Get My Preferences

```http id="ntfapi17"
GET /api/v1/notifications/preferences
```

---

## Update Preferences

```http id="ntfapi18"
PUT /api/v1/notifications/preferences
```

---

# Archive Endpoints

## Get Archives

```http id="ntfapi19"
GET /api/v1/notifications/archives
```

---

## Restore Notification

```http id="ntfapi20"
POST /api/v1/notifications/{id}/restore
```

---

# Response Format

Response berhasil

```json id="ntfapi21"
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Response gagal

```json id="ntfapi22"
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

- Seluruh endpoint memerlukan Authentication.
- Seluruh notifikasi dikirim melalui Queue.
- Retry hanya untuk status **Failed**.
- Delete menggunakan Soft Delete.
- Riwayat Delivery tidak dapat dihapus.
- Seluruh aktivitas dicatat pada Audit Log.

---

# Security

API Notification wajib:

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
- Queue Processing

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

- Seluruh endpoint CRUD tersedia.
- Queue dan Retry berjalan normal.
- Response mengikuti standar API proyek.
- Seluruh endpoint mengikuti Business Rules, Security Policy, dan Repository Pattern.
