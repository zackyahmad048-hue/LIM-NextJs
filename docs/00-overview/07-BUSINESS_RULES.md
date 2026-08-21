# BUSINESS_RULES

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

**Document Type:** Business Rules Specification

---

# Purpose

Dokumen ini mendefinisikan seluruh aturan bisnis yang menjadi dasar perilaku LIM Digital Platform.

Business Rules menjadi acuan utama bagi implementasi sistem, pengembangan fitur, pengujian, dan dokumentasi.

Seluruh implementasi harus mengikuti aturan dalam dokumen ini.

---

# General Principles

Platform mengikuti prinsip berikut:

- Satu Data, Banyak Layanan.
- Data harus konsisten.
- Data tidak boleh diduplikasi.
- Data privat tidak dipublikasikan tanpa izin.
- Seluruh aktivitas penting dapat diaudit.

---

# Data Ownership

Setiap data memiliki satu sumber utama (Single Source of Truth).

Contoh:

- Data Pengguna berasal dari domain Authentication.
- Data Program berasal dari domain Program.
- Data Organisasi berasal dari domain Organization.
- Data Sertifikat berasal dari domain Certificate.

Domain lain hanya menggunakan referensi terhadap data tersebut.

---

# Soft Delete

Data tidak dihapus secara permanen.

Penghapusan dilakukan menggunakan mekanisme Soft Delete dengan mengisi nilai `deletedAt`.

Data yang telah dihapus:

- Tidak tampil pada aplikasi.
- Tidak dapat digunakan dalam proses bisnis.
- Masih tersedia untuk kebutuhan audit apabila diperlukan.

Hard Delete hanya diperbolehkan untuk kebutuhan administrasi sistem dan harus dicatat pada Audit Log.

---

# Audit Log

Aktivitas berikut wajib dicatat:

- Login
- Logout
- Create
- Update
- Delete
- Restore
- Publish
- Unpublish
- Approval
- Role & Permission Changes

Audit Log minimal menyimpan:

- Pengguna
- Waktu
- Modul
- Aktivitas
- Data yang berubah

---

# Validation

Seluruh data yang masuk wajib divalidasi.

Validasi dilakukan sebelum Business Rules dijalankan.

Seluruh validasi menggunakan Zod.

---

# Slug

Slug harus:

- Unik.
- Menggunakan huruf kecil.
- Menggunakan tanda hubung (-).
- Tidak mengandung karakter khusus.
- Tidak boleh berubah otomatis setelah data dibuat, kecuali diperbarui secara sadar oleh pengguna.

---

# Status Data

Data yang dipublikasikan mengikuti status berikut:

```text
Draft

↓

Published

↓

Archived
```

Setiap domain dapat menambahkan status lain sesuai kebutuhan bisnis.

---

# Organization

Struktur organisasi mengikuti hierarki resmi organisasi.

Data organisasi menjadi referensi bagi:

- Program
- Pengurus
- Surat
- Sertifikat
- Laporan

---

# Program

Seluruh kegiatan organisasi dikelola melalui domain Program.

Contoh:

- Safari Ramadan
- Wajib Khidmah
- Pelatihan
- Seminar
- Kajian

Setiap Program memiliki:

- Peserta
- Lokasi
- Jadwal
- Penanggung Jawab
- Dokumen
- Laporan
- Sertifikat (jika diperlukan)

---

# Secretariat

Domain Secretariat mengelola administrasi internal.

Data Secretariat bersifat privat dan tidak dipublikasikan kecuali ditentukan lain.

---

# Letter

Setiap surat memiliki:

- Nomor Surat
- Tanggal
- Status
- Penandatangan
- QR Verification (jika digunakan)

Nomor surat tidak boleh duplikat.

---

# Certificate

Sertifikat hanya diterbitkan kepada peserta yang memenuhi syarat sesuai aturan program.

Sertifikat yang dipublikasikan harus dapat diverifikasi melalui QR Code atau kode verifikasi.

---

# CMS

Konten publik dikelola melalui CMS.

Konten yang dipublikasikan harus memiliki:

- Judul
- Slug
- Penulis
- Status
- Tanggal Publikasi

---

# Media

Seluruh file media dikelola melalui Media Library.

Media dapat digunakan kembali oleh berbagai modul.

Penghapusan media harus mempertimbangkan apakah media masih digunakan oleh modul lain.

---

# Authentication

Seluruh pengguna harus melakukan autentikasi sebelum mengakses area yang dilindungi.

Sesi mengikuti mekanisme Better Auth.

---

# Authorization

Hak akses menggunakan Role Based Access Control (RBAC).

Permission diberikan berdasarkan Role, bukan langsung kepada pengguna.

---

# Privacy

Data internal organisasi bersifat privat.

Data hanya dapat diakses oleh pengguna yang memiliki hak akses.

Data publik hanya ditampilkan melalui Website atau API publik.

---

# API

REST API hanya mengakses Business Rules melalui Service Layer.

API tidak boleh mengakses database secara langsung.

---

# Mobile

Aplikasi Mobile menggunakan Business Rules yang sama dengan Website dan Admin.

Perbedaan hanya berada pada tampilan dan pengalaman pengguna.

---

# Error Handling

Sistem harus memberikan pesan kesalahan yang jelas tanpa membocorkan informasi sensitif.

Seluruh error penting dicatat pada sistem logging.

---

# Future Changes

Perubahan Business Rules harus:

- Didokumentasikan.
- Ditinjau dampaknya terhadap domain lain.
- Disetujui sebelum diimplementasikan.

---

# Governance

Business Rules merupakan acuan resmi perilaku sistem.

Apabila terdapat implementasi yang bertentangan dengan Business Rules, maka implementasi tersebut harus diperbaiki agar sesuai dengan dokumen ini.
