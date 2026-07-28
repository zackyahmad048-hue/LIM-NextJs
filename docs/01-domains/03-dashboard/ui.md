# Dashboard UI

**Project:** LIM Digital Platform

**Domain:** Dashboard

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan struktur antarmuka Dashboard.

---

# Layout

```text
Header

↓

Statistics

↓

Quick Access

↓

Recent Activities

↓

Announcements
```

---

# Components

## Header

Berisi:

* Judul
* Breadcrumb
* User Menu

---

## Welcome Card

Menampilkan:

* Nama User
* Role
* Sapaan

---

## Statistics Card

Menampilkan:

* Total User
* Total Program
* Total Surat
* Total Sertifikat
* Total Berita

---

## Quick Access

Shortcut menuju modul utama.

---

## Recent Activities

Daftar aktivitas terbaru.

---

## Announcement

Daftar pengumuman aktif.

---

## Empty State

Apabila data kosong:

* Tampilkan ilustrasi.
* Tampilkan pesan.
* Tampilkan tombol aksi jika diperlukan.

---

## Loading State

Gunakan Skeleton Loading.

---

## Error State

Gunakan Alert dengan pesan yang mudah dipahami.

---

# Responsive

Dashboard wajib mendukung:

* Mobile
* Tablet
* Desktop

---

# Related Documents

* README.md
* workflow.md
* api.md

---

# Acceptance Criteria

* Layout konsisten.
* Responsive.
* Mengikuti Design System.
* Seluruh widget mengikuti Permission.
