# LIM Digital Platform — Documentation Hub

> Center of Excellence for Architecture, Domain Specifications, Design System, Infrastructure, and Development Guidelines.

---

## 📌 Project Overview

**LIM Digital Platform** adalah platform digital terintegrasi berbasis **Next.js 16 (App Router)** dan **TypeScript** yang mengusung arsitektur **Domain-Driven Design (DDD)**. Platform ini mengintegrasikan seluruh operasional organisasi: website publik, portal administrasi (CMS), manajemen persuratan, program kerja, sertifikat digital, notifikasi, hingga layanan falak.

---

## 🛠️ Technology Stack

- **Core Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **Language:** TypeScript
- **Styling & UI:** Tailwind CSS v4, `shadcn/ui` (`radix-maia` style), `framer-motion`
- **Database & ORM:** PostgreSQL (Neon) with Prisma ORM (`@/generated/client`)
- **Authentication & AuthZ:** Better Auth with Prisma Adapter & Custom RBAC
- **Icons:** Lucide React

---

## 📁 Repository & Architecture Structure

```text
my-app/
├── app/                  # Next.js App Router (Public, Auth, Admin CMS, API)
├── modules/              # Domain-Driven Design Modules (DDD)
│   ├── authentication/   # Login, Register, Sessions
│   ├── authorization/    # Roles, Permissions, RBAC
│   ├── cms/              # Articles, Posts, Categories, Media, Hero
│   ├── dashboard/        # Analytics & Stats queries
│   ├── media/            # File & Media Repository
│   ├── settings/         # Application Settings
│   └── shared/           # Prisma Client, Base Interfaces, Utilities
├── components/           # UI Components (ui/, admin/, website/, motion/)
├── config/               # App configuration & site navigation
├── actions/              # Server Actions
├── prisma/               # Database Schema (schema.prisma) & Seeders
├── generated/client/     # Auto-generated Prisma Client
└── docs/                 # Platform Master Documentation
```

---

## 📚 Master Documentation Map

Seluruh dokumen platform dikelompokkan ke dalam 14 direktori utama:

### 📑 [00-Overview](./00-overview/00-README.md)

Prinsip utama, visi produk, blueprint, keamanan, dan standar umum platform.

- [00-README](./00-overview/00-README.md) — Ringskasan Platform & Daftar Dokumen Utama
- [01-PRODUCT_VISION](./00-overview/01-PRODUCT_VISION.md) — Visi & Misi Digitalisasi Organisasi
- [02-PROJECT_OVERVIEW](./00-overview/02-PROJECT_OVERVIEW.md) — Lingkup & Sasaran Proyek
- [03-BLUEPRINT](./00-overview/03-BLUEPRINT.md) — Cetak Biru Arsitektur & Layanan
- [04-ROADMAP](./00-overview/04-ROADMAP.md) — Peta Jalan Pengembangan Fitur
- [05-ARCHITECTURE](./00-overview/05-ARCHITECTURE.md) — Prinsip & Layering Sistem
- [06-PROJECT_STRUCTURE](./00-overview/06-PROJECT_STRUCTURE.md) — Struktur Direktori Resmi & Konvensi Impor
- [07-BUSINESS_RULES](./00-overview/07-BUSINESS_RULES.md) — Aturan Bisnis Global
- [08-DATABASE](./00-overview/08-DATABASE.md) — Standar Database & Integrasi Prisma
- [09-SECURITY](./00-overview/09-SECURITY.md) — Keamanan, Auth, Session & RBAC
- [10-CODING_STANDARDS](./00-overview/10-CODING_STANDARDS.md) — Standar Koding TypeScript & React
- [11-API](./00-overview/11-API.md) — Standar REST API & Server Actions
- [12-AI_RULES](./00-overview/12-AI_RULES.md) — Panduan & Aturan untuk Agent / AI Assistants
- [13-CONTRIBUTING](./00-overview/13-CONTRIBUTING.md) — Panduan Kontribusi
- [14-GIT_WORKFLOW](./00-overview/14-GIT_WORKFLOW.md) — Alur Kerja Git & Conventional Commits
- [15-DEPLOYMENT](./00-overview/15-DEPLOYMENT.md) — Alur Rilis & Deployment
- [16-DESIGN_SYSTEM](./00-overview/16-DESIGN_SYSTEM.md) — Konsep Visual & Tokens
- [17-UX_GUIDELINES](./00-overview/17-UX_GUIDELINES.md) — Panduan Pengalaman Pengguna (UX)
- [18-DATA_DICTIONARY](./00-overview/18-DATA_DICTIONARY.md) — Kamus Data Global

### 📦 [01-Domains](./01-domains/README.md)

Spesifikasi modul domain bisnis (Business Domains):

