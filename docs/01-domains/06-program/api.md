# Program API

**Project:** LIM Digital Platform

**Domain:** Program

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar REST API pada Domain Program.

API Program digunakan untuk mengelola seluruh siklus kegiatan organisasi mulai dari Program, Jadwal, Panitia, Peserta, Absensi, hingga Dokumentasi.

---

# Base URL

```text id="prgapi01"
/api/v1/programs
```

---

# Authentication

Seluruh endpoint Admin memerlukan:

* Authentication
* Session Valid
* Authorization

Endpoint Public hanya dapat mengakses Program yang telah dipublikasikan.

---

# API Modules

Domain Program terdiri dari:

* Program
* Schedule
* Committee
* Participant
* Attendance
* Documentation

---

# Program Endpoints

## Get Programs

```http id="prgapi02"
GET /api/v1/programs
```

Query Parameter

| Parameter | Type   | Description    |
| --------- | ------ | -------------- |
| page      | Number | Halaman        |
| limit     | Number | Jumlah data    |
| search    | String | Kata kunci     |
| status    | Enum   | Status Program |
| type      | String | Jenis Program  |
| startDate | Date   | Filter tanggal |

---

## Get Program Detail

```http id="prgapi03"
GET /api/v1/programs/{id}
```

---

## Create Program

```http id="prgapi04"
POST /api/v1/programs
```

---

## Update Program

```http id="prgapi05"
PUT /api/v1/programs/{id}
```

---

## Delete Program

```http id="prgapi06"
DELETE /api/v1/programs/{id}
```

Soft Delete.

---

## Publish Program

```http id="prgapi07"
POST /api/v1/programs/{id}/publish
```

---

## Cancel Program

```http id="prgapi08"
POST /api/v1/programs/{id}/cancel
```

---

## Complete Program

```http id="prgapi09"
POST /api/v1/programs/{id}/complete
```

---

# Schedule Endpoints

## Get Schedule

```http id="prgapi10"
GET /api/v1/programs/{id}/schedules
```

---

## Create Schedule

```http id="prgapi11"
POST /api/v1/programs/{id}/schedules
```

---

## Update Schedule

```http id="prgapi12"
PUT /api/v1/programs/schedules/{scheduleId}
```

---

## Delete Schedule

```http id="prgapi13"
DELETE /api/v1/programs/schedules/{scheduleId}
```

---

# Committee Endpoints

## Get Committees

```http id="prgapi14"
GET /api/v1/programs/{id}/committees
```

---

## Assign Committee

```http id="prgapi15"
POST /api/v1/programs/{id}/committees
```

---

## Update Committee

```http id="prgapi16"
PUT /api/v1/programs/committees/{committeeId}
```

---

## Remove Committee

```http id="prgapi17"
DELETE /api/v1/programs/committees/{committeeId}
```

---

# Participant Endpoints

## Get Participants

```http id="prgapi18"
GET /api/v1/programs/{id}/participants
```

---

## Register Participant

```http id="prgapi19"
POST /api/v1/programs/{id}/participants
```

---

## Update Participant

```http id="prgapi20"
PUT /api/v1/programs/participants/{participantId}
```

---

## Remove Participant

```http id="prgapi21"
DELETE /api/v1/programs/participants/{participantId}
```

---

# Attendance Endpoints

## Get Attendance

```http id="prgapi22"
GET /api/v1/programs/{id}/attendance
```

---

## Check In

```http id="prgapi23"
POST /api/v1/programs/{id}/attendance/check-in
```

---

## Check Out

```http id="prgapi24"
POST /api/v1/programs/{id}/attendance/check-out
```

---

# Documentation Endpoints

## Get Documentation

```http id="prgapi25"
GET /api/v1/programs/{id}/documentation
```

---

## Upload Documentation

```http id="prgapi26"
POST /api/v1/programs/{id}/documentation
```

---

## Delete Documentation

```http id="prgapi27"
DELETE /api/v1/programs/documentation/{documentationId}
```

---

# Public API

Endpoint berikut dapat diakses Website dan Mobile.

## Published Programs

```http id="prgapi28"
GET /api/v1/public/programs
```

---

## Program Detail

```http id="prgapi29"
GET /api/v1/public/programs/{slug}
```

---

## Upcoming Programs

```http id="prgapi30"
GET /api/v1/public/programs/upcoming
```

---

## Registration

```http id="prgapi31"
POST /api/v1/public/programs/{id}/register
```

---

# Response Format

Response berhasil

```json id="prgapi32"
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Response gagal

```json id="prgapi33"
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
* Seluruh endpoint memerlukan Permission.
* Endpoint Public hanya menampilkan Program berstatus **Published** atau **Registration Open**.
* Absensi hanya dapat dilakukan pada Program **On Going**.
* Delete menggunakan Soft Delete.
* Seluruh perubahan dicatat pada Audit Log.

---

# Security

API Program wajib:

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

API Program dianggap selesai apabila:

* Seluruh endpoint CRUD tersedia.
* Public API hanya menampilkan Program yang valid.
* Response mengikuti standar API proyek.
* Seluruh endpoint mengikuti Business Rules, Security Policy, dan Repository Pattern.
