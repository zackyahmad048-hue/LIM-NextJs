# Authorization - Business Rules

**Project:** LIM Digital Platform

**Domain:** Authorization

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan aturan bisnis domain Authorization.

---

# Business Rules

### BR-AUTHZ-001: Role

- Setiap user memiliki minimal satu role.
- Role menentukan hak akses pengguna.
- Role dapat ditugaskan atau dicabut oleh admin.

### BR-AUTHZ-002: Permission

- Permission adalah hak akses terkecil.
- Permission dapat ditugaskan langsung ke user atau melalui role.
- Permission mengikuti format: `domain:action` (misal: `cms:create`).

### BR-AUTHZ-003: Access Control

- User dengan role `super_admin` memiliki akses penuh.
- User dengan role `admin` memiliki akses admin.
- User dengan role `member` memiliki akses terbatas.
- User tanpa role tidak memiliki akses admin.

### BR-AUTHZ-004: Default Roles

| Role        | Description                         | Default              |
| ----------- | ----------------------------------- | -------------------- |
| super_admin | Akses penuh ke seluruh sistem       | Tidak                |
| admin       | Akses admin ke sebagian besar fitur | Tidak                |
| editor      | Akses pengelolaan konten            | Tidak                |
| member      | Akses dasar sebagai anggota         | Ya (untuk user baru) |

---

# Related Documents

- `README.md` - Domain overview.
- `database.md` - Database schema.
- `api.md` - API endpoints.
