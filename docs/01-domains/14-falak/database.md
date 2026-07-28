# Falak Database

**Project:** LIM Digital Platform

**Domain:** Falak

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan struktur database pada Domain Falak.

Domain Falak menyimpan data astronomi, hasil perhitungan, observasi rukyat, kalender Hijriah, arah kiblat, jadwal salat, dan arsip observasi.

---

# Overview

Domain Falak menjadi pusat penyimpanan seluruh data astronomi Islam yang digunakan oleh LIM Digital Platform.

Seluruh hasil perhitungan dapat direproduksi berdasarkan parameter yang tersimpan.

---

# Entity Relationship

```text id="flkdb01"
Prayer Time
      │
      ├─────────────┬──────────────┬──────────────┐
      ▼             ▼              ▼              ▼
Hijri Calendar   Hisab        Rukyat      Eclipse
      │
      ▼
Qibla
```

---

# Main Tables

## falak_prayer_time

Jadwal waktu salat.

| Field             | Type      | Description |
| ----------------- | --------- | ----------- |
| id                | UUID      | Primary Key |
| locationId        | UUID      | Lokasi      |
| calculationMethod | String    | Metode      |
| prayerDate        | Date      | Tanggal     |
| fajr              | Time      | Subuh       |
| sunrise           | Time      | Terbit      |
| dhuhr             | Time      | Zuhur       |
| asr               | Time      | Asar        |
| maghrib           | Time      | Magrib      |
| isha              | Time      | Isya        |
| createdAt         | Timestamp | Dibuat      |

---

## falak_qibla

Data arah kiblat.

| Field     | Type      |
| --------- | --------- |
| id        | UUID      |
| latitude  | Decimal   |
| longitude | Decimal   |
| direction | Decimal   |
| createdAt | Timestamp |

---

## falak_hijri_calendar

Kalender Hijriah.

| Field         | Type      |
| ------------- | --------- |
| id            | UUID      |
| gregorianDate | Date      |
| hijriDate     | String    |
| method        | Enum      |
| createdAt     | Timestamp |

---

## falak_hisab

Hasil perhitungan hisab.

| Field           | Type      |
| --------------- | --------- |
| id              | UUID      |
| calculationDate | Date      |
| parameters      | JSON      |
| result          | JSON      |
| calculatedBy    | UUID      |
| createdAt       | Timestamp |

---

## falak_rukyat

Data observasi rukyat.

| Field           | Type      |
| --------------- | --------- |
| id              | UUID      |
| observationDate | Date      |
| locationId      | UUID      |
| observerId      | UUID      |
| weather         | String    |
| result          | Enum      |
| notes           | Text      |
| status          | Enum      |
| createdAt       | Timestamp |

---

## falak_eclipse

Data gerhana.

| Field       | Type   |
| ----------- | ------ |
| id          | UUID   |
| eclipseType | Enum   |
| eclipseDate | Date   |
| visibility  | String |
| details     | JSON   |

---

# Relationships

| Source   | Relation | Target      |
| -------- | -------- | ----------- |
| Location | 1 : N    | Prayer Time |
| Location | 1 : N    | Rukyat      |
| User     | 1 : N    | Hisab       |
| User     | 1 : N    | Rukyat      |

---

# Indexes

```text id="flkdb02"
falak_prayer_time.prayerDate

falak_hijri_calendar.gregorianDate

falak_hisab.calculationDate

falak_rukyat.observationDate

falak_rukyat.status

falak_eclipse.eclipseDate
```

---

# Constraints

## Prayer Time

* locationId wajib.
* prayerDate wajib.

---

## Hijri Calendar

* gregorianDate unik.

---

## Hisab

* parameters wajib.
* result wajib.

---

## Rukyat

* observerId wajib.
* status wajib.

---

# Soft Delete

Menggunakan Soft Delete:

* falak_hisab
* falak_rukyat

Prayer Time, Hijri Calendar, Qibla, dan Eclipse bersifat permanen.

---

# Status Enum

## Observation Status

```text id="flkdb03"
Draft

Verified

Confirmed

Archived
```

---

## Rukyat Result

```text id="flkdb04"
Visible

Not Visible

Cloudy

Unknown
```

---

# Database Rules

* Seluruh hasil perhitungan menyimpan parameter.
* Data observasi yang telah dikonfirmasi tidak dapat diubah.
* Kalender Hijriah mengikuti metode yang dipilih.
* Seluruh akses database menggunakan Repository Pattern.

---

# Future Tables

```text id="flkdb05"
falak_location

falak_observation_media

falak_calculation_history

falak_prediction

falak_statistics
```

---

# Related Documents

* README.md
* business-rules.md
* workflow.md
* api.md
* permissions.md
* validation.md
* ui.md
* roadmap.md

---

# Acceptance Criteria

* Struktur database mendukung seluruh layanan Falak.
* Parameter perhitungan tersimpan.
* Observasi memiliki status yang jelas.
* Data historis terjaga.
* Seluruh akses database menggunakan Repository Pattern.
