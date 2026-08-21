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

**URL:** `/admin/login`

**Layout:**

- Centered card on dark background
- App logo + name
- Email input
- Password input
- Login button
- Forgot password link

**Components:**

- `Input` (email)
- `Input` (password, type=password)
- `Button` (submit)
- `Link` (forgot password)

---

### Forgot Password Page

**URL:** `/admin/forgot-password`

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
