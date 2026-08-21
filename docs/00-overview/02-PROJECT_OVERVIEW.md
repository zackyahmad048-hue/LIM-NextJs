# PROJECT_OVERVIEW

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini memberikan gambaran menyeluruh mengenai LIM Digital Platform, meliputi ruang lingkup proyek, komponen utama, domain bisnis, target pengguna, dan hubungan antar aplikasi.

Dokumen ini menjadi pintu masuk bagi seluruh developer, AI, maupun stakeholder untuk memahami proyek sebelum mempelajari dokumentasi teknis lainnya.

---

# What is LIM Digital Platform?

LIM Digital Platform adalah platform digital terintegrasi yang dikembangkan untuk mendukung seluruh aktivitas organisasi dalam satu ekosistem.

Platform ini menggabungkan layanan publik, administrasi internal, pengelolaan program, layanan ibadah, dan layanan digital organisasi ke dalam satu sistem yang saling terhubung.

---

# Project Scope

Platform mencakup lima komponen utama.

## Public Website

Portal informasi resmi organisasi.

Fitur utama:

- Profil organisasi
- Berita
- Artikel
- Agenda
- Galeri
- Kontak
- Verifikasi Dokumen

---

## Admin Portal

Pusat administrasi organisasi.

Fitur utama:

- Dashboard
- CMS
- Organisasi
- Program
- Kesekretariatan
- Persuratan
- Sertifikat
- Media
- Pengguna
- Pengaturan

---

## Mobile Application

Aplikasi Android dan iOS.

Fitur utama:

- Jadwal Sholat
- Al-Qur'an
- Doa Harian
- Istighotsah
- Arah Kiblat
- Berita
- Agenda
- Sertifikat Saya

---

## REST API

Digunakan oleh:

- Mobile Application
- Integrasi sistem
- Layanan eksternal

---

## Core Services

Layanan inti yang digunakan bersama oleh seluruh aplikasi.

---

# High Level Architecture

```text id="k8m4xu"
                    PostgreSQL
                         │
                    Prisma ORM
                         │
                  Repository Layer
                         │
                   Service Layer
                         │
     ┌───────────────────┼───────────────────┐
     │                   │                   │
 Server Actions        REST API       Background Jobs
     │                   │
     ├─────────────┬─────┘
     │             │
 Admin Portal   Public Website
                   │
              Android & iOS
```

---

# Business Domains

Platform dibangun berdasarkan domain bisnis.

- Authentication
- Authorization
- CMS
- Organization
- Program
- Secretariat
- Letter
- Certificate
- Falak
- Media
- Notification
- Settings

Setiap domain dikembangkan secara independen namun saling terintegrasi.

---

# Core Principle

Seluruh modul mengikuti prinsip:

> **Satu Data, Banyak Layanan**

Data hanya dibuat satu kali dan dapat dimanfaatkan oleh berbagai modul sesuai hak akses.

Contoh:

Satu peserta Program dapat digunakan untuk:

- Surat Tugas
- Sertifikat
- Arsip
- Laporan
- Riwayat Program

tanpa melakukan input ulang.

---

# Core Applications

## Website

Media publikasi organisasi.

---

## Admin

Pusat operasional organisasi.

---

## Mobile

Layanan digital untuk masyarakat dan anggota.

---

## API

Lapisan integrasi antar aplikasi.

---

## Core Services

Layanan bisnis yang dapat digunakan bersama.

---

# Core Services

Platform memiliki layanan berikut.

- Falak Service
- Certificate Service
- Media Service
- Notification Service
- QR Verification Service

Seluruh layanan dirancang agar dapat digunakan lintas aplikasi.

---

# Target Users

## Public

Mengakses informasi dan layanan publik.

---

## Member

Mengakses layanan yang tersedia sesuai hak akses.

---

## Secretariat

Mengelola administrasi organisasi.

---

## Administrator

Mengelola sistem.

---

## Super Administrator

Mengelola seluruh platform.

---

# Project Characteristics

Platform memiliki karakteristik berikut.

- Modular
- Domain Driven
- API Ready
- Mobile Ready
- Documentation First
- Secure by Default
- Privacy by Default
- Scalable
- Maintainable

---

# Technology Overview

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend

- Server Actions
- REST API
- Prisma ORM
- PostgreSQL
- Better Auth

Mobile

- React Native
- Expo

Infrastructure

- Neon PostgreSQL
- GitHub
- GitHub Actions
- Vercel (tahap awal)

---

# Project Lifecycle

```text id="g7vb4f"
Documentation

↓

Architecture

↓

Blueprint Freeze

↓

Development

↓

Testing

↓

Deployment

↓

Maintenance

↓

Continuous Improvement
```

---

# Expected Outcomes

LIM Digital Platform diharapkan menjadi fondasi digital organisasi yang:

- Memusatkan data organisasi.
- Mendukung administrasi yang lebih efisien.
- Mempermudah publik memperoleh informasi.
- Menyediakan layanan ibadah digital.
- Mempermudah pengembangan fitur baru tanpa mengubah arsitektur utama.

---

# Project Governance

Seluruh pengembangan proyek mengikuti urutan dokumen berikut:

1. Product Vision
2. Project Overview
3. Blueprint
4. Architecture
5. Business Rules
6. Database
7. API
8. Coding Standards
9. AI Rules

Dokumen pada tingkat yang lebih rendah tidak boleh bertentangan dengan dokumen pada tingkat yang lebih tinggi.

---

# Closing

LIM Digital Platform bukan sekadar website organisasi, melainkan sebuah platform digital terintegrasi yang dirancang untuk mendukung kebutuhan organisasi saat ini dan perkembangan di masa depan.

Dengan pendekatan berbasis domain, dokumentasi yang lengkap, dan arsitektur yang konsisten, platform ini diharapkan menjadi fondasi jangka panjang bagi transformasi digital organisasi.
