# Authentication Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `authentication-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi Domain Authentication.

Dokumen ini menjadi acuan implementasi Backend, Frontend, QA, dan DevOps.

Authentication bertanggung jawab memverifikasi identitas pengguna dan menghasilkan Session yang aman.

Authorization dibahas pada dokumen terpisah.

---

# Objectives

Authentication harus mampu:

- Login
- Logout
- Refresh Token
- Forgot Password
- Reset Password
- Change Password
- Verify Email
- Verify Session
- Revoke Session

---

# Actors

| Actor         | Description        |
| ------------- | ------------------ |
| Guest         | Belum Login        |
| User          | Sudah Login        |
| Administrator | Pengelola Sistem   |
| System        | Background Process |

---

# Functional Requirements

## Login

User dapat login menggunakan:

- Email
- Password

Output:

- Access Token
- Refresh Token
- Session

---

## Logout

Menghapus Session aktif.

---

## Refresh Token

Menghasilkan Access Token baru.

---

## Forgot Password

Mengirim Reset Link.

---

## Reset Password

Mengganti Password menggunakan Reset Token.

---

## Change Password

Mengganti Password ketika User telah Login.

---

## Session Validation

Memastikan Token masih valid.

---

# Non Functional Requirements

Authentication harus:

- Response < 500 ms
- Secure
- Stateless
- Audit Enabled
- Highly Available

---

# Preconditions

Login:

- User aktif.
- Email terverifikasi.
- Password benar.

---

# Postconditions

Login berhasil:

- Session dibuat.
- JWT dibuat.
- Audit Log dibuat.
- Last Login diperbarui.

---

# Main Flow

```text id="authspec01"
Login Request

↓

Validate Input

↓

Find User

↓

Verify Password

↓

Generate JWT

↓

Create Session

↓

Audit Log

↓

Response
```

---

# Alternative Flow

Password salah

↓

Login Failed

↓

Audit Log

↓

Return Error

---

# Exception Flow

- User tidak ditemukan.
- User nonaktif.
- Email belum diverifikasi.
- Password salah.
- Session kadaluarsa.
- Refresh Token tidak valid.

---

# Sequence Diagram

```text id="authspec02"
Client

↓

Authentication API

↓

Application Service

↓

Domain

↓

Repository

↓

Database

↓

JWT Service

↓

Client
```

---

# State Diagram

```text id="authspec03"
Guest

↓

Authenticated

↓

Expired

↓

Logged Out
```

---

# Domain Model

Entity:

- User
- Session

Value Object:

- Email
- Password
- JWT Token

Aggregate:

- Authentication

---

# Database Mapping

Table:

```text id="authspec04"
users

sessions

password_reset_tokens

email_verifications
```

---

# API Specification

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | /api/v1/auth/login           |
| POST   | /api/v1/auth/logout          |
| POST   | /api/v1/auth/refresh         |
| POST   | /api/v1/auth/forgot-password |
| POST   | /api/v1/auth/reset-password  |
| POST   | /api/v1/auth/change-password |
| GET    | /api/v1/auth/me              |

---

# Request Validation

Login

| Field    | Rule            |
| -------- | --------------- |
| email    | Required, Email |
| password | Required        |

Refresh

| Field        | Rule     |
| ------------ | -------- |
| refreshToken | Required |

---

# Permission Matrix

| Endpoint | Guest | User | Admin |
| -------- | :---: | :--: | :---: |
| Login    |  ✅   |  ❌  |  ❌   |
| Logout   |  ❌   |  ✅  |  ✅   |
| Refresh  |  ❌   |  ✅  |  ✅   |
| Me       |  ❌   |  ✅  |  ✅   |

---

# Error Catalog

| Code     | Description           |
| -------- | --------------------- |
| AUTH_001 | Invalid Email         |
| AUTH_002 | Invalid Password      |
| AUTH_003 | User Not Found        |
| AUTH_004 | Session Expired       |
| AUTH_005 | Invalid Refresh Token |
| AUTH_006 | Email Not Verified    |
| AUTH_007 | Account Disabled      |

---

# Notification Matrix

| Event            | Notification |
| ---------------- | ------------ |
| Login New Device | Email        |
| Password Changed | Email        |
| Forgot Password  | Email        |
| Email Verified   | Email        |

---

# Acceptance Test

- Login berhasil.
- Login gagal.
- Refresh berhasil.
- Refresh gagal.
- Logout berhasil.
- Password berhasil diganti.
- Session kadaluarsa.
- Audit Log tercatat.

---

# Performance Requirement

- Login < 500 ms.
- Refresh Token < 300 ms.
- JWT Generation < 100 ms.

---

# Security Requirement

- Password menggunakan Argon2/Bcrypt.
- JWT ditandatangani secara aman.
- Refresh Token dapat dicabut.
- Rate Limiting diterapkan.
- Audit Log wajib aktif.
- Seluruh komunikasi menggunakan HTTPS.

---

# Acceptance Criteria

- Authentication berjalan sesuai Business Rules.
- JWT dan Session tervalidasi.
- Seluruh API mengikuti API Standard.
- Error dan Audit Log konsisten.
- Specification siap digunakan sebagai dasar implementasi.
