# CQRS (Command Query Responsibility Segregation)

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan implementasi **Command Query Responsibility Segregation (CQRS)** pada LIM Digital Platform.

CQRS digunakan secara **selektif (Selective CQRS)** untuk memisahkan operasi perubahan data (Command) dan pembacaan data (Query) pada use case yang kompleks.

CQRS **bukan** diterapkan pada seluruh modul.

---

# Overview

LIM Digital Platform menggunakan pendekatan:

* CRUD untuk kasus sederhana.
* CQRS untuk domain yang memiliki kompleksitas tinggi.

Contoh:

* Dashboard
* Notification
* Knowledge Search
* Falak Calculation
* Reporting

---

# CQRS Principle

```text id="cqrs01"
Write

≠

Read
```

Command dan Query memiliki:

* Model berbeda.
* DTO berbeda.
* Use Case berbeda.
* Optimisasi berbeda.

---

# Command Side

Command digunakan untuk:

* Create
* Update
* Delete
* Approve
* Publish
* Archive

Command mengubah state sistem.

---

# Query Side

Query digunakan untuk:

* Get Detail
* List
* Search
* Dashboard
* Reporting
* Analytics

Query tidak mengubah data.

---

# Architecture

```text id="cqrs02"
Controller

↓

Command / Query

↓

Handler

↓

Domain

↓

Repository
```

---

# Command Flow

```text id="cqrs03"
HTTP Request

↓

Controller

↓

Command

↓

Command Handler

↓

Domain

↓

Repository

↓

Database
```

---

# Query Flow

```text id="cqrs04"
HTTP Request

↓

Controller

↓

Query

↓

Query Handler

↓

Read Repository

↓

Database
```

---

# Folder Structure

```text id="cqrs05"
application/

commands/

queries/

handlers/

dto/
```

---

# Example Commands

```text id="cqrs06"
CreateProgramCommand

UpdateLetterCommand

PublishKnowledgeCommand

GenerateCertificateCommand

ArchiveNotificationCommand
```

---

# Example Queries

```text id="cqrs07"
GetProgramQuery

GetDashboardQuery

SearchKnowledgeQuery

GetPrayerTimeQuery

GetCertificateQuery
```

---

# Handler Responsibilities

## Command Handler

* Validasi Command.
* Menjalankan Business Rules.
* Menyimpan perubahan.
* Menghasilkan Domain Event (jika diperlukan).

---

## Query Handler

* Mengambil data.
* Mengoptimalkan query.
* Tidak menjalankan Business Rules yang mengubah state.

---

# Read Model

Read Model dapat:

* Menggunakan View Database.
* Menggunakan Projection.
* Menggunakan Cache.
* Menggunakan Materialized View.

Read Model tidak boleh digunakan untuk proses update.

---

# Write Model

Write Model menggunakan:

* Entity
* Aggregate
* Repository
* Domain Service

Write Model menjadi sumber kebenaran (**Source of Truth**).

---

# CQRS Usage

CQRS digunakan pada:

| Domain       | Usage            |
| ------------ | ---------------- |
| Dashboard    | Analytics        |
| Notification | Queue & Delivery |
| Knowledge    | Full Text Search |
| Falak        | Calculation      |
| Certificate  | Reporting        |

Domain CRUD sederhana tidak wajib menggunakan CQRS.

---

# Benefits

* Query lebih cepat.
* Command lebih sederhana.
* Skalabilitas lebih baik.
* Mudah menambahkan Reporting.
* Mendukung Event Driven Architecture.

---

# Design Principles

* Separate Read & Write.
* Independent Optimization.
* Simple Command.
* Fast Query.
* Event Friendly.

---

# Related Documents

* README.md
* architecture-overview.md
* clean-architecture.md
* hexagonal-architecture.md
* event-driven.md
* folder-structure.md
* dependency-rules.md

---

# Acceptance Criteria

* Command dan Query dipisahkan.
* Handler memiliki tanggung jawab yang jelas.
* CQRS hanya diterapkan pada domain yang membutuhkan.
* Read Model dan Write Model terpisah.
* Implementasi tetap mengikuti Clean Architecture.
