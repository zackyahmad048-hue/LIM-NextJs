# Certificate Validation

**Project:** LIM Digital Platform

**Domain:** Certificate

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan validasi pada Domain Certificate.

Seluruh data sertifikat wajib melalui proses validasi sebelum diproses oleh Business Rules dan disimpan ke database.

---

# Validation Principles

* Server-side Validation
* Client-side Validation
* Fail Fast
* Consistent Error Messages

---

# Certificate Validation

## Program

* Wajib dipilih.
* Harus berstatus **Completed**.

---

## Participant

* Wajib dipilih.
* Harus terdaftar pada Program.
* Memenuhi syarat penerbitan sertifikat.

---

## Template

* Wajib dipilih.
* Harus aktif.

---

## Certificate Title

* Wajib diisi.
* Minimum 5 karakter.
* Maksimum 255 karakter.

---

## Issue Date

* Wajib diisi.
* Tidak boleh lebih kecil dari tanggal selesai Program.

---

# Number Validation

Nomor sertifikat:

* Dibuat otomatis.
* Harus unik.
* Tidak dapat diubah setelah diterbitkan.

---

# QR Code Validation

* QR Code wajib dibuat sebelum Publish.
* Verification Code harus unik.
* Tidak boleh kosong.

---

# Signature Validation

Sertifikat hanya dapat ditandatangani apabila:

* Status = Generated.
* Nomor sertifikat tersedia.
* Penandatangan aktif.
* Penandatangan memiliki permission.

---

# Publish Validation

Sertifikat hanya dapat dipublikasikan apabila:

* Sudah ditandatangani.
* QR Code tersedia.
* Verification Code tersedia.

---

# Distribution Validation

Sertifikat hanya dapat dikirim apabila:

* Status = Published.
* Pemilik sertifikat valid.

---

# Verification Validation

Verifikasi berhasil apabila:

* Verification Code ditemukan.
* Status bukan **Revoked**.
* Sertifikat belum dihapus.

---

# Revoke Validation

Sertifikat dapat dicabut apabila:

* Status = Published.
* Dilakukan oleh pengguna yang memiliki permission.

---

# Attachment Validation

* Menggunakan Domain Media.
* File template wajib tersedia.
* Format mengikuti standar Domain Media.

---

# Search Validation

* search ≤ 100 karakter.

---

# Pagination Validation

* page ≥ 1
* limit 1–100

---

# Delete Validation

Sertifikat tidak dapat dihapus apabila:

* Sudah Published.
* Sudah didistribusikan.
* Menjadi referensi domain lain.

---

# Error Messages

| Validation                       | Message                                              |
| -------------------------------- | ---------------------------------------------------- |
| Program belum selesai            | Program belum memenuhi syarat penerbitan sertifikat. |
| Peserta tidak valid              | Peserta tidak memenuhi syarat.                       |
| Template tidak ditemukan         | Template sertifikat tidak valid.                     |
| Nomor sertifikat sudah digunakan | Nomor sertifikat sudah digunakan.                    |
| Sertifikat belum ditandatangani  | Sertifikat belum dapat dipublikasikan.               |
| Verification Code tidak valid    | Sertifikat tidak ditemukan.                          |

---

# Validation Flow

```text id="crtval01"
Request

↓

Validation

↓

Business Rules

↓

Repository

↓

Database
```

---

# Acceptance Criteria

* Seluruh input tervalidasi.
* Program harus berstatus **Completed**.
* Nomor sertifikat dan Verification Code selalu unik.
* Sertifikat tidak dapat dipublikasikan sebelum Signed.
* Seluruh validasi dijalankan sebelum Business Rules.
