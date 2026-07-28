# Falak Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `falak-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Falak Domain**.

Falak Domain merupakan domain khusus yang menyediakan layanan astronomi Islam (*Ilmu Falak*), meliputi perhitungan waktu salat, arah kiblat, kalender Hijriah, hisab, rukyat, fase bulan, serta peristiwa astronomi lainnya.

Domain ini menjadi layanan inti yang dapat digunakan oleh Website, Mobile App, Dashboard, API Publik, dan sistem eksternal.

---

# Objectives

Falak harus mampu:

* Menghitung Waktu Salat.
* Menghitung Arah Kiblat.
* Menghasilkan Kalender Hijriah.
* Menghitung Hisab Hilal.
* Mendukung Data Rukyat.
* Menghitung Gerhana.
* Menyediakan API Astronomi Islam.

---

# Actors

| Actor         | Description                                 |
| ------------- | ------------------------------------------- |
| Public User   | Menggunakan layanan Falak                   |
| Administrator | Mengelola parameter dan referensi           |
| Researcher    | Mengakses data hisab dan rukyat             |
| System        | Menggunakan layanan Falak untuk domain lain |

---

# Functional Requirements

## Prayer Time

Menghasilkan:

* Fajr
* Sunrise
* Dhuhr
* Asr
* Maghrib
* Isha

Mendukung berbagai metode perhitungan.

---

## Qibla Direction

Menghasilkan:

* Azimuth Kiblat
* Kompas Kiblat
* Peta Kiblat (Future)

---

## Hijri Calendar

Menyediakan:

* Tanggal Hijriah
* Awal Bulan
* Nama Bulan
* Konversi Hijriah ↔ Masehi

---

## Hilal Calculation

Menghasilkan parameter:

* Tinggi Hilal
* Elongasi
* Umur Bulan
* Lag Time
* Illuminasi
* Azimuth Matahari
* Azimuth Bulan

---

## Rukyat Observation

Mengelola:

* Lokasi Observasi
* Hasil Observasi
* Observer
* Cuaca
* Dokumentasi

---

## Eclipse

Menghasilkan:

* Gerhana Matahari
* Gerhana Bulan
* Waktu Kontak
* Magnitudo
* Jalur Gerhana (Future)

---

# Non Functional Requirements

Falak harus:

* Response < 500 ms.
* Presisi tinggi.
* Highly Available.
* Stateless.
* Audit Enabled.

---

# Preconditions

* Parameter lokasi tersedia.
* Koordinat valid.
* Zona waktu diketahui.

---

# Postconditions

* Hasil perhitungan dihasilkan.
* Riwayat perhitungan (opsional) disimpan.
* Audit Log dibuat jika diperlukan.
* Domain Event diterbitkan untuk proses tertentu.

---

# Main Flow

```text id="falak01"
Request

↓

Validation

↓

Calculation Service

↓

Astronomical Engine

↓

Result Formatter

↓

Response
```

---

# Alternative Flow

```text id="falak02"
Cached Result

↓

Return Cached Data
```

---

# Exception Flow

* Lokasi tidak valid.
* Koordinat tidak ditemukan.
* Metode perhitungan tidak didukung.
* Parameter astronomi tidak tersedia.

---

# Sequence Diagram

```text id="falak03"
Client

↓

Falak API

↓

Application

↓

Calculation Engine

↓

Repository (Reference Data)

↓

Response
```

---

# State Diagram

```text id="falak04"
Input

↓

Calculating

↓

Completed

↓

Returned
```

---

# Domain Model

Entity:

* Observation
* CalculationProfile
* PrayerTimeConfiguration

Aggregate:

* Falak

Value Object:

* Coordinate
* Elevation
* PrayerTime
* QiblaDirection
* HijriDate
* HilalParameter

---

# Database Mapping

Tables:

```text id="falak05"
calculation_profiles

rukyat_observations

observation_locations

astronomical_reference_data
```

Sebagian besar hasil perhitungan bersifat dinamis dan tidak wajib disimpan permanen.

---

# API Specification

| Method | Endpoint                     |
| ------ | ---------------------------- |
| GET    | /api/v1/falak/prayer-times   |
| GET    | /api/v1/falak/qibla          |
| GET    | /api/v1/falak/hijri-calendar |
| GET    | /api/v1/falak/hilal          |
| GET    | /api/v1/falak/eclipse        |
| POST   | /api/v1/falak/rukyat         |

---

# Validation Matrix

| Field             | Rule                |
| ----------------- | ------------------- |
| latitude          | Required, -90..90   |
| longitude         | Required, -180..180 |
| elevation         | Optional, ≥ 0       |
| date              | Required            |
| calculationMethod | Required            |

---

# Permission Matrix

| Action                | Public | User | Researcher | Admin |
| --------------------- | :----: | :--: | :--------: | :---: |
| Prayer Time           |    ✅   |   ✅  |      ✅     |   ✅   |
| Qibla                 |    ✅   |   ✅  |      ✅     |   ✅   |
| Hijri Calendar        |    ✅   |   ✅  |      ✅     |   ✅   |
| Hilal Calculation     |    ✅   |   ✅  |      ✅     |   ✅   |
| Submit Rukyat         |    ❌   |   ✅  |      ✅     |   ✅   |
| Manage Reference Data |    ❌   |   ❌  |      ❌     |   ✅   |

---

# Error Catalog

| Code      | Description                    |
| --------- | ------------------------------ |
| FALAK_001 | Invalid Coordinate             |
| FALAK_002 | Invalid Date                   |
| FALAK_003 | Unsupported Calculation Method |
| FALAK_004 | Observation Not Found          |
| FALAK_005 | Astronomical Data Unavailable  |

---

# Notification Matrix

| Event                | Notification      |
| -------------------- | ----------------- |
| New Rukyat Submitted | Administrator     |
| Observation Approved | Observer          |
| Eclipse Announcement | Public (Optional) |

---

# Domain Events

```text id="falak06"
PrayerTimeCalculated

QiblaCalculated

HijriCalendarGenerated

HilalCalculated

RukyatSubmitted

RukyatVerified
```

---

# Acceptance Test

* Waktu salat dihitung dengan benar.
* Arah kiblat sesuai koordinat.
* Kalender Hijriah berhasil dikonversi.
* Perhitungan hilal menghasilkan seluruh parameter.
* Data rukyat berhasil disimpan.
* Audit Log tercatat.
* Domain Event diterbitkan.

---

# Performance Requirement

* Prayer Time Calculation < 100 ms.
* Qibla Calculation < 100 ms.
* Hijri Conversion < 100 ms.
* Hilal Calculation < 500 ms.

---

# Security Requirement

* Input koordinat divalidasi.
* RBAC diterapkan pada fitur administratif.
* Audit Log aktif untuk perubahan data referensi dan observasi.
* API menggunakan HTTPS.
* Rate Limiting diterapkan pada Public API.

---

# Acceptance Criteria

* Seluruh layanan Falak menghasilkan perhitungan yang konsisten sesuai metode yang dipilih.
* API mengikuti API Standard.
* Perhitungan bersifat deterministik dan dapat diuji ulang.
* Domain Event dan Audit Log berjalan sesuai kebutuhan.
* Specification siap digunakan sebagai dasar implementasi Falak Domain.
