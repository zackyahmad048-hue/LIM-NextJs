# Notification

**Project:** LIM Digital Platform

**Domain:** Notification

**Version:** 1.0

**Status:** Approved

---

# Overview

Domain Notification bertanggung jawab mengelola seluruh pengiriman notifikasi pada LIM Digital Platform.

Domain ini menjadi layanan terpusat untuk mengirim pemberitahuan kepada pengguna melalui berbagai kanal seperti In-App Notification, Email, WhatsApp, Push Notification, dan SMS.

Notification merupakan **Shared Domain** yang digunakan oleh seluruh modul dalam sistem.

---

# Objectives

Domain Notification bertujuan untuk:

- Mengelola pengiriman notifikasi.
- Mengelola template notifikasi.
- Mengelola antrean (queue) pengiriman.
- Mengelola status pengiriman.
- Mengelola preferensi notifikasi pengguna.
- Mendukung pengiriman multi-channel.

---

# Scope

Domain Notification mencakup:

- In-App Notification
- Email Notification
- WhatsApp Notification
- Push Notification
- SMS Notification
- Notification Template
- Notification Queue
- Notification History

---

# Actors

Domain Notification digunakan oleh:

- Super Administrator
- Administrator
- Seluruh Domain Internal
- End User

Pengguna menerima notifikasi sesuai hak akses dan preferensi masing-masing.

---

# Responsibilities

Domain Notification bertanggung jawab untuk:

- Mengirim notifikasi.
- Mengelola template pesan.
- Mengelola antrean pengiriman.
- Mencatat riwayat pengiriman.
- Mengelola status notifikasi.
- Mengelola preferensi pengguna.

---

# Dependencies

Menggunakan data dari:

- Authentication
- Authorization
- Organization
- Media

Digunakan oleh:

- CMS
- Program
- Secretariat
- Letter
- Certificate
- Knowledge
- Settings
- Falak

---

# Features

- In-App Notification
- Email Notification
- WhatsApp Notification
- Push Notification
- SMS Notification
- Notification Template
- Notification Queue
- Delivery History

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

Shared Domain

Domain Notification merupakan layanan bersama yang menangani seluruh proses pengiriman notifikasi pada LIM Digital Platform.

---

# Status

**Status:** Active
