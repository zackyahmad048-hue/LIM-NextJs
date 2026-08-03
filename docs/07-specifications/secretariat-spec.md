# Secretariat Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `secretariat-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Secretariat Domain**.

Secretariat Domain bertanggung jawab mengelola administrasi organisasi, termasuk agenda, disposisi, arsip administrasi, dokumen internal, surat masuk, surat keluar, dan kegiatan kesekretariatan lainnya.

Domain ini menjadi pusat administrasi organisasi dan berintegrasi dengan Letter, Organization, Notification, dan Dashboard Domain.

---

# Objectives

Secretariat harus mampu:

- Mengelola Agenda.
- Mengelola Surat Masuk.
- Mengelola Surat Keluar.
- Mengelola Disposisi.
- Mengelola Arsip Administrasi.
- Mengelola Dokumen Internal.
- Melacak Status Administrasi.

---

# Actors

| Actor               | Description                      |
| ------------------- | -------------------------------- |
| Super Administrator | Mengelola seluruh administrasi   |
| Secretariat Staff   | Mengelola administrasi harian    |
| Administrator       | Melakukan persetujuan tertentu   |
| User                | Melihat dokumen sesuai hak akses |
| System              | Menghasilkan nomor administrasi  |

---

# Functional Requirements

## Agenda Management

Mengelola:

- Agenda Rapat
- Agenda Organisasi
- Jadwal Kegiatan
- Kalender Internal

---

## Incoming Mail

Mengelola:

- Registrasi Surat Masuk
- Klasifikasi
- Disposisi
- Arsip

---

## Outgoing Mail

Mengelola:

- Draft
- Approval
- Penomoran
- Pengiriman
- Arsip

---

## Disposition

Mengelola:

- Tujuan Disposisi
- Catatan
- Status
- Tindak Lanjut

---

## Archive

Mengelola:

- Arsip Digital
- Arsip Administrasi
- Kategori Arsip
- Retensi Arsip

---

# Non Functional Requirements

Secretariat harus:

- Response < 500 ms.
- Audit Enabled.
- Mendukung Full Text Search.
- Highly Available.

---

# Preconditions

- User telah Login.
- Permission sesuai.
- Dokumen tervalidasi.

---

# Postconditions

- Data tersimpan.
- Nomor administrasi dibuat (jika diperlukan).
- Audit Log dibuat.
- Notification dikirim.
- Domain Event diterbitkan.

---

# Main Flow

```text id="secspec01"
Request

↓

Authentication

↓

Authorization

↓

Validation

↓

Secretariat Service

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

```text id="secspec02"
Save Draft

↓

Review

↓

Approve

↓

Archive
```

---

# Exception Flow

- Dokumen tidak ditemukan.
- Nomor administrasi sudah digunakan.
- Permission ditolak.
- Status tidak valid.
- Arsip tidak tersedia.

---

# Sequence Diagram

```text id="secspec03"
Client

↓

Secretariat API

↓

Application

↓

Repository

↓

Database

↓

Notification

↓

Response
```

---

# State Diagram

```text id="secspec04"
Draft

↓

Submitted

↓

Approved

↓

Archived
```

---

# Domain Model

Entity:

- Agenda
- IncomingMail
- OutgoingMail
- Disposition
- Archive

Aggregate:

- Secretariat

Value Object:

- AgendaNumber
- DocumentNumber
- ArchiveCode

---

# Database Mapping

Tables:

```text id="secspec05"
agendas

incoming_mails

outgoing_mails

dispositions

archives
```

---

# API Specification

| Method | Endpoint               |
| ------ | ---------------------- |
| GET    | /api/v1/agendas        |
| POST   | /api/v1/agendas        |
| GET    | /api/v1/incoming-mails |
| POST   | /api/v1/incoming-mails |
| GET    | /api/v1/outgoing-mails |
| POST   | /api/v1/outgoing-mails |
| POST   | /api/v1/dispositions   |

---

# Validation Matrix

| Field          | Rule             |
| -------------- | ---------------- |
| documentNumber | Required, Unique |
| subject        | Required         |
| sender         | Required         |
| receivedDate   | Required         |
| category       | Required         |

---

# Permission Matrix

| Action  | Admin | Secretariat |  User   |
| ------- | :---: | :---------: | :-----: |
| View    |  ✅   |     ✅      | Limited |
| Create  |  ✅   |     ✅      |   ❌    |
| Update  |  ✅   |     ✅      |   ❌    |
| Approve |  ✅   |     ❌      |   ❌    |
| Archive |  ✅   |     ✅      |   ❌    |

---

# Error Catalog

| Code    | Description               |
| ------- | ------------------------- |
| SEC_001 | Document Not Found        |
| SEC_002 | Duplicate Document Number |
| SEC_003 | Invalid Status            |
| SEC_004 | Archive Not Found         |
| SEC_005 | Invalid Disposition       |

---

# Notification Matrix

| Event                  | Notification         |
| ---------------------- | -------------------- |
| Incoming Mail Received | Secretariat          |
| Outgoing Mail Approved | Administrator        |
| Disposition Assigned   | Assigned User        |
| Agenda Created         | Related Participants |

---

# Domain Events

```text id="secspec06"
AgendaCreated

IncomingMailRegistered

OutgoingMailApproved

DispositionAssigned

ArchiveCreated
```

---

# Acceptance Test

- Agenda berhasil dibuat.
- Surat masuk berhasil diregistrasi.
- Surat keluar berhasil disetujui.
- Disposisi berhasil diberikan.
- Arsip berhasil dibuat.
- Notification terkirim.
- Audit Log tercatat.
- Domain Event diterbitkan.

---

# Performance Requirement

- Create Agenda < 500 ms.
- Register Mail < 500 ms.
- Search Archive < 300 ms.
- List Documents mendukung Pagination.

---

# Security Requirement

- RBAC diterapkan.
- Audit Log aktif.
- Nomor dokumen bersifat unik.
- Arsip mengikuti kebijakan retensi.
- Seluruh endpoint menggunakan HTTPS.

---

# Acceptance Criteria

- Seluruh proses administrasi berjalan sesuai Business Rules.
- Penomoran dokumen konsisten.
- Disposisi dan Arsip terdokumentasi.
- Notification dan Domain Event berjalan sesuai desain.
- Specification siap digunakan sebagai dasar implementasi Secretariat Domain.
