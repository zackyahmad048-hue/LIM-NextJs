# ARCHITECTURE

**Project:** LIM Digital Platform

**Version:** 2.0

**Status:** Approved

**Document Type:** Software Architecture Specification

---

# Purpose

Dokumen ini mendefinisikan arsitektur resmi LIM Digital Platform.

Arsitektur menjadi fondasi seluruh implementasi sistem dan memastikan setiap aplikasi, layanan, serta modul mengikuti pola yang konsisten, aman, dan mudah dikembangkan.

Tidak ada implementasi yang boleh bertentangan dengan dokumen ini.

---

# Architecture Vision

LIM Digital Platform dibangun sebagai **Digital Organization Platform** yang terdiri dari beberapa aplikasi dengan satu fondasi data dan satu aturan bisnis.

Semua aplikasi menggunakan domain, service, dan database yang sama.

---

# Architecture Principles

Platform mengikuti prinsip berikut.

* Documentation First
* Architecture First
* Domain Driven Design
* Clean Architecture
* Service Oriented
* Repository Pattern
* API Ready
* Mobile Ready
* Security First
* Privacy by Default
* Organization First

---

# High Level Architecture


                  PostgreSQL
                       │
                  Prisma ORM
                       │
               Repository Layer
                       │
                Service Layer
                       │
        ┌──────────────┼──────────────┐
        │              │              │
 Server Actions     REST API     Background Jobs
        │              │
        ├───────┬──────┘
        │       │
   Admin     Website
               │
        Android / iOS
```

Seluruh aplikasi menggunakan business rules yang sama.

---

# Platform Components

Platform terdiri dari lima komponen utama.

## Public Website

Portal informasi organisasi.

---

## Admin Portal

Pusat administrasi organisasi.

---

## Mobile Application

Android dan iOS.

---

## REST API

Lapisan integrasi.

---

## Core Services

Layanan inti yang digunakan lintas aplikasi.

---

# Domain Architecture

Platform menggunakan pendekatan Domain Driven.


Authentication

Authorization

CMS

Organization

Program

Secretariat

Letter

Certificate

Knowledge

Falak

Media

Notification

Settings
```

Setiap domain memiliki:

* Validation
* Service
* Repository
* API
* Documentation

---

# Layer Architecture

Setiap request mengikuti alur berikut.


Presentation

↓

Action / API

↓

Service

↓

Repository

↓

Prisma

↓

Database
```

Layer tidak boleh dilewati.

---

# Presentation Layer

Bertanggung jawab terhadap:

* UI
* UX
* Form
* Table
* Layout

Presentation tidak boleh berisi business logic.

---

# Application Layer

Terdiri dari:

* Server Actions
* Route Handlers
* REST API

Layer ini bertugas menerima request dan mengembalikan response.

---

# Service Layer

Merupakan pusat seluruh Business Rules.

Contoh:

* Validasi bisnis
* Permission
* Workflow
* Duplicate checking
* Generate Certificate
* Generate Letter

---

# Repository Layer

Repository bertanggung jawab terhadap seluruh akses database.

Tidak ada query Prisma di luar Repository.

---

# Database Layer

Menggunakan:

* PostgreSQL
* Prisma ORM
* Migration
* Seeder

---

# Core Services

Platform memiliki layanan inti.

## Falak Service

* Prayer Engine
* Hijri Engine
* Qibla Engine
* Astronomy
* Hilal
* Eclipse
* Imsakiyah

---

## Certificate Service

* Generate
* Verification
* Publish

---

## Notification Service

* Email
* Push Notification
* Announcement

---

## Media Service

* Upload
* Image Processing
* Storage

---

## QR Verification Service

* Surat
* Sertifikat
* Dokumen

---

# Data Flow


User

↓

Presentation

↓

Server Action / API

↓

Service

↓

Repository

↓

Database

↓

Repository

↓

Service

↓

Response

↓

Presentation
```

---

# Authentication Flow


User

↓

Better Auth

↓

Session

↓

Authorization

↓

Application
```

---

# Module Architecture

Setiap modul mengikuti struktur berikut.


Module

↓

Validation

↓

Action / API

↓

Service

↓

Repository

↓

Database
```

---

# Mobile Architecture

Android dan iOS menggunakan REST API yang sama.


Android

↓

REST API

↓

Service

↓

Repository

↓

Database

↓

iOS
```

---

# Integration Principles

Seluruh aplikasi menggunakan:

* Database yang sama
* Business Rules yang sama
* Permission yang sama
* Audit Log yang sama

Perbedaan hanya berada pada lapisan Presentation.

---

# Scalability

Arsitektur mendukung:

* Multi Organization
* Multi Language
* Multi Region
* AI Integration
* Offline Mobile
* Queue System
* Object Storage
* Analytics
* Background Worker

Tanpa perubahan besar pada fondasi sistem.

---

# Architecture Rules

Seluruh developer dan AI wajib mematuhi aturan berikut.

* Tidak mengakses Prisma di luar Repository.
* Tidak memindahkan Business Rules ke UI.
* Tidak melewati Service Layer.
* Seluruh validasi menggunakan Zod.
* Seluruh modul mengikuti Domain Architecture.
* Dokumentasi diperbarui sebelum implementasi besar.

---

# Architecture Governance

Perubahan arsitektur hanya dapat dilakukan apabila:

* Didokumentasikan.
* Memiliki alasan teknis yang kuat.
* Tidak bertentangan dengan Blueprint.
* Disetujui sebelum implementasi.

---

# Closing

Arsitektur ini menjadi fondasi resmi LIM Digital Platform.

Seluruh aplikasi—Website, Admin Portal, Mobile, REST API, dan Core Services—dibangun di atas arsitektur yang sama agar platform tetap konsisten, aman, mudah dipelihara, dan mampu berkembang mengikuti kebutuhan organisasi dalam jangka panjang.
