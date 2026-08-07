# Cache Infrastructure

**Project:** LIM Digital Platform

**Folder:** `09-infrastructure`

**Document:** `cache-infrastructure.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar implementasi **Cache Infrastructure** pada LIM Digital Platform.

Cache menggunakan **Redis** sebagai layanan utama untuk meningkatkan performa aplikasi, mengurangi beban database, serta mendukung layanan asynchronous seperti Queue, Session, dan Rate Limiting.

Redis bukan merupakan sumber data utama (Source of Truth), melainkan penyimpanan data sementara (In-Memory Cache).

---

# Objectives

Cache Infrastructure bertujuan untuk:

- Mengurangi beban Database.
- Mempercepat Response Time.
- Mendukung Queue Processing.
- Mengelola Session.
- Mendukung Rate Limiting.
- Menyediakan Temporary Data Storage.

---

# Cache Platform

Platform awal:

- Next.js Data Cache (`unstable_cache` + `revalidateTag`) sebagai layer cache serverless utama.

Platform roadmap (diperlukan saat ada background job, queue, atau rate-limit skala besar):

- Redis

Fitur yang digunakan (Next.js Data Cache):

- Server-side memoization dengan TTL (revalidate)
- Cache invalidation berbasis tag
- Tanpa infrastruktur tambahan di Vercel serverless

Fitur yang direncanakan di Redis:

- Key-Value Storage
- TTL (Time To Live)
- Pub/Sub (Opsional)
- Queue
- Atomic Operation

---

# Cache Architecture

```text id="cache01"
Application

↓

Cache Service

↓

Redis

↓

PostgreSQL
```

Aplikasi selalu memeriksa Cache terlebih dahulu sebelum mengakses Database.

---

# Cache Usage

Redis digunakan untuk:

- Application Cache
- Session Storage
- Authentication Token
- Rate Limiting
- Queue
- Temporary Data
- Dashboard Statistics

---

# Cache Strategy

Strategi yang digunakan:

## Cache Aside

```text id="cache02"
Request

↓

Redis

↓

Hit?

↓

Yes → Response

↓

No

↓

Database

↓

Store Redis

↓

Response
```

---

## Write Through

Digunakan untuk data yang harus langsung memperbarui Cache setelah perubahan pada Database.

---

# Cache Expiration

Seluruh Cache memiliki TTL.

Contoh:

| Data       | TTL                    |
| ---------- | ---------------------- |
| Dashboard  | 5 menit                |
| Settings   | 30 menit               |
| Session    | Sesuai Session Timeout |
| Statistics | 10 menit               |
| Rate Limit | 1 menit                |

TTL dapat disesuaikan berdasarkan kebutuhan bisnis.

---

# Key Naming Convention

Contoh penamaan Key:

```text id="cache03"
user:123

dashboard:admin

settings:system

program:456

certificate:789
```

Gunakan namespace yang konsisten agar mudah dikelola.

---

# Cache Invalidation

Cache harus diperbarui ketika:

- Data berubah.
- Data dihapus.
- TTL berakhir.
- Administrator melakukan Refresh Cache.

Tidak diperbolehkan menggunakan Cache yang sudah kedaluwarsa.

---

# Queue Infrastructure

Redis juga digunakan sebagai Queue untuk:

- Email
- Notification
- Background Job
- PDF Generation
- Scheduled Task

Queue diproses oleh Worker secara asynchronous.

---

# Session Management

Redis digunakan untuk:

- Active Session
- Refresh Token Metadata
- Temporary Authentication Data

Session akan dihapus otomatis setelah TTL berakhir.

---

# Security

Redis wajib:

- Berada pada Private Network.
- Menggunakan Authentication.
- Tidak dapat diakses langsung dari Internet.
- Menggunakan TLS bila didukung.
- Dipantau melalui Audit dan Monitoring.

---

# Monitoring

Parameter yang dipantau:

- Memory Usage
- Cache Hit Ratio
- Cache Miss Ratio
- Connected Clients
- Key Count
- Queue Length
- Eviction Count

Alert dikirim ketika penggunaan sumber daya melebihi ambang batas.

---

# Backup

Backup Redis bersifat opsional karena sebagian besar data dapat dibangun kembali dari Database.

Namun, konfigurasi Redis tetap didokumentasikan dan dicadangkan sesuai kebutuhan operasional.

---

# Best Practices

- Jangan menyimpan data permanen di Redis.
- Gunakan TTL pada seluruh Cache.
- Hindari Key yang terlalu besar.
- Gunakan Namespace pada Key.
- Bersihkan Cache yang sudah tidak digunakan.
- Pantau Cache Hit Ratio secara berkala.

---

# Related Documents

- README.md
- database-infrastructure.md
- storage-infrastructure.md
- monitoring-infrastructure.md

---

# Acceptance Criteria

- Layer cache aktif memakai Next.js Data Cache (unstable_cache + revalidateTag).
- Cache menggunakan TTL yang sesuai.
- Redis dijadwalkan sebagai roadmap ketika queue/background job/rate-limit dibutuhkan.
- Monitoring Cache aktif.
- Cache Infrastructure menjadi acuan resmi implementasi cache LIM Digital Platform.
