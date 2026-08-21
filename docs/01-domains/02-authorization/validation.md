# Authorization - Validation

**Project:** LIM Digital Platform

**Domain:** Authorization

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan validasi schema untuk domain Authorization menggunakan Zod.

---

# Schemas

### Create Role Schema

``typescript
import { z } from "zod";

export const createRoleSchema = z.object({
name: z
.string()
.min(1, "Nama role harus diisi")
.max(50, "Nama role maksimal 50 karakter")
.regex(/^[a-z_]+$/, "Nama role hanya boleh huruf kecil dan underscore"),
description: z.string().optional(),
});
``

---

### Update Role Schema

`typescript
export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Nama role harus diisi")
    .max(50, "Nama role maksimal 50 karakter")
    .regex(/^[a-z_]+$/, "Nama role hanya boleh huruf kecil dan underscore")
    .optional(),
  description: z.string().optional(),
});
`

---

### Assign Permissions Schema

`typescript
export const assignPermissionsSchema = z.object({
  permissionIds: z
    .array(z.string().uuid())
    .min(1, "Pilih minimal satu permission"),
});
`

---

### Assign Roles Schema

`typescript
export const assignRolesSchema = z.object({
  roleIds: z
    .array(z.string().uuid())
    .min(1, "Pilih minimal satu role"),
});
`

---

# Related Documents

- `README.md` - Domain overview.
- `business-rules.md` - Business rules.
- `api.md` - API endpoints.
