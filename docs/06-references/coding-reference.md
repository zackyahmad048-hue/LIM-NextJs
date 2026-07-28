# Coding Reference

**Project:** LIM Digital Platform

**Folder:** `06-references`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjadi referensi cepat (Quick Reference) bagi Developer mengenai standar implementasi kode pada LIM Digital Platform.

Dokumen ini melengkapi **Coding Standards** dengan menyediakan ringkasan aturan yang sering digunakan selama proses pengembangan.

---

# General Principles

Seluruh kode mengikuti prinsip:

* Clean Code
* SOLID
* DRY
* KISS
* YAGNI
* Separation of Concerns
* Dependency Inversion

---

# Project Structure

```text id="code01"
src/

presentation/

application/

domain/

infrastructure/

shared/
```

---

# Layer Responsibilities

| Layer          | Responsibility               |
| -------------- | ---------------------------- |
| Presentation   | HTTP/API Interface           |
| Application    | Use Case & Orchestration     |
| Domain         | Business Rules               |
| Infrastructure | Database & External Services |
| Shared         | Reusable Components          |

---

# Naming Reference

| Element         | Convention       |
| --------------- | ---------------- |
| Folder          | kebab-case       |
| File            | kebab-case       |
| Class           | PascalCase       |
| Interface       | PascalCase       |
| Method          | camelCase        |
| Variable        | camelCase        |
| Constant        | UPPER_SNAKE_CASE |
| Database Table  | snake_case       |
| Database Column | snake_case       |

---

# Repository Pattern

```text id="code02"
Domain

↓

Repository Interface

↓

Infrastructure

↓

Repository Implementation
```

Repository Interface:

```text id="code03"
ProgramRepository

LetterRepository

KnowledgeRepository
```

Implementation:

```text id="code04"
PostgresProgramRepository

PrismaLetterRepository
```

---

# CQRS Reference

Command:

```text id="code05"
CreateProgramCommand

UpdateLetterCommand
```

Query:

```text id="code06"
GetProgramQuery

SearchKnowledgeQuery
```

Handler:

```text id="code07"
CreateProgramHandler

SearchKnowledgeHandler
```

---

# Event Naming

Gunakan:

```text id="code08"
Entity + Past Tense
```

Contoh:

```text id="code09"
ProgramCreated

LetterApproved

KnowledgePublished

NotificationSent
```

---

# API Naming

Endpoint:

```text id="code10"
/api/v1/programs

/api/v1/letters

/api/v1/prayer-times
```

HTTP Method:

| Method | Action         |
| ------ | -------------- |
| GET    | Read           |
| POST   | Create         |
| PUT    | Replace        |
| PATCH  | Partial Update |
| DELETE | Delete         |

---

# Error Handling

Gunakan:

* Custom Exception
* Result Pattern
* Error Code yang konsisten

Hindari:

* Empty Catch
* Silent Error
* Magic String

---

# Dependency Rules

```text id="code11"
Presentation

↓

Application

↓

Domain

↑

Infrastructure
```

Business Rules hanya berada pada Domain Layer.

---

# Testing Reference

Prioritas:

```text id="code12"
Unit Test

↓

Integration Test

↓

End-to-End Test
```

Target Coverage:

| Layer       | Target |
| ----------- | ------ |
| Domain      | ≥90%   |
| Application | ≥80%   |
| Overall     | ≥80%   |

---

# Git Reference

Branch:

```text id="code13"
main

develop

feature/*

bugfix/*

hotfix/*

release/*
```

Commit:

```text id="code14"
feat(scope): description

fix(scope): description

docs(scope): description
```

---

# Security Reference

Developer wajib:

* Validasi seluruh input.
* Gunakan Environment Variable.
* Hindari Hardcoded Secret.
* Gunakan Parameterized Query.
* Terapkan RBAC.
* Catat Audit Log.

---

# Performance Reference

* Hindari N+1 Query.
* Gunakan Pagination.
* Optimalkan Index Database.
* Gunakan Cache bila diperlukan.
* Hindari Query berulang.

---

# Documentation Reference

Setiap perubahan besar wajib memperbarui:

* README
* API Documentation
* ADR
* Database Documentation
* Architecture Documentation

---

# Developer Checklist

```text id="code15"
□ Coding Standards diikuti.

□ Naming Convention sesuai.

□ Unit Test ditambahkan.

□ Linter berhasil.

□ Formatter dijalankan.

□ Dokumentasi diperbarui.

□ Pull Request dibuat.

□ Code Review selesai.

□ CI berhasil.
```

---

# Related Documents

* README.md
* glossary.md
* api-reference.md
* database-reference.md
* external-references.md

---

# Acceptance Criteria

* Menjadi referensi cepat bagi Developer.
* Selaras dengan Coding Standards.
* Mencakup aturan implementasi utama.
* Digunakan sebagai acuan pada Code Review dan Development.
