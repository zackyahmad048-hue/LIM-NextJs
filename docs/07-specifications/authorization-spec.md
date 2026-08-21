# Authorization Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `authorization-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Authorization Domain**.

Authorization bertanggung jawab menentukan apakah pengguna yang telah terautentikasi memiliki hak untuk mengakses suatu resource atau melakukan suatu aksi.

Domain ini menggunakan **Role-Based Access Control (RBAC)** sesuai ADR-004.

---

# Objectives

Authorization harus mampu:

- Mengelola Role
- Mengelola Permission
- Memberikan Role kepada User
- Mengevaluasi Permission
- Mendukung Authorization pada API
- Mendukung Authorization pada UI
- Mencatat Audit seluruh perubahan hak akses

---

# Actors

| Actor               | Description                           |
| ------------------- | ------------------------------------- |
| Super Administrator | Mengelola seluruh Role dan Permission |
| Administrator       | Mengelola User dan Assignment         |
| User                | Mengakses fitur sesuai Role           |
| System              | Melakukan Permission Check            |

---

# Functional Requirements

## Role Management

Administrator dapat:

- Create Role
- Update Role
- Delete Role
- View Role

---

## Permission Management

Administrator dapat:

- Create Permission
- Update Permission
- Delete Permission
- View Permission

---

## Role Assignment

Administrator dapat:

- Assign Role
- Remove Role
- Change Role

---

## Permission Check

Sistem harus memverifikasi:

- Authentication
- Role
- Permission
- Resource Ownership (jika berlaku)

---

# Non Functional Requirements

Authorization harus:

- Response < 100 ms
- Cached
- Audit Enabled
- Highly Available
- Stateless

---

# Preconditions

- User telah Login.
- Session valid.
- JWT valid.

---

# Postconditions

Permission berhasil diverifikasi:

- Request diteruskan.
- Audit dicatat (untuk perubahan Role/Permission).

Permission gagal:

- Request ditolak.
- Error dikembalikan.

---

# Main Flow

```text id="authz01"
Request

↓

Authentication

↓

Load User

↓

Load Role

↓

Load Permission

↓

Permission Evaluation

↓

Access Granted

↓

Business Process
```

---

# Alternative Flow

```text id="authz02"
Permission Missing

↓

Access Denied

↓

Return 403
```

---

# Exception Flow

- JWT tidak valid.
- Session berakhir.
- User dinonaktifkan.
- Role tidak ditemukan.
- Permission tidak tersedia.
- Resource tidak ditemukan.

---

# Sequence Diagram

```text id="authz03"
Client

↓

Authentication Middleware

↓

Authorization Service

↓

Permission Repository

↓

Decision

↓

Application
```

---

# State Diagram

```text id="authz04"
Authenticated

↓

Permission Check

↓

Granted

or

Denied
```

---

# Domain Model

Entity:

- User
- Role
- Permission

Aggregate:

- Authorization

Value Object:

- PermissionCode
- RoleName

---

# Database Mapping

Tables:

```text id="authz05"
roles

permissions

role_permissions

user_roles
```

---

# API Specification

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | /api/v1/roles       |
| POST   | /api/v1/roles       |
| PATCH  | /api/v1/roles/{id}  |
| DELETE | /api/v1/roles/{id}  |
| GET    | /api/v1/permissions |
| POST   | /api/v1/user-roles  |

---

# Validation Matrix

## Role

| Field       | Rule             |
| ----------- | ---------------- |
| name        | Required, Unique |
| description | Optional         |

---

## Permission

| Field  | Rule             |
| ------ | ---------------- |
| code   | Required, Unique |
| module | Required         |
| action | Required         |

---

# Permission Matrix

| Endpoint    | Super Admin | Admin | User |
| ----------- | :---------: | :---: | :--: |
| View Roles  |     ✅      |  ✅   |  ❌  |
| Create Role |     ✅      |  ❌   |  ❌  |
| Update Role |     ✅      |  ❌   |  ❌  |
| Delete Role |     ✅      |  ❌   |  ❌  |
| Assign Role |     ✅      |  ✅   |  ❌  |

---

# Error Catalog

| Code      | Description             |
| --------- | ----------------------- |
| AUTHZ_001 | Access Denied           |
| AUTHZ_002 | Role Not Found          |
| AUTHZ_003 | Permission Not Found    |
| AUTHZ_004 | Invalid Role Assignment |
| AUTHZ_005 | User Has No Role        |
| AUTHZ_006 | Forbidden Resource      |

---

# Notification Matrix

| Event              | Notification     |
| ------------------ | ---------------- |
| Role Assigned      | Email (Optional) |
| Permission Changed | Email            |
| Role Deleted       | Email            |
| Security Event     | Administrator    |

---

# Acceptance Test

- Role berhasil dibuat.
- Permission berhasil dibuat.
- User memperoleh Role.
- Permission Check berhasil.
- Permission Check ditolak.
- Audit Log tercatat.
- API mengembalikan HTTP 403 ketika akses ditolak.

---

# Performance Requirement

- Permission Check < 100 ms.
- Role Assignment < 300 ms.
- Cache Hit Ratio > 90%.

---

# Security Requirement

- Menggunakan RBAC.
- Default Deny untuk seluruh resource.
- Permission diperiksa pada setiap request.
- Audit Log aktif.
- Role dan Permission hanya dapat diubah oleh Administrator yang berwenang.

---

# Acceptance Criteria

- Seluruh Authorization menggunakan RBAC.
- Permission Check diterapkan pada seluruh endpoint yang dilindungi.
- Role dan Permission terdokumentasi.
- Audit Log mencatat seluruh perubahan hak akses.
- Specification siap digunakan sebagai dasar implementasi Authorization Domain.
