# SECURITY

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

**Document Type:** Security Specification

---

# Purpose

Dokumen ini mendefinisikan standar keamanan yang wajib diterapkan pada seluruh komponen LIM Digital Platform.

Seluruh aplikasi, API, layanan, dan database harus mengikuti standar keamanan yang ditetapkan dalam dokumen ini.

---

# Security Principles

Platform dibangun berdasarkan prinsip berikut:

- Security by Design
- Privacy by Default
- Least Privilege
- Defense in Depth
- Zero Trust
- Secure by Default

---

# Authentication

Seluruh autentikasi menggunakan Better Auth.

Aturan:

- Session dikelola secara aman.
- Password tidak disimpan dalam bentuk plaintext.
- Session memiliki masa berlaku.
- Logout mengakhiri session aktif.

---

# Authorization

Hak akses menggunakan Role Based Access Control (RBAC).

Aturan:

- Permission diberikan kepada Role.
- User memperoleh Permission melalui Role.
- Permission diperiksa pada setiap aksi yang memerlukan otorisasi.
- Tidak ada akses berdasarkan asumsi atau hardcode.

---

# Password Policy

Password pengguna harus:

- Memenuhi panjang minimum yang ditentukan sistem.
- Disimpan menggunakan hashing yang aman.
- Tidak ditampilkan kembali kepada pengguna.
- Tidak dicatat pada log.

---

# Session Management

Session harus:

- Memiliki waktu kedaluwarsa.
- Dapat dicabut (revoke).
- Tidak dapat dipalsukan.
- Menggunakan cookie yang aman bila berbasis web.

---

# Access Control

Setiap request harus melalui proses:

```text id="sec01"
Authentication

↓

Authorization

↓

Permission Check

↓

Business Rules

↓

Response
```

---

# Data Protection

Seluruh data dibagi menjadi dua kategori.

## Public Data

Data yang boleh diakses publik.

Contoh:

- Berita
- Artikel
- Agenda
- Profil Organisasi

---

## Private Data

Data yang hanya dapat diakses oleh pengguna yang memiliki hak.

Contoh:

- Data Pengguna
- Administrasi
- Program Internal
- Arsip
- Audit Log

---

# Input Validation

Seluruh input wajib:

- Divalidasi menggunakan Zod.
- Dibersihkan dari data yang tidak diperlukan.
- Tidak langsung diteruskan ke database.

---

# Database Security

Database harus:

- Menggunakan koneksi terenkripsi.
- Tidak dapat diakses langsung dari internet.
- Menggunakan Environment Variables untuk kredensial.
- Diakses hanya melalui Prisma Repository.

---

# API Security

REST API wajib:

- Melakukan autentikasi.
- Melakukan otorisasi.
- Memvalidasi seluruh input.
- Mengembalikan response yang aman.
- Tidak membocorkan informasi internal.

---

# File Upload Security

Seluruh file upload harus:

- Divalidasi tipe file.
- Dibatasi ukuran file.
- Memiliki nama file yang aman.
- Disimpan di lokasi yang telah ditentukan.
- Tidak dapat dieksekusi sebagai script.

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
- Permission Change
- Role Change

Audit Log tidak boleh diubah oleh pengguna biasa.

---

# Error Handling

Pesan error kepada pengguna:

- Jelas.
- Tidak membocorkan stack trace.
- Tidak menampilkan query database.
- Tidak menampilkan informasi sensitif.

Detail teknis hanya tersedia pada sistem logging.

---

# Environment Variables

Seluruh secret disimpan pada Environment Variables.

Contoh:

```text id="sec02"
DATABASE_URL

AUTH_SECRET

BETTER_AUTH_SECRET

SMTP_PASSWORD

STORAGE_SECRET
```

Secret tidak boleh disimpan di source code maupun repository.

---

# HTTPS

Seluruh komunikasi produksi wajib menggunakan HTTPS.

Data sensitif tidak boleh dikirim melalui koneksi yang tidak terenkripsi.

---

# Backup & Recovery

Backup dilakukan secara berkala.

Restore harus diuji secara berkala untuk memastikan data dapat dipulihkan.

---

# Dependency Management

Library pihak ketiga harus:

- Berasal dari sumber terpercaya.
- Diperbarui secara berkala.
- Ditinjau apabila terdapat kerentanan keamanan.

---

# Logging

Log digunakan untuk:

- Monitoring
- Audit
- Investigasi

Log tidak boleh berisi:

- Password
- Secret
- Token
- Informasi sensitif lainnya

---

# Security Incident

Apabila terjadi insiden keamanan:

1. Identifikasi insiden.
2. Batasi dampak.
3. Pulihkan layanan.
4. Dokumentasikan penyebab.
5. Lakukan perbaikan permanen.

---

# Compliance

Seluruh modul harus mematuhi:

- Business Rules
- Architecture
- Privacy Policy
- Security Policy

---

# Governance

Perubahan terhadap standar keamanan harus:

- Didokumentasikan.
- Ditinjau dampaknya.
- Disetujui sebelum diterapkan.

---

# Closing

Keamanan merupakan tanggung jawab seluruh pengembang.

Setiap fitur baru harus dirancang dengan mempertimbangkan aspek autentikasi, otorisasi, validasi, perlindungan data, dan audit agar LIM Digital Platform tetap aman, terpercaya, dan siap digunakan dalam jangka panjang.
