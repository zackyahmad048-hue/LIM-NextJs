# Dashboard

**Project:** LIM Digital Platform

**Domain:** Dashboard

**Version:** 1.0

**Status:** Approved

---

# Overview

Dashboard merupakan halaman utama setelah pengguna berhasil melakukan login.

Domain ini berfungsi sebagai pusat informasi (Information Hub) yang menampilkan ringkasan data, statistik, aktivitas terbaru, dan akses cepat ke modul yang dapat diakses oleh pengguna.

Dashboard tidak mengelola data bisnis secara langsung. Seluruh data yang ditampilkan berasal dari domain lain sesuai hak akses pengguna.

---

# Objectives

Tujuan utama Domain Dashboard adalah:

- Menampilkan informasi penting secara ringkas.
- Memberikan akses cepat ke modul utama.
- Menyajikan statistik yang relevan.
- Menampilkan aktivitas terbaru.
- Membantu pengguna memahami kondisi sistem setelah login.

---

# Scope

Domain Dashboard mencakup:

- Dashboard Home
- Statistics
- Quick Access
- Recent Activities
- Announcements
- System Information

Domain Dashboard tidak mencakup:

- CRUD Data
- Pengelolaan Program
- Pengelolaan Surat
- Pengelolaan Sertifikat
- Pengelolaan Konten

---

# Actors

Domain Dashboard digunakan oleh:

- Super Administrator
- Administrator
- Operator
- User

Informasi yang ditampilkan menyesuaikan Role dan Permission masing-masing pengguna.

---

# Responsibilities

Domain Dashboard bertanggung jawab untuk:

- Menampilkan ringkasan informasi.
- Menampilkan statistik sistem.
- Menampilkan shortcut menuju modul.
- Menampilkan aktivitas terbaru.
- Menampilkan informasi sistem sesuai hak akses.

Dashboard bukan sumber data utama dan tidak memiliki Business Rules yang mengubah data.

---

# Dependencies

Dashboard menggunakan data dari domain berikut:

- Authentication
- Authorization
- CMS
- Organization
- Program
- Secretariat
- Letter
- Certificate
- Media
- Notification
- Settings

Dashboard tidak menjadi dependency bagi domain lain.

---

# Features

Fitur utama Dashboard:

- Welcome Card
- Statistics Card
- Quick Access
- Recent Activities
- Announcement Panel
- System Information

---

# Related Documents

Dokumen yang berkaitan dengan Domain Dashboard:

- business-rules.md
- workflow.md
- database.md
- api.md
- permissions.md
- validation.md
- ui.md
- roadmap.md

---

# Ownership

Domain Dashboard dikelola sebagai bagian dari Core Platform.

Seluruh perubahan pada domain ini harus mengikuti Blueprint, Business Rules, dan Coding Standards yang berlaku.

---

# Status

**Status:** Active

Domain Dashboard merupakan domain inti dan menjadi halaman pertama yang diakses pengguna setelah proses autentikasi berhasil.
