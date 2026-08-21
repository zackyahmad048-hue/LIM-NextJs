# Domain Map

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan hubungan antar domain (Domain Map) pada LIM Digital Platform berdasarkan prinsip Domain Driven Design (DDD).

Domain Map menjadi acuan komunikasi antar domain, ownership data, dependency, dan integrasi internal.

---

# Overview

LIM Digital Platform menggunakan pendekatan **Modular Monolith** dengan pemisahan domain berdasarkan tanggung jawab bisnis.

Setiap domain memiliki:

- Business Rules sendiri.
- Database sendiri (logical ownership).
- API sendiri.
- Service sendiri.
- Repository sendiri.

Tidak diperbolehkan mengakses database domain lain secara langsung.

---

# Domain Classification

```text id="dmap01"
Core Domain

├── Organization
├── Program
├── Secretariat
├── Letter
├── Certificate
└── Falak

Supporting Domain

├── Dashboard
├── CMS
└── Knowledge

Shared Domain

├── Authentication
├── Authorization
├── Media
├── Notification
└── Settings
```

---

# High Level Domain Map

```text id="dmap02"
                    Authentication
                           │
                           │
                   Authorization
                           │
 ┌───────────────┬──────────┼───────────────┬──────────────┐
 │               │          │               │              │
 ▼               ▼          ▼               ▼              ▼
Organization  Dashboard    CMS          Notification    Settings
      │
      ├──────────────┬─────────────┬──────────────┐
      ▼              ▼             ▼              ▼
 Program      Secretariat      Knowledge      Falak
      │              │
      │              ▼
      │           Letter
      │              │
      └──────────────▼
                 Certificate

Media digunakan oleh hampir seluruh domain.
```

---

# Domain Ownership

| Domain         | Owns Data           |
| -------------- | ------------------- |
| Authentication | User Session        |
| Authorization  | Roles & Permissions |
| Organization   | Organization        |
| Dashboard      | Dashboard Metrics   |
| CMS            | Content             |
| Program        | Program             |
| Secretariat    | Secretariat Data    |
| Letter         | Letters             |
| Certificate    | Certificates        |
| Media          | Files & Assets      |
| Notification   | Notifications       |
| Settings       | Configuration       |
| Knowledge      | Knowledge Base      |
| Falak          | Astronomy Data      |

---

# Dependency Rules

## Shared Domain

Dapat digunakan oleh seluruh domain.

```text id="dmap03"
Authentication

Authorization

Media

Notification

Settings
```

---

## Core Domain

Tidak saling bergantung secara langsung.

Komunikasi dilakukan melalui:

- Service Interface
- Domain Event
- API
- Application Service

---

## Supporting Domain

Mengonsumsi data dari Core Domain.

Tidak menjadi sumber Business Rules utama.

---

# Communication Pattern

```text id="dmap04"
Controller

↓

Application Service

↓

Domain

↓

Repository

↓

Infrastructure
```

Antar-domain:

```text id="dmap05"
Domain A

↓

Application Service

↓

Public Interface

↓

Domain B
```

---

# Integration Rules

Domain hanya boleh berkomunikasi melalui:

- Public Service
- Public API
- Domain Event

Tidak diperbolehkan:

- Query langsung ke tabel domain lain.
- Menggunakan Repository domain lain.
- Mengakses Entity domain lain secara langsung.

---

# Shared Components

Digunakan oleh seluruh domain:

- Authentication
- Authorization
- Audit Log
- Validation
- Configuration
- Logging
- Exception Handling

---

# Evolution Strategy

Tahap awal:

```text id="dmap06"
Modular Monolith
```

Tahap berikutnya:

```text id="dmap07"
Modular Monolith

↓

Hybrid Services

↓

Microservices (Optional)
```

Migrasi dilakukan tanpa mengubah Business Rules.

---

# Architecture Principles

- High Cohesion
- Low Coupling
- Explicit Dependency
- Single Source of Truth
- Domain Ownership
- Separation of Concerns

---

# Related Documents

- README.md
- architecture-overview.md
- system-context.md
- bounded-context.md
- clean-architecture.md
- hexagonal-architecture.md
- cqrs.md
- event-driven.md
- folder-structure.md
- dependency-rules.md

---

# Acceptance Criteria

- Seluruh domain memiliki ownership yang jelas.
- Dependency antar domain terdokumentasi.
- Komunikasi antar domain mengikuti Public Interface.
- Tidak ada akses langsung ke database domain lain.
- Domain Map menjadi acuan pengembangan seluruh modul.
