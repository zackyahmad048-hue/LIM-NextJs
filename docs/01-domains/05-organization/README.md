# Organization

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 2.0

**Status:** Draft

---

# Overview

Domain Organization bertanggung jawab mengelola data kepengurusan organisasi LIM berdasarkan AD/ART.

Domain ini menjadi sumber data utama (Single Source of Truth) untuk seluruh informasi kepengurusan yang digunakan oleh domain lain.

---

# Objectives

- Mengelola profil organisasi.
- Mengelola data cabang (kabupaten/kota).
- Mengelola Pengurus Pusat (Central Board).
- Mengelola Pengurus Wilayah (Regional Board — tingkat provinsi).
- Mengelola Pengurus Cabang (Branch Board — tingkat kabupaten/kota).
- Mengelola data Anggota.
- Menjadi referensi seluruh domain.

---

# Scope

Domain ini mencakup:

- Organization Profile
- Branch
- Central Board (Pengurus Pusat)
- Regional Board (Pengurus Wilayah)
- Branch Board (Pengurus Cabang)
- Member (Anggota)

---

# Actors

- Super Administrator
- Administrator
- Sekretariat

---

# Responsibilities

Domain Organization bertanggung jawab terhadap:

- Profil organisasi.
- Data cabang.
- Data Pengurus Pusat.
- Data Pengurus Wilayah.
- Data Pengurus Cabang.
- Data Anggota.
- Periode kepengurusan tetap (2024–2029).

---

# Dependencies

Menggunakan:

- Authentication
- Authorization

Digunakan oleh:

- Program
- Secretariat
- Letter
- Certificate
- Notification

---

# Features

- Organization Profile
- Branch Management
- Central Board Management
- Regional Board Management
- Branch Board Management
- Member Management

---

# Related Documents

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

Core Domain

---

# Status

Active