# Authorization - API

**Project:** LIM Digital Platform

**Domain:** Authorization

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan API endpoints untuk domain Authorization.

---

# Endpoints

### GET /api/admin/roles

Mendapatkan semua roles.

**Headers:**

`text
Authorization: Bearer <token>
`

**Response (200):**

`json
{
  "roles": [
    {
      "id": "...",
      "name": "admin",
      "description": "Administrator",
      "isSystem": true
    }
  ]
}
`

---

### POST /api/admin/roles

Membuat role baru.

**Request:**

`json
{
  "name": "editor",
  "description": "Content Editor"
}
`

**Response (201):**

`json
{
  "id": "...",
  "name": "editor",
  "description": "Content Editor"
}
`

---

### PUT /api/admin/roles/:id

Memperbarui role.

**Request:**

`json
{
  "name": "editor",
  "description": "Senior Content Editor"
}
`

**Response (200):**

`json
{
  "id": "...",
  "name": "editor",
  "description": "Senior Content Editor"
}
`

---

### DELETE /api/admin/roles/:id

Menghapus role.

**Response (200):**

`json
{
  "message": "Role berhasil dihapus"
}
`

---

### POST /api/admin/roles/:id/permissions

Menugaskan permission ke role.

**Request:**

`json
{
  "permissionIds": ["...", "..."]
}
`

**Response (200):**

`json
{
  "message": "Permission berhasil ditugaskan"
}
`

---

### POST /api/admin/users/:id/roles

Menugaskan role ke user.

**Request:**

`json
{
  "roleIds": ["...", "..."]
}
`

**Response (200):**

`json
{
  "message": "Role berhasil ditugaskan"
}
`

---

# Related Documents

- `README.md` - Domain overview.
- `business-rules.md` - Business rules.
- `database.md` - Database schema.
