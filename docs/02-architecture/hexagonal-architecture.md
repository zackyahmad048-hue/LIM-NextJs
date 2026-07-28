# Hexagonal Architecture

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan implementasi **Hexagonal Architecture (Ports & Adapters)** pada LIM Digital Platform.

Hexagonal Architecture memastikan Domain Layer tidak bergantung pada teknologi eksternal dengan memisahkan Business Logic dari implementasi teknis menggunakan **Ports** dan **Adapters**.

---

# Overview

LIM Digital Platform mengadopsi Hexagonal Architecture untuk menjaga agar Business Rules tetap independen terhadap:

* Database
* Framework
* HTTP
* Queue
* Storage
* Email
* Notification
* External API

Seluruh komunikasi dengan dunia luar dilakukan melalui **Ports**.

---

# Architecture Diagram

```text id="hex01"
               REST API
                   │
            HTTP Adapter
                   │
              Input Port
                   │
            Application Layer
                   │
               Domain Layer
                   │
             Output Port
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
 Repository   Notification   Storage
   Adapter       Adapter      Adapter
      │            │            │
 Database      Email/API     Object Storage
```

---

# Core Components

## Domain

Berisi:

* Entity
* Aggregate
* Value Object
* Domain Service
* Business Rules

Domain tidak mengetahui Adapter maupun Framework.

---

## Input Port

Input Port mendefinisikan Use Case yang dapat dipanggil dari luar.

Contoh:

```text id="hex02"
CreateProgram

UpdateLetter

GenerateCertificate

CalculatePrayerTime
```

Input Port berupa Interface yang diimplementasikan oleh Application Service.

---

## Output Port

Output Port mendefinisikan kebutuhan Domain terhadap layanan eksternal.

Contoh:

```text id="hex03"
ProgramRepository

NotificationService

MediaStorage

EmailService
```

Output Port berada pada Domain/Application Layer.

---

## Input Adapter

Input Adapter menerjemahkan request dari luar menjadi pemanggilan Use Case.

Contoh:

* REST Controller
* GraphQL Resolver
* CLI
* Scheduler
* Background Worker

---

## Output Adapter

Output Adapter mengimplementasikan Output Port.

Contoh:

* PostgreSQL Repository
* S3 Storage
* SMTP Mailer
* WhatsApp Gateway
* Firebase Notification

---

# Request Flow

```text id="hex04"
HTTP Request

↓

Controller

↓

Input Port

↓

Application Service

↓

Domain

↓

Output Port

↓

Repository Adapter

↓

Database
```

---

# Port Structure

```text id="hex05"
application/

ports/

input/

output/
```

---

# Adapter Structure

```text id="hex06"
presentation/

controllers/

infrastructure/

repositories/

storage/

notification/

email/
```

---

# Dependency Rule

```text id="hex07"
Adapter

↓

Port

↓

Domain
```

Domain tidak mengetahui Adapter.

Adapter wajib mengikuti kontrak Port.

---

# Example

Repository

```text id="hex08"
ProgramRepository

↓

PostgreSQLProgramRepository
```

Notification

```text id="hex09"
NotificationPort

↓

EmailNotificationAdapter

↓

WhatsAppNotificationAdapter

↓

PushNotificationAdapter
```

Storage

```text id="hex10"
StoragePort

↓

LocalStorageAdapter

↓

S3StorageAdapter
```

---

# Benefits

* Mudah mengganti database.
* Mudah mengganti provider email.
* Mudah mengganti storage.
* Mudah membuat Mock untuk Unit Test.
* Domain tetap bersih.

---

# Design Principles

* Ports First
* Dependency Inversion
* Technology Independence
* Testability
* Replaceable Adapters

---

# Integration Strategy

Seluruh integrasi eksternal wajib melalui Output Port.

Contoh:

* SMTP
* Firebase
* WhatsApp Gateway
* Object Storage
* Payment Gateway (Future)
* GIS Service

Tidak diperbolehkan memanggil SDK eksternal langsung dari Domain.

---

# Related Documents

* README.md
* architecture-overview.md
* system-context.md
* domain-map.md
* bounded-context.md
* clean-architecture.md
* cqrs.md
* event-driven.md
* folder-structure.md
* dependency-rules.md

---

# Acceptance Criteria

* Seluruh integrasi menggunakan Port & Adapter.
* Domain independen dari teknologi eksternal.
* Adapter dapat diganti tanpa mengubah Business Rules.
* Dependency mengikuti prinsip Hexagonal Architecture.
* Seluruh modul menerapkan pola Ports & Adapters.
