# AUTHENTICATION

**Project:** LIM Digital Platform

**Domain:** Authentication

**Version:** 1.0

**Status:** Approved

**Document Type:** Domain Specification

---

# Purpose

Domain Authentication bertanggung jawab terhadap proses identifikasi pengguna pada LIM Digital Platform.

Domain ini memastikan hanya pengguna yang memiliki identitas yang sah yang dapat mengakses sistem sesuai hak akses yang dimiliki.

Domain Authentication hanya menangani identitas dan sesi pengguna. Pengelolaan hak akses berada pada domain Authorization.

---

# Scope

Domain Authentication mencakup:

- Login
- Logout
- Session
- Password
- Forgot Password
- Reset Password
- Change Password
- Email Verification
- User Identity

Tidak mencakup:

- Role
- Permission
- Menu
- Hak Akses

---

# Objectives

Tujuan domain ini adalah:

- Mengidentifikasi pengguna.
- Mengelola sesi login.
- Menjaga keamanan akun.
- Menyediakan fondasi autentikasi bagi seluruh aplikasi.

---

# Actors

## Guest

Pengguna yang belum login.

Hak:

- Login
- Lupa Password

---

## Authenticated User

Pengguna yang telah login.

Hak:

- Logout
- Mengubah Password
- Melihat Profil
- Mengelola Session sendiri

---

## Administrator

Mengelola akun pengguna sesuai kewenangan.

---

# Features

Fitur utama Authentication:

- Login
- Logout
- Remember Session
- Change Password
- Forgot Password
- Reset Password
- Email Verification
- Session Management

---

# Authentication Flow

```text
User

↓

Login

↓

Credential Validation

↓

Better Auth

↓

Session Created

↓

Access Granted
```

---

# Login

Input:

- Email
- Password

Output:

- Session aktif

Apabila gagal:

- Session tidak dibuat.
- Pesan kesalahan ditampilkan.

---

# Logout

Logout harus:

- Menghapus session aktif.
- Mengarahkan pengguna ke halaman login.

---

# Session

Session memiliki informasi:

- User ID
- Login Time
- Expired Time

Session hanya berlaku selama masa aktif yang ditentukan sistem.

---

# Password Policy

Password harus:

- Memenuhi panjang minimum.
- Disimpan menggunakan hashing yang aman.
- Tidak pernah ditampilkan kembali.

---

# Forgot Password

Alur:

```text
Input Email

↓

Generate Reset Token

↓

Kirim Email

↓

Reset Password

↓

Password Baru
```

---

# Email Verification

Apabila digunakan:

- Email diverifikasi satu kali.
- Link memiliki masa berlaku.
- Token hanya dapat digunakan sekali.

---

# Business Rules

- Email harus unik.
- Password tidak boleh disimpan dalam bentuk plaintext.
- Session harus divalidasi pada setiap request.
- Logout menghapus session aktif.
- Reset Password menggunakan token yang memiliki masa berlaku.

---

# Dependencies

Domain ini bergantung pada:

- Better Auth
- User Repository
- Notification Service (Email)

---

# Related Domains

Domain yang menggunakan Authentication:

- Authorization
- Dashboard
- CMS
- Organization
- Program
- Secretariat
- Letter
- Certificate
- Falak
- Knowledge
- Media
- Notification
- Settings

---

# Database

Entitas utama:

- User
- Session
- Account
- Verification

Detail schema dijelaskan pada dokumen `database.md`.

---

# API

Endpoint utama:

```text
POST   /auth/login

POST   /auth/logout

POST   /auth/forgot-password

POST   /auth/reset-password

GET    /auth/session
```

---

# Security

Authentication wajib:

- Menggunakan HTTPS.
- Memvalidasi seluruh input.
- Menggunakan session yang aman.
- Tidak membocorkan informasi sensitif.

---

# Audit

Aktivitas berikut dicatat:

- Login
- Logout
- Reset Password
- Change Password
- Email Verification

---

# Acceptance Criteria

Domain Authentication dianggap selesai apabila:

- Pengguna dapat login.
- Pengguna dapat logout.
- Session berjalan dengan benar.
- Forgot Password berfungsi.
- Reset Password berfungsi.
- Email Verification berfungsi (jika diaktifkan).
- Audit Log tercatat.

---

# Future Roadmap

Pengembangan berikutnya dapat mencakup:

- Two Factor Authentication (2FA)
- Passkey/WebAuthn
- Single Sign-On (SSO)
- OAuth Provider
- Multi Device Session Management

---

# Governance

Authentication menjadi fondasi keamanan seluruh LIM Digital Platform.

Perubahan pada domain ini harus mempertimbangkan dampaknya terhadap seluruh domain lain.
