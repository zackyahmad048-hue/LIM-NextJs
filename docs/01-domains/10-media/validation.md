# Media Validation

**Project:** LIM Digital Platform

**Domain:** Media

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan validasi pada Domain Media.

Seluruh file dan metadata wajib melalui proses validasi sebelum disimpan ke Storage Provider dan Database.

---

# Validation Principles

* Server-side Validation
* Client-side Validation
* Fail Fast
* Consistent Error Messages

---

# File Validation

## File

* Wajib dipilih.
* Tidak boleh kosong.
* Tidak rusak (corrupt).

---

## File Name

* Wajib diisi.
* Maksimum 255 karakter.
* Tidak mengandung karakter ilegal.

---

## MIME Type

Harus termasuk tipe yang diizinkan.

Contoh:

* image/jpeg
* image/png
* image/webp
* application/pdf
* video/mp4
* audio/mpeg

---

## File Extension

Harus sesuai dengan MIME Type.

Ekstensi yang didukung:

* JPG
* JPEG
* PNG
* WEBP
* PDF
* DOCX
* XLSX
* PPTX
* MP4
* MP3
* ZIP

---

## File Size

Mengikuti konfigurasi sistem.

Contoh default:

* Image ≤ 10 MB
* Document ≤ 20 MB
* Video ≤ 200 MB
* Audio ≤ 50 MB

---

# Folder Validation

* Folder harus tersedia.
* Parent Folder harus valid apabila digunakan.

---

# Upload Validation

Upload hanya dapat dilakukan apabila:

* User telah login.
* User memiliki permission.
* Storage tersedia.

---

# Thumbnail Validation

Thumbnail hanya dibuat apabila:

* File bertipe Image.
* File berhasil diunggah.

---

# Preview Validation

Preview hanya didukung untuk:

* Image
* PDF
* Video

---

# Download Validation

Download hanya dapat dilakukan apabila:

* File tersedia.
* User memiliki hak akses.

---

# Archive Validation

File hanya dapat diarsipkan apabila:

* Tidak sedang diproses.
* Tidak rusak.

---

# Restore Validation

File hanya dapat dipulihkan apabila:

* Status = Archived.

---

# Delete Validation

File tidak dapat dihapus apabila:

* Memiliki Reference aktif.
* Digunakan sebagai Logo.
* Digunakan sebagai Template.
* Digunakan oleh domain lain.

---

# Search Validation

* search ≤ 100 karakter.

---

# Pagination Validation

* page ≥ 1
* limit 1–100

---

# Error Messages

| Validation                 | Message                                          |
| -------------------------- | ------------------------------------------------ |
| File kosong                | File wajib dipilih.                              |
| Format tidak didukung      | Format file tidak didukung.                      |
| Ukuran file melebihi batas | Ukuran file terlalu besar.                       |
| Folder tidak ditemukan     | Folder tidak valid.                              |
| File masih digunakan       | File tidak dapat dihapus karena masih digunakan. |

---

# Validation Flow

```text id="medval01"
Request

↓

Validation

↓

Business Rules

↓

Storage

↓

Repository

↓

Database
```

---

# Acceptance Criteria

* Seluruh upload tervalidasi.
* Format dan ukuran file sesuai aturan.
* File yang direferensikan tidak dapat dihapus.
* Thumbnail hanya dibuat untuk gambar.
* Validasi dijalankan sebelum Business Rules.
