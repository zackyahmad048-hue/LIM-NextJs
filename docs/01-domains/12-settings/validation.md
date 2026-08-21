# Settings Validation

**Project:** LIM Digital Platform

**Domain:** Settings

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan validasi pada Domain Settings.

Seluruh konfigurasi sistem wajib melalui proses validasi sebelum disimpan dan diterapkan pada aplikasi.

---

# Validation Principles

- Server-side Validation
- Client-side Validation
- Fail Fast
- Consistent Error Messages

---

# Configuration Validation

## Key

- Wajib diisi.
- Harus unik.
- Maksimum 100 karakter.
- Menggunakan format `snake_case`.
- Tidak boleh mengandung spasi.

Contoh:

```text id="setval01"
app_name

session_timeout

smtp_host

storage_provider
```

---

## Value

- Wajib diisi.
- Harus sesuai dengan Data Type.
- Tidak boleh kosong.

---

## Category

- Wajib dipilih.
- Harus merupakan kategori yang aktif.

---

## Data Type

Harus salah satu dari:

- String
- Number
- Boolean
- JSON
- Array

---

## Description

- Opsional.
- Maksimum 500 karakter.

---

# Organization Validation

Validasi meliputi:

- Nama organisasi wajib diisi.
- Email menggunakan format email yang valid.
- Website menggunakan URL yang valid.
- Logo menggunakan Domain Media.
- Zona waktu harus valid.
- Bahasa harus termasuk bahasa yang didukung.

---

# Security Validation

- Session Timeout > 0.
- Password Minimum Length ≥ 8.
- Login Attempt Limit ≥ 1.
- JWT Expiration > 0.
- MFA Provider harus valid apabila MFA diaktifkan.

---

# Notification Validation

- SMTP Host wajib diisi apabila Email aktif.
- WhatsApp Gateway wajib valid apabila WhatsApp aktif.
- Firebase Configuration wajib tersedia apabila Push Notification aktif.
- Retry Count ≥ 0.

---

# Storage Validation

- Storage Provider harus didukung.
- Bucket Name wajib diisi untuk Cloud Storage.
- Upload Limit > 0.
- MIME Type harus termasuk daftar yang diizinkan.

---

# Integration Validation

- Provider wajib dipilih.
- Client ID wajib diisi.
- Client Secret wajib diisi.
- Endpoint menggunakan URL yang valid.
- Credential harus lolos Connection Test sebelum disimpan.

---

# Feature Flag Validation

- Feature Key wajib unik.
- Nama Feature wajib diisi.
- Nilai hanya **Enabled** atau **Disabled**.

---

# Search Validation

- search ≤ 100 karakter.

---

# Pagination Validation

- page ≥ 1
- limit 1–100

---

# Delete Validation

Konfigurasi tidak dapat dihapus apabila:

- Merupakan konfigurasi inti sistem.
- Masih digunakan oleh domain lain.
- Digunakan sebagai konfigurasi aktif.

---

# Error Messages

| Validation             | Message                               |
| ---------------------- | ------------------------------------- |
| Key kosong             | Configuration key wajib diisi.        |
| Key sudah digunakan    | Configuration key sudah digunakan.    |
| Category tidak valid   | Kategori konfigurasi tidak ditemukan. |
| Data Type tidak sesuai | Nilai tidak sesuai dengan tipe data.  |
| SMTP tidak valid       | Konfigurasi SMTP tidak valid.         |
| Storage tidak valid    | Storage Provider tidak valid.         |
| Integration gagal      | Koneksi ke layanan eksternal gagal.   |

---

# Validation Flow

```text id="setval02"
Request

↓

Validation

↓

Business Rules

↓

Encrypt Sensitive Data

↓

Repository

↓

Database
```

---

# Acceptance Criteria

- Seluruh konfigurasi tervalidasi sebelum disimpan.
- Configuration Key selalu unik.
- Credential diverifikasi dan dienkripsi.
- Konfigurasi inti tidak dapat dihapus.
- Seluruh validasi dijalankan sebelum Business Rules.
