# Architecture Guide

**Project:** LIM Digital Platform

**Folder:** `13-handbook`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini memberikan ringkasan arsitektur LIM Digital Platform bagi developer. Untuk detail lengkap, lihat `docs/00-overview/05-ARCHITECTURE.md`.

---

# Architecture Principles

Platform mengikuti prinsip berikut:

- **Documentation First** - Dokumentasi sebelum implementasi.
- **Architecture First** - Arsitektur sebelum kode.
- **Domain Driven Design** - Struktur mengikuti domain bisnis.
- **Clean Architecture** - Pemisahan layer yang jelas.
- **Repository Pattern** - Akses database terpusat.
- **Security First** - Keamanan di setiap layer.
- **Mobile Ready** - API siap untuk mobile.

---

# High Level Architecture

``
                    PostgreSQL
                         |
                    Prisma ORM
                         |
                 Repository Layer
                         |
                  Service Layer
                         |
       +-----------------+-----------------+
       |                 |                 |
  Server Actions      REST API      Background Jobs
       |                 |
       +---------+-------+
                 |
            Admin Portal
            Public Website
                 |
           Mobile (iOS/Android)
``

---

# Layer Architecture

### 1. Presentation Layer

Bertanggung jawab untuk UI, UX, Form, Table, Layout.

- Menggunakan React Component (Server/Client).
- Tidak boleh berisi Business Rules.
- Tidak boleh mengakses database langsung.

### 2. Application Layer

Terdiri dari Server Actions dan Route Handlers.

- Menerima request dari UI.
- Memanggil Service Layer.
- Mengembalikan response.

### 3. Service Layer

Pusat seluruh Business Rules.

- Validasi bisnis.
- Permission check.
- Workflow logic.
- Duplicate checking.

### 4. Repository Layer

Akses database.

- CRUD operations.
- Query optimization.
- Tidak boleh berisi Business Rules.

### 5. Database Layer

- PostgreSQL
- Prisma ORM
- Migration
- Seeder

---

# Domain Architecture

Platform menggunakan pendekatan Domain Driven. Setiap domain memiliki struktur yang konsisten:

``
[domain]/
+-- index.ts
+-- application/
|   +-- [use-case].ts
+-- infrastructure/
|   +-- [domain].repository.ts
|   +-- [domain].service.ts
+-- validation/
    +-- [domain].schema.ts
``

### Domain List

| Domain | Fungsi |
|--------|--------|
| Authentication | Login, session, token |
| Authorization | Role, permission |
| CMS | Content management |
| Organization | Data organisasi |
| Program | Program kegiatan |
| Secretariat | Administrasi |
| Letter | Persuratan |
| Certificate | Sertifikat |
| Knowledge | Pengetahuan |
| Falak | Kalendar Islam |
| Media | File management |
| Notification | Notifikasi |
| Settings | Pengaturan sistem |

---

# Core Services

Layanan inti yang digunakan lintas aplikasi:

| Service | Fungsi |
|---------|--------|
| Falak Service | Prayer time, Hijri, Qibla |
| Certificate Service | Generate, verify, publish |
| Notification Service | Email, push, announcement |
| Media Service | Upload, image processing |
| QR Verification | Verifikasi dokumen |

---

# Data Flow

``
User
  |
Presentation
  |
Server Action / API
  |
Service
  |
Repository
  |
Database
  |
Repository
  |
Service
  |
Response
  |
Presentation
``

---

# Authentication Flow

``
User -> Better Auth -> Session -> Authorization -> Application
``

Menggunakan Better Auth untuk:
- User registration
- Login / Logout
- Session management
- OAuth (jika diperlukan)

---

# Integration Principles

Seluruh aplikasi menggunakan:
- Database yang sama.
- Business Rules yang sama.
- Permission yang sama.
- Audit Log yang sama.

Perbedaan hanya pada lapisan Presentation.

---

# Architecture Rules

Seluruh developer wajib mematuhi:

1. Tidak mengakses Prisma di luar Repository.
2. Tidak memindahkan Business Rules ke UI.
3. Tidak melewati Service Layer.
4. Seluruh validasi menggunakan Zod.
5. Seluruh modul mengikuti Domain Architecture.
6. Dokumentasi diperbarui sebelum implementasi besar.

---

# Related Documents

- `docs/00-overview/05-ARCHITECTURE.md` - Arsitektur resmi lengkap.
- `docs/00-overview/06-PROJECT_STRUCTURE.md` - Struktur repository.
- [Developer Guide](./developer-guide.md) - Panduan pengembangan.
