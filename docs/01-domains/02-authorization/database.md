# Authorization - Database

**Project:** LIM Digital Platform

**Domain:** Authorization

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan database schema untuk domain Authorization.

---

# Tables

### role

| Field       | Type      | Constraint       | Keterangan                        |
| ----------- | --------- | ---------------- | --------------------------------- |
| id          | UUID      | PK               | Primary key                       |
| name        | VARCHAR   | UNIQUE, NOT NULL | Nama role                         |
| description | VARCHAR   | NULL             | Deskripsi role                    |
| isSystem    | BOOLEAN   | DEFAULT false    | Role sistem (tidak dapat dihapus) |
| createdAt   | TIMESTAMP | DEFAULT now()    | Waktu pembuatan                   |
| updatedAt   | TIMESTAMP |                  | Waktu update terakhir             |

### permission

| Field       | Type    | Constraint       | Keterangan                            |
| ----------- | ------- | ---------------- | ------------------------------------- |
| id          | UUID    | PK               | Primary key                           |
| name        | VARCHAR | UNIQUE, NOT NULL | Nama permission (misal: `cms:create`) |
| description | VARCHAR | NULL             | Deskripsi permission                  |
| domain      | VARCHAR | NOT NULL         | Domain (misal: `cms`)                 |
| action      | VARCHAR | NOT NULL         | Action (misal: `create`)              |

### user_role

| Field  | Type | Constraint    | Keterangan  |
| ------ | ---- | ------------- | ----------- |
| id     | UUID | PK            | Primary key |
| userId | UUID | FK -> user.id | User        |
| roleId | UUID | FK -> role.id | Role        |

### role_permission

| Field        | Type | Constraint          | Keterangan  |
| ------------ | ---- | ------------------- | ----------- |
| id           | UUID | PK                  | Primary key |
| roleId       | UUID | FK -> role.id       | Role        |
| permissionId | UUID | FK -> permission.id | Permission  |

---

# Relations

`role 1--* user_role
role 1--* role_permission
permission 1--* role_permission
user 1--* user_role`

---

# Default Permissions

`text
dashboard:view
cms:create
cms:read
cms:update
cms:delete
organization:create
organization:read
organization:update
organization:delete
program:create
program:read
program:update
program:delete
letter:create
letter:read
letter:update
letter:delete
certificate:create
certificate:read
certificate:update
certificate:delete
media:create
media:read
media:update
media:delete
users:create
users:read
users:update
users:delete
roles:create
roles:read
roles:update
roles:delete
settings:read
settings:update
`

---

# Related Documents

- `README.md` - Domain overview.
- `business-rules.md` - Business rules.
- `api.md` - API endpoints.
