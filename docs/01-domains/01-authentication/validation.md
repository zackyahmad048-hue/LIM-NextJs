# Authentication - Validation

**Project:** LIM Digital Platform

**Domain:** Authentication

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan validasi schema untuk domain Authentication menggunakan Zod.

---

# Schemas

### Login Schema

``typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
});
``

---

### Register Schema

``typescript
export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil")
    .regex(/[0-9]/, "Password harus mengandung angka")
    .regex(/[^A-Za-z0-9]/, "Password harus mengandung karakter khusus"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});
``

---

### Forgot Password Schema

``typescript
export const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});
``

---

### Reset Password Schema

``typescript
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token harus diisi"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil")
    .regex(/[0-9]/, "Password harus mengandung angka")
    .regex(/[^A-Za-z0-9]/, "Password harus mengandung karakter khusus"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});
``

---

### Change Password Schema

``typescript
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password lama harus diisi"),
  newPassword: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil")
    .regex(/[0-9]/, "Password harus mengandung angka")
    .regex(/[^A-Za-z0-9]/, "Password harus mengandung karakter khusus"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});
``

---

# Related Documents

- `README.md` - Domain overview.
- `business-rules.md` - Business rules.
- `api.md` - API endpoints.
