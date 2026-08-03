# Authentication - Workflow

**Project:** LIM Digital Platform

**Domain:** Authentication

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan workflow untuk domain Authentication.

---

# Login Workflow

``

1. User mengirim email + password
   |
2. Validasi input
   |
3. Cari user berdasarkan email
   |
4. Verifikasi password hash
   |
5. Cek apakah akun terkunci
   |
6. Buat session baru
   |
7. Kembalikan token
   |
8. User mengakses sistem
   ``

---

# Logout Workflow

``

1. User mengklik logout
   |
2. Hapus session dari database
   |
3. Token tidak berlaku lagi
   |
4. Redirect ke halaman login
   ``

---

# Forgot Password Workflow

``

1. User mengirim email
   |
2. Validasi email ada di database
   |
3. Generate reset token
   |
4. Simpan token di tabel verification
   |
5. Kirim email dengan reset link
   |
6. User klik link
   |
7. User masukkan password baru
   |
8. Update password hash
   |
9. Hapus token verification
   |
10. Redirect ke login
    ``

---

# Email Verification Workflow

``

1. User registrasi
   |
2. Generate verifikasi token
   |
3. Simpan token di tabel verification
   |
4. Kirim email verifikasi
   |
5. User klik link verifikasi
   |
6. Update emailVerified = true
   |
7. Hapus token verification
   ``

---

# Session Management

`User login
      |
Buat session (expires: 7 hari / 1 hari)
      |
Setiap request: validasi token
      |
Jika token valid: lanjutkan
Jika token expired: hapus session, redirect login`

---

# Related Documents

- `README.md` - Domain overview.
- `business-rules.md` - Business rules.
- `api.md` - API endpoints.
