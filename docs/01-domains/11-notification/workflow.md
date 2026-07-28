# Notification Workflow

**Project:** LIM Digital Platform

**Domain:** Notification

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan alur proses (Workflow) pada Domain Notification.

Workflow menjadi acuan implementasi pembuatan, antrean, pengiriman, pembacaan, retry, dan pengarsipan notifikasi.

---

# Overview

Domain Notification mengelola seluruh lifecycle notifikasi pada LIM Digital Platform.

Seluruh aktivitas mengikuti Business Rules dan dicatat pada Audit Log.

---

# Notification Lifecycle

```text id="ntfwf01"
Created

↓

Queued

↓

Processing

↓

Sent

↓

Delivered

↓

Read

↓

Archived
```

Apabila gagal:

```text id="ntfwf02"
Processing

↓

Failed

↓

Retry

↓

Sent
```

---

# Create Notification Workflow

```text id="ntfwf03"
Event Trigger

↓

Load Template

↓

Replace Variables

↓

Create Notification

↓

Queue
```

---

# Queue Workflow

```text id="ntfwf04"
Notification

↓

Queue

↓

Worker

↓

Processing

↓

Delivery
```

---

# Delivery Workflow

```text id="ntfwf05"
Processing

↓

Select Channel

↓

Email

WhatsApp

Push

SMS

In-App

↓

Delivery Log
```

---

# Read Workflow

```text id="ntfwf06"
User Opens Notification

↓

Mark As Read

↓

Update Read Time

↓

Audit Log
```

---

# Retry Workflow

```text id="ntfwf07"
Delivery Failed

↓

Retry Policy

↓

Queue Again

↓

Processing
```

Retry mengikuti konfigurasi sistem.

---

# Archive Workflow

```text id="ntfwf08"
Old Notification

↓

Archive

↓

Read Only
```

---

# Delete Workflow

```text id="ntfwf09"
Delete Request

↓

Soft Delete

↓

Audit Log
```

---

# Search Workflow

```text id="ntfwf10"
Search

↓

Filter

↓

Sort

↓

Pagination

↓

Result
```

---

# Preference Workflow

```text id="ntfwf11"
User Preference

↓

Check Enabled Channel

↓

Send Notification
```

---

# Permission Workflow

```text id="ntfwf12"
Authentication

↓

Authorization

↓

Permission Check

↓

Execute Action
```

---

# Error Workflow

```text id="ntfwf13"
Validation Failed

↓

Return Error

↓

Retry
```

---

# Workflow Rules

* Seluruh notifikasi melalui Queue.
* Template diproses sebelum pengiriman.
* Retry hanya untuk pengiriman gagal.
* Riwayat pengiriman tidak dihapus.
* Seluruh aktivitas dicatat pada Audit Log.

---

# Related Documents

* README.md
* business-rules.md
* database.md
* api.md
* permissions.md
* validation.md
* ui.md
* roadmap.md

---

# Acceptance Criteria

Workflow Notification dianggap selesai apabila:

* Seluruh notifikasi melalui Queue.
* Pengiriman mengikuti preferensi pengguna.
* Retry berjalan otomatis.
* Riwayat pengiriman tersimpan.
* Seluruh aktivitas mengikuti Business Rules dan tercatat pada Audit Log.
