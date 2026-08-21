# Falak UI

**Project:** LIM Digital Platform

**Domain:** Falak

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar antarmuka pengguna (UI) pada Domain Falak.

UI digunakan untuk mengelola perhitungan falak, jadwal salat, arah kiblat, kalender Hijriah, hisab, rukyat, gerhana, dan laporan astronomi.

---

# Navigation

```text id="flkui01"
Falak
├── Dashboard
├── Prayer Time
├── Qibla
├── Hijri Calendar
├── Hisab
├── Rukyat
├── Eclipse
├── Reports
└── Archive
```

---

# Dashboard

Menampilkan:

- Today's Prayer Time
- Current Hijri Date
- Upcoming Eclipse
- Recent Observations
- Pending Verification
- Astronomy Summary

---

# Prayer Time

Field:

- Location
- Date
- Calculation Method

Action:

- Calculate
- Save
- Export PDF

Hasil:

- Fajr
- Sunrise
- Dhuhr
- Asr
- Maghrib
- Isha

---

# Qibla

Field:

- Latitude
- Longitude

Action:

- Calculate
- Show Map
- Export

Hasil:

- Qibla Direction (Degree)
- Compass View

---

# Hijri Calendar

Field:

- Year
- Method

Action:

- Generate
- Print
- Export

---

# Hisab

Field:

- Date
- Location
- Method
- Parameters

Action:

- Calculate
- Save
- Generate Report

---

# Rukyat

Kolom:

- Observation Date
- Location
- Observer
- Weather
- Status

Action:

- Create Observation
- Verify
- Confirm
- Archive

---

# Eclipse

Kolom:

- Eclipse Type
- Date
- Visibility
- Status

Action:

- Calculate
- View Detail
- Export Report

---

# Reports

Jenis laporan:

- Prayer Time Report
- Hijri Calendar Report
- Hisab Report
- Rukyat Report
- Eclipse Report

Action:

- Preview
- Export PDF
- Export Excel

---

# Archive

Read Only.

Kolom:

- Observation
- Archived At
- Archived By

Action:

- View
- Restore

---

# Components

- Data Table
- Map Viewer
- Coordinate Picker
- Calendar
- Date Picker
- Chart
- Search
- Filter
- Badge
- Modal
- Dialog
- Toast
- Export Button

---

# States

- Empty State
- Loading State
- Calculating State
- Error State

---

# Responsive

- Desktop
- Tablet
- Mobile (Prayer Time, Qibla, Hijri Calendar)

---

# Acceptance Criteria

- UI konsisten.
- Responsive.
- Perhitungan dapat dijalankan dari UI.
- Peta dan arah kiblat ditampilkan dengan jelas.
- Seluruh aksi mengikuti Permission.
