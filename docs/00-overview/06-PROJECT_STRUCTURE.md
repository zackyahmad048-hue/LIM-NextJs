# PROJECT_STRUCTURE

**Project:** LIM Digital Platform

**Version:** 2.0

**Status:** Approved

**Document Type:** Project Structure Specification

---

# Purpose

Dokumen ini mendefinisikan struktur repository resmi LIM Digital Platform.

Seluruh source code, dokumentasi, layanan, dan aset proyek harus mengikuti struktur ini agar tetap konsisten, mudah dipelihara, dan siap dikembangkan oleh banyak developer.

---

# Project Philosophy

Struktur proyek dirancang berdasarkan prinsip:

- Domain Driven
- Modular
- Scalable
- Monorepo Ready
- Documentation First
- Service Oriented

---

# Repository Structure

```text
my-app/
├── app/                  # Next.js 16 App Router Pages & API
│   ├── (auth)/           # Authentication Routes (login, register)
│   ├── (dashboard)/admin/# Admin CMS & Dashboard Portal (Protected)
│   ├── (public)/         # Public Website Routes
│   └── api/auth/         # Better Auth API catch-all handler
├── modules/              # Domain-Driven Design Modules
│   ├── authentication/   # Auth logic, Better Auth config, sessions
│   ├── authorization/    # RBAC Roles & Permissions
│   ├── cms/              # Posts, Categories, Media, Hero
│   ├── dashboard/        # Dashboard metrics & analytics queries
│   ├── media/            # File management & Media Repository
│   ├── settings/         # System Settings Repository
│   └── shared/           # Prisma Client, base entities, utilities
├── components/           # UI Components (radix-maia style)
│   ├── ui/               # Primitive components (shadcn/ui)
│   ├── admin/            # Admin Layout, Navigation, Data Table
│   ├── website/          # Public site header, hero, footer
│   └── motion/           # Motion library animations
├── config/               # App configuration & site navigation
├── actions/              # Server Actions
├── prisma/               # Database Schema & Seeders (prisma/seed.ts)
├── generated/client/     # Auto-generated Prisma Client (@/generated/client)
├── docs/                 # Platform Master Documentation
├── public/               # Static Assets
├── package.json          # Dependencies & Scripts
├── tsconfig.json         # TypeScript configuration (Alias: @/* -> root)
└── postcss.config.mjs    # Tailwind CSS v4 PostCSS Plugin Setup
```

---

# Key Project Directories

## `app/`

Menggunakan Next.js App Router dengan Route Groups:

- `(auth)`: Halaman Login & Registrasi
- `(dashboard)/admin`: CMS Portal Admin (dilindungi proteksi sesi)
- `(public)`: Website publik organisasi
- `api/auth`: Handler catch-all Better Auth

---

## `modules/`

Arsitektur Domain-Driven Design (DDD):

Setiap modul di bawah `modules/` mengusung layering terstruktur:

- `domain/`: Business logic, value objects, domain entities
- `infrastructure/`: Implementasi database, ORM, external API
- `application/`: Use cases, services, DTO
- `presentation/`: Action handlers / UI bridge

---

## `generated/client/`

Prisma Client dikonfigurasi dengan _custom output path_ ke `../generated/client`. Seluruh modul wajib mengimpor Prisma Client via `@/generated/client`.

---

## Admin

Portal administrasi organisasi.

Fitur utama:

- Dashboard
- CMS
- Organization
- Program
- Secretariat
- Letter
- Certificate
- Media
- Users
- Settings

---

## Website

Website publik.

Fitur:

- Homepage
- Organization
- News
- Article
- Agenda
- Gallery
- Contact
- Verification

---

## Mobile

Aplikasi Android dan iOS.

Fitur:

- Jadwal Sholat
- Al-Qur'an
- Doa
- Istighotsah
- Arah Kiblat
- Berita
- Agenda
- Sertifikat Saya

---

# packages/

Library yang digunakan bersama.

```text
packages/

ui/

shared/

types/

validation/

utils/

config/

constants/
```

---

## ui

Komponen UI reusable.

---

## shared

Business helper.

---

## validation

Schema Zod.

---

## types

TypeScript Types.

---

## utils

Utility Function.

---

## config

Konfigurasi bersama.

---

## constants

Konstanta sistem.

---

# services/

Core Service.

```text
services/

falak-service/

certificate-service/

media-service/

notification-service/

qr-service/
```

Seluruh service dapat digunakan oleh Website, Admin, API, maupun Mobile.

---

# prisma/

```text
schema.prisma

migrations/

seed/
```

---

# docs/

Seluruh dokumentasi proyek.

```text
00-overview/

01-modules/

02-services/

03-mobile/

04-public/

05-admin/

06-database/

07-api/

08-adr/

09-development/

10-diagrams/

11-wireframes/

12-decisions/

13-organization/
```

---

# scripts/

Automation Script.

Contoh:

- Seeder
- Import
- Export
- Backup

---

# infrastructure/

Konfigurasi deployment.

Contoh:

- Docker
- CI/CD
- Environment
- Reverse Proxy

---

# public/

Asset publik.

- Image
- Icon
- Font
- Manifest

---

# .github/

Konfigurasi GitHub.

```text
workflows/

ISSUE_TEMPLATE/

PULL_REQUEST_TEMPLATE.md
```

---

# Folder Convention

Menggunakan:

kebab-case

Contoh:

```text
letter-management

certificate-service

audit-log
```

---

# File Convention

Menggunakan:

kebab-case

Contoh:

```text
category.service.ts

user.repository.ts

post.schema.ts
```

---

# Component Convention

React Component menggunakan PascalCase.

Contoh:

```text
CategoryForm

DashboardLayout

PrayerCard
```

---

# Module Convention

Setiap modul memiliki struktur yang sama.

```text
module/

index.ts

columns.tsx

table.tsx

dialog.tsx

form.tsx

delete.dialog.tsx
```

---

# Layer Convention

```text
Presentation

↓

Action / API

↓

Service

↓

Repository

↓

Database
```

Tidak boleh melewati layer.

---

# Documentation Convention

Setiap modul wajib memiliki dokumentasi pada folder:

```text
docs/01-modules
```

Sebelum implementasi dimulai.

---

# Future Scalability

Struktur ini dirancang agar mendukung:

- Multi App
- Multi Service
- Multi Organization
- Multi Language
- AI Integration
- Offline Mobile
- Plugin Architecture (masa depan)

Tanpa perubahan besar pada repository.

---

# Governance

Seluruh perubahan struktur repository harus:

- Didokumentasikan.
- Tidak bertentangan dengan Blueprint.
- Menjaga kompatibilitas antar aplikasi.
- Disetujui sebelum diterapkan.

---

# Closing

PROJECT_STRUCTURE menjadi acuan resmi penataan repository LIM Digital Platform.

Dengan struktur yang konsisten, platform dapat berkembang menjadi ekosistem digital organisasi yang terorganisasi, mudah dipelihara, dan siap dikembangkan oleh banyak kontributor dalam jangka panjang.
