# Bounded Context

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan **Bounded Context** pada LIM Digital Platform berdasarkan prinsip **Domain Driven Design (DDD)**.

Setiap Bounded Context memiliki model domain, business rules, database, service, dan API sendiri.

---

# Overview

LIM Digital Platform dibagi menjadi beberapa Bounded Context yang saling berkomunikasi melalui Public Interface, Domain Event, atau REST API.

Setiap Context memiliki tanggung jawab yang jelas dan tidak boleh mengakses implementasi internal context lain.

---

# Context Overview

```text id="bc01"
Shared Context

Core Context

Supporting Context
```

---

# Shared Context

Shared Context digunakan oleh seluruh sistem.

```text id="bc02"
Authentication

Authorization

Media

Notification

Settings
```

### Responsibility

- Authentication
- Authorization
- File Storage
- Notification
- Global Configuration

---

# Core Context

Merupakan inti bisnis LIM Digital Platform.

```text id="bc03"
Organization

Program

Secretariat

Letter

Certificate

Falak
```

### Responsibility

- Organisasi
- Program
- Persuratan
- Sertifikat
- Astronomi Islam

---

# Supporting Context

Mendukung proses bisnis utama.

```text id="bc04"
Dashboard

CMS

Knowledge
```

### Responsibility

- Dashboard
- Content Management
- Knowledge Base

---

# Context Boundary

```text id="bc05"
+----------------------+
| Authentication       |
+----------------------+

+----------------------+
| Authorization        |
+----------------------+

+----------------------+
| Organization         |
+----------------------+

+----------------------+
| Program              |
+----------------------+

+----------------------+
| Secretariat          |
+----------------------+

+----------------------+
| Letter               |
+----------------------+

+----------------------+
| Certificate          |
+----------------------+

+----------------------+
| Falak                |
+----------------------+

+----------------------+
| Media                |
+----------------------+

+----------------------+
| Notification         |
+----------------------+

+----------------------+
| Settings             |
+----------------------+

+----------------------+
| Dashboard            |
+----------------------+

+----------------------+
| CMS                  |
+----------------------+

+----------------------+
| Knowledge            |
+----------------------+
```

---

# Communication Rules

Setiap Context hanya boleh berkomunikasi melalui:

- Application Service
- Public Interface
- REST API
- Domain Event

Tidak diperbolehkan:

- Mengakses Entity context lain.
- Mengakses Repository context lain.
- Mengakses Database context lain.

---

# Data Ownership

| Context        | Owns              |
| -------------- | ----------------- |
| Authentication | Session           |
| Authorization  | Role & Permission |
| Organization   | Organization Data |
| Program        | Program Data      |
| Secretariat    | Secretariat Data  |
| Letter         | Letter Data       |
| Certificate    | Certificate Data  |
| Media          | Files             |
| Notification   | Notifications     |
| Settings       | Configuration     |
| Dashboard      | Dashboard Metrics |
| CMS            | Content           |
| Knowledge      | Knowledge Base    |
| Falak          | Astronomy Data    |

---

# Dependency Direction

```text id="bc06"
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

Dependency antar Context hanya melalui **Application Layer**.

---

# Context Mapping

| Source       | Target       | Method  |
| ------------ | ------------ | ------- |
| Program      | Organization | Service |
| Letter       | Organization | Service |
| Certificate  | Program      | Service |
| Dashboard    | All Domains  | Query   |
| Notification | All Domains  | Event   |
| Media        | All Domains  | Service |
| Knowledge    | CMS          | Service |
| Falak        | Dashboard    | Query   |

---

# Context Isolation

Setiap Context memiliki:

- Entity
- Repository
- Use Case
- Service
- Validation
- Permission
- API
- Database

Tidak ada implementasi yang dibagikan selain Shared Kernel yang telah ditentukan.

---

# Shared Kernel

Komponen yang boleh digunakan bersama:

- Base Entity
- Base Repository
- Result Pattern
- Error Model
- Pagination Model
- Audit Model
- Value Objects umum

Business Rules **tidak boleh** ditempatkan di Shared Kernel.

---

# Evolution Strategy

```text id="bc07"
Bounded Context

↓

Independent Module

↓

Independent Service

↓

Microservice (Optional)
```

---

# Architecture Principles

- High Cohesion
- Low Coupling
- Explicit Boundary
- Independent Evolution
- Single Ownership

---

# Related Documents

- README.md
- architecture-overview.md
- system-context.md
- domain-map.md
- clean-architecture.md
- hexagonal-architecture.md
- cqrs.md
- event-driven.md
- folder-structure.md
- dependency-rules.md

---

# Acceptance Criteria

- Seluruh Bounded Context terdokumentasi.
- Ownership setiap Context jelas.
- Tidak ada akses lintas database.
- Komunikasi antar Context melalui Public Interface.
- Bounded Context menjadi acuan implementasi DDD pada LIM Digital Platform.
