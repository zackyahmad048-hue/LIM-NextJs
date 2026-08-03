# Clean Architecture

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan implementasi **Clean Architecture** pada LIM Digital Platform.

Clean Architecture memastikan Business Rules tetap independen dari framework, database, UI, dan teknologi eksternal sehingga sistem lebih mudah dikembangkan, diuji, dan dipelihara.

---

# Overview

LIM Digital Platform mengadopsi Clean Architecture dengan prinsip **Dependency Rule**, yaitu seluruh dependency mengarah ke dalam (Domain Layer).

Business Rules tidak boleh bergantung pada implementasi teknis.

---

# Layer Architecture

```text id="clean01"
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

---

# Layer Responsibilities

## Presentation Layer

Bertanggung jawab untuk:

- REST API
- HTTP Controller
- Request Validation
- Authentication
- Response Formatting

Tidak boleh mengandung Business Logic.

---

## Application Layer

Berisi:

- Use Case
- Command
- Query
- DTO
- Transaction Management
- Event Publishing

Application Layer mengorkestrasi Business Rules tanpa mengimplementasikannya.

---

## Domain Layer

Merupakan inti sistem.

Berisi:

- Entity
- Aggregate
- Value Object
- Domain Service
- Repository Interface
- Domain Event
- Business Rules

Layer ini tidak mengetahui:

- HTTP
- ORM
- Framework
- Database
- Storage

---

## Infrastructure Layer

Berisi implementasi teknis:

- Database
- ORM
- Repository Implementation
- Cache
- Storage
- Email
- Notification
- Queue
- External API

Infrastructure bergantung pada Domain, bukan sebaliknya.

---

# Dependency Rule

```text id="clean02"
Presentation

↓

Application

↓

Domain

↑

Infrastructure
```

Domain tidak pernah mengimpor Infrastructure.

---

# Typical Request Flow

```text id="clean03"
HTTP Request

↓

Controller

↓

Use Case

↓

Domain Service

↓

Repository Interface

↓

Repository Implementation

↓

Database
```

---

# Project Structure

```text id="clean04"
src/

presentation/

application/

domain/

infrastructure/

shared/
```

---

# Repository Pattern

Repository Interface berada pada:

```text id="clean05"
domain/repositories
```

Repository Implementation berada pada:

```text id="clean06"
infrastructure/repositories
```

---

# Dependency Injection

Seluruh implementasi dihubungkan menggunakan Dependency Injection.

```text id="clean07"
Controller

↓

Use Case

↓

Repository Interface

↓

Repository Implementation
```

---

# Domain Independence

Domain Layer tidak boleh mengetahui:

- Express
- NestJS
- Laravel
- Spring
- Prisma
- TypeORM
- PostgreSQL
- MySQL
- MongoDB

Business Rules tetap dapat berjalan walaupun teknologi berubah.

---

# Cross Cutting Concerns

Digunakan oleh seluruh layer:

- Logging
- Validation
- Configuration
- Authentication
- Authorization
- Audit Log
- Exception Handling

Implementasi dilakukan tanpa melanggar Dependency Rule.

---

# Design Principles

- SOLID
- Dependency Inversion Principle
- Single Responsibility Principle
- Open Closed Principle
- Separation of Concerns

---

# Benefits

- Mudah diuji (Unit Test).
- Mudah mengganti database.
- Mudah mengganti framework.
- Business Rules tetap stabil.
- Mendukung Modular Monolith dan migrasi ke Microservices.

---

# Related Documents

- README.md
- architecture-overview.md
- system-context.md
- domain-map.md
- bounded-context.md
- hexagonal-architecture.md
- cqrs.md
- event-driven.md
- folder-structure.md
- dependency-rules.md

---

# Acceptance Criteria

- Dependency mengikuti aturan Clean Architecture.
- Business Rules independen dari teknologi.
- Repository menggunakan Interface.
- Infrastructure hanya berisi implementasi teknis.
- Seluruh modul mengikuti struktur Clean Architecture.
