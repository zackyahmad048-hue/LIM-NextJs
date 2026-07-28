# CMS Validation

**Project:** LIM Digital Platform

**Domain:** Content Management System (CMS)

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan validasi pada Domain Content Management System (CMS).

Seluruh data yang diterima oleh CMS wajib melalui proses validasi sebelum diproses oleh Business Rules maupun disimpan ke database.

---

# Validation Principles

Seluruh validasi mengikuti prinsip:

* Validate Before Process
* Server-side Validation First
* Client Validation for User Experience
* Fail Fast
* Consistent Error Messages

---

# Validation Technology

Standar validasi menggunakan:

* Zod (Server Validation)
* React Hook Form (Client Validation)

Client Validation tidak menggantikan Server Validation.

---

# Post Validation

## Title

Aturan:

* Wajib diisi.
* Minimum 5 karakter.
* Maksimum 255 karakter.

---

## Slug

Aturan:

* Wajib diisi.
* Unik.
* Huruf kecil.
* Menggunakan tanda hubung (-).
* Tidak mengandung karakter khusus.

Contoh:

```text id="cmsv01"
safari-ramadan-2027
```

---

## Excerpt

Aturan:

* Opsional.
* Maksimum 500 karakter.

---

## Content

Aturan:

* Wajib diisi.
* Tidak boleh kosong.

---

## Category

Aturan:

* Wajib dipilih.
* Harus mengacu pada Category yang masih aktif.

---

## Tags

Aturan:

* Opsional.
* Tidak boleh duplikat.

---

## Status

Nilai yang diperbolehkan:

```text id="cmsv02"
Draft

Published

Archived
```

---

## Featured

Tipe:

Boolean

Default:

```text id="cmsv03"
false
```

---

# Page Validation

## Title

* Wajib.
* Maksimum 255 karakter.

---

## Slug

* Wajib.
* Unik.
* Mengikuti standar slug proyek.

---

## Content

* Wajib diisi.

---

# Category Validation

## Name

* Wajib.
* Maksimum 100 karakter.
* Harus unik.

---

## Slug

* Wajib.
* Unik.

---

# Tag Validation

## Name

* Wajib.
* Maksimum 50 karakter.
* Harus unik.

---

# Search Validation

Parameter:

```text id="cmsv04"
search
```

Aturan:

* Maksimum 100 karakter.

---

# Pagination Validation

## page

* Minimum: 1

## limit

* Minimum: 1
* Maksimum: 100

---

# Publish Validation

Konten hanya dapat dipublikasikan apabila:

* Title tersedia.
* Slug valid.
* Content tersedia.
* Category tersedia (untuk Post).
* Tidak melanggar Business Rules.

---

# Delete Validation

Category tidak dapat dihapus apabila:

* Masih digunakan oleh Post.

Tag dapat dihapus apabila tidak digunakan.

---

# Error Message Standard

Contoh:

| Validation               | Message                   |
| ------------------------ | ------------------------- |
| Title kosong             | Title wajib diisi.        |
| Slug duplikat            | Slug sudah digunakan.     |
| Category tidak ditemukan | Category tidak ditemukan. |
| Status tidak valid       | Status tidak valid.       |

Pesan harus menggunakan bahasa yang mudah dipahami pengguna.

---

# Validation Flow

```text id="cmsv05"
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

```text id="cmsv06"
Request

↓

Validation Failed

↓

Return Validation Error
```

---

# Related Documents

* README.md
* business-rules.md
* workflow.md
* database.md
* api.md
* permissions.md
* ui.md
* roadmap.md

---

# Acceptance Criteria

Validation CMS dianggap selesai apabila:

* Seluruh input tervalidasi.
* Slug selalu unik.
* Data tidak valid ditolak.
* Pesan validasi konsisten.
* Seluruh validasi dilakukan sebelum Business Rules dijalankan.
