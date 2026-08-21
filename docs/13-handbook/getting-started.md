# Getting Started

**Project:** LIM Digital Platform

**Folder:** `13-handbook`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini memberikan pengantar cepat bagi developer baru untuk memahami LIM Digital Platform dan mulai berkontribusi dalam waktu singkat.

---

# What is LIM Digital Platform?

LIM Digital Platform adalah platform digital terintegrasi untuk Lembaga Ittihadul Muballighin. Platform ini mencakup:

- **Public Website** - Portal informasi organisasi.
- **Admin Portal** - Pusat administrasi CMS.
- **Mobile Application** - Layanan digital (Android & iOS).
- **REST API** - Lapisan integrasi antar aplikasi.

---

# Tech Stack

| Layer      | Technology      |
| ---------- | --------------- |
| Language   | TypeScript      |
| Framework  | Next.js 16      |
| UI Library | React 19        |
| Styling    | Tailwind CSS 4  |
| Component  | shadcn/ui       |
| ORM        | Prisma 7        |
| Database   | PostgreSQL      |
| Auth       | Better Auth     |
| Validation | Zod             |
| Form       | React Hook Form |
| Table      | TanStack Table  |
| Animation  | Motion          |
| State      | React Context   |

---

# Project Structure

`text
my-app/
+-- app/                    # Next.js App Router
|   +-- (public)/           # Public website routes
|   +-- (dashboard)/        # Admin dashboard routes
|   +-- api/                # REST API routes
|   +-- layout.tsx          # Root layout
+-- components/
|   +-- ui/                 # shadcn/ui components
|   +-- admin/              # Admin-specific components
|   +-- website/            # Public website components
|   +-- shared/             # Shared components
+-- modules/                # Domain modules (DDD)
|   +-- authentication/
|   +-- cms/
|   +-- dashboard/
|   +-- program/
|   +-- ...
+-- lib/                    # Utilities and helpers
+-- prisma/                 # Database schema and migrations
+-- docs/                   # Documentation
+-- public/                 # Static assets
+-- config/                 # App configuration
`

---

# Architecture Layers

`text
Presentation (UI)
      |
Server Actions / API
      |
Service Layer (Business Rules)
      |
Repository Layer (Database Access)
      |
Prisma ORM
      |
PostgreSQL
`

Aturan utama:

- Business Rules hanya di Service Layer.
- Database access hanya melalui Repository.
- UI tidak boleh mengakses Prisma langsung.

---

# Domain Modules

Platform dibangun dengan pendekatan Domain Driven:

- Authentication
- Authorization
- CMS (Content Management)
- Organization
- Program
- Secretariat
- Letter
- Certificate
- Knowledge
- Falak
- Media
- Notification
- Settings

Setiap domain memiliki struktur yang konsisten: validation, service, repository.

---

# Development Workflow

1. Baca dokumentasi terkait di `docs/`.
2. Buat branch baru dari `main`.
3. Implementasikan fitur mengikuti arsitektur.
4. Jalankan `npm run check` untuk memastikan tidak ada error.
5. Buat Pull Request.
6. Tunggu code review.

---

# Essential Commands

``bash

# Development

npm run dev # Jalankan dev server

# Quality

npm run check # Lint + Typecheck
npm run lint # ESLint only
npm run typecheck # TypeScript only
npm run format # Prettier format

# Database

npm run prisma:generate # Generate Prisma client
npm run prisma:migrate # Jalankan migrasi
npm run prisma:studio # Buka Prisma Studio
npm run db:push # Push schema ke database
npm run db:seed # Jalankan seed data
``

---

# Related Documents

- `docs/00-overview/02-PROJECT_OVERVIEW.md` - Gambaran umum proyek.
- `docs/00-overview/05-ARCHITECTURE.md` - Arsitektur resmi.
- `docs/00-overview/06-PROJECT_STRUCTURE.md` - Struktur repository.
- `docs/00-overview/10-CODING_STANDARDS.md` - Standar penulisan kode.
- `docs/03-development/coding-standards.md` - Coding standards detail.
- `docs/13-handbook/local-setup.md` - Panduan setup lokal.
- `docs/13-handbook/developer-guide.md` - Panduan pengembangan.

---

# Next Steps

- [Local Setup](./local-setup.md) - Atur lingkungan pengembangan lokal.
- [Developer Guide](./developer-guide.md) - Pelajari cara mengembangkan fitur.
- [Architecture Guide](./architecture-guide.md) - Pahami arsitektur sistem.
- [FAQ](./faq.md) - Pertanyaan yang sering diajukan.
- [Troubleshooting](./troubleshooting.md) - Solusi error umum.
