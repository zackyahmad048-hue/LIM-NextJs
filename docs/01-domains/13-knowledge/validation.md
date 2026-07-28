# Knowledge Validation

**Project:** LIM Digital Platform

**Domain:** Knowledge

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan validasi pada Domain Knowledge.

Seluruh konten Knowledge wajib melalui proses validasi sebelum disimpan, direview, dipublikasikan, atau diarsipkan.

---

# Validation Principles

* Server-side Validation
* Client-side Validation
* Fail Fast
* Consistent Error Messages

---

# Content Validation

## Title

* Wajib diisi.
* Minimum 5 karakter.
* Maksimum 255 karakter.

---

## Slug

* Dibuat otomatis dari Title (dapat diubah).
* Harus unik.
* Menggunakan huruf kecil, angka, dan tanda hubung (-).

Contoh:

```text id="knwval01"
cara-membuat-surat-keputusan

panduan-login

faq-pendaftaran
```

---

## Content

* Wajib diisi.
* Tidak boleh kosong.
* Mendukung Rich Text/Markdown.

---

## Content Type

Harus salah satu dari:

* Article
* Documentation
* SOP
* FAQ
* Tutorial
* Reference
* Announcement
* Policy

---

## Category

* Wajib dipilih.
* Harus aktif.

---

## Tag

* Opsional.
* Tidak boleh duplikat.

---

# Author Validation

* Author wajib aktif.
* Author harus memiliki permission `knowledge.create`.

---

# Review Validation

Konten hanya dapat dikirim untuk review apabila:

* Status = Draft.
* Title valid.
* Content valid.
* Category tersedia.

---

# Publish Validation

Konten hanya dapat dipublikasikan apabila:

* Status = Review.
* Reviewer telah menyetujui.
* Author valid.
* Slug unik.

---

# Archive Validation

Konten hanya dapat diarsipkan apabila:

* Status = Published.

---

# Restore Validation

Konten hanya dapat dipulihkan apabila:

* Status = Archived.

---

# Delete Validation

Konten tidak dapat dihapus apabila:

* Menjadi referensi domain lain.
* Digunakan sebagai SOP aktif.
* Digunakan sebagai dokumentasi sistem.

---

# Search Validation

* search ≤ 100 karakter.

---

# Pagination Validation

* page ≥ 1
* limit 1–100

---

# Error Messages

| Validation             | Message                                                    |
| ---------------------- | ---------------------------------------------------------- |
| Judul kosong           | Judul wajib diisi.                                         |
| Slug sudah digunakan   | Slug sudah digunakan.                                      |
| Kategori tidak valid   | Kategori tidak ditemukan.                                  |
| Konten kosong          | Isi artikel wajib diisi.                                   |
| Review belum selesai   | Konten belum dapat dipublikasikan.                         |
| Konten masih digunakan | Konten tidak dapat dihapus karena masih menjadi referensi. |

---

# Validation Flow

```text id="knwval02"
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
* Slug selalu unik.
* Publish hanya dilakukan setelah Review.
* Konten referensi tidak dapat dihapus.
* Seluruh validasi dijalankan sebelum Business Rules.
