# Program Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `program-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Program Domain**.

Program Domain bertanggung jawab mengelola seluruh kegiatan, program kerja, pelatihan, seminar, workshop, dan aktivitas organisasi yang dilaksanakan oleh LIM.

Domain ini menjadi pusat pengelolaan siklus hidup program mulai dari perencanaan hingga evaluasi.

---

# Objectives

Program harus mampu:

* Mengelola Program.
* Mengelola Kategori Program.
* Mengelola Jadwal.
* Mengelola Peserta.
* Mengelola Registrasi.
* Mengelola Status Program.
* Mengelola Evaluasi Program.

---

# Actors

| Actor               | Description                         |
| ------------------- | ----------------------------------- |
| Super Administrator | Mengelola seluruh program           |
| Administrator       | Mengelola program organisasi        |
| Operator            | Mengelola operasional program       |
| Participant         | Mengikuti program                   |
| Public User         | Melihat program yang dipublikasikan |

---

# Functional Requirements

## Program Management

Administrator dapat:

* Create Program
* Update Program
* Delete Program
* Publish Program
* Archive Program

---

## Category Management

Mengelola:

* Seminar
* Workshop
* Training
* Webinar
* Social Activity
* Internal Meeting

---

## Schedule Management

Mengelola:

* Date
* Time
* Venue
* Online Meeting
* Registration Period

---

## Participant Management

Mengelola:

* Registration
* Attendance
* Participant Status
* Certificate Eligibility

---

## Evaluation

Setelah program selesai:

* Feedback
* Evaluation Score
* Completion Report

---

# Non Functional Requirements

Program harus:

* Response < 500 ms.
* Mendukung Pagination.
* Audit Enabled.
* Highly Available.

---

# Preconditions

* User telah Login.
* Memiliki Permission.
* Data Program valid.

---

# Postconditions

* Program tersimpan.
* Audit Log dibuat.
* Domain Event diterbitkan.
* Notification dikirim (jika diperlukan).

---

# Main Flow

```text id="prog01"
Request

↓

Authentication

↓

Authorization

↓

Validation

↓

Program Service

↓

Repository

↓

Database

↓

Publish Event

↓

Response
```

---

# Alternative Flow

```text id="prog02"
Save Draft

↓

Edit

↓

Publish
```

---

# Exception Flow

* Program tidak ditemukan.
* Nama Program sudah digunakan.
* Jadwal bentrok.
* Registrasi ditutup.
* Permission ditolak.

---

# Sequence Diagram

```text id="prog03"
Client

↓

Program API

↓

Application

↓

Program Aggregate

↓

Repository

↓

Database

↓

Event Bus
```

---

# State Diagram

```text id="prog04"
Draft

↓

Published

↓

Registration Open

↓

Registration Closed

↓

Ongoing

↓

Completed

↓

Archived
```

---

# Domain Model

Entity:

* Program
* ProgramCategory
* Schedule
* Participant
* Registration

Aggregate:

* Program

Value Object:

* ProgramCode
* ProgramStatus
* Venue
* RegistrationPeriod

---

# Database Mapping

Tables:

```text id="prog05"
programs

program_categories

program_schedules

program_registrations

program_participants
```

---

# API Specification

| Method | Endpoint                       |
| ------ | ------------------------------ |
| GET    | /api/v1/programs               |
| GET    | /api/v1/programs/{id}          |
| POST   | /api/v1/programs               |
| PATCH  | /api/v1/programs/{id}          |
| DELETE | /api/v1/programs/{id}          |
| POST   | /api/v1/programs/{id}/publish  |
| POST   | /api/v1/programs/{id}/register |

---

# Validation Matrix

| Field                | Rule                  |
| -------------------- | --------------------- |
| title                | Required, Max 255     |
| categoryId           | Required              |
| startDate            | Required              |
| endDate              | Required, ≥ startDate |
| registrationDeadline | Required              |
| capacity             | Integer > 0           |

---

# Permission Matrix

| Action   | Admin | Operator | Participant | Public |
| -------- | :---: | :------: | :---------: | :----: |
| View     |   ✅   |     ✅    |      ✅      |    ✅   |
| Create   |   ✅   |     ✅    |      ❌      |    ❌   |
| Update   |   ✅   |     ✅    |      ❌      |    ❌   |
| Publish  |   ✅   |     ❌    |      ❌      |    ❌   |
| Register |   ❌   |     ❌    |      ✅      |    ❌   |

---

# Error Catalog

| Code        | Description                    |
| ----------- | ------------------------------ |
| PROGRAM_001 | Program Not Found              |
| PROGRAM_002 | Duplicate Program              |
| PROGRAM_003 | Invalid Schedule               |
| PROGRAM_004 | Registration Closed            |
| PROGRAM_005 | Capacity Reached               |
| PROGRAM_006 | Participant Already Registered |

---

# Notification Matrix

| Event                | Notification |
| -------------------- | ------------ |
| Program Published    | Email / Push |
| Registration Success | Email        |
| Registration Closed  | Email        |
| Program Reminder     | Email / Push |
| Program Cancelled    | Email / Push |

---

# Domain Events

```text id="prog06"
ProgramCreated

ProgramPublished

ProgramUpdated

ParticipantRegistered

RegistrationClosed

ProgramCompleted
```

---

# Acceptance Test

* Program berhasil dibuat.
* Program berhasil dipublikasikan.
* Peserta berhasil mendaftar.
* Registrasi ditutup sesuai jadwal.
* Kapasitas peserta divalidasi.
* Notification terkirim.
* Audit Log tercatat.
* Domain Event diterbitkan.

---

# Performance Requirement

* Create Program < 500 ms.
* Search Program < 300 ms.
* Registration < 500 ms.
* Dashboard Statistics < 300 ms.

---

# Security Requirement

* RBAC diterapkan.
* Audit Log aktif.
* Input tervalidasi.
* Soft Delete digunakan.
* Seluruh endpoint menggunakan HTTPS.
* Registrasi hanya dapat dilakukan oleh pengguna yang telah login.

---

# Acceptance Criteria

* Seluruh Business Rules Program berjalan sesuai spesifikasi.
* Siklus hidup Program mengikuti State Diagram.
* Registrasi peserta tervalidasi.
* Notification dan Domain Event berjalan sesuai desain.
* Specification siap digunakan sebagai dasar implementasi Program Domain.
