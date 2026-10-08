# Authentication - UI

**Project:** LIM Digital Platform

**Domain:** Authentication

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan UI specification untuk domain Authentication.

---

# Pages

> Status implementasi: halaman `/admin/login` dan `/admin/setup` sudah memakai kartu glass di latar polos (dual-mode). Halaman forgot/reset-password dan change-password belum dibangun meski tercantum di dokumen ini.
- Halaman auth memakai latar grid hairline `.auth-grid` (monokrom, bergeser 60s, reduced-motion membekukan).
- Toast global memakai island Sonner di tengah atas (pil terbalik tema, `visibleToasts=1`, tanpa tombol tutup).

### Login Page

**URL:** `/admin/login`

**Layout:**

- Card kaca (`.glass rounded-xl shadow-sm`) di latar polos `bg-background` (dual-mode, bukan dark-only)
- Kartu glass kristal sesuai `DESIGN.md`; chrome tetap solid
- App logo + name
- Email input
- Password input
- Login button
- (Tautan "Lupa password" tidak dirender sampai halaman forgot-password tersedia)

**Components:**

- `Input` (email)
- `Input` (password, type=password)
- `Button` (submit)

---

### Forgot Password Page (belum dibangun)

**URL:** `/admin/forgot-password`

**Layout:**

- Card kaca (`.glass rounded-xl shadow-sm`) di latar polos `bg-background` (dual-mode); shell auth bersama tanpa `<main>` bersarang

- Email input
- Submit button
- Back to login link

**Components:**

- `Input` (email)
- `Button` (submit)
- `Link` (back to login)

---

### Reset Password Page (belum dibangun)

**URL:** `/admin/reset-password?token=...`

**Layout:**

- Card kaca (`.glass rounded-xl shadow-sm`) di latar polos `bg-background` (dual-mode); shell auth bersama tanpa `<main>` bersarang

- New password input
- Confirm password input
- Submit button

**Components:**

- `Input` (password)
- `Input` (confirm password)
- `Button` (submit)

---

### Change Password Page (belum dibangun)

**URL:** `/admin/change-password` (authenticated)

**Layout:**

- Card in dashboard
- Current password input
- New password input
- Confirm new password input
- Submit button

**Components:**

- `Input` (current password)
- `Input` (new password)
- `Input` (confirm password)
- `Button` (submit)

---

# Related Documents

- `README.md` - Domain overview.
- `business-rules.md` - Business rules.
- `validation.md` - Validation schemas.
