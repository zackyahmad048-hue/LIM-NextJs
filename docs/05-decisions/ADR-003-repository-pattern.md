# ADR-003: Repository Pattern

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Accepted

**Date:** 2026-07-14

---

# Context

Business Rules pada LIM Digital Platform tidak boleh bergantung langsung pada teknologi penyimpanan data seperti:

* PostgreSQL
* MySQL
* MongoDB
* Prisma
* TypeORM
* Raw SQL

Apabila Domain mengakses database secara langsung, maka perubahan teknologi penyimpanan akan memengaruhi Business Rules dan menyulitkan proses pengujian.

Diperlukan mekanisme yang memisahkan Business Logic dari implementasi akses data.

---

# Decision

LIM Digital Platform menggunakan **Repository Pattern** sebagai abstraksi akses data.

Repository dibagi menjadi dua bagian:

* Repository Interface
* Repository Implementation

Struktur:

```text id="adr00301"
Domain

↓

Repository Interface

↑

Repository Implementation

↓

Database
```

Repository Interface ditempatkan pada **Domain Layer**, sedangkan implementasinya berada pada **Infrastructure Layer**.

---

# Rationale

Repository Pattern dipilih karena:

* Memisahkan Business Logic dari Database.
* Mendukung Dependency Inversion Principle.
* Mempermudah Unit Testing menggunakan Mock Repository.
* Memungkinkan pergantian ORM atau Database tanpa mengubah Domain.
* Selaras dengan Clean Architecture dan DDD.

---

# Alternatives Considered

## Direct ORM Access

Contoh:

```text id="adr00302"
Use Case

↓

Prisma

↓

Database
```

Kelebihan:

* Implementasi cepat.
* Kode lebih sedikit.

Kekurangan:

* Business Logic bergantung pada ORM.
* Sulit diuji tanpa database.
* Tight Coupling.

---

## Active Record Pattern

Kelebihan:

* Mudah dipahami.
* Cocok untuk aplikasi sederhana.

Kekurangan:

* Entity mengetahui Database.
* Tidak sesuai dengan Clean Architecture.
* Sulit berkembang pada sistem berskala besar.

---

## DAO (Data Access Object)

Kelebihan:

* Memisahkan query dari Business Logic.

Kekurangan:

* Tidak terintegrasi dengan konsep Aggregate dan Domain pada DDD.
* Kurang merepresentasikan model bisnis.

---

# Consequences

Keuntungan:

* Domain tetap independen.
* Repository mudah di-mock untuk Unit Test.
* Pergantian ORM lebih mudah.
* Query kompleks dapat diisolasi pada Infrastructure.

Konsekuensi:

* Menambah jumlah Interface dan Class.
* Membutuhkan Dependency Injection.
* Membutuhkan implementasi Repository untuk setiap Domain.

---

# Implementation Rules

Repository Interface hanya mendefinisikan kontrak.

Contoh:

```text id="adr00303"
ProgramRepository

LetterRepository

KnowledgeRepository
```

Repository Implementation berada pada Infrastructure.

Contoh:

```text id="adr00304"
PostgresProgramRepository

PrismaLetterRepository

PostgresKnowledgeRepository
```

Repository tidak boleh:

* Berisi Business Rules.
* Memanggil HTTP API.
* Mengakses Repository Domain lain.

---

# Related Decisions

* ADR-001 Domain Driven Design
* ADR-002 Clean Architecture
* ADR-005 Event Driven Architecture

---

# References

* Patterns of Enterprise Application Architecture — Martin Fowler
* Clean Architecture — Robert C. Martin
* Architecture Documentation (`02-architecture/repository-pattern.md`)

---

# Status

**Accepted**

---

# Acceptance Criteria

* Seluruh akses database melalui Repository.
* Repository Interface berada pada Domain Layer.
* Repository Implementation berada pada Infrastructure Layer.
* Business Rules tidak bergantung pada ORM atau Database.
* Repository Pattern menjadi standar akses data LIM Digital Platform.
