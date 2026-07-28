# Branching Strategy

**Project:** LIM Digital Platform

**Folder:** `03-development`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan strategi branching pada LIM Digital Platform.

Strategi ini memastikan proses pengembangan berlangsung terstruktur, mendukung kolaborasi tim, serta mempermudah proses release dan maintenance.

---

# Overview

LIM Digital Platform menggunakan pendekatan **GitFlow** yang disederhanakan.

Struktur branch:

```text id="branch01"
main

develop

feature/*

bugfix/*

hotfix/*

release/*
```

---

# Main Branch

```text id="branch02"
main
```

Berisi kode Production.

Rules:

* Tidak boleh commit langsung.
* Wajib melalui Pull Request.
* Selalu dalam kondisi stabil.
* Setiap merge menghasilkan Release.

---

# Develop Branch

```text id="branch03"
develop
```

Berisi pengembangan aktif.

Semua Feature Branch di-merge ke branch ini.

---

# Feature Branch

Format:

```text id="branch04"
feature/<feature-name>
```

Contoh:

```text id="branch05"
feature/program-management

feature/authentication

feature/knowledge-search

feature/prayer-time
```

Rules:

* Dibuat dari `develop`.
* Satu fitur satu branch.
* Dihapus setelah merge.

---

# Bugfix Branch

Format:

```text id="branch06"
bugfix/<bug-name>
```

Contoh:

```text id="branch07"
bugfix/login-timeout

bugfix/certificate-validation
```

Rules:

* Dibuat dari `develop`.
* Digunakan untuk memperbaiki bug selama development.

---

# Hotfix Branch

Format:

```text id="branch08"
hotfix/<issue-name>
```

Contoh:

```text id="branch09"
hotfix/security-fix

hotfix/session-expired
```

Rules:

* Dibuat dari `main`.
* Setelah selesai di-merge ke:

  * `main`
  * `develop`

---

# Release Branch

Format:

```text id="branch10"
release/vX.Y.Z
```

Contoh:

```text id="branch11"
release/v1.0.0

release/v1.1.0
```

Digunakan untuk:

* QA
* UAT
* Bug Fix Release
* Final Validation

---

# Branch Lifecycle

```text id="branch12"
develop

↓

feature

↓

Pull Request

↓

Review

↓

Merge

↓

develop
```

---

# Release Lifecycle

```text id="branch13"
develop

↓

release

↓

QA

↓

main

↓

Tag

↓

Deploy
```

---

# Hotfix Lifecycle

```text id="branch14"
main

↓

hotfix

↓

Review

↓

main

↓

develop
```

---

# Branch Protection

Branch yang diproteksi:

```text id="branch15"
main

develop
```

Aturan:

* Pull Request wajib.
* CI wajib berhasil.
* Minimal 1 Approval.
* Tidak boleh force push.

---

# Branch Naming Rules

Gunakan:

* lowercase
* kebab-case
* tanpa spasi

Contoh:

```text id="branch16"
feature/program-report

bugfix/login-error

hotfix/token-expired
```

---

# Merge Strategy

Gunakan:

```text id="branch17"
Squash Merge
```

Alternatif:

```text id="branch18"
Rebase Merge
```

Hindari Merge Commit kecuali benar-benar diperlukan.

---

# Branch Rules

* Maksimal satu tujuan per branch.
* Branch tidak boleh digunakan ulang.
* Branch harus sinkron dengan `develop`.
* Branch yang sudah selesai wajib dihapus.

---

# Best Practices

* Pull branch terbaru sebelum mulai bekerja.
* Push secara berkala.
* Hindari branch berumur terlalu lama.
* Selesaikan konflik sebelum membuka Pull Request.
* Pastikan seluruh test lulus sebelum merge.

---

# Related Documents

* README.md
* coding-standards.md
* naming-conventions.md
* git-workflow.md
* testing-strategy.md
* commit-convention.md
* code-review.md

---

# Acceptance Criteria

* Seluruh branch mengikuti standar penamaan.
* Branch terlindungi dengan Branch Protection.
* Release menggunakan Release Branch.
* Hotfix mengikuti alur yang ditentukan.
* Branching Strategy diterapkan oleh seluruh developer.
