# ADR-001: Domain Driven Design

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Accepted

**Date:** 2026-07-14

---

# Context

LIM Digital Platform memiliki cakupan bisnis yang luas, meliputi:

* Organization
* Program
* Secretariat
* Letter
* Certificate
* Knowledge
* Falak
* Notification
* Media

Apabila seluruh Business Logic ditempatkan tanpa batasan domain yang jelas, sistem akan menjadi sulit dipelihara, memiliki coupling yang tinggi, dan sulit dikembangkan oleh banyak developer secara bersamaan.

Diperlukan pendekatan arsitektur yang mampu memisahkan kompleksitas bisnis menjadi bagian-bagian yang lebih kecil dan memiliki tanggung jawab yang jelas.

---

# Decision

LIM Digital Platform menggunakan **Domain Driven Design (DDD)** sebagai pendekatan utama dalam merancang arsitektur aplikasi.

Implementasi DDD meliputi:

* Bounded Context.
* Domain Layer.
* Entity.
* Value Object.
* Aggregate.
* Domain Service.
* Repository Pattern.
* Domain Event.
* Ubiquitous Language.

Setiap domain memiliki:

* Business Rules sendiri.
* API sendiri.
* Database ownership sendiri (logical ownership).
* Tim pengembangan yang dapat bekerja secara independen.

---

# Rationale

DDD dipilih karena:

* Memisahkan kompleksitas bisnis.
* Menjaga Business Rules tetap terorganisasi.
* Memudahkan kolaborasi tim.
* Mendukung Modular Monolith.
* Mempermudah migrasi ke Microservices di masa depan.
* Mengurangi coupling antar modul.

---

# Alternatives Considered

## Layered Architecture Tradisional

Kelebihan:

* Mudah dipahami.
* Cepat diimplementasikan.

Kekurangan:

* Business Logic mudah tercampur.
* Sulit berkembang pada sistem besar.

---

## Package by Technical Layer

Contoh:

```text id="adr00101"
controllers/

services/

repositories/

models/
```

Kelebihan:

* Sederhana.

Kekurangan:

* Tidak merepresentasikan domain bisnis.
* Sulit dipelihara ketika jumlah fitur bertambah.

---

## Microservices Sejak Awal

Kelebihan:

* Skalabilitas tinggi.

Kekurangan:

* Kompleksitas operasional tinggi.
* Overhead deployment.
* Tidak sesuai dengan kebutuhan awal proyek.

---

# Consequences

Keuntungan:

* Domain lebih independen.
* Kode lebih mudah dipelihara.
* Business Rules lebih terisolasi.
* Mendukung pengembangan paralel.

Konsekuensi:

* Membutuhkan disiplin dalam menjaga batas domain.
* Membutuhkan dokumentasi yang baik.
* Developer harus memahami konsep DDD.

---

# Related Decisions

* ADR-002 Clean Architecture
* ADR-003 Repository Pattern
* ADR-005 Event Driven Architecture

---

# References

* Domain Driven Design — Eric Evans
* Implementing Domain-Driven Design — Vaughn Vernon
* Architecture Documentation (`02-architecture/`)

---

# Status

**Accepted**

---

# Acceptance Criteria

* Seluruh Business Rules ditempatkan pada Domain yang sesuai.
* Setiap Domain memiliki Bounded Context.
* Tidak ada akses langsung ke Business Rules Domain lain.
* DDD menjadi fondasi arsitektur LIM Digital Platform.
