# System Context

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan posisi LIM Digital Platform dalam ekosistem sistem informasi, aktor yang berinteraksi, serta integrasi dengan layanan eksternal.

System Context memberikan gambaran batas sistem (System Boundary), hubungan antar aktor, dan dependensi terhadap sistem lain.

---

# Overview

LIM Digital Platform merupakan sistem terintegrasi yang mengelola layanan administrasi, program, persuratan, sertifikat, media, pengetahuan, notifikasi, dan layanan Falak.

Platform ini menjadi pusat layanan digital organisasi.

---

# System Context Diagram

```text id="ctx01"
                    +----------------------+
                    |     Administrator    |
                    +----------+-----------+
                               |
                               |
+-------------+        +--------v--------+        +--------------+
| Public User |------->| LIM Digital     |<-------| Internal User|
+-------------+        | Platform        |        +--------------+
                       +--------+--------+
                                |
       +------------------------+------------------------+
       |            |            |            |          |
       v            v            v            v          v
 Authentication  Storage   Notification  Email/API  External Services
```

---

# Primary Actors

## Super Administrator

Bertanggung jawab terhadap:

* Konfigurasi sistem.
* Manajemen pengguna.
* Pengaturan keamanan.
* Monitoring.

---

## Administrator

Bertanggung jawab terhadap:

* Operasional sistem.
* Pengelolaan data.
* Validasi proses bisnis.

---

## Internal User

Menggunakan sistem untuk:

* Program
* Persuratan
* Sertifikat
* Knowledge
* Dashboard

---

## Public User

Mengakses layanan publik seperti:

* Jadwal Salat
* Kalender Hijriah
* Arah Kiblat
* Informasi Organisasi
* Artikel Publik

---

# External Systems

Platform dapat berintegrasi dengan:

* SMTP Server
* WhatsApp Gateway
* Firebase Cloud Messaging
* Object Storage
* OAuth Provider
* reCAPTCHA
* GIS/Maps Service
* NTP Time Service

---

# Internal Modules

```text id="ctx02"
Authentication

Authorization

Organization

Dashboard

CMS

Program

Secretariat

Letter

Certificate

Media

Notification

Settings

Knowledge

Falak
```

---

# System Boundary

Di dalam boundary sistem:

* Business Logic
* REST API
* Database
* File Storage
* Queue
* Audit Log
* Background Worker

Di luar boundary sistem:

* Email Server
* WhatsApp API
* Cloud Storage
* Identity Provider
* Browser
* Mobile Application

---

# Communication

Komunikasi internal:

* Service-to-Service (Module Call)
* Domain Event
* Repository

Komunikasi eksternal:

* HTTPS REST API
* Webhook
* SMTP
* Push Notification

---

# Data Ownership

Setiap domain memiliki kepemilikan data masing-masing.

Contoh:

| Domain       | Data Owner        |
| ------------ | ----------------- |
| Organization | Organization Data |
| Program      | Program Data      |
| Letter       | Letter Data       |
| Certificate  | Certificate Data  |
| Knowledge    | Knowledge Base    |
| Falak        | Astronomy Data    |

Akses data domain lain hanya melalui Service/API yang disediakan.

---

# Security Context

Seluruh akses sistem menggunakan:

* Authentication
* Authorization
* RBAC
* HTTPS
* Audit Log
* Input Validation

---

# Scalability

Arsitektur dirancang agar mendukung:

* Modular Monolith
* Migrasi ke Microservices di masa depan
* Horizontal Scaling
* Background Job Processing
* Distributed Cache

---

# Related Documents

* README.md
* architecture-overview.md
* domain-map.md
* bounded-context.md
* clean-architecture.md
* hexagonal-architecture.md
* cqrs.md
* event-driven.md
* folder-structure.md
* dependency-rules.md

---

# Acceptance Criteria

* Batas sistem terdokumentasi.
* Aktor dan layanan eksternal teridentifikasi.
* Kepemilikan data antar domain jelas.
* Integrasi internal dan eksternal terdokumentasi.
* Menjadi acuan integrasi sistem secara keseluruhan.
