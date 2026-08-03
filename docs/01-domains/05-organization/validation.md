# Organization Validation

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan validasi pada Domain Organization.

Seluruh data organisasi harus melalui proses validasi sebelum diproses oleh Business Rules dan disimpan ke database.

---

# Validation Principles

Seluruh validasi mengikuti prinsip berikut:

- Validate Before Process
- Server-side Validation First
- Client-side Validation for User Experience
- Fail Fast
- Consistent Error Messages

---

# Validation Technology

Standar validasi menggunakan:

- Zod (Server Validation)
- React Hook Form (Client Validation)

Client Validation tidak menggantikan Server Validation.

---

# Organization Validation

## Name

Aturan:

- Wajib diisi.
- Minimum 3 karakter.
- Maksimum 255 karakter.
- Harus unik.

---

## Short Name

Aturan:

- Opsional.
- Maksimum 50 karakter.

---

## Logo

Aturan:

- Opsional.
- Harus berupa gambar.
- Format: JPG, PNG, WEBP.
- Maksimum 2 MB.

---

## Address

Aturan:

- Wajib diisi.
- Maksimum 1000 karakter.

---

## Phone

Aturan:

- Opsional.
- Format nomor telepon yang valid.

---

## Email

Aturan:

- Opsional.
- Format email yang valid.

---

## Website

Aturan:

- Opsional.
- Format URL yang valid.

---

# Region Validation

## Province

- Wajib diisi.

---

## Regency / City

- Wajib diisi.

---

## District

- Wajib diisi.

---

## Village

- Opsional.

---

# Branch Validation

## Organization

- Wajib dipilih.
- Harus merupakan Organization yang aktif.

---

## Region

- Wajib dipilih.
- Harus merupakan Region yang valid.

---

## Name

- Wajib diisi.
- Maksimum 255 karakter.

---

## Code

- Wajib diisi.
- Maksimum 20 karakter.
- Harus unik.

---

## Address

- Opsional.
- Maksimum 1000 karakter.

---

# Department Validation

## Name

- Wajib diisi.
- Maksimum 150 karakter.
- Unik dalam satu Organization.

---

## Description

- Opsional.
- Maksimum 1000 karakter.

---

# Position Validation

## Department

- Wajib dipilih.

---

## Name

- Wajib diisi.
- Maksimum 150 karakter.

---

## Level

- Wajib.
- Nilai minimal 1.

---

## Sort Order

- Wajib.
- Bilangan bulat positif.

---

# Management Period Validation

## Name

- Wajib diisi.
- Maksimum 100 karakter.

---

## Start Date

- Wajib diisi.

---

## End Date

- Wajib diisi.
- Harus lebih besar atau sama dengan Start Date.

---

## Status

Nilai yang diperbolehkan:

```text id="orgval01"
Upcoming

Active

Completed
```

Hanya satu periode yang boleh berstatus **Active**.

---

# Management Validation

## User

- Wajib dipilih.
- Harus merupakan User yang aktif.

---

## Branch

- Wajib dipilih.

---

## Position

- Wajib dipilih.

---

## Period

- Wajib dipilih.
- Harus merupakan periode yang aktif.

---

## Start Date

- Wajib diisi.

---

## End Date

- Opsional.
- Jika diisi, harus lebih besar atau sama dengan Start Date.

---

# Search Validation

Parameter:

```text id="orgval02"
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

# Delete Validation

Data tidak dapat dihapus apabila:

- Masih digunakan oleh domain lain.
- Memiliki relasi aktif.
- Menjadi referensi pada Program, Letter, Certificate, atau Secretariat.

---

# Error Message Standard

| Validation                   | Message                                      |
| ---------------------------- | -------------------------------------------- |
| Name kosong                  | Nama wajib diisi.                            |
| Name duplikat                | Nama sudah digunakan.                        |
| Code duplikat                | Kode sudah digunakan.                        |
| Organization tidak ditemukan | Organization tidak ditemukan.                |
| Region tidak valid           | Region tidak valid.                          |
| Period aktif sudah ada       | Hanya satu periode aktif yang diperbolehkan. |
| End Date tidak valid         | Tanggal selesai harus setelah tanggal mulai. |

---

# Validation Flow

```text id="orgval03"
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

```text id="orgval04"
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

Validation Organization dianggap selesai apabila:

- Seluruh input tervalidasi.
- Nama dan kode yang unik tidak dapat diduplikasi.
- Periode aktif hanya satu.
- Data dengan relasi aktif tidak dapat dihapus.
- Seluruh validasi dijalankan sebelum Business Rules dieksekusi.
