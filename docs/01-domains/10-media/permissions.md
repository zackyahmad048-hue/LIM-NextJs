# Media Permissions

**Project:** LIM Digital Platform

**Domain:** Media

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan hak akses (Permission) pada Domain Media.

Permission digunakan untuk mengatur akses terhadap seluruh proses upload, download, pengelolaan folder, thumbnail, arsip, dan metadata menggunakan Role Based Access Control (RBAC).

---

# Permission Model

Domain Media menggunakan RBAC.

```text id="medpm01"
User

↓

Role

↓

Permission

↓

Media Module
```

Permission diberikan kepada **Role**, bukan langsung kepada User.

---

# Permission Naming Standard

Format:

```text id="medpm02"
media.resource.action
```

Contoh:

```text id="medpm03"
media.view

media.upload

media.download
```

---

# Media Permissions

| Permission     | Description       |
| -------------- | ----------------- |
| media.view     | Melihat media     |
| media.upload   | Upload file       |
| media.update   | Mengubah metadata |
| media.delete   | Menghapus file    |
| media.download | Download file     |
| media.preview  | Preview file      |
| media.archive  | Mengarsipkan file |
| media.restore  | Memulihkan file   |

---

# Folder Permissions

| Permission          | Description      |
| ------------------- | ---------------- |
| media.folder.view   | Melihat folder   |
| media.folder.create | Membuat folder   |
| media.folder.update | Mengubah folder  |
| media.folder.delete | Menghapus folder |

---

# Thumbnail Permissions

| Permission               | Description        |
| ------------------------ | ------------------ |
| media.thumbnail.view     | Melihat thumbnail  |
| media.thumbnail.generate | Generate thumbnail |

---

# Reference Permissions

| Permission           | Description            |
| -------------------- | ---------------------- |
| media.reference.view | Melihat referensi file |

---

# Role Matrix

| Permission        | Super Admin | Admin | Operator | User |
| ----------------- | :---------: | :---: | :------: | :--: |
| View              |      ✅      |   ✅   |     ✅    |   ✅  |
| Upload            |      ✅      |   ✅   |     ✅    |   ✅  |
| Update            |      ✅      |   ✅   |     ✅    |   ❌  |
| Delete            |      ✅      |   ❌   |     ❌    |   ❌  |
| Download          |      ✅      |   ✅   |     ✅    |   ✅  |
| Preview           |      ✅      |   ✅   |     ✅    |   ✅  |
| Archive           |      ✅      |   ✅   |     ❌    |   ❌  |
| Restore           |      ✅      |   ✅   |     ❌    |   ❌  |
| Folder Management |      ✅      |   ✅   |     ✅    |   ❌  |

---

# Menu Authorization

Menu **Media** hanya ditampilkan apabila pengguna memiliki:

```text id="medpm04"
media.view
```

---

# Action Authorization

| Action             | Permission               |
| ------------------ | ------------------------ |
| Upload File        | media.upload             |
| Download File      | media.download           |
| Preview File       | media.preview            |
| Update Metadata    | media.update             |
| Archive File       | media.archive            |
| Restore File       | media.restore            |
| Create Folder      | media.folder.create      |
| Generate Thumbnail | media.thumbnail.generate |

---

# Business Rules

* Authentication wajib dilakukan.
* Permission diperiksa pada setiap request.
* Pengguna tanpa permission menerima HTTP 403 Forbidden.
* Tombol aksi mengikuti permission pengguna.
* File Public tetap mengikuti kebijakan akses sistem.

---

# Security Rules

* Permission tidak boleh dilewati.
* Pemeriksaan dilakukan pada Service Layer.
* Seluruh aktivitas dicatat pada Audit Log.
* Hak akses mengikuti prinsip Least Privilege.

---

# Future Permissions

```text id="medpm05"
media.export

media.import

media.share

media.processing

media.analytics
```

---

# Related Documents

* README.md
* business-rules.md
* workflow.md
* database.md
* api.md
* validation.md
* ui.md
* roadmap.md

---

# Acceptance Criteria

* Seluruh fitur memiliki permission.
* Permission diterapkan pada UI dan API.
* Menu mengikuti Role pengguna.
* Aksi tanpa permission ditolak.
* Seluruh hak akses mengikuti standar RBAC.
