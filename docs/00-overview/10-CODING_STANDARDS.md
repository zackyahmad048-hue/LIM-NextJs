# CODING_STANDARDS

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

**Document Type:** Coding Standards

---

# Purpose

Dokumen ini mendefinisikan standar penulisan kode yang wajib diterapkan pada seluruh LIM Digital Platform.

Tujuannya adalah menjaga konsistensi, kualitas, keamanan, dan kemudahan pemeliharaan source code.

Seluruh developer dan AI wajib mengikuti standar ini.

---

# General Principles

Seluruh kode harus memenuhi prinsip berikut:

* Readability First
* Consistency Over Preference
* Simplicity First
* Reusability
* Maintainability
* Testability

Kode dibaca lebih sering daripada ditulis.

---

# Technology Stack

Bahasa:

* TypeScript

Framework:

* Next.js

UI:

* React
* Tailwind CSS
* shadcn/ui

Database:

* Prisma ORM

Validation:

* Zod

Form:

* React Hook Form

Table:

* TanStack Table

---

# Project Structure

Seluruh struktur mengikuti PROJECT_STRUCTURE.md.

Tidak diperbolehkan membuat struktur baru tanpa persetujuan.

---

# Naming Convention

## Folder

Gunakan:

```text id="cs01"
kebab-case
```

Contoh:

```text id="cs02"
category-management

user-profile

audit-log
```

---

## File

Gunakan:

```text id="cs03"
kebab-case
```

Contoh:

```text id="cs04"
category.service.ts

user.repository.ts

post.schema.ts
```

---

## Component

Gunakan:

```text id="cs05"
PascalCase
```

Contoh:

```text id="cs06"
CategoryForm

DashboardLayout

ProgramTable
```

---

## Variable

Gunakan:

```text id="cs07"
camelCase
```

Contoh:

```text id="cs08"
userName

createdAt

programId
```

---

## Constant

Gunakan:

```text id="cs09"
UPPER_SNAKE_CASE
```

Contoh:

```text id="cs10"
MAX_UPLOAD_SIZE

DEFAULT_PAGE_SIZE
```

---

# Function Rules

Function harus:

* Memiliki satu tanggung jawab.
* Mudah dipahami.
* Tidak terlalu panjang.
* Menggunakan nama yang jelas.

Contoh:

```text id="cs11"
createCategory()

updateProgram()

publishCertificate()
```

---

# Component Rules

React Component harus:

* Fokus pada satu tugas.
* Reusable.
* Tidak menyimpan Business Rules.
* Tidak mengakses database.

---

# Business Rules

Business Rules hanya berada pada Service Layer.

Tidak diperbolehkan meletakkan Business Rules di:

* Component
* Repository
* Prisma
* UI

---

# Repository Rules

Repository hanya bertugas:

* Membaca data.
* Menyimpan data.
* Memperbarui data.
* Menghapus data.

Repository tidak boleh berisi Business Rules.

---

# Validation Rules

Seluruh validasi menggunakan Zod.

Client Validation hanya membantu pengalaman pengguna.

Server Validation tetap wajib dilakukan.

---

# TypeScript Rules

Wajib:

* Strict Mode.
* Type yang jelas.
* Interface atau Type sesuai kebutuhan.

Tidak diperbolehkan:

* Menggunakan `any` tanpa alasan yang kuat.
* Mengabaikan error TypeScript.

---

# Import Rules

Urutan import:

1. External Library
2. Internal Alias
3. Relative Import

Contoh:

```typescript
import { useState } from "react";

import { z } from "zod";

import { Button } from "@/components/ui/button";

import { categoryService } from "@/services/category.service";

import "./style.css";
```

---

# Error Handling

Gunakan Error yang jelas.

Contoh:

* "Kategori tidak ditemukan."
* "Slug sudah digunakan."
* "Akses ditolak."

Hindari pesan yang tidak informatif.

---

# Database Access

Seluruh akses database melalui:

```text id="cs12"
Repository
```

Tidak diperbolehkan memanggil Prisma langsung dari:

* UI
* Component
* Service lain

---

# API Rules

REST API hanya:

* Menerima Request.
* Memanggil Service.
* Mengembalikan Response.

Business Rules tetap berada pada Service Layer.

---

# Comment Rules

Komentar hanya digunakan apabila benar-benar diperlukan.

Kode yang baik seharusnya dapat dipahami tanpa komentar berlebihan.

---

# Logging

Gunakan logging untuk:

* Error
* Warning
* Audit

Hapus seluruh log debugging sebelum release.

---

# Security Rules

Tidak boleh:

* Hardcode Secret.
* Menyimpan Password.
* Menampilkan Stack Trace ke pengguna.

---

# Performance Rules

Utamakan:

* Pagination
* Lazy Loading bila diperlukan
* Query efisien
* Menghindari N+1 Query
* Reuse Component

---

# Code Review Checklist

Sebelum merge, pastikan:

* Build berhasil.
* TypeScript tanpa error.
* Lint tanpa error.
* Tidak ada `console.log()`.
* Business Rules dipatuhi.
* Repository Pattern dipatuhi.
* Dokumentasi diperbarui bila diperlukan.

---

# Definition of Done

Sebuah pekerjaan dianggap selesai apabila:

* Fitur berjalan sesuai kebutuhan.
* Build berhasil.
* Tidak ada error TypeScript.
* Tidak ada lint error.
* Dokumentasi diperbarui.
* Siap untuk code review.

---

# Governance

Seluruh source code LIM Digital Platform wajib mengikuti Coding Standards ini.

Perubahan terhadap standar hanya dapat dilakukan melalui pembaruan dokumentasi dan persetujuan tim.

---

# Closing

Coding Standards bertujuan menciptakan source code yang konsisten, mudah dipahami, aman, dan mudah dipelihara.

Seluruh developer dan AI diharapkan mengikuti standar ini agar kualitas LIM Digital Platform tetap terjaga seiring pertumbuhan proyek.
