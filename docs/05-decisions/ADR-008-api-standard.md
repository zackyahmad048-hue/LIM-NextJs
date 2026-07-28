# ADR-008: API Standard

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Accepted

**Date:** 2026-07-14

---

# Context

LIM Digital Platform terdiri dari banyak domain yang menyediakan REST API.

Tanpa standar yang konsisten, API akan memiliki:

* Struktur URL yang berbeda.
* Format Response yang tidak seragam.
* Error Handling yang berbeda.
* Dokumentasi yang sulit dipahami.
* Integrasi yang kompleks.

Diperlukan standar API yang berlaku untuk seluruh domain.

---

# Decision

LIM Digital Platform menggunakan **RESTful API** sebagai standar komunikasi antar client dan server.

Seluruh API mengikuti standar yang sama untuk:

* URL
* HTTP Method
* Request
* Response
* Error
* Pagination
* Versioning

---

# Rationale

REST dipilih karena:

* Sederhana.
* Mature.
* Didukung hampir seluruh platform.
* Mudah diintegrasikan.
* Cocok untuk Modular Monolith maupun Microservices.

---

# API Versioning

Seluruh endpoint menggunakan URL Versioning.

Format:

```text id="adr00801"
/api/v1/
```

Contoh:

```text id="adr00802"
/api/v1/programs

/api/v1/letters

/api/v1/certificates

/api/v1/prayer-times
```

Perubahan yang tidak kompatibel menggunakan versi baru.

---

# URL Convention

Endpoint menggunakan:

```text id="adr00803"
Plural Resource

kebab-case
```

Contoh:

```text id="adr00804"
/programs

/knowledge-categories

/prayer-times
```

---

# HTTP Methods

| Method | Purpose        |
| ------ | -------------- |
| GET    | Read           |
| POST   | Create         |
| PUT    | Replace        |
| PATCH  | Partial Update |
| DELETE | Delete         |

---

# Response Standard

Response sukses:

```text id="adr00805"
success

message

data

meta
```

Response error:

```text id="adr00806"
success

message

errors

code
```

Seluruh API menggunakan struktur response yang konsisten.

---

# Error Handling

Menggunakan HTTP Status Code standar.

Contoh:

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

# Authentication

Seluruh API privat menggunakan:

```text id="adr00807"
JWT Bearer Token
```

Authorization menggunakan:

* Role
* Permission
* RBAC

---

# Pagination

Endpoint List menggunakan format:

```text id="adr00808"
page

limit

sort

search

filter
```

Response menyediakan:

* total
* totalPages
* currentPage
* hasNextPage

---

# Documentation

Seluruh API wajib didokumentasikan menggunakan:

```text id="adr00809"
OpenAPI 3.x
```

Dokumentasi harus selalu sinkron dengan implementasi.

---

# Alternatives Considered

## GraphQL

Kelebihan:

* Fleksibel.
* Efisien untuk Frontend.

Kekurangan:

* Kompleks.
* Overhead lebih tinggi.
* Belum diperlukan pada fase awal.

---

## gRPC

Kelebihan:

* Sangat cepat.
* Cocok untuk Service-to-Service.

Kekurangan:

* Tidak ideal untuk Public API.
* Lebih kompleks.

---

## REST API (Chosen)

Kelebihan:

* Sederhana.
* Mudah dipahami.
* Standar industri.
* Didukung luas.

Kekurangan:

* Over-fetching pada beberapa kasus.

---

# Consequences

Keuntungan:

* API konsisten.
* Dokumentasi lebih mudah.
* Integrasi lebih sederhana.
* Mendukung versioning.

Konsekuensi:

* Semua domain wajib mengikuti standar yang sama.
* Breaking Change memerlukan versi API baru.

---

# Related Decisions

* ADR-002 Clean Architecture
* ADR-004 RBAC
* ADR-009 Validation Strategy

---

# References

* REST Architectural Style — Roy Fielding
* OpenAPI Specification 3.x
* Architecture Documentation (`01-domains/api.md`)

---

# Status

**Accepted**

---

# Acceptance Criteria

* Seluruh API menggunakan REST.
* Endpoint mengikuti standar penamaan.
* Response dan Error konsisten.
* OpenAPI menjadi dokumentasi resmi.
* API Standard menjadi pedoman seluruh layanan LIM Digital Platform.
