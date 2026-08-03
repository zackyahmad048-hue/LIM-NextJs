# Notification Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `notification-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Notification Domain**.

Notification Domain bertanggung jawab mengelola seluruh pengiriman notifikasi pada LIM Digital Platform. Domain ini menjadi layanan terpusat (_Centralized Notification Service_) yang menerima Domain Event dari berbagai domain dan mengirimkan notifikasi melalui berbagai channel.

Domain ini mengimplementasikan **ADR-007 Notification Architecture**.

---

# Objectives

Notification harus mampu:

- Mengirim Email.
- Mengirim Push Notification.
- Mengelola In-App Notification.
- Mengelola Template Notification.
- Mengelola Delivery Queue.
- Retry Notification.
- Melacak Status Pengiriman.

---

# Actors

| Actor               | Description                        |
| ------------------- | ---------------------------------- |
| System              | Menghasilkan Domain Event          |
| Administrator       | Mengelola Template dan Konfigurasi |
| User                | Menerima Notification              |
| Notification Worker | Memproses Queue                    |

---

# Functional Requirements

## Notification Queue

Mengelola:

- Queue Notification
- Retry Queue
- Failed Queue
- Processing Queue

---

## Channel Management

Channel yang didukung:

- Email
- In-App Notification
- Push Notification

Roadmap:

- WhatsApp
- SMS
- Telegram
- Slack

---

## Template Management

Template mendukung:

- HTML
- Plain Text
- Placeholder
- Localization
- Versioning

---

## Delivery Tracking

Status:

- Queued
- Processing
- Sent
- Delivered
- Failed
- Cancelled

---

## Retry Mechanism

Retry menggunakan:

- Exponential Backoff
- Maximum Retry Count
- Failed Queue

---

# Non Functional Requirements

Notification harus:

- Asynchronous.
- Highly Available.
- Audit Enabled.
- Horizontal Scalable.
- Mendukung ribuan notifikasi per jam.

---

# Preconditions

- Domain Event diterima.
- Recipient valid.
- Template tersedia.

---

# Postconditions

- Notification dikirim.
- Delivery Status diperbarui.
- Audit Log dibuat.
- Delivery Event diterbitkan.

---

# Main Flow

```text id="notif01"
Domain Event

↓

Notification Service

↓

Template Engine

↓

Queue

↓

Worker

↓

Channel Adapter

↓

Recipient

↓

Update Status
```

---

# Alternative Flow

```text id="notif02"
Delivery Failed

↓

Retry Queue

↓

Retry

↓

Delivered
```

---

# Exception Flow

- Recipient tidak ditemukan.
- Template tidak ditemukan.
- SMTP gagal.
- Push Provider gagal.
- Retry melebihi batas.

---

# Sequence Diagram

```text id="notif03"
Domain Event

↓

Notification API

↓

Queue

↓

Worker

↓

Channel Adapter

↓

Recipient
```

---

# State Diagram

```text id="notif04"
Queued

↓

Processing

↓

Sent

↓

Delivered

↓

Failed

↓

Cancelled
```

---

# Domain Model

Entity:

- Notification
- NotificationTemplate
- DeliveryLog

Aggregate:

- Notification

Value Object:

- Recipient
- NotificationChannel
- DeliveryStatus

---

# Database Mapping

Tables:

```text id="notif05"
notifications

notification_templates

notification_deliveries
```

---

# API Specification

| Method | Endpoint                         |
| ------ | -------------------------------- |
| GET    | /api/v1/notifications            |
| GET    | /api/v1/notifications/{id}       |
| POST   | /api/v1/notifications/send       |
| PATCH  | /api/v1/notifications/{id}/retry |
| GET    | /api/v1/notification-templates   |

---

# Validation Matrix

| Field      | Rule     |
| ---------- | -------- |
| recipient  | Required |
| channel    | Required |
| templateId | Required |
| payload    | Required |

---

# Permission Matrix

| Action          | Admin | User | System |
| --------------- | :---: | :--: | :----: |
| View            |  ✅   | Own  |   ✅   |
| Send            |  ✅   |  ❌  |   ✅   |
| Retry           |  ✅   |  ❌  |   ✅   |
| Manage Template |  ✅   |  ❌  |   ❌   |

---

# Error Catalog

| Code      | Description          |
| --------- | -------------------- |
| NOTIF_001 | Recipient Not Found  |
| NOTIF_002 | Template Not Found   |
| NOTIF_003 | Invalid Channel      |
| NOTIF_004 | Delivery Failed      |
| NOTIF_005 | Retry Limit Exceeded |
| NOTIF_006 | Queue Unavailable    |

---

# Notification Matrix

| Event                | Channel       |
| -------------------- | ------------- |
| Login Alert          | Email         |
| Program Published    | Email, Push   |
| Registration Success | Email         |
| Letter Approved      | In-App, Email |
| Certificate Issued   | Email, Push   |
| Password Changed     | Email         |

---

# Domain Events

```text id="notif06"
NotificationQueued

NotificationSent

NotificationDelivered

NotificationFailed

NotificationRetried

NotificationCancelled
```

---

# Acceptance Test

- Notification berhasil di-queue.
- Email berhasil dikirim.
- Push Notification berhasil dikirim.
- Retry berjalan saat pengiriman gagal.
- Delivery Status diperbarui.
- Audit Log tercatat.
- Domain Event diterbitkan.

---

# Performance Requirement

- Queue Processing < 100 ms.
- Email Dispatch < 2 detik.
- Push Dispatch < 1 detik.
- Retry Processing < 5 detik.

---

# Security Requirement

- RBAC diterapkan.
- Template hanya dapat diubah Administrator.
- Recipient divalidasi.
- Secret SMTP dan Push Provider dikelola melalui Secret Manager.
- Audit Log aktif.
- Seluruh komunikasi menggunakan HTTPS/TLS.

---

# Acceptance Criteria

- Seluruh Notification diproses secara asynchronous.
- Multi-channel Notification berjalan sesuai konfigurasi.
- Retry dan Delivery Tracking berfungsi.
- Domain Event dan Audit Log aktif.
- Specification siap digunakan sebagai dasar implementasi Notification Domain.