- [01-Authentication](./01-domains/01-authentication/README.md) — Autentikasi & Identitas
- [02-Authorization](./01-domains/02-authorization/README.md) — Peran & Hak Akses (RBAC)
- [03-Dashboard](./01-domains/03-dashboard/README.md) — Metrics & Analytics Dashboard
- [04-CMS](./01-domains/04-cms/README.md) — Manajemen Konten (Artikel, Berita, Banner)
- [05-Organization](./01-domains/05-organization/README.md) — Struktur & Data Organisasi
- [06-Program](./01-domains/06-program/README.md) — Manajemen Program Kerja
- [07-Secretariat](./01-domains/07-secretariat/README.md) — Administrasi & Kesekretariatan
- [08-Letter](./01-domains/08-letter/README.md) — Manajemen Persuratan Resmi
- [09-Falak](./01-domains/09-falak/README.md) — Layanan Jadwal Sholat & Falak
- [10-Media](./01-domains/10-media/README.md) — Repository & Manajemen Media File
- [11-Knowledge](./01-domains/11-knowledge/README.md) — Pusat Pengetahuan & Artikel Ref
- [12-Certificate](./01-domains/12-certificate/README.md) — Penerbitan & Verifikasi Sertifikat
- [13-Notification](./01-domains/13-notification/README.md) — Layanan Notifikasi & Email
- [14-Settings](./01-domains/14-settings/README.md) — Pengaturan Sistem Global

### 🏗️ [02-Architecture](./02-architecture/README.md)

Arsitektur teknis, Clean Architecture, Hexagonal, dan Monolith Modular:

- [Overview & Principles](./02-architecture/README.md)
- [System Context](./02-architecture/system-context.md)
- [Hexagonal Architecture](./02-architecture/hexagonal-architecture.md)
- [Frontend Architecture](./02-architecture/frontend.md)
- [Mobile Strategy](./02-architecture/mobile-strategy.md)
- [Folder Structure Specification](./02-architecture/folder-structure.md)

### 💻 [03-Development](./03-development/README.md)

Panduan pengembang, standar koding, strategi percabangan, dan alur code review:

- [Development Overview](./03-development/README.md)
- [Development Workflow](./03-development/development-workflow.md)
- [Branching Strategy](./03-development/branching-strategy.md)
- [Git Workflow](./03-development/git-workflow.md)
- [Commit Convention](./03-development/commit-convention.md)
- [Naming Conventions](./03-development/naming-conventions.md)
- [Coding Standards](./03-development/coding-standards.md)
- [Code Review Guidelines](./03-development/code-review.md)
- [Testing Strategy](./03-development/testing-strategy.md)

### 🚀 [04-Deployment](./04-deployment/README.md)

Infrastruktur deployment, server, CI/CD, Docker, dan pemantauan:

- [Deployment Overview](./04-deployment/README.md)
- [Environment Configuration](./04-deployment/environment.md)
- [Server Requirements](./04-deployment/server.md)
- [Docker Setup](./04-deployment/docker.md)
- [CI/CD Pipelines](./04-deployment/ci-cd.md)
- [Security Hardening](./04-deployment/security.md)
- [Monitoring & Logging](./04-deployment/monitoring.md)
- [Backup Strategy](./04-deployment/backup.md)

### 📋 [05-Decisions (ADR)](./05-decisions/README.md)

Architecture Decision Records (ADR):

- [ADR-001 Domain Driven Design](./05-decisions/ADR-001-domain-driven-design.md)
- [ADR-002 Clean Architecture](./05-decisions/ADR-002-clean-architecture.md)
- [ADR-003 Repository Pattern](./05-decisions/ADR-003-repository-pattern.md)
- [ADR-004 Role Based Access Control](./05-decisions/ADR-004-role-based-access-control.md)
- [ADR-005 Event Driven Architecture](./05-decisions/ADR-005-event-driven-architecture.md)
- [ADR-006 Storage Strategy](./05-decisions/ADR-006-storage-strategy.md)
- [ADR-007 Notification Architecture](./05-decisions/ADR-007-notification-architecture.md)
- [ADR-008 API Standard](./05-decisions/ADR-008-api-standard.md)
- [ADR-009 Validation Strategy](./05-decisions/ADR-009-validation-strategy.md)
- [ADR-010 Audit Log System](./05-decisions/ADR-010-audit-log.md)

### 📖 [06-References](./06-references/README.md)

Glosarium, API, database, dan referensi eksternal:

- [Glossary](./06-references/glossary.md)
- [API Reference](./06-references/api-reference.md)
- [Database Reference](./06-references/database-reference.md)
- [Coding Reference](./06-references/coding-reference.md)
- [External References](./06-references/external-reference.md)

### 📐 [07-Specifications](./07-specifications/README.md)

Spesifikasi teknis mendalam untuk setiap modul & layanan:

- [Authentication Spec](./07-specifications/authentication-spec.md) | [Authorization Spec](./07-specifications/authorization-spec.md)
- [CMS Spec](./07-specifications/cms-spec.md) | [Dashboard Spec](./07-specifications/dashboard-spec.md)
- [Organization Spec](./07-specifications/organization-spec.md) | [Program Spec](./07-specifications/program-spec.md)
- [Secretariat Spec](./07-specifications/secretariat-spec.md) | [Letter Spec](./07-specifications/letter-spec.md)
- [Certificate Spec](./07-specifications/certificate-spec.md) | [Falak Spec](./07-specifications/falak-spec.md)
- [Knowledge Spec](./07-specifications/knowledge-spec.md) | [Media Spec](./07-specifications/media-spec.md)
- [Notification Spec](./07-specifications/notification-spec.md) | [Settings Spec](./07-specifications/settings-spec.md)

