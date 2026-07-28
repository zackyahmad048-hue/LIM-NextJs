# Falak Workflow

**Project:** LIM Digital Platform

**Domain:** Falak

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan alur proses (Workflow) pada Domain Falak.

Workflow menjadi acuan implementasi perhitungan falak, observasi rukyat, kalender Hijriah, arah kiblat, waktu salat, dan pengelolaan data astronomi.

---

# Overview

Domain Falak mengelola seluruh lifecycle data astronomi Islam dan hasil perhitungan falak.

Seluruh proses mengikuti Business Rules dan dicatat pada Audit Log.

---

# Prayer Time Workflow

```text id="flkwf01"
Input Location

↓

Select Date

↓

Select Calculation Method

↓

Calculate Prayer Time

↓

Display Result

↓

Save History
```

---

# Qibla Workflow

```text id="flkwf02"
Input Coordinate

↓

Validate Coordinate

↓

Calculate Qibla

↓

Display Direction

↓

Save History
```

---

# Hijri Calendar Workflow

```text id="flkwf03"
Select Method

↓

Input Date

↓

Calculate Hijri Date

↓

Generate Calendar

↓

Publish Calendar
```

---

# Hisab Workflow

```text id="flkwf04"
Input Astronomical Parameters

↓

Calculate

↓

Validate Result

↓

Save Calculation

↓

Generate Report
```

---

# Rukyat Workflow

```text id="flkwf05"
Create Observation

↓

Input Location

↓

Input Weather

↓

Observation

↓

Verification

↓

Confirmed

↓

Archive
```

Setelah **Confirmed**, data observasi tidak dapat diubah.

---

# Eclipse Workflow

```text id="flkwf06"
Input Date

↓

Calculate Eclipse

↓

Generate Report

↓

Publish Result
```

---

# Archive Workflow

```text id="flkwf07"
Observation

↓

Archive

↓

Read Only

↓

Audit Log
```

---

# Restore Workflow

```text id="flkwf08"
Archived Data

↓

Restore

↓

Available
```

---

# Delete Workflow

```text id="flkwf09"
Delete Request

↓

Dependency Check

↓

Soft Delete

↓

Audit Log
```

Data historis tidak dapat dihapus.

---

# Search Workflow

```text id="flkwf10"
Search

↓

Filter

↓

Sort

↓

Pagination

↓

Result
```

---

# Permission Workflow

```text id="flkwf11"
Authentication

↓

Authorization

↓

Permission Check

↓

Execute Action
```

---

# Error Workflow

```text id="flkwf12"
Validation Failed

↓

Return Error

↓

Retry
```

---

# Workflow Rules

* Seluruh perhitungan menggunakan parameter yang tervalidasi.
* Observasi harus melalui proses verifikasi.
* Data yang telah dikonfirmasi menjadi Read Only.
* Perhitungan dapat direproduksi menggunakan parameter yang sama.
* Seluruh aktivitas dicatat pada Audit Log.

---

# Related Documents

* README.md
* business-rules.md
* database.md
* api.md
* permissions.md
* validation.md
* ui.md
* roadmap.md

---

# Acceptance Criteria

Workflow Falak dianggap selesai apabila:

* Seluruh proses mengikuti lifecycle yang ditentukan.
* Perhitungan konsisten dan dapat diverifikasi.
* Observasi tervalidasi sebelum dikonfirmasi.
* Arsip bersifat Read Only.
* Seluruh aktivitas mengikuti Business Rules dan tercatat pada Audit Log.
