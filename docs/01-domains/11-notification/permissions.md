# Notification Permissions

**Project:** LIM Digital Platform

**Domain:** Notification

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan hak akses (Permission) pada Domain Notification.

Permission digunakan untuk mengatur akses terhadap seluruh proses pembuatan, pengiriman, antrean, template, preferensi, dan arsip notifikasi menggunakan Role Based Access Control (RBAC).

---

# Permission Model

Domain Notification menggunakan RBAC.

```text id="ntfpm01"
User

↓

Role

↓

Permission

↓

Notification Module
```

Permission diberikan kepada **Role**, bukan langsung kepada User.

---

# Permission Naming Standard

Format:

```text id="ntfpm02"
notification.resource.action
```

Contoh:

```text id="ntfpm03"
notification.view

notification.send

notification.template.create
```

---

# Notification Permissions

| Permission           | Description               |
| -------------------- | ------------------------- |
| notification.view    | Melihat notifikasi        |
| notification.create  | Membuat notifikasi        |
| notification.update  | Mengubah notifikasi       |
| notification.delete  | Menghapus notifikasi      |
| notification.send    | Mengirim notifikasi       |
| notification.retry   | Mengirim ulang notifikasi |
| notification.read    | Menandai sebagai dibaca   |
| notification.archive | Mengarsipkan notifikasi   |
| notification.restore | Memulihkan notifikasi     |

---

# Template Permissions

| Permission                   | Description        |
| ---------------------------- | ------------------ |
| notification.template.view   | Melihat template   |
| notification.template.create | Membuat template   |
| notification.template.update | Mengubah template  |
| notification.template.delete | Menghapus template |

---

# Queue Permissions

| Permission               | Description     |
| ------------------------ | --------------- |
| notification.queue.view  | Melihat antrean |
| notification.queue.retry | Retry antrean   |

---

# Delivery Permissions

| Permission                 | Description                |
| -------------------------- | -------------------------- |
| notification.delivery.view | Melihat riwayat pengiriman |

---

# Preference Permissions

| Permission                     | Description         |
| ------------------------------ | ------------------- |
| notification.preference.view   | Melihat preferensi  |
| notification.preference.update | Mengubah preferensi |

---

# Role Matrix

| Permission          | Super Admin | Admin | Operator | User |
| ------------------- | :---------: | :---: | :------: | :--: |
| View                |     ✅      |  ✅   |    ✅    |  ✅  |
| Create              |     ✅      |  ✅   |    ✅    |  ❌  |
| Update              |     ✅      |  ✅   |    ✅    |  ❌  |
| Delete              |     ✅      |  ❌   |    ❌    |  ❌  |
| Send                |     ✅      |  ✅   |    ✅    |  ❌  |
| Retry               |     ✅      |  ✅   |    ✅    |  ❌  |
| Read                |     ✅      |  ✅   |    ✅    |  ✅  |
| Archive             |     ✅      |  ✅   |    ❌    |  ❌  |
| Restore             |     ✅      |  ✅   |    ❌    |  ❌  |
| Template Management |     ✅      |  ✅   |    ✅    |  ❌  |
| Queue Management    |     ✅      |  ✅   |    ✅    |  ❌  |

---

# Menu Authorization

Menu **Notification** hanya ditampilkan apabila pengguna memiliki:

```text id="ntfpm04"
notification.view
```

---

# Action Authorization

| Action               | Permission                     |
| -------------------- | ------------------------------ |
| Create Notification  | notification.create            |
| Send Notification    | notification.send              |
| Retry Notification   | notification.retry             |
| Mark As Read         | notification.read              |
| Archive Notification | notification.archive           |
| Restore Notification | notification.restore           |
| Manage Template      | notification.template.update   |
| Retry Queue          | notification.queue.retry       |
| Update Preference    | notification.preference.update |

---

# Business Rules

- Authentication wajib dilakukan.
- Permission diperiksa pada setiap request.
- Pengguna tanpa permission menerima HTTP 403 Forbidden.
- Tombol aksi mengikuti permission pengguna.
- Pengguna hanya dapat mengubah preferensi notifikasi miliknya sendiri.

---

# Security Rules

- Permission tidak boleh dilewati.
- Pemeriksaan dilakukan pada Service Layer.
- Seluruh aktivitas dicatat pada Audit Log.
- Hak akses mengikuti prinsip Least Privilege.

---

# Future Permissions

```text id="ntfpm05"
notification.export

notification.import

notification.broadcast

notification.analytics

notification.schedule
```

---

# Related Documents

- README.md
- business-rules.md
- workflow.md
- database.md
- api.md
- validation.md
- ui.md
- roadmap.md

---

# Acceptance Criteria

- Seluruh fitur memiliki permission.
- Permission diterapkan pada UI dan API.
- Menu mengikuti Role pengguna.
- Aksi tanpa permission ditolak.
- Seluruh hak akses mengikuti standar RBAC.
