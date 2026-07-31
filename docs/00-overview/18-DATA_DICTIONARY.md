# DATA_DICTIONARY

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

**Document Type:** Data Dictionary

---

# Purpose

Dokumen ini mendefinisikan istilah, entitas, dan atribut utama yang digunakan dalam LIM Digital Platform.

Tujuan dokumen ini adalah menjaga konsistensi penggunaan istilah di seluruh dokumentasi, database, API, source code, dan antarmuka pengguna.

Dokumen ini bukan spesifikasi tabel database, melainkan kamus data proyek.

---

# General Rules

Seluruh istilah harus:

* Memiliki satu arti yang jelas.
* Digunakan secara konsisten.
* Tidak memiliki nama berbeda untuk objek yang sama.
* Mengikuti bahasa domain organisasi.

---

# Standard System Fields

## id

Identitas unik setiap data.

Tipe:

UUID

---

## createdAt

Waktu data dibuat.

---

## updatedAt

Waktu terakhir data diperbarui.

---

## deletedAt

Menandai data telah dihapus secara Soft Delete.

---

## createdBy

Pengguna yang membuat data.

---

## updatedBy

Pengguna terakhir yang mengubah data.

---

## deletedBy

Pengguna yang menghapus data.

---

# Authentication

## User

Pengguna yang memiliki akun pada sistem.

---

## Session

Sesi login aktif milik pengguna.

---

## Role

Kelompok hak akses.

Contoh:

* Super Admin
* Admin
* Editor

---

## Permission

Hak akses spesifik terhadap suatu aksi.

Contoh:

* user.create
* user.update
* post.publish

---

# Organization

## Organization

Data organisasi utama.

---

## Region

Wilayah organisasi.

---

## Branch

Cabang organisasi.

---

## Position

Jabatan dalam organisasi.

---

## Member

Anggota organisasi.

---

# Program

## Program

Kegiatan resmi organisasi.

Contoh:

* Safari Ramadan
* Wajib Khidmah
* Pelatihan

---

## Participant

Peserta suatu Program.

---

## Schedule

Jadwal pelaksanaan Program.

---

## Location

Lokasi pelaksanaan Program.

---

## Committee

Panitia atau penanggung jawab Program.

---

# Secretariat

## Archive

Dokumen yang disimpan sebagai arsip organisasi.

---

## Administration

Administrasi internal organisasi.

---

## Official Document

Dokumen resmi yang dikelola sekretariat.

---

# CMS

## Category

Kelompok konten.

---

## Post

Artikel atau berita.

---

## Page

Halaman statis.

---

## Media

File digital.

Contoh:

* Gambar
* Dokumen
* Video

---

# Letter

## Letter

Surat resmi organisasi.

---

## Letter Number

Nomor unik surat.

---

## Signatory

Penandatangan surat.

---

# Certificate

## Certificate

Dokumen digital yang diterbitkan organisasi.

---

## Certificate Number

Nomor unik sertifikat.

---

## Verification Code

Kode untuk memverifikasi keaslian sertifikat.

---

# Falak

## Prayer Schedule

Jadwal waktu shalat.

---

## Hijri Date

Tanggal kalender Hijriah.

---

## Qibla Direction

Arah kiblat berdasarkan lokasi.

---

## Imsakiyah

Jadwal imsak dan waktu ibadah selama Ramadan. Data diimpor dari Google Sheet ke PostgreSQL.

- Tabel: `imsakiyah`
- Impor: `npm run import:imsakiyah` (replace isi tabel) atau tombol "Import dari Google Sheets" di `/admin/falak/imsakiyah`. Koreksi data bergeser: `npm run repair:imsakiyah`.
- Kolom utama: `gregorianDate`, `dayName`, `javaneseDay`, `ramadanDay`, `hijriDate`, `hijriMonth`, `hijriYear`, `province`, `city`, `latitude`, `longitude`, `elevation`, `googleMapsLink`, `imsak`, `subuh`, `terbit`, `dhuha`, `dzuhur`, `ashar`, `maghrib`, `isya`, `moonPhase`, `eclipseData`, `eclipseTime`, `hilalAltitude`.
- Waktu shalat disimpan sebagai teks (`HH:MM`) untuk mempertahankan format sumber.
- Akses: halaman publik `/falak/imsakiyah`, admin `/admin/falak/imsakiyah`, API `GET /api/v1/falak/imsakiyah?year=YYYY`.

---

## Hilal

Data pengamatan hilal.

---

## Eclipse

Data gerhana Matahari atau Bulan.

---

# Knowledge

## Knowledge Article

Artikel edukasi.

---

## Reference

Dokumen referensi.

---

## Guide

Panduan penggunaan atau panduan ibadah.

---

# Notification

## Notification

Pesan yang dikirim kepada pengguna.

---

## Announcement

Pengumuman resmi.

---

# Common Status

Status standar yang digunakan oleh berbagai domain.

```text id="dd01"
Draft

Published

Archived

Active

Inactive

Completed

Cancelled
```

Domain tertentu dapat menambahkan status lain sesuai kebutuhan.

---

# Common Actions

Aksi standar dalam sistem.

```text id="dd02"
Create

Update

Delete

Restore

Publish

Unpublish

Approve

Reject

Verify
```

---

# Naming Convention

Gunakan istilah berikut secara konsisten.

| Gunakan      | Hindari            |
| ------------ | ------------------ |
| User         | Account User       |
| Program      | Event              |
| Participant  | Peserta Program    |
| Certificate  | Sertifikat Digital |
| Letter       | Surat Keluar       |
| Organization | Instansi           |

---

# Data Classification

Data dikelompokkan menjadi:

## Public

Data yang dapat diakses oleh publik.

Contoh:

* Berita
* Agenda
* Profil Organisasi

---

## Internal

Data yang hanya dapat diakses oleh pengguna internal.

Contoh:

* Program
* Surat
* Arsip

---

## Confidential

Data dengan akses terbatas.

Contoh:

* Data Pengguna
* Hak Akses
* Audit Log
* Konfigurasi Sistem

---

# Related Documentation

Dokumen ini berkaitan dengan:

* Business Rules
* Database
* API
* Architecture
* Security

---

# Governance

Setiap istilah baru yang digunakan dalam proyek harus ditambahkan ke Data Dictionary sebelum digunakan pada database, API, dokumentasi, atau source code.

Perubahan terhadap definisi istilah harus ditinjau agar tidak menimbulkan inkonsistensi di seluruh platform.

---

# Closing

Data Dictionary menjadi referensi resmi seluruh istilah dalam LIM Digital Platform.

Dengan penggunaan istilah yang konsisten, komunikasi antar developer, analis, desainer, dan stakeholder menjadi lebih jelas, serta mengurangi kesalahan dalam implementasi dan dokumentasi.
