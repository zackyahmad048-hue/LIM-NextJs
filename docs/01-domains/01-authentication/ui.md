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

### Login Page

**URL:** `/login` (route group `(auth)`; redirect lama `/admin/login` → `/login`)

**Status:** Diimplementasi — `app/(auth)/login/page.tsx`

**Layout:**

- Centered card on dark/aurora background
- Back link "Beranda" (→ `/`)
- App logo + name ("Admin Gateway")
- Email input
- Password input (toggle lihat/sembunyi)
- Login button
- Footer kredit

**Components:**

- `LoginForm` (`modules/authentication/presentation/login-form.tsx`)
- `SmoothInput` (email, `name="email"`, `autoComplete="email"`)
- `SmoothInput` (password, `type="password"`)
- `Button` (submit)

**Catatan:**

- Login sukses mengarahkan ke `/cms` (panel Payload).
- Belum ada link "lupa password" di halaman ini.

---

### Setup Page

**URL:** `/login/setup`

**Status:** Diimplementasi — `app/(auth)/login/setup/page.tsx`

**Layout:**

- Centered card "Buat Admin Pertama"
- Penjelasan bahwa akun diambil dari `ADMIN_EMAIL` / `ADMIN_PASSWORD` pada `.env`
- Submit button (server action `createAdmin`)

---

### Forgot Password Page

**URL:** `/admin/forgot-password`

**Status:** Belum diimplementasi — tidak ada route maupun komponennya di `app/`.

**Layout:**

- Centered card
- Email input
- Submit button
- Back to login link

**Components:**

- `Input` (email)
- `Button` (submit)
- `Link` (back to login)

---

### Reset Password Page

**URL:** `/admin/reset-password?token=...`

**Status:** Belum diimplementasi — tidak ada route maupun komponennya di `app/`.

**Layout:**

- Centered card
- New password input
- Confirm password input
- Submit button

**Components:**

- `Input` (password)
- `Input` (confirm password)
- `Button` (submit)

---

### Change Password Page

**URL:** `/admin/change-password` (authenticated)

**Status:** Belum diimplementasi — tidak ada route maupun komponennya di `app/`.

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
