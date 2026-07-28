# Authentication - API

**Project:** LIM Digital Platform

**Domain:** Authentication

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan API endpoints untuk domain Authentication.

---

# Endpoints

### POST /api/auth/sign-in

Login pengguna.

**Request:**

``json
{
  "email": "user@example.com",
  "password": "password123"
}
``

**Response (200):**

``json
{
  "token": "...",
  "user": {
    "id": "...",
    "email": "...",
    "name": "..."
  }
}
``

**Response (401):**

``json
{
  "error": "Email atau password salah"
}
``

---

### POST /api/auth/sign-up

Registrasi pengguna baru.

**Request:**

``json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "Password123!"
}
``

**Response (201):**

``json
{
  "message": "Registrasi berhasil. Silakan verifikasi email Anda."
}
``

---

### POST /api/auth/sign-out

Logout pengguna.

**Headers:**

``text
Authorization: Bearer <token>
``

**Response (200):**

``json
{
  "message": "Logout berhasil"
}
``

---

### POST /api/auth/forgot-password

Minta reset password.

**Request:**

``json
{
  "email": "user@example.com"
}
``

**Response (200):**

``json
{
  "message": "Email reset password telah dikirim"
}
``

---

### POST /api/auth/reset-password

Reset password dengan token.

**Request:**

``json
{
  "token": "...",
  "password": "NewPassword123!"
}
``

**Response (200):**

``json
{
  "message": "Password berhasil diubah"
}
``

---

### POST /api/auth/change-password

Ganti password (authenticated).

**Headers:**

``text
Authorization: Bearer <token>
``

**Request:**

``json
{
  "currentPassword": "oldpassword",
  "newPassword": "NewPassword123!"
}
``

**Response (200):**

``json
{
  "message": "Password berhasil diubah"
}
``

---

### GET /api/auth/verify-email

Verifikasi email.

**Query:**

``text
?token=...
``

**Response (200):**

``json
{
  "message": "Email berhasil diverifikasi"
}
``

---

# Related Documents

- `README.md` - Domain overview.
- `business-rules.md` - Business rules.
- `database.md` - Database schema.
