# Notification UI

**Project:** LIM Digital Platform

**Domain:** Notification

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar antarmuka pengguna (UI) pada Domain Notification.

UI digunakan untuk mengelola notifikasi, template, antrean, riwayat pengiriman, preferensi pengguna, dan arsip notifikasi.

---

# Navigation

```text id="ntfui01"
Notification
├── Dashboard
├── Notifications
├── Templates
├── Queue
├── Delivery History
├── User Preferences
└── Archive
```

---

# Dashboard

Menampilkan:

- Total Notifications
- Pending Queue
- Processing
- Delivered
- Failed
- Read
- Recent Activity

---

# Notification List

Kolom:

- Title
- Recipient
- Type
- Channel
- Status
- Created At

Action:

- View
- Retry
- Archive
- Delete

Fitur:

- Search
- Filter
- Sorting
- Pagination

---

# Notification Form

Field:

```text id="ntfui02"
Recipient

Template

Channel

Title

Message

Schedule (Optional)
```

Action:

- Send
- Save Draft

---

# Template

Kolom:

- Code
- Template Name
- Channel
- Status

Action:

- Create
- Edit
- Delete

---

# Queue

Kolom:

- Notification
- Channel
- Status
- Retry Count
- Scheduled At

Action:

- Retry
- Cancel

---

# Delivery History

Kolom:

- Recipient
- Channel
- Delivery Status
- Delivered At

Action:

- View Detail

---

# User Preferences

Field:

- Email Notification
- WhatsApp Notification
- Push Notification
- SMS Notification

Action:

- Save Preference

---

# Archive

Read Only.

Kolom:

- Notification
- Archived At
- Archived By

Action:

- View
- Restore

---

# Components

- Data Table
- Search Box
- Filter Panel
- Badge
- Rich Text Editor
- Modal
- Dialog
- Toast
- Pagination
- Queue Status Indicator

---

# States

- Empty State
- Loading State
- Processing State
- Error State

---

# Responsive

- Desktop
- Tablet
- Mobile

---

# Acceptance Criteria

- UI konsisten.
- Responsive.
- Mengikuti Design System.
- Status Queue tampil real-time.
- Seluruh aksi mengikuti Permission.
