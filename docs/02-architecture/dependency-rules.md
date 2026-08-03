# Dependency Rules

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan dependency pada LIM Digital Platform.

Tujuan utama aturan ini adalah menjaga agar setiap layer dan domain tetap memiliki **Low Coupling**, **High Cohesion**, serta mengikuti prinsip **Clean Architecture**, **Hexagonal Architecture**, dan **Domain Driven Design (DDD)**.

---

# Overview

Seluruh dependency dalam sistem mengikuti prinsip:

> **Source Code Dependency selalu mengarah ke Business Rules (Domain Layer).**

Tidak diperbolehkan dependency yang menyebabkan Domain bergantung pada teknologi atau domain lain secara langsung.

---

# Layer Dependency

Dependency antar layer:

```text id="dep01"
Presentation

↓

Application

↓

Domain

↑

Infrastructure
```

Aturan:

- Presentation boleh bergantung pada Application.
- Application boleh bergantung pada Domain.
- Infrastructure mengimplementasikan Domain Interface.
- Domain tidak bergantung pada layer lain.

---

# Domain Dependency

```text id="dep02"
Shared Domain

↓

Core Domain

↓

Supporting Domain
```

Aturan:

- Shared Domain dapat digunakan seluruh domain.
- Core Domain tidak saling mengakses database.
- Supporting Domain mengonsumsi layanan Core Domain.

---

# Allowed Dependencies

| Source         | Target         | Allowed |
| -------------- | -------------- | :-----: |
| Presentation   | Application    |   ✅    |
| Application    | Domain         |   ✅    |
| Infrastructure | Domain         |   ✅    |
| Domain         | Shared Kernel  |   ✅    |
| Domain         | Infrastructure |   ❌    |
| Domain         | Presentation   |   ❌    |
| Domain         | Database       |   ❌    |
| Domain         | Framework      |   ❌    |

---

# Cross Domain Rules

Komunikasi antar domain hanya melalui:

- Application Service
- Public Interface
- REST API
- Domain Event

Tidak diperbolehkan:

- Mengakses Entity domain lain.
- Mengakses Repository domain lain.
- Mengakses tabel database domain lain.
- Mengubah data domain lain secara langsung.

---

# Repository Rules

Repository Interface:

```text id="dep03"
Domain Layer
```

Repository Implementation:

```text id="dep04"
Infrastructure Layer
```

Repository hanya boleh digunakan oleh:

- Application Layer
- Domain Service (melalui Interface)

---

# Shared Kernel Rules

Shared Kernel hanya boleh berisi:

- Base Entity
- Base Value Object
- Result Pattern
- Pagination
- Error Model
- Common Utilities

Tidak boleh berisi:

- Business Rules
- Domain Entity
- Domain Service
- Repository Implementation

---

# External Dependencies

Integrasi eksternal dilakukan melalui **Output Port**.

Contoh:

```text id="dep05"
SMTP

Firebase

WhatsApp Gateway

Object Storage

GIS API

Payment Gateway (Future)
```

SDK eksternal tidak boleh dipanggil langsung dari Domain.

---

# Dependency Injection

Seluruh implementasi menggunakan Dependency Injection.

```text id="dep06"
Controller

↓

Use Case

↓

Repository Interface

↓

Repository Implementation
```

Object dibuat oleh DI Container.

---

# Circular Dependency

Circular Dependency **tidak diperbolehkan**.

Contoh yang dilarang:

```text id="dep07"
Program

↓

Letter

↓

Program
```

Gunakan:

- Domain Event
- Application Service
- Public Interface

---

# Module Independence

Setiap module harus dapat:

- Dikembangkan secara independen.
- Diuji secara independen.
- Dipindahkan menjadi service tersendiri tanpa mengubah Business Rules.

---

# Architecture Validation Checklist

```text id="dep08"
□ Domain tidak mengakses Database langsung.

□ Domain tidak mengenal Framework.

□ Repository berupa Interface.

□ Infrastructure hanya implementasi.

□ Tidak ada Circular Dependency.

□ Komunikasi lintas Domain melalui Public Interface.

□ Shared Kernel bebas Business Rules.
```

---

# Design Principles

- Dependency Inversion Principle
- Separation of Concerns
- High Cohesion
- Low Coupling
- Explicit Dependency
- Single Responsibility Principle

---

# Related Documents

- README.md
- architecture-overview.md
- system-context.md
- domain-map.md
- bounded-context.md
- clean-architecture.md
- hexagonal-architecture.md
- cqrs.md
- event-driven.md
- folder-structure.md

---

# Acceptance Criteria

- Seluruh dependency mengikuti Clean Architecture.
- Tidak terdapat Circular Dependency.
- Domain tetap independen dari teknologi.
- Komunikasi lintas domain menggunakan Public Interface.
- Dependency Rules menjadi standar wajib dalam seluruh implementasi LIM Digital Platform.
