# Folder Structure

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan struktur folder standar pada LIM Digital Platform.

Struktur folder dirancang agar konsisten dengan prinsip:

- Domain Driven Design (DDD)
- Clean Architecture
- Hexagonal Architecture
- Modular Monolith

Setiap domain memiliki struktur yang sama sehingga memudahkan pengembangan dan pemeliharaan.

---

# Root Structure

```text id="fs01"
project-root/
├── app/                  # Next.js 16 App Router (Presentation & Routing)
├── modules/              # Domain-Driven Design (DDD Domain Modules)
├── components/           # UI Components (shadcn/ui, admin, website)
├── config/               # App configuration & Navigation configs
├── actions/              # Server Actions
├── prisma/               # Prisma Database Schemas & Seeders
├── generated/client/     # Custom Output Path Prisma Client
├── docs/                 # Platform Master Documentation
├── public/               # Static Public Assets
└── package.json
```

---

# Domain Module Structure (`modules/`)

Setiap modul di bawah `modules/` memisahkan _concern_ ke dalam 4 layer Clean/Hexagonal Architecture:

```text id="fs02"
modules/<domain>/
├── domain/               # Business Entities, Value Objects, Domain Exceptions
├── application/          # Use Cases, DTOs, Application Services, Ports
├── infrastructure/       # Prisma Repositories, DB Adapters, External APIs
└── presentation/         # View Bridges, Form Components, Action Handlers
```

---

# Domain Modules Directory

Struktur modul yang terorganisasi di dalam `modules/`:

```text id="fs03"

organization/

secretariat/

letter/

certificate/

media/

notification/

settings/

knowledge/

falak/
```

---

# Domain Folder Structure

Contoh:

```text id="fs04"
program/

application/

domain/

infrastructure/

presentation/
```

---

# Application Layer

```text id="fs05"
application/

commands/

queries/

handlers/

dto/

services/

ports/
```

Berisi:

- Use Case
- CQRS
- DTO
- Input Port
- Output Port

---

# Domain Layer

```text id="fs06"
domain/

entities/

aggregates/

repositories/

services/

events/

value-objects/

exceptions/
```

Berisi Business Rules.

Tidak bergantung pada framework.

---

# Infrastructure Layer

```text id="fs07"
infrastructure/

database/

repositories/

storage/

notification/

queue/

cache/

email/

external/
```

Berisi implementasi teknis.

---

# Presentation Layer

```text id="fs08"
presentation/

controllers/

requests/

responses/

middlewares/

routes/
```

Berisi:

- REST Controller
- HTTP Request
- HTTP Response

---

# Shared Layer

```text id="fs09"
shared/

base/

common/

utils/

errors/

validation/

security/

pagination/
```

Shared Layer hanya berisi komponen umum.

Business Rules tidak boleh ditempatkan di sini.

---

# Documentation

```text id="fs10"
docs/

00-overview/

01-domains/

02-architecture/

03-development/

04-deployment/

05-decisions/

06-references/
```

---

# Testing

```text id="fs11"
tests/

unit/

integration/

e2e/

fixtures/

helpers/
```

---

# Configuration

```text id="fs12"
config/

application/

database/

security/

notification/

storage/

logging/
```

---

# Scripts

```text id="fs13"
scripts/

build/

migration/

seed/

deploy/

backup/
```

---

# Naming Convention

Folder menggunakan:

```text id="fs14"
kebab-case
```

Class menggunakan:

```text id="fs15"
PascalCase
```

Method menggunakan:

```text id="fs16"
camelCase
```

Constant menggunakan:

```text id="fs17"
UPPER_SNAKE_CASE
```

---

# Folder Rules

- Setiap Domain memiliki struktur yang sama.
- Tidak ada akses langsung antar Domain.
- Shared hanya berisi reusable component.
- Infrastructure tidak boleh diakses langsung oleh Presentation.
- Seluruh Business Rules berada pada Domain Layer.

---

# Related Documents

- README.md
- architecture-overview.md
- clean-architecture.md
- hexagonal-architecture.md
- cqrs.md
- event-driven.md
- dependency-rules.md

---

# Acceptance Criteria

- Struktur folder konsisten.
- Seluruh domain menggunakan struktur yang sama.
- Layer mengikuti Clean Architecture.
- Shared Layer tidak berisi Business Rules.
- Struktur siap dikembangkan menjadi Modular Monolith maupun Microservices.
