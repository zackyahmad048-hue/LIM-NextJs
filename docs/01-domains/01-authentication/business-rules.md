# Authentication - Business Rules

**Project:** LIM Digital Platform

**Domain:** Authentication

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan aturan bisnis domain Authentication.

---

# Business Rules

### BR-AUTH-001: Login

- Pengguna harus menyediakan email dan password yang valid.
- Sesi dibuat setelah login berhasil.
- Login gagal setelah 5 percobaan akan mengunci akun selama 15 menit.

### BR-AUTH-002: Logout

- Sesi dihapus saat logout.
- Token yang sudah tidak berlaku tidak dapat digunakan.

### BR-AUTH-003: Password

- Password minimal 8 karakter.
- Harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus.
- Password di-hash menggunakan bcrypt.

### BR-AUTH-004: Forgot Password

- Reset link dikirim ke email yang terdaftar.
- Link berlaku selama 1 jam.
- Link hanya dapat digunakan satu kali.

### BR-AUTH-005: Session

- Session berlaku selama 7 hari (jika Remember Me aktif).
- Session berlaku selama 1 hari (jika Remember Me tidak aktif).
- Session dapat di-revoke oleh user atau admin.

### BR-AUTH-006: Email Verification

- Email verifikasi dikirim saat registrasi.
- Akun belum aktif sampai email diverifikasi.
- Link verifikasi berlaku selama 24 jam.

---

# Validation Rules

| Field    | Rule                                                    |
| -------- | ------------------------------------------------------- |
| Email    | Valid email format, required                            |
| Password | Min 8 chars, uppercase, lowercase, number, special char |
| Name     | Required, min 2 chars                                   |

---

# Related Documents

- `README.md` - Domain overview.
- `database.md` - Database schema.
- `api.md` - API endpoints.
