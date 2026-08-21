# Organization Validation

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 2.0

**Status:** Draft

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

# Branch Validation

## Organization

- Wajib dipilih.
- Harus merupakan Organization yang aktif.

---

## Name

- Wajib diisi.
- Maksimum 255 karakter.
- Harus unik dalam satu Organization.

---

## Province

- Wajib diisi.

---

## Regency

- Wajib diisi.

---

## Address

- Opsional.
- Maksimum 1000 karakter.

---

# Central Board Validation

## User

- Wajib dipilih.
- Harus merupakan User yang aktif.

---

## Organization

- Wajib dipilih.
- Harus merupakan Organization yang aktif.

---

## Period

- Wajib.
- Nilai tetap: `2024-2029`.

---

# Regional Board Validation

## User

- Wajib dipilih.
- Harus merupakan User yang aktif.

---

## Organization

- Wajib dipilih.
- Harus merupakan Organization yang aktif.

---

## Province

- Wajib diisi.

---

## Period

- Wajib.
- Nilai tetap: `2024-2029`.

---

# Branch Board Validation

## User

- Wajib dipilih.
- Harus merupakan User yang aktif.

---

## Organization

- Wajib dipilih.
- Harus merupakan Organization yang aktif.

---

## Branch

- Wajib dipilih.
- Harus merupakan Branch yang aktif.

---

## Period

- Wajib.
- Nilai tetap: `2024-2029`.

---

# Member Validation

## User

- Wajib dipilih.
- Harus merupakan User yang aktif.

---

## Organization

- Wajib dipilih.
- Harus merupakan Organization yang aktif.

---

## Branch

- Wajib dipilih.
- Harus merupakan Branch yang aktif.

---

## Period

- Wajib.
- Nilai tetap: `2024-2029`.

---

# Search Validation

Parameter:

```text id="orgval01"
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
- Menjadi referensi pada Program, Secretariat, Letter, atau Certificate.

---

# Error Message Standard

| Validation                   | Message                                      |
| ---------------------------- | -------------------------------------------- |
| Name kosong                  | Nama wajib diisi.                            |
| Name duplikat                | Nama sudah digunakan.                        |
| Organization tidak ditemukan | Organization tidak ditemukan.                |
| Branch tidak ditemukan       | Cabang tidak ditemukan.                      |
| User tidak ditemukan         | Pengguna tidak ditemukan.                    |
| Periode tidak valid          | Periode kepengurusan harus 2024-2029.        |
| Branch aktif sudah ada       | Pengurus cabang untuk branch ini sudah ada.  |
| End Date tidak valid         | Tanggal selesai harus setelah tanggal mulai. |

---

# Validation Flow

```text id="orgval02"
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

```text id="orgval03"
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
- Periode kepengurusan bersifat tetap (2024-2029).
- Data dengan relasi aktif tidak dapat dihapus.
- Seluruh validasi dijalankan sebelum Business Rules dieksekusi.