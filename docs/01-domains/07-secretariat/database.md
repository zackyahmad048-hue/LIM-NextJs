# Secretariat Database

**Project:** LIM Digital Platform

**Domain:** Secretariat

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan struktur database pada Domain Secretariat.

Domain Secretariat menyimpan seluruh data administrasi organisasi yang berkaitan dengan surat, disposisi, arsip, agenda, dan dokumen resmi.

---

# Overview

Domain Secretariat menjadi pusat administrasi organisasi.

Seluruh data administrasi menggunakan standar database LIM Digital Platform dan menjadi referensi bagi Domain Letter, Dashboard, Notification, dan Knowledge.

---

# Entity Relationship

```text id="secdb01"
Incoming Mail
      │
      ▼
Disposition
      │
      ▼
Archive

Outgoing Mail
      │
      ▼
Archive

Administrative Document
      │
      ▼
Attachment
```

---

# Main Tables

## incoming_mail

Menyimpan data surat masuk.

| Field        | Type      | Description      |
| ------------ | --------- | ---------------- |
| id           | UUID      | Primary Key      |
| agendaNumber | String    | Nomor Agenda     |
| letterNumber | String    | Nomor Surat      |
| sender       | String    | Pengirim         |
| subject      | String    | Perihal          |
| letterDate   | Date      | Tanggal Surat    |
| receivedDate | Date      | Tanggal Diterima |
| attachmentId | UUID      | Lampiran         |
| status       | Enum      | Status Surat     |
| createdAt    | Timestamp | Dibuat           |
| updatedAt    | Timestamp | Diubah           |
| deletedAt    | Timestamp | Soft Delete      |

---

## outgoing_mail

Menyimpan data surat keluar.

| Field        | Type      |
| ------------ | --------- |
| id           | UUID      |
| letterNumber | String    |
| recipient    | String    |
| subject      | String    |
| signedBy     | UUID      |
| letterDate   | Date      |
| attachmentId | UUID      |
| status       | Enum      |
| createdAt    | Timestamp |
| updatedAt    | Timestamp |
| deletedAt    | Timestamp |

---

## disposition

Menyimpan disposisi surat.

| Field           | Type      |
| --------------- | --------- |
| id              | UUID      |
| incomingMailId  | UUID      |
| assignedTo      | UUID      |
| instruction     | Text      |
| dispositionDate | Timestamp |
| status          | Enum      |

---

## administrative_document

Dokumen administrasi organisasi.

| Field          | Type      |
| -------------- | --------- |
| id             | UUID      |
| documentNumber | String    |
| documentType   | String    |
| title          | String    |
| description    | Text      |
| attachmentId   | UUID      |
| status         | Enum      |
| createdAt      | Timestamp |
| updatedAt      | Timestamp |
| deletedAt      | Timestamp |

---

## agenda_book

Menyimpan nomor agenda.

| Field         | Type      |
| ------------- | --------- |
| id            | UUID      |
| agendaNumber  | String    |
| referenceType | String    |
| referenceId   | UUID      |
| createdAt     | Timestamp |

---

## document_archive

Arsip dokumen.

| Field         | Type      |
| ------------- | --------- |
| id            | UUID      |
| referenceType | String    |
| referenceId   | UUID      |
| archivedAt    | Timestamp |
| archivedBy    | UUID      |

---

# Relationships

| Source                  | Relation | Target                    |
| ----------------------- | -------- | ------------------------- |
| Incoming Mail           | 1 : N    | Disposition               |
| Incoming Mail           | 1 : 1    | Agenda Book               |
| Outgoing Mail           | 1 : 1    | Agenda Book               |
| Administrative Document | 1 : 1    | Attachment                |
| Media                   | 1 : N    | Attachment                |
| User                    | 1 : N    | Disposition               |
| User                    | 1 : N    | Outgoing Mail (Signed By) |

---

# Indexes

Index dibuat pada:

```text id="secdb02"
incoming_mail.agendaNumber

incoming_mail.letterNumber

outgoing_mail.letterNumber

administrative_document.documentNumber

disposition.assignedTo

agenda_book.agendaNumber
```

---

# Constraints

## Incoming Mail

- agendaNumber wajib unik.
- letterNumber wajib diisi.

---

## Outgoing Mail

- letterNumber wajib unik.
- recipient wajib diisi.

---

## Administrative Document

- documentNumber wajib unik.
- documentType wajib diisi.

---

## Disposition

- incomingMailId wajib ada.
- assignedTo wajib merupakan User aktif.

---

# Soft Delete

Menggunakan Soft Delete:

- incoming_mail
- outgoing_mail
- administrative_document

Disposition dan Agenda Book tidak menggunakan Soft Delete.

---

# Status Enum

## Incoming Mail

```text id="secdb03"
Received

Processed

Archived
```

---

## Outgoing Mail

```text id="secdb04"
Draft

Approved

Sent

Archived
```

---

## Disposition

```text id="secdb05"
Pending

In Progress

Completed

Cancelled
```

---

## Administrative Document

```text id="secdb06"
Draft

Submitted

Approved

Rejected

Archived
```

---

# Database Rules

- Nomor agenda harus unik.
- Nomor surat harus unik.
- Disposisi hanya dapat dibuat untuk Surat Masuk.
- Lampiran menggunakan Domain Media.
- Arsip bersifat Read Only.
- Seluruh akses database menggunakan Repository Pattern.

---

# Future Tables

Versi berikutnya dapat menambahkan:

```text id="secdb07"
document_revision

document_template

document_signature

document_history

document_comment
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

Database Secretariat dianggap selesai apabila:

- Struktur database mendukung seluruh proses administrasi.
- Relasi antar tabel konsisten.
- Nomor agenda dan nomor dokumen selalu unik.
- Arsip bersifat permanen (Read Only).
- Seluruh akses database menggunakan Repository Pattern.
