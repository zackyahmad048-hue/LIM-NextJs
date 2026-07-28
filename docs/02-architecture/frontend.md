# Frontend Architecture

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Document:** `frontend.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan arsitektur frontend untuk LIM Digital Platform yang mencakup **Admin Dashboard** dan **Public Web**.

---

# Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js (App Router) | Framework utama |
| React 19 | UI library |
| Tailwind CSS | Utility-first CSS |
| shadcn/ui | Component library |
| React Query (TanStack Query) | Server state management |
| Zustand | Global client state |
| React Hook Form | Form handling |
| Zod | Schema validation |
| Prisma 7 | Database ORM |
| Better Auth | Authentication |

---

# Application Structure

```text
app/
      |
(website)/           → Public Web (Landing, Media, Artikel, Kontak)
      |
(dashboard)/admin/   → Admin Dashboard
      |
api/                 → API Routes (BFF)
```

---

# Pattern

## Component-Driven

* **UI Components:** Dumb components, hanya menerima props dan menampilkan UI.
* **Feature Components:** Smart components yang mengelola state dan memanggil API.
* **Page Components:** Compose feature components menjadi halaman utuh.

## BFF (Backend for Frontend)

Next.js API Routes bertindak sebagai proxy atau agregator sebelum memanggil Core API di backend.

```text
Client → Next.js API Route → Core API → Database
```

Manfaat:

* Menjaga agar client-side tidak terekspos langsung ke microservices.
* Agregasi data dari multiple API calls.
* Transformasi data sesuai kebutuhan frontend.
* Enrichment data (contoh: menambahkan user info).

---

# State Management

## Server State (React Query)

Digunakan untuk data yang berasal dari server:

* Fetching (GET)
* Mutations (POST, PUT, DELETE)
* Caching
* Optimistic updates
* Background refetch

## Client State (Zustand)

Digunakan untuk state lokal yang tidak bergantung pada server:

* UI state (sidebar open/closed, modal state)
* Form state (multi-step forms)
* Filter/sort preferences
* Theme preference

---

# Data Fetching Strategy

```text
Page Load
      |
Server Component → Fetch initial data
      |
Client hydration
      |
React Query → Manage subsequent fetches
```

## Server Components

* Digunakan untuk data yang tidak memerlukan interaksi user.
* SEO-friendly content.
* Initial page load data.

## Client Components

* Interactive UI elements.
* Real-time updates.
* User-triggered actions.

---

# Form Handling

```text
React Hook Form
      |
Zod Schema Validation
      |
API Submission (React Query Mutation)
      |
Success/Error Handling
```

---

# Error Handling

```text
API Error
      |
React Query onError
      |
Toast Notification
      |
Fallback UI (if needed)
```

---

# Performance Optimization

* **Code Splitting:** Lazy load routes dan components.
* **Image Optimization:** Next.js Image component.
* **Font Optimization:** next/font.
* **Caching:** React Query cache + Next.js cache.
* **Bundle Analysis:** Regular bundle size monitoring.

---

# Security

* CSRF protection via SameSite cookies.
* XSS prevention via React's automatic escaping.
* Content Security Policy (CSP) headers.
* Rate limiting on API routes.
* Input validation on both client and server.

---

# Related Documents

* `README.md` - Architecture overview.
* `architecture-overview.md` - High level architecture.
* `mobile-strategy.md` - Mobile integration.
* `dependency-rules.md` - Dependency rules.

---

# Acceptance Criteria

* Tech stack terimplementasi sesuai spek.
* BFF pattern berfungsi dengan benar.
* Server dan client state terpisah dengan jelas.
* Form handling menggunakan React Hook Form + Zod.
* Error handling terimplementasi secara konsisten.
* Performance optimization terimplementasi.
* Security best practices terpenuhi.
