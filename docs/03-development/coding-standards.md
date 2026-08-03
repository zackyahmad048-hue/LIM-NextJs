# Coding Standards

**Project:** LIM Digital Platform

**Folder:** `03-development`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar penulisan kode (Coding Standards) yang wajib diikuti pada seluruh proyek LIM Digital Platform.

Tujuannya adalah menghasilkan kode yang konsisten, mudah dibaca, mudah diuji, dan mudah dipelihara.

---

# General Principles

Seluruh kode harus mengikuti prinsip:

- Readability First
- Simplicity
- Maintainability
- Consistency
- Testability
- Security by Default

---

# Clean Code Principles

Developer wajib menerapkan:

- SOLID
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- YAGNI (You Aren't Gonna Need It)
- Separation of Concerns
- Single Responsibility Principle

---

# File Organization

Satu file memiliki satu tanggung jawab utama.

Contoh:

```text id="cs01"
ProgramController

ProgramService

ProgramRepository

CreateProgramCommand
```

Tidak diperbolehkan mencampur banyak tanggung jawab dalam satu file.

---

# Function Rules

Function harus:

- Memiliki satu tanggung jawab.
- Pendek dan mudah dipahami.
- Menggunakan nama yang deskriptif.
- Tidak memiliki efek samping yang tidak jelas.

Rekomendasi:

- Maksimum ±50 baris.
- Maksimum 3–5 parameter (lebih dari itu gunakan DTO).

---

# Class Rules

Class harus:

- Memiliki satu tanggung jawab.
- Tidak terlalu besar.
- Mengikuti Single Responsibility Principle.

Rekomendasi:

- Maksimum ±300 baris.

---

# Method Rules

Method harus:

- Menggunakan kata kerja.
- Mengembalikan hasil yang jelas.
- Tidak melakukan banyak pekerjaan sekaligus.

Contoh:

```text id="cs02"
createProgram()

updateLetter()

sendNotification()

calculatePrayerTime()
```

---

# Variable Rules

Nama variabel harus:

- Jelas.
- Bermakna.
- Tidak disingkat kecuali istilah umum.

Baik:

```text id="cs03"
programName

organizationId

certificateNumber
```

Tidak disarankan:

```text id="cs04"
a

tmp

x1

obj
```

---

# Error Handling

Gunakan:

- Custom Exception.
- Result Pattern.
- Error Code yang konsisten.

Jangan menggunakan:

- Silent Error.
- Empty Catch Block.
- Magic String.

---

# Logging

Log hanya digunakan untuk:

- Error
- Warning
- Audit
- Monitoring

Jangan melakukan logging terhadap:

- Password
- Token
- Credential
- Data sensitif

---

# Comments

Komentar hanya digunakan untuk:

- Menjelaskan alasan (Why).
- Menjelaskan keputusan desain.

Hindari komentar yang hanya menjelaskan apa yang sudah terlihat pada kode.

---

# Magic Number

Gunakan Constant.

Baik:

```text id="cs05"
MAX_UPLOAD_SIZE
```

Tidak disarankan:

```text id="cs06"
10485760
```

---

# Dependency Rules

- Gunakan Dependency Injection.
- Jangan membuat object menggunakan `new` di dalam Business Logic apabila dapat diinjeksi.
- Gunakan Interface untuk dependency.

---

# Code Formatting

Gunakan formatter yang disepakati tim.

Standar:

- Indent 2 atau 4 spasi (konsisten).
- Maksimum 120 karakter per baris.
- Gunakan trailing comma apabila didukung.
- Import diurutkan secara konsisten.

---

# Security Rules

- Selalu validasi input.
- Gunakan parameterized query.
- Jangan hardcode credential.
- Jangan menyimpan secret di source code.
- Gunakan environment variable untuk konfigurasi sensitif.

---

# Performance Rules

- Hindari N+1 Query.
- Gunakan pagination.
- Gunakan lazy loading bila sesuai.
- Cache hanya jika diperlukan.
- Optimalkan query database.

---

# Code Smells

Harus dihindari:

- Long Method
- God Class
- Duplicate Code
- Deep Nesting
- Circular Dependency
- Tight Coupling
- Primitive Obsession
- Large Switch Statement

---

# Required Tools

- Formatter
- Linter
- Static Analysis
- Unit Test
- Dependency Scanner

---

# Related Documents

- README.md
- naming-conventions.md
- git-workflow.md
- testing-strategy.md
- branching-strategy.md
- commit-convention.md
- code-review.md

---

# Acceptance Criteria

- Kode mengikuti Clean Code.
- Tidak terdapat Code Smell utama.
- Seluruh Business Logic mudah diuji.
- Kode konsisten pada seluruh proyek.
- Coding Standards menjadi acuan wajib seluruh developer.
