# Program Database

**Project:** LIM Digital Platform

**Domain:** Program

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan struktur database pada Domain Program.

Domain Program menjadi pusat penyimpanan seluruh data kegiatan organisasi, mulai dari program, jadwal, panitia, peserta, absensi, hingga dokumentasi.

---

# Overview

Domain Program mengelola seluruh data operasional kegiatan organisasi.

Seluruh data disimpan menggunakan prinsip normalisasi dan menjadi referensi bagi Domain Certificate, Secretariat, Letter, Notification, dan Dashboard.

---

# Entity Relationship

```text id="prgdb01"
Program
   │
   ├────────────┬─────────────┬────────────┐
   ▼            ▼             ▼            ▼
Schedule   Committee   Participant   Documentation
                              │
                              ▼
                         Attendance
```

---

# Main Tables

## program

Menyimpan data utama Program.

| Field             | Type      | Description       |
| ----------------- | --------- | ----------------- |
| id                | UUID      | Primary Key       |
| code              | String    | Kode Program      |
| name              | String    | Nama Program      |
| type              | String    | Jenis Program     |
| description       | Text      | Deskripsi         |
| organizerId       | UUID      | Organization      |
| personInChargeId  | UUID      | Penanggung Jawab  |
| status            | Enum      | Status Program    |
| registrationOpen  | Timestamp | Mulai Pendaftaran |
| registrationClose | Timestamp | Akhir Pendaftaran |
| startDate         | Date      | Tanggal Mulai     |
| endDate           | Date      | Tanggal Selesai   |
| createdAt         | Timestamp | Dibuat            |
| updatedAt         | Timestamp | Diubah            |
| deletedAt         | Timestamp | Soft Delete       |

---

## program_schedule

Jadwal pelaksanaan Program.

| Field       | Type      |
| ----------- | --------- |
| id          | UUID      |
| programId   | UUID      |
| title       | String    |
| venueId     | UUID      |
| startTime   | Timestamp |
| endTime     | Timestamp |
| description | Text      |

---

## program_committee

Data panitia Program.

| Field     | Type   |
| --------- | ------ |
| id        | UUID   |
| programId | UUID   |
| userId    | UUID   |
| role      | String |
| status    | Enum   |

---

## participant

Data peserta Program.

| Field              | Type      |
| ------------------ | --------- |
| id                 | UUID      |
| programId          | UUID      |
| userId             | UUID      |
| registrationDate   | Timestamp |
| registrationStatus | Enum      |
| attendanceStatus   | Enum      |

---

## attendance

Data absensi peserta.

| Field         | Type      |
| ------------- | --------- |
| id            | UUID      |
| participantId | UUID      |
| checkIn       | Timestamp |
| checkOut      | Timestamp |
| status        | Enum      |

---

## program_documentation

Dokumentasi kegiatan.

| Field       | Type   |
| ----------- | ------ |
| id          | UUID   |
| programId   | UUID   |
| mediaId     | UUID   |
| title       | String |
| description | Text   |

---

# Relationships

| Source      | Relation | Target           |
| ----------- | -------- | ---------------- |
| Program     | 1 : N    | Program Schedule |
| Program     | 1 : N    | Committee        |
| Program     | 1 : N    | Participant      |
| Participant | 1 : N    | Attendance       |
| Program     | 1 : N    | Documentation    |
| Media       | 1 : N    | Documentation    |
| User        | 1 : N    | Committee        |
| User        | 1 : N    | Participant      |

---

# Indexes

Index dibuat pada:

```text id="prgdb02"
program.code

program.status

program.startDate

participant.userId

attendance.participantId

program_schedule.programId
```

---

# Constraints

## Program

- code wajib unik.
- name wajib diisi.
- startDate ≤ endDate.

---

## Participant

- Satu User hanya boleh terdaftar satu kali pada Program yang sama.

---

## Schedule

- endTime harus lebih besar dari startTime.

---

## Attendance

- Attendance hanya dapat dibuat apabila Participant valid.

---

# Soft Delete

Menggunakan Soft Delete:

- program
- participant
- committee
- program_schedule
- program_documentation

Attendance tidak menggunakan Soft Delete.

---

# Status Enum

## Program

```text id="prgdb03"
Draft

Published

Registration Open

Registration Closed

On Going

Completed

Cancelled

Archived
```

---

## Registration

```text id="prgdb04"
Pending

Approved

Rejected

Cancelled
```

---

## Attendance

```text id="prgdb05"
Present

Absent

Late

Excused
```

---

# Database Rules

- Program menjadi entitas utama.
- Peserta tidak boleh ganda pada Program yang sama.
- Jadwal minimal satu.
- Dokumentasi menggunakan Domain Media.
- Sertifikat menggunakan data Program.
- Seluruh akses database melalui Repository.

---

# Future Tables

Versi berikutnya dapat menambahkan:

```text id="prgdb06"
program_budget

program_sponsor

program_feedback

program_rating

program_checklist

program_task
```

---

# Related Documents

- README.md
- business-rules.md
- workflow.md
- api.md
- permissions.md
- validation.md
- ui.md
- roadmap.md

---

# Acceptance Criteria

Database Program dianggap selesai apabila:

- Struktur database mendukung seluruh siklus Program.
- Relasi antar tabel konsisten.
- Tidak terdapat peserta ganda.
- Seluruh Foreign Key valid.
- Seluruh akses database menggunakan Repository Pattern.
