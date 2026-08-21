# Authorization - UI

**Project:** LIM Digital Platform

**Domain:** Authorization

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan UI specification untuk domain Authorization.

---

# Pages

### Roles Page

**URL:** `/admin/system/roles`

**Layout:**

- Page header with title
- Table with roles
- Add role button

**Table Columns:**

- Name
- Description
- Is System
- Permissions count
- Actions (edit, delete)

---

### Role Form Dialog

**Trigger:** Add/Edit button

**Fields:**

- Name (text input)
- Description (textarea)
- Permissions (checkboxes grouped by domain)

---

### Users Page

**URL:** `/admin/system/users`

**Layout:**

- Page header with title
- Table with users
- Add user button

**Table Columns:**

- Name
- Email
- Roles
- Status
- Actions (edit, delete)

---

### User Form Dialog

**Trigger:** Add/Edit button

**Fields:**

- Name (text input)
- Email (email input)
- Password (password input, only for create)
- Roles (checkboxes)

---

# Related Documents

- `README.md` - Domain overview.
- `business-rules.md` - Business rules.
- `validation.md` - Validation schemas.
