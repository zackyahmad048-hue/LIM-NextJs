# Program Validation

**Project:** LIM Digital Platform

**Domain:** Program

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan validasi pada Domain Program.

Seluruh data Program wajib melalui proses validasi sebelum diproses oleh Business Rules dan disimpan ke database.

---

# Validation Principles

Seluruh validasi mengikuti prinsip:

- Validate Before Process
- Server-side Validation First
- Client-side Validation for User Experience
- Fail Fast
- Consistent Error Messages

---

# Validation Technology

Standar validasi:

- Zod (Server Validation)
- React Hook Form (Client Validation)

Client Validation tidak menggantikan Server Validation.

---

# Program Validation

## Program Code

Aturan:

- Wajib diisi.
- Maksimum 30 karakter.
- Harus unik.
- Tidak boleh mengandung spasi.

Contoh:

```text id="prgval01"
SD-2027-001

TRN-2027-015
```

---

## Program Name

Aturan:

- Wajib diisi.
- Minimum 5 karakter.
- Maksimum 255 karakter.

---

## Program Type

Aturan:

- Wajib dipilih.
- Harus berasal dari daftar Program Type yang aktif.

---

## Description

Aturan:

- Opsional.
- Maksimum 5000 karakter.

---

## Person In Charge

Aturan:

- Wajib dipilih.
- Harus merupakan User aktif.

---

## Start Date

Aturan:

- Wajib diisi.

---

## End Date

Aturan:

- Wajib diisi.
- Harus lebih besar atau sama dengan Start Date.

---

## Status

Nilai yang diperbolehkan:

```text id="prgval02"
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

# Schedule Validation

## Title

- Wajib diisi.
- Maksimum 255 karakter.

---

## Venue

- Wajib dipilih.

---

## Start Time

- Wajib diisi.

---

## End Time

- Wajib diisi.
- Harus lebih besar dari Start Time.

---

# Participant Validation

## User

- Wajib dipilih.
- Harus merupakan User aktif.

---

## Registration

Aturan:

- Tidak boleh terdaftar dua kali pada Program yang sama.
- Program harus masih menerima pendaftaran.

---

# Committee Validation

## User

- Wajib dipilih.
- Tidak boleh menjadi panitia dua kali pada Program yang sama.

---

## Role

- Wajib diisi.

---

# Attendance Validation

Check In:

- Program harus berstatus **On Going**.
- Peserta harus terdaftar.
- Belum pernah Check In.

Check Out:

- Harus sudah Check In.
- Belum pernah Check Out.

---

# Documentation Validation

## File

- Wajib dipilih.
- Harus berasal dari Domain Media.

Format:

- JPG
- PNG
- WEBP
- PDF
- MP4

Ukuran mengikuti standar Domain Media.

---

# Search Validation

Parameter:

```text id="prgval03"
search
```

Aturan:

- Maksimum 100 karakter.

---

# Pagination Validation

## page

- Minimum: 1

---

## limit

- Minimum: 1
- Maksimum: 100

---

# Publish Validation

Program hanya dapat dipublikasikan apabila:

- Program Name tersedia.
- Program Code tersedia.
- Program Type dipilih.
- Penanggung Jawab tersedia.
- Minimal satu Schedule tersedia.

---

# Complete Validation

Program hanya dapat diselesaikan apabila:

- Status **On Going**.
- Seluruh jadwal selesai.
- Tidak ada proses yang masih berjalan.

---

# Delete Validation

Program tidak dapat dihapus apabila:

- Memiliki peserta.
- Memiliki absensi.
- Memiliki sertifikat.
- Memiliki surat.
- Digunakan oleh domain lain.

---

# Error Message Standard

| Validation              | Message                                      |
| ----------------------- | -------------------------------------------- |
| Program Name kosong     | Nama Program wajib diisi.                    |
| Program Code duplikat   | Kode Program sudah digunakan.                |
| Jadwal belum tersedia   | Minimal satu jadwal diperlukan.              |
| Peserta sudah terdaftar | Peserta sudah terdaftar pada Program ini.    |
| Program belum selesai   | Program belum dapat diselesaikan.            |
| Tanggal tidak valid     | Tanggal selesai harus setelah tanggal mulai. |

---

# Validation Flow

```text id="prgval04"
Request

↓

Validate Input

↓

Validation Success

↓

Business Rules

↓

Repository

↓

Database
```

Apabila validasi gagal:

```text id="prgval05"
Request

↓

Validation Failed

↓

Return Validation Error
```

---

# Related Documents

- README.md
- business-rules.md
- workflow.md
- database.md
- api.md
- permissions.md
- ui.md
- roadmap.md

---

# Acceptance Criteria

Validation Program dianggap selesai apabila:

- Seluruh input tervalidasi.
- Program Code selalu unik.
- Peserta tidak dapat terdaftar ganda.
- Jadwal valid.
- Status Program mengikuti Business Rules.
- Seluruh validasi dilakukan sebelum Business Rules dijalankan.
