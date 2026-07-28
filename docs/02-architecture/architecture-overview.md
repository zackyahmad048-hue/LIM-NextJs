# Architecture Overview

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan gambaran umum arsitektur LIM Digital Platform.

Architecture Overview menjadi referensi utama mengenai bagaimana sistem dirancang, bagaimana domain saling berinteraksi, dan bagaimana setiap layer bekerja.

---

# Architectural Style

LIM Digital Platform menggunakan kombinasi beberapa pendekatan arsitektur:

* Domain Driven Design (DDD)
* Clean Architecture
* Hexagonal Architecture (Ports & Adapters)
* Modular Monolith
* REST API
* Repository Pattern
* Event Driven Architecture (Selective)
* CQRS (Selective)

---

# High Level Architecture

```text id="archov01"
Client

↓

REST API

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

↓

Database
```

---

# Layer Responsibilities

## Presentation Layer

Bertanggung jawab untuk:

* REST API
* Authentication
* Validation
* Request Parsing
* Response Formatting

Tidak boleh mengandung Business Logic.

---

## Application Layer

Bertanggung jawab untuk:

* Use Cases
* Command
* Query
* Transaction
* Orchestration
* Event Publishing

Application Layer menghubungkan Presentation dengan Domain.

---

## Domain Layer

Merupakan inti sistem.

Berisi:

* Entity
* Value Object
* Aggregate
* Domain Service
* Repository Interface
* Business Rules
* Domain Event

Layer ini tidak bergantung pada framework.

---

## Infrastructure Layer

Berisi implementasi teknis:

* Database
* Repository
* Storage
* Cache
* Queue
* Notification
* Email
* External API

---

# Domain Architecture

```text id="archov02"
Core Domain

↓

Supporting Domain

↓

Shared Domain
```

---

## Core Domain

* Organization
* Program
* Secretariat
* Letter
* Certificate
* Falak

---

## Supporting Domain

* Dashboard
* CMS
* Knowledge

---

## Shared Domain

* Authentication
* Authorization
* Media
* Notification
* Settings

---

# Request Flow

```text id="archov03"
HTTP Request

↓

Controller

↓

Use Case

↓

Domain

↓

Repository

↓

Database
```

---

# Dependency Flow

```text id="archov04"
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

Dependency hanya boleh mengarah ke bawah.

---

# Cross Cutting Concerns

Digunakan oleh seluruh domain:

* Logging
* Validation
* Authentication
* Authorization
* Audit Log
* Configuration
* Error Handling

---

# Design Principles

* SOLID
* DRY
* KISS
* YAGNI
* Separation of Concerns
* Dependency Inversion

---

# Non Functional Goals

Sistem harus:

* Scalable
* Secure
* Maintainable
* Testable
* Observable
* Performant
* Extensible

---

# Technology Independence

Business Rules tidak boleh bergantung pada:

* Framework
* Database
* HTTP
* ORM
* Storage Provider

---

# Related Documents

* README.md
* system-context.md
* domain-map.md
* bounded-context.md
* clean-architecture.md
* hexagonal-architecture.md
* cqrs.md
* event-driven.md
* folder-structure.md
* dependency-rules.md

---

# Acceptance Criteria

* Arsitektur sistem terdokumentasi.
* Layer memiliki tanggung jawab yang jelas.
* Dependency mengikuti Clean Architecture.
* Domain independen dari teknologi.
* Menjadi acuan implementasi seluruh modul.
