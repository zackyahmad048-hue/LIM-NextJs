# Authentication - Permissions

**Project:** LIM Digital Platform

**Domain:** Authentication

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan permissions untuk domain Authentication.

---

# Permissions

Domain Authentication hanya menangani identitas dan sesi. Permission untuk hak akses berada di domain Authorization.

---

# Access Control

| Action          | Guest | Authenticated User | Admin | Super Admin |
| --------------- | ----- | ------------------ | ----- | ----------- |
| Login           | Ya    | -                  | -     | -           |
| Logout          | -     | Ya                 | Ya    | Ya          |
| View Profile    | -     | Ya                 | Ya    | Ya          |
| Change Password | -     | Ya                 | Ya    | Ya          |
| Forgot Password | Ya    | -                  | -     | -           |
| Reset Password  | Ya    | -                  | -     | -           |
| Verify Email    | Ya    | -                  | -     | -           |
| Manage Users    | -     | -                  | Ya    | Ya          |
| Revoke Session  | -     | -                  | Ya    | Ya          |
| Lock Account    | -     | -                  | Ya    | Ya          |

---

# Related Documents

- `README.md` - Domain overview.
- `business-rules.md` - Business rules.
- `../02-authorization/` - Authorization domain.
