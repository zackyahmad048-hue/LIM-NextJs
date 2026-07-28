# Git Workflow

**Project:** LIM Digital Platform

**Folder:** `03-development`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar Git Workflow pada LIM Digital Platform.

Workflow ini bertujuan menjaga kualitas kode, mempermudah kolaborasi tim, serta memastikan proses pengembangan berjalan secara konsisten.

---

# Overview

Seluruh perubahan kode harus melalui proses:

```text id="git01"
Issue

↓

Branch

↓

Development

↓

Commit

↓

Push

↓

Pull Request

↓

Code Review

↓

CI Pipeline

↓

Merge

↓

Deployment
```

---

# Git Flow Model

Branch utama:

```text id="git02"
main

develop
```

Branch pendukung:

```text id="git03"
feature/*

bugfix/*

hotfix/*

release/*
```

---

# Main Branch

`main`

Digunakan untuk:

* Production
* Stable Release

Tidak boleh melakukan commit langsung.

---

# Develop Branch

`develop`

Digunakan sebagai branch utama pengembangan.

Seluruh Feature Branch di-merge ke branch ini.

---

# Feature Branch

Format:

```text id="git04"
feature/<feature-name>
```

Contoh:

```text id="git05"
feature/program-management

feature/knowledge-search

feature/falak-prayer-time
```

---

# Bugfix Branch

Format:

```text id="git06"
bugfix/<issue-name>
```

Contoh:

```text id="git07"
bugfix/login-validation

bugfix/dashboard-filter
```

---

# Hotfix Branch

Format:

```text id="git08"
hotfix/<issue-name>
```

Digunakan hanya untuk perbaikan Production.

Contoh:

```text id="git09"
hotfix/session-timeout

hotfix/security-patch
```

---

# Release Branch

Format:

```text id="git10"
release/<version>
```

Contoh:

```text id="git11"
release/v1.0.0

release/v1.1.0
```

---

# Development Flow

```text id="git12"
Create Issue

↓

Create Branch

↓

Development

↓

Local Test

↓

Commit

↓

Push

↓

Pull Request

↓

Review

↓

Merge
```

---

# Pull Request Rules

Pull Request wajib:

* Memiliki deskripsi.
* Mengacu pada Issue.
* Lulus CI Pipeline.
* Mendapat persetujuan Reviewer.
* Tidak memiliki konflik.

---

# Merge Strategy

Gunakan:

```text id="git13"
Squash and Merge
```

Atau:

```text id="git14"
Rebase and Merge
```

Hindari **Merge Commit** kecuali diperlukan.

---

# Branch Protection

Branch berikut wajib diproteksi:

```text id="git15"
main

develop
```

Aturan:

* Tidak boleh push langsung.
* Pull Request wajib.
* Minimal 1 Approval.
* CI wajib berhasil.

---

# Conflict Resolution

Apabila terjadi konflik:

```text id="git16"
Pull Latest

↓

Resolve Conflict

↓

Run Test

↓

Commit

↓

Push
```

---

# Version Tag

Format:

```text id="git17"
vMAJOR.MINOR.PATCH
```

Contoh:

```text id="git18"
v1.0.0

v1.2.3

v2.0.0
```

---

# Release Flow

```text id="git19"
develop

↓

release

↓

QA Testing

↓

main

↓

Tag

↓

Deploy
```

---

# Git Rules

* Satu branch untuk satu fitur.
* Satu Pull Request untuk satu tujuan.
* Branch dihapus setelah merge.
* Rebase sebelum membuka Pull Request.
* Selalu sinkron dengan `develop`.

---

# Related Documents

* README.md
* coding-standards.md
* naming-conventions.md
* testing-strategy.md
* branching-strategy.md
* commit-convention.md
* code-review.md

---

# Acceptance Criteria

* Seluruh perubahan melalui Pull Request.
* Branch mengikuti standar penamaan.
* `main` dan `develop` terlindungi.
* CI Pipeline berhasil sebelum merge.
* Git Workflow diterapkan oleh seluruh developer.
