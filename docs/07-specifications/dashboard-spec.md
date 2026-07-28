# Dashboard Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `dashboard-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Dashboard Domain**.

Dashboard menyediakan ringkasan informasi, statistik, KPI, aktivitas terbaru, serta insight yang diperoleh dari berbagai Domain dalam LIM Digital Platform.

Dashboard tidak menjadi sumber data utama (*Source of Truth*), melainkan menyajikan data hasil agregasi dari domain lain.

---

# Objectives

Dashboard harus mampu:

* Menampilkan KPI.
* Menampilkan Ringkasan Statistik.
* Menampilkan Aktivitas Terbaru.
* Menampilkan Grafik.
* Menampilkan Informasi Berdasarkan Role.
* Menyediakan Dashboard Widget.

---

# Actors

| Actor               | Description                |
| ------------------- | -------------------------- |
| Super Administrator | Melihat seluruh Dashboard  |
| Administrator       | Dashboard organisasi       |
| Operator            | Dashboard operasional      |
| User                | Dashboard sesuai hak akses |
| System              | Menghasilkan data agregasi |

---

# Functional Requirements

## KPI Dashboard

Menampilkan:

* Total Users
* Total Organizations
* Total Programs
* Total Letters
* Total Certificates
* Total Knowledge Articles
* Total Notifications

---

## Recent Activities

Menampilkan:

* Login Terbaru
* Program Baru
* Surat Terbaru
* Sertifikat Terbaru
* Artikel Terbaru

---

## Statistics

Dashboard menyediakan:

* Daily Statistics
* Weekly Statistics
* Monthly Statistics
* Yearly Statistics

---

## Widget Management

Dashboard mendukung:

* Show Widget
* Hide Widget
* Widget Ordering
* Role Based Widget

---

## Search Summary

Dashboard menyediakan ringkasan hasil pencarian global.

---

# Non Functional Requirements

Dashboard harus:

* Response < 500 ms
* Cached
* Highly Available
* Responsive
* Near Real-Time

---

# Preconditions

* User telah Login.
* Permission telah diverifikasi.

---

# Postconditions

* Statistik berhasil dimuat.
* Cache diperbarui apabila diperlukan.
* Aktivitas terbaru ditampilkan.

---

# Main Flow

```text id="dash01"
Request

↓

Authentication

↓

Authorization

↓

Dashboard Service

↓

Aggregate Data

↓

Cache

↓

Response
```

---

# Alternative Flow

```text id="dash02"
Cache Miss

↓

Load Database

↓

Store Cache

↓

Response
```

---

# Exception Flow

* User tidak memiliki Permission.
* Data tidak tersedia.
* Cache gagal.
* Dashboard Service gagal.

---

# Sequence Diagram

```text id="dash03"
Client

↓

Dashboard API

↓

Dashboard Service

↓

Cache

↓

Repositories

↓

Response
```

---

# State Diagram

```text id="dash04"
Loading

↓

Ready

↓

Refreshing
```

---

# Domain Model

Entity:

* DashboardWidget
* DashboardPreference

Value Object:

* Statistic
* KPI
* ChartData

Aggregate:

* Dashboard

---

# Database Mapping

Tables:

```text id="dash05"
dashboard_preferences

dashboard_widgets
```

Data statistik berasal dari domain lain dan tidak diduplikasi kecuali untuk kebutuhan cache.

---

# API Specification

| Method | Endpoint                      |
| ------ | ----------------------------- |
| GET    | /api/v1/dashboard             |
| GET    | /api/v1/dashboard/statistics  |
| GET    | /api/v1/dashboard/activities  |
| GET    | /api/v1/dashboard/widgets     |
| PATCH  | /api/v1/dashboard/preferences |

---

# Validation Matrix

| Field    | Rule        |
| -------- | ----------- |
| widgetId | Required    |
| visible  | Boolean     |
| order    | Integer ≥ 0 |

---

# Permission Matrix

| Feature          | Admin | Operator | User |
| ---------------- | :---: | :------: | :--: |
| View Dashboard   |   ✅   |     ✅    |   ✅  |
| View KPI         |   ✅   |     ✅    |   ✅  |
| Configure Widget |   ✅   |     ✅    |   ❌  |
| Reset Layout     |   ✅   |     ❌    |   ❌  |

---

# Error Catalog

| Code     | Description                  |
| -------- | ---------------------------- |
| DASH_001 | Dashboard Not Available      |
| DASH_002 | Widget Not Found             |
| DASH_003 | Invalid Dashboard Preference |
| DASH_004 | Statistics Not Available     |

---

# Notification Matrix

Dashboard tidak mengirim notifikasi secara langsung.

Dashboard hanya menampilkan data dari Notification Domain.

---

# Domain Events

```text id="dash06"
DashboardPreferenceUpdated

DashboardCacheRefreshed
```

---

# Acceptance Test

* Dashboard berhasil dimuat.
* KPI sesuai data.
* Widget dapat dikonfigurasi.
* Statistik ditampilkan dengan benar.
* Cache bekerja.
* Permission divalidasi.

---

# Performance Requirement

* Dashboard < 500 ms.
* Statistik < 300 ms.
* Cache Hit Ratio > 90%.

---

# Security Requirement

* Seluruh endpoint menggunakan RBAC.
* Dashboard hanya menampilkan data sesuai hak akses.
* Audit Log mencatat perubahan preferensi pengguna.
* Tidak menampilkan data sensitif tanpa izin.

---

# Acceptance Criteria

* Dashboard menampilkan data sesuai Role.
* Statistik berasal dari sumber data yang valid.
* Widget dapat dikustomisasi.
* API mengikuti API Standard.
* Specification siap digunakan sebagai dasar implementasi Dashboard Domain.
