# Notification Database

**Project:** LIM Digital Platform

**Domain:** Notification

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan struktur database pada Domain Notification.

Domain Notification menyimpan data notifikasi, template, queue, riwayat pengiriman, preferensi pengguna, dan arsip notifikasi.

---

# Overview

Domain Notification merupakan layanan terpusat untuk seluruh proses pengiriman notifikasi.

Seluruh domain mengirim notifikasi melalui Domain Notification.

---

# Entity Relationship

```text id="ntfdb01"
Notification
      │
      ├─────────────┬──────────────┬─────────────┐
      ▼             ▼              ▼             ▼
Template        Queue        Delivery Log    Archive
      │
      ▼
User Preference
```

---

# Main Tables

## notification

Menyimpan data utama notifikasi.

| Field      | Type      | Description  |
| ---------- | --------- | ------------ |
| id         | UUID      | Primary Key  |
| userId     | UUID      | Penerima     |
| templateId | UUID      | Template     |
| title      | String    | Judul        |
| message    | Text      | Isi          |
| channel    | Enum      | Kanal        |
| type       | Enum      | Jenis        |
| status     | Enum      | Status       |
| readAt     | Timestamp | Waktu Dibaca |
| createdAt  | Timestamp | Dibuat       |
| updatedAt  | Timestamp | Diubah       |
| deletedAt  | Timestamp | Soft Delete  |

---

## notification_template

Template notifikasi.

| Field   | Type   |
| ------- | ------ |
| id      | UUID   |
| code    | String |
| name    | String |
| subject | String |
| content | Text   |
| channel | Enum   |
| status  | Enum   |

---

## notification_queue

Antrean pengiriman.

| Field          | Type      |
| -------------- | --------- |
| id             | UUID      |
| notificationId | UUID      |
| status         | Enum      |
| retryCount     | Integer   |
| scheduledAt    | Timestamp |
| processedAt    | Timestamp |

---

## notification_delivery

Riwayat pengiriman.

| Field          | Type      |
| -------------- | --------- |
| id             | UUID      |
| notificationId | UUID      |
| channel        | Enum      |
| recipient      | String    |
| deliveredAt    | Timestamp |
| status         | Enum      |
| response       | Text      |

---

## notification_preference

Preferensi pengguna.

| Field           | Type    |
| --------------- | ------- |
| id              | UUID    |
| userId          | UUID    |
| emailEnabled    | Boolean |
| whatsappEnabled | Boolean |
| pushEnabled     | Boolean |
| smsEnabled      | Boolean |

---

## notification_archive

Arsip notifikasi.

| Field          | Type      |
| -------------- | --------- |
| id             | UUID      |
| notificationId | UUID      |
| archivedBy     | UUID      |
| archivedAt     | Timestamp |

---

# Relationships

| Source       | Relation | Target                  |
| ------------ | -------- | ----------------------- |
| User         | 1 : N    | Notification            |
| Template     | 1 : N    | Notification            |
| Notification | 1 : 1    | Queue                   |
| Notification | 1 : N    | Delivery                |
| Notification | 1 : 1    | Archive                 |
| User         | 1 : 1    | Notification Preference |

---

# Indexes

```text id="ntfdb02"
notification.userId

notification.status

notification.type

notification.createdAt

notification_queue.status

notification_template.code
```

---

# Constraints

## Notification

* userId wajib.
* channel wajib.
* type wajib.

---

## Queue

* notificationId wajib.
* retryCount ≥ 0.

---

## Template

* code wajib unik.

---

## Preference

* userId wajib unik.

---

# Soft Delete

Menggunakan Soft Delete:

* notification
* notification_template

Queue, Delivery, Preference, dan Archive bersifat permanen.

---

# Status Enum

## Notification

```text id="ntfdb03"
Created

Queued

Processing

Sent

Delivered

Read

Failed

Archived
```

---

## Channel Enum

```text id="ntfdb04"
InApp

Email

WhatsApp

Push

SMS
```

---

# Database Rules

* Seluruh notifikasi menggunakan Template.
* Pengiriman melalui Queue.
* Riwayat Delivery tidak dihapus.
* User Preference menentukan channel aktif.
* Seluruh akses database menggunakan Repository Pattern.

---

# Future Tables

```text id="ntfdb05"
notification_batch

notification_schedule

notification_webhook

notification_device

notification_metrics
```

---

# Related Documents

* README.md
* business-rules.md
* workflow.md
* api.md
* permissions.md
* validation.md
* ui.md
* roadmap.md

---

# Acceptance Criteria

* Struktur database mendukung seluruh lifecycle notifikasi.
* Queue dan Delivery terpisah.
* Preferensi pengguna tersimpan.
* Riwayat pengiriman permanen.
* Seluruh akses database menggunakan Repository Pattern.
