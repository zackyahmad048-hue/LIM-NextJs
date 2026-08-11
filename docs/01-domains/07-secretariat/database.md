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

| Field              | Type       | Description                         |
| ------------------ | ---------- | ----------------------------------- |
| id                 | UUID       | Primary Key                         |
| registrationNumber | String     | Nomor Register (internal, otomatis) |
| recipient          | String?    | Penerima                            |
| subject            | String     | Perihal                             |
| senderName         | String?    | Penanda Tangan (tidak lagi diisi dari form — legacy) |
| mailDate           | Date       | Tanggal Surat                       |
| status             | Enum       | Status Surat (DRAFT/SENT/ARCHIVED)  |
| categoryCode       | String?    | Kode Kategori Surat                 |
| content            | Text?      | Isi Surat                           |
| sequence           | Int?       | Nomor urut (kolom 1 nomor surat)    |
| levelCode          | String?    | Kode indeks tingkat kepengurusan    |
| romanMonth         | String?    | Bulan angka Romawi (kolom 4)        |
| periodYear         | Int?       | Tahun awal periode aktif (kolom 5)  |
| fullNumber         | String?    | Nomor surat lengkap (unik)          |
| verificationCode   | String?    | Kode verifikasi QR                  |
| qrFileId           | String?    | File QR verifikasi (Domain Media)   |
| ketuaName          | String?    | Nama Ketua (QR penanda tangan)      |
| ketuaPosition      | String?    | Jabatan Ketua (QR penanda tangan)   |
| sekretarisName     | String?    | Nama Sekretaris (QR penanda tangan) |
| sekretarisPosition | String?    | Jabatan Sekretaris (QR)             |
| qrKetuaPosition    | Json?      | Posisi QR Ketua (mm, halaman)       |
| qrSekretarisPosition | Json?    | Posisi QR Sekretaris (mm, halaman)  |
| qrVerifikasiPosition | Json?    | Posisi QR Verifikasi (mm)           |
| sentAt             | Timestamp? | Waktu ditandai terkirim             |
| archivedAt         | Timestamp? | Waktu diarsipkan                    |
| attachmentUrl      | String?    | Lampiran (Domain Media)             |
| createdAt          | Timestamp  | Dibuat                              |
| updatedAt          | Timestamp  | Diubah                              |
| deletedAt          | Timestamp  | Soft Delete                         |

> Kolom persetujuan lama (`submittedAt`, `reviewedAt`, `approvedAt`, `signedAt`
> beserta penanda `*ById`) dihapus karena alur persetujuan tidak dipakai.
> Nomor & QR kini diterbitkan langsung saat transisi ke status **SENT**.
>
> `qr*Position` menyimpan koordinat dalam **mm** dengan titik asal pojok
> kiri-bawah halaman (sesuai sistem koordinat pdf-lib). `qrKetuaPosition` dan
> `qrSekretarisPosition` menyertakan nomor halaman; `qrVerifikasiPosition`
> ditempel di semua halaman. Posisi default diambil dari `example-surat.pdf`.
>
> `senderName` dipertahankan sebagai kolom legacy namun tidak lagi diisi
> melalui form Create/Edit — penanda tangan kini berasal dari
> `ketuaName`/`sekretarisName` yang diisi via select Pengurus Pusat
> (`getCentralBoardSigners`). Tampilan list & halaman verifikasi menampilkan
> **Ketua** dan **Sekretaris** sebagai pengganti `senderName`.

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

| Field          | Type      | Description                         |
| -------------- | --------- | ----------------------------------- |
| id             | UUID      | Primary Key                         |
| documentNumber | String    | Nomor Dokumen (unik)                |
| documentType   | String    | Jenis Dokumen                       |
| title          | String    | Judul / Perihal                     |
| description    | Text      | Deskripsi                           |
| content        | Text      | Konten dokumen (teks)               |
| attachmentUrl  | String?   | Lampiran (Domain Media)             |
| status         | Enum      | Status (DRAFT/SUBMITTED/APPROVED/…) |
| createdAt      | Timestamp |
| updatedAt      | Timestamp |
| deletedAt      | Timestamp |

> Lampiran dokumen memakai **Domain Media** (`media.fileId`); `attachmentUrl`
> berisi URL file yang dihasilkan `MediaUploadService`. Jika file diunggah,
> halaman cetak menampilkan file tersebut (iframe); jika tidak, konten teks
> ditampilkan.

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

| Source                  | Relation | Target                  |
| ----------------------- | -------- | ----------------------- |
| Incoming Mail           | 1 : N    | Disposition             |
| Incoming Mail           | 1 : 1    | Agenda Book             |
| Outgoing Mail           | 1 : 1    | Agenda Book             |
| Administrative Document | 1 : 1    | Attachment              |
| Media                   | 1 : N    | Attachment              |
| User                    | 1 : N    | Disposition             |
| Media                   | 1 : 1    | Outgoing Mail (QR File) |

---

# Indexes

Index dibuat pada:

```text id="secdb02"
incoming_mail.agendaNumber

incoming_mail.letterNumber

outgoing_mail.fullNumber

outgoing_mail.registrationNumber

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

- fullNumber (nomor surat lengkap) wajib unik saat diterbitkan.
- registrationNumber wajib unik (dibuat otomatis).

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

Sent

Archived
```

Transisi sah:

```text id="secdb04b"
DRAFT ──▶ SENT ──▶ ARCHIVED

SENT  ──▶ DRAFT (pembatalan, reversible)
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
