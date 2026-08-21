# ADR-002: Clean Architecture

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Accepted

**Date:** 2026-07-14

---

# Context

LIM Digital Platform diperkirakan akan berkembang menjadi sistem dengan banyak domain, fitur, dan integrasi eksternal.

Apabila Business Logic bergantung langsung pada:

- Framework
- Database
- HTTP
- ORM
- Storage
- External API

maka perubahan teknologi akan berdampak besar terhadap keseluruhan sistem.

Diperlukan arsitektur yang menjaga agar Business Rules tetap independen dari implementasi teknis.

---

# Decision

LIM Digital Platform menggunakan **Clean Architecture** sebagai standar arsitektur aplikasi.

Arsitektur dibagi menjadi empat layer utama:

```text id="adr00201"
Presentation

↓

Application

↓

Domain

↑

Infrastructure
```

Business Rules ditempatkan sepenuhnya pada **Domain Layer**.

Seluruh dependency mengikuti **Dependency Rule**, yaitu mengarah ke Domain.

---

# Rationale

Clean Architecture dipilih karena:

- Business Rules menjadi independen.
- Framework dapat diganti tanpa mengubah Domain.
- Database dapat diganti tanpa memengaruhi Business Logic.
- Mendukung Unit Testing.
- Selaras dengan Domain Driven Design.

---

# Alternatives Considered

## Traditional Layered Architecture

Kelebihan:

- Mudah dipahami.
- Cepat dikembangkan.

Kekurangan:

- Business Logic sering tersebar.
- Ketergantungan tinggi pada framework.

---

## MVC Architecture

Kelebihan:

- Sederhana.
- Banyak didukung framework.

Kekurangan:

- Controller dan Model cenderung menjadi terlalu besar.
- Sulit menjaga batas Business Rules.

---

## Hexagonal Architecture Saja

Kelebihan:

- Sangat fleksibel.
- Mudah mengganti Adapter.

Kekurangan:

- Tidak memberikan struktur layer secara lengkap.

Karena itu Hexagonal digunakan sebagai pelengkap Clean Architecture, bukan pengganti.

---

# Consequences

Keuntungan:

- Business Rules tetap stabil.
- Mudah melakukan Unit Test.
- Infrastruktur dapat berubah tanpa memengaruhi Domain.
- Kode lebih modular.

Konsekuensi:

- Struktur proyek menjadi lebih kompleks.
- Membutuhkan Dependency Injection.
- Membutuhkan disiplin dalam menjaga batas layer.

---

# Implementation Rules

- Presentation hanya berkomunikasi dengan Application.
- Application mengorkestrasi Use Case.
- Domain tidak mengetahui Framework.
- Infrastructure hanya mengimplementasikan Interface.
- Repository Interface berada pada Domain.
- Repository Implementation berada pada Infrastructure.

---

# Related Decisions

- ADR-001 Domain Driven Design
- ADR-003 Repository Pattern
- ADR-005 Event Driven Architecture

---

# References

- Clean Architecture — Robert C. Martin
- Architecture Documentation (`02-architecture/clean-architecture.md`)

---

# Status

**Accepted**

---

# Acceptance Criteria

- Dependency mengikuti Clean Architecture.
- Business Rules tidak bergantung pada Framework.
- Repository menggunakan Interface.
- Domain Layer bebas dari implementasi teknis.
- Clean Architecture menjadi standar implementasi LIM Digital Platform.
