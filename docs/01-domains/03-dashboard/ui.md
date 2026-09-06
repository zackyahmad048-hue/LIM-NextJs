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

> **Catatan (per `docs/07-specifications/spec-admin-permukaan-tenang.md`):** urutan di bawah adalah **contoh alur**, bukan mandat vertikal. Komposisi permukaan (stat band/baris, list divider-row, navigasi ke rail) ditetapkan oleh spec permukaan admin. Istilah kartu pada bagian Components (`Statistics Card`, `Welcome Card`) sudah dinetralkan; "Statistics" adalah data, belum tentu kartu.

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

- Judul
- Breadcrumb
- User Menu

---

## Welcome

Menampilkan:

- Nama User
- Role
- Sapaan

Mengikuti komposisi band yang ditetapkan spec permukaan admin (bukan kotak "Welcome Card"; pada dasbor saat ini sapaan dipindah menjadi headline PageHeader).

---

## Statistics

Menampilkan ringkasan data yang dapat diakses pengguna (contoh: total user, program, surat, sertifikat, berita).

Jumlah angka yang menonjol dan bentuknya (band ringkas/baris) ditetapkan `spec-admin-permukaan-tenang.md` (§Statistik: kap 4 angka menonjol; angka selanjutnya sebagai baris). Bukan grid kartu paralel.

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

- Tampilkan ilustrasi.
- Tampilkan pesan.
- Tampilkan tombol aksi jika diperlukan.

---

## Loading State

Gunakan Skeleton Loading.

---

## Error State

Gunakan Alert dengan pesan yang mudah dipahami.

---

# Responsive

Dashboard wajib mendukung:

- Mobile
- Tablet
- Desktop

---

# Related Documents

- README.md
- workflow.md
- api.md

---

# Acceptance Criteria

- Layout konsisten.
- Responsive.
- Mengikuti Design System.
- Seluruh widget mengikuti Permission.
