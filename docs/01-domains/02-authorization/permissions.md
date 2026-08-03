# Authorization - Permissions

**Project:** LIM Digital Platform

**Domain:** Authorization

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan permissions detail untuk domain Authorization.

---

# Permission Structure

Format: `domain:action`

| Domain       | Actions                      |
| ------------ | ---------------------------- |
| dashboard    | view                         |
| cms          | create, read, update, delete |
| organization | create, read, update, delete |
| program      | create, read, update, delete |
| letter       | create, read, update, delete |
| certificate  | create, read, update, delete |
| media        | create, read, update, delete |
| users        | create, read, update, delete |
| roles        | create, read, update, delete |
| settings     | read, update                 |

---

# Role Permission Matrix

| Permission          | super_admin | admin | editor | member |
| ------------------- | ----------- | ----- | ------ | ------ |
| dashboard:view      | Ya          | Ya    | Ya     | -      |
| cms:create          | Ya          | Ya    | Ya     | -      |
| cms:read            | Ya          | Ya    | Ya     | Ya     |
| cms:update          | Ya          | Ya    | Ya     | -      |
| cms:delete          | Ya          | Ya    | -      | -      |
| organization:create | Ya          | Ya    | -      | -      |
| organization:read   | Ya          | Ya    | Ya     | Ya     |
| organization:update | Ya          | Ya    | -      | -      |
| organization:delete | Ya          | -     | -      | -      |
| program:create      | Ya          | Ya    | -      | -      |
| program:read        | Ya          | Ya    | Ya     | Ya     |
| program:update      | Ya          | Ya    | -      | -      |
| program:delete      | Ya          | -     | -      | -      |
| letter:create       | Ya          | Ya    | -      | -      |
| letter:read         | Ya          | Ya    | Ya     | -      |
| letter:update       | Ya          | Ya    | -      | -      |
| letter:delete       | Ya          | -     | -      | -      |
| certificate:create  | Ya          | Ya    | -      | -      |
| certificate:read    | Ya          | Ya    | Ya     | Ya     |
| certificate:update  | Ya          | Ya    | -      | -      |
| certificate:delete  | Ya          | -     | -      | -      |
| media:create        | Ya          | Ya    | Ya     | -      |
| media:read          | Ya          | Ya    | Ya     | Ya     |
| media:update        | Ya          | Ya    | Ya     | -      |
| media:delete        | Ya          | Ya    | -      | -      |
| users:create        | Ya          | Ya    | -      | -      |
| users:read          | Ya          | Ya    | -      | -      |
| users:update        | Ya          | Ya    | -      | -      |
| users:delete        | Ya          | -     | -      | -      |
| roles:create        | Ya          | -     | -      | -      |
| roles:read          | Ya          | Ya    | -      | -      |
| roles:update        | Ya          | -     | -      | -      |
| roles:delete        | Ya          | -     | -      | -      |
| settings:read       | Ya          | Ya    | -      | -      |
| settings:update     | Ya          | -     | -      | -      |

---

# Related Documents

- `README.md` - Domain overview.
- `business-rules.md` - Business rules.
- `database.md` - Database schema.
