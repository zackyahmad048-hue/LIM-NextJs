# Development

**Project:** LIM Digital Platform

**Folder:** `03-development`

**Version:** 1.0

**Status:** Approved

---

# Overview

Folder **Development** berisi seluruh standar pengembangan perangkat lunak pada LIM Digital Platform.

Dokumen ini menjadi acuan resmi bagi seluruh Developer, QA Engineer, DevOps Engineer, dan Technical Lead agar implementasi kode tetap konsisten, mudah dipelihara, dan sesuai dengan arsitektur yang telah ditetapkan.

---

# Objectives

Folder Development bertujuan untuk:

* Menetapkan standar pengembangan.
* Menjaga kualitas kode.
* Menyeragamkan gaya penulisan kode.
* Mempermudah proses review.
* Mengurangi Technical Debt.
* Mendukung Continuous Integration.

---

# Scope

Folder ini mencakup:

* Coding Standards
* Naming Conventions
* Git Workflow
* Branching Strategy
* Commit Convention
* Testing Strategy
* Code Review
* Development Workflow

---

# Document Structure

```text id="dev01"
03-development/

README.md

coding-standards.md

naming-conventions.md

git-workflow.md

testing-strategy.md

branching-strategy.md

commit-convention.md

code-review.md

development-workflow.md
```

---

# Development Principles

Seluruh pengembangan mengikuti prinsip:

* Clean Code
* SOLID
* DRY
* KISS
* YAGNI
* Domain Driven Design
* Clean Architecture
* Hexagonal Architecture
* Test Driven Development (Recommended)

---

# Development Workflow

```text id="dev02"
Planning

↓

Development

↓

Testing

↓

Code Review

↓

Merge

↓

Deployment
```

---

# Code Quality

Seluruh kode harus memenuhi:

* Readable
* Testable
* Maintainable
* Consistent
* Secure
* Well Documented

---

# Required Practices

* Pull Request wajib.
* Code Review wajib.
* Unit Test untuk Business Logic.
* Linter wajib lolos.
* Formatter wajib dijalankan.
* CI Pipeline harus berhasil sebelum merge.

---

# Tools

Direkomendasikan menggunakan:

* Git
* Docker
* VS Code / IntelliJ IDEA
* ESLint / Biome
* Prettier
* Husky
* Commitlint
* GitHub Actions

---

# Documentation

Seluruh perubahan besar harus disertai:

* Update dokumentasi.
* Update API (jika berubah).
* Update ADR (jika mengubah keputusan arsitektur).

---

# Related Documents

* 02-architecture/
* 04-deployment/
* 05-decisions/
* 06-references/

---

# Status

**Status:** Active

---

# Acceptance Criteria

* Seluruh developer mengikuti standar yang sama.
* Workflow pengembangan terdokumentasi.
* Code Quality terjaga.
* Dokumentasi selalu diperbarui.
* Menjadi pedoman resmi proses development.
