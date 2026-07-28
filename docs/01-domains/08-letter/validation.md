# Letter Validation

**Project:** LIM Digital Platform

**Domain:** Letter

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan validasi pada Domain Letter.

Seluruh data surat wajib melalui proses validasi sebelum diproses oleh Business Rules dan disimpan ke database.

---

# Validation Principles

* Server-side Validation
* Client-side Validation
* Fail Fast
* Consistent Error Messages

---

# Letter Validation

## Letter Type

* Wajib dipilih.
* Harus merupakan tipe surat yang aktif.

---

## Template

* Wajib dipilih.
* Harus tersedia.

---

## Subject

* Wajib diisi.
* Minimum 5 karakter.
* Maksimum 255 karakter.

---

## Recipient

* Wajib diisi.
* Maksimum 255 karakter.

---

## Content

* Wajib diisi.
* Tidak boleh kosong.

---

## Signer

* Wajib dipilih.
* Harus merupakan User aktif.
* Memiliki hak sebagai penandatangan.

---

# Number Validation

Nomor surat:

* Dibuat otomatis.
* Harus unik.
* Tidak dapat diubah setelah dibuat.

---

# Approval Validation

Surat hanya dapat disubmit apabila:

* Template tersedia.
* Subject tersedia.
* Recipient tersedia.
* Content tersedia.

Approval hanya dapat dilakukan oleh Reviewer yang berwenang.

---

# Signature Validation

Surat hanya dapat ditandatangani apabila:

* Status = Approved.
* Nomor surat tersedia.
* Penandatangan valid.

---

# Distribution Validation

Surat hanya dapat dikirim apabila:

* Status = Signed.
* Minimal memiliki satu tujuan distribusi.

---

# Attachment Validation

* Menggunakan Domain Media.
* File wajib tersedia.
* Format mengikuti standar Domain Media.

---

# Search Validation

* search ≤ 100 karakter.

---

# Pagination Validation

* page ≥ 1
* limit 1–100

---

# Archive Validation

Surat hanya dapat diarsipkan apabila:

* Status = Sent.

---

# Restore Validation

Surat hanya dapat dipulihkan apabila:

* Status = Archived.

---

# Delete Validation

Surat tidak dapat dihapus apabila:

* Sudah ditandatangani.
* Sudah dikirim.
* Sudah diarsipkan.
* Digunakan oleh domain lain.

---

# Error Messages

| Validation                  | Message                           |
| --------------------------- | --------------------------------- |
| Subject kosong              | Perihal wajib diisi.              |
| Recipient kosong            | Tujuan surat wajib diisi.         |
| Template tidak ditemukan    | Template surat tidak valid.       |
| Nomor surat sudah digunakan | Nomor surat sudah digunakan.      |
| Surat belum disetujui       | Surat belum dapat ditandatangani. |
| Surat belum ditandatangani  | Surat belum dapat dikirim.        |

---

# Validation Flow

```text id="ltrval01"
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
* Nomor surat unik.
* Surat tidak dapat ditandatangani sebelum Approved.
* Surat tidak dapat dikirim sebelum Signed.
* Validasi dijalankan sebelum Business Rules.