### 🎨 [08-Design System](./08-design-system/README.md)

Sistem desain visual, komponen UI, warna, tipografi, dan aksesibilitas:

- [Design System Overview](./08-design-system/README.md)
- [Theme & Dark Mode](./08-design-system/theme.md)
- [Colors](./08-design-system/colors.md) | [Typography](./08-design-system/typography.md) | [Spacing](./08-design-system/spacing.md)
- [Layout](./08-design-system/layout.md) | [Navigation](./08-design-system/navigation.md) | [Components](./08-design-system/components.md)
- [Forms](./08-design-system/forms.md) | [Tables](./08-design-system/tables.md) | [Icons](./08-design-system/icons.md)
- [Responsive Design](./08-design-system/responsive.md) | [Accessibility (a11y)](./08-design-system/accessibility.md)

### 🌐 [09-Infrastructure](./09-infrastructure/README.md)

Topologi jaringan, arsitektur server, container, database, cache, dan storage:

- [Infrastructure Overview](./09-infrastructure/README.md)
- [Server Architecture](./09-infrastructure/server-architecture.md)
- [Network Topology](./09-infrastructure/network-topology.md)
- [Container Platform](./09-infrastructure/container-platform.md)
- [Database Infrastructure](./09-infrastructure/database-infrastructure.md)
- [Cache Infrastructure](./09-infrastructure/cache-infrastructure.md)
- [Storage Infrastructure](./09-infrastructure/storage-infrastructure.md)
- [Monitoring Infrastructure](./09-infrastructure/monitoring-infrastructure.md)

### 🧪 [10-Testing](./10-testing/README.md)

Rencana pengujian, skenario uji, pengujian keamanan, dan performa:

- [Testing Overview](./10-testing/README.md)
- [Test Plan](./10-testing/test-plan.md)
- [Test Cases](./10-testing/test-cases.md)
- [Security Testing](./10-testing/security-testing.md)
- [Performance Testing](./10-testing/performance-testing.md)
- [User Acceptance Testing (UAT)](./10-testing/uat.md)

### ⚙️ [11-Operations](./11-operations/README.md)

Sistem pemeliharaan, penanganan insiden, pencadangan data, dan runbook operasional:

- [Operations Overview](./11-operations/README.md)
- [Runbook](./11-operations/runbook.md)
- [Maintenance Guide](./11-operations/maintenance.md)
- [Incident Response](./11-operations/incident-response.md)
- [Release Management](./11-operations/release-management.md)
- [Backup & Recovery](./11-operations/backup-recovery.md)
- [Operational Checklist](./11-operations/operational-checklist.md)

### 📊 [12-Project Management](./12-project-management/README.md)

Manajemen proyek, backlog, kriteria rilis, dan manajemen risiko:

- [Project Management Overview](./12-project-management/README.md)
- [Milestones](./12-project-management/milestone.md)
- [Product Backlog](./12-project-management/backlog.md)
- [Definition of Ready (DoR)](./12-project-management/definition-of-ready.md)
- [Definition of Done (DoD)](./12-project-management/definition-of-done.md)
- [Release Plan](./12-project-management/release-plan.md)
- [Risk Register](./12-project-management/risk-register.md)

### 📘 [13-Handbook](./13-handbook/README.md)

Buku panduan untuk pengembang dan kontributor:

- [Handbook Overview](./13-handbook/README.md)
- [Getting Started](./13-handbook/getting-started.md)
- [Local Environment Setup](./13-handbook/local-setup.md)
- [Developer Guide](./13-handbook/developer-guide.md)
- [Architecture Guide](./13-handbook/architecture-guide.md)
- [Troubleshooting](./13-handbook/troubleshooting.md)
- [FAQ](./13-handbook/faq.md)

---

## ⚡ Quick Commands

```bash
# Menjalankan dev server
npm run dev

# Menjalankan linting dan pengecekan tipe data
npm run check

# Format kode dengan Prettier
npm run format

# Prisma Operations
npm run prisma:generate   # Generasi Prisma Client ke @/generated/client
npm run prisma:migrate    # Buat & terapkan migrasi database
npm run db:push           # Push perubahan schema tanpa file migrasi
npm run db:seed           # Jalankan seeder database (tsx prisma/seed.ts)
```

---

## 🗝️ Key Development Conventions

1. **Import Alias:** Selalu gunakan `@/*` mengacu pada root proyek (`@/modules/...`, `@/components/...`, `@/generated/client`).
2. **Prisma Client:** Prisma dikonfigurasi untuk menghasilkan client di `../generated/client`. Selalu impor Prisma Client dari `@/generated/client`.
3. **Module Architecture:** Setiap modul bisnis ditempatkan pada `modules/<domain>` dengan sub-layer `domain/`, `infrastructure/`, `application/`, dan `presentation/`.
4. **Authentication:** Pengisian sesi dan autentikasi ditangani oleh Better Auth dengan Prisma Adapter (`@/modules/authentication`).
