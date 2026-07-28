# ADR-007: Notification Architecture

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Accepted

**Date:** 2026-07-14

---

# Context

LIM Digital Platform mengirim berbagai jenis notifikasi, seperti:

* Login Alert
* Program Update
* Letter Approval
* Certificate Issued
* Knowledge Published
* Prayer Time Reminder
* System Announcement

Notifikasi perlu dikirim melalui berbagai kanal (Email, Push Notification, WhatsApp, dan lainnya).

Apabila setiap Domain mengimplementasikan pengiriman notifikasi sendiri, akan terjadi:

* Duplikasi kode.
* Tight Coupling.
* Sulit menambah channel baru.
* Sulit melakukan monitoring dan retry.

Diperlukan arsitektur notifikasi yang terpusat dan mudah dikembangkan.

---

# Decision

LIM Digital Platform menggunakan **Notification Domain** sebagai layanan terpusat untuk seluruh proses pengiriman notifikasi.

Seluruh Domain hanya menerbitkan **Domain Event**, sedangkan Notification Domain bertanggung jawab:

* Menentukan Channel.
* Menyusun Payload.
* Mengirim Notifikasi.
* Retry jika gagal.
* Mencatat Audit.

---

# Rationale

Pendekatan ini dipilih karena:

* Loose Coupling.
* Reusable.
* Mudah menambah channel baru.
* Mendukung asynchronous processing.
* Mendukung monitoring delivery.

---

# Architecture

```text id="adr00701"
Business Action

↓

Domain Event

↓

Notification Service

↓

Channel Adapter

↓

Recipient
```

---

# Supported Channels

Versi awal:

```text id="adr00702"
Email

In-App Notification

Push Notification
```

Roadmap:

```text id="adr00703"
WhatsApp

SMS

Telegram

Microsoft Teams

Slack
```

---

# Notification Flow

```text id="adr00704"
ProgramCreated

↓

ProgramCreated Event

↓

Notification Service

↓

Template Engine

↓

Email Adapter

↓

Recipient
```

---

# Channel Adapter

Setiap channel diimplementasikan menggunakan Adapter.

Contoh:

```text id="adr00705"
NotificationPort

↓

EmailAdapter

↓

PushAdapter

↓

WhatsAppAdapter
```

Domain tidak mengetahui implementasi channel.

---

# Template Strategy

Template dipisahkan dari Business Logic.

Template dapat berupa:

* HTML Email
* Plain Text
* Push Payload
* WhatsApp Template

Template mendukung:

* Placeholder
* Localization
* Versioning

---

# Retry Strategy

Apabila pengiriman gagal:

```text id="adr00706"
Send

↓

Failed

↓

Retry

↓

Retry Queue

↓

Dead Letter Queue (Future)
```

Retry menggunakan **Exponential Backoff**.

---

# Delivery Status

Status yang didukung:

```text id="adr00707"
Queued

Processing

Sent

Delivered

Failed

Cancelled
```

---

# Alternatives Considered

## Direct Notification

```text id="adr00708"
Program

↓

SMTP
```

Kelebihan:

* Mudah.

Kekurangan:

* Tight Coupling.
* Sulit menambah channel.

---

## Third-Party Notification Platform

Kelebihan:

* Cepat.

Kekurangan:

* Vendor Lock-in.
* Biaya tambahan.
* Kontrol terbatas.

---

## Dedicated Notification Domain (Chosen)

Kelebihan:

* Modular.
* Fleksibel.
* Mudah dikembangkan.

Kekurangan:

* Menambah satu Domain baru yang harus dipelihara.

---

# Consequences

Keuntungan:

* Pengiriman notifikasi terpusat.
* Mendukung Multi Channel.
* Monitoring lebih mudah.
* Retry terstandarisasi.
* Mudah menambah provider baru.

Konsekuensi:

* Memerlukan Queue.
* Membutuhkan Template Management.
* Monitoring Delivery menjadi bagian penting operasional.

---

# Related Decisions

* ADR-005 Event Driven Architecture
* ADR-006 Storage Strategy
* ADR-010 Audit Log

---

# References

* Enterprise Integration Patterns
* Architecture Documentation (`01-domains/notification/`)
* Architecture Documentation (`02-architecture/event-driven.md`)

---

# Status

**Accepted**

---

# Acceptance Criteria

* Seluruh notifikasi dikirim melalui Notification Domain.
* Domain tidak mengirim notifikasi secara langsung.
* Seluruh Channel menggunakan Adapter.
* Retry dan Delivery Status terdokumentasi.
* Notification Architecture menjadi standar pengiriman notifikasi LIM Digital Platform.
