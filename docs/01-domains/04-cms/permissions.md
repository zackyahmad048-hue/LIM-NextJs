# CMS Permissions

**Project:** LIM Digital Platform

**Domain:** Content Management System (CMS)

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan hak akses (Permission) yang digunakan oleh Domain CMS.

Permission menjadi dasar pengendalian akses terhadap seluruh fitur Content Management System dan diterapkan menggunakan Role Based Access Control (RBAC).

---

# Permission Model

CMS menggunakan model:

```text
User
    │
    ▼
Role
    │
    ▼
Permission
    │
    ▼
CMS Feature
```

Permission diberikan kepada **Role**, bukan langsung kepada User.

---

# Permission Naming

Format permission menggunakan pola:

```text
resource.action
```

Contoh:

```text
cms.post.create

cms.page.update

cms.category.delete
```

---

# Post Permissions

| Permission       | Description          |
| ---------------- | -------------------- |
| cms.post.view    | Melihat daftar Post  |
| cms.post.create  | Membuat Post         |
| cms.post.update  | Mengubah Post        |
| cms.post.delete  | Menghapus Post       |
| cms.post.publish | Mempublikasikan Post |
| cms.post.archive | Mengarsipkan Post    |
| cms.post.restore | Memulihkan Post      |

---

# Page Permissions

| Permission       | Description          |
| ---------------- | -------------------- |
| cms.page.view    | Melihat daftar Page  |
| cms.page.create  | Membuat Page         |
| cms.page.update  | Mengubah Page        |
| cms.page.delete  | Menghapus Page       |
| cms.page.publish | Mempublikasikan Page |
| cms.page.archive | Mengarsipkan Page    |
| cms.page.restore | Memulihkan Page      |

---

# Category Permissions

| Permission          | Description        |
| ------------------- | ------------------ |
| cms.category.view   | Melihat Category   |
| cms.category.create | Membuat Category   |
| cms.category.update | Mengubah Category  |
| cms.category.delete | Menghapus Category |

---

# Tag Permissions

| Permission     | Description   |
| -------------- | ------------- |
| cms.tag.view   | Melihat Tag   |
| cms.tag.create | Membuat Tag   |
| cms.tag.update | Mengubah Tag  |
| cms.tag.delete | Menghapus Tag |

---

# Role Matrix

| Permission | Super Admin | Admin | Editor |
| ---------- | :---------: | :---: | :----: |
| View       |     ✅      |  ✅   |   ✅   |
| Create     |     ✅      |  ✅   |   ✅   |
| Update     |     ✅      |  ✅   |   ✅   |
| Delete     |     ✅      |  ✅   |   ❌   |
| Publish    |     ✅      |  ✅   |   ✅   |
| Archive    |     ✅      |  ✅   |   ✅   |
| Restore    |     ✅      |  ✅   |   ❌   |

Hak akses dapat disesuaikan berdasarkan kebutuhan organisasi.

---

# Permission Rules

- Pengguna harus login sebelum Permission diperiksa.
- Permission diperiksa pada setiap request.
- Menu CMS hanya ditampilkan apabila pengguna memiliki `cms.*.view`.
- Tombol aksi (Create, Update, Delete, Publish) hanya ditampilkan apabila pengguna memiliki permission terkait.

---

# Security Rules

CMS wajib:

- Menolak request tanpa permission.
- Mengembalikan HTTP 403 apabila akses ditolak.
- Mencatat perubahan penting ke Audit Log.

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

Permission CMS dianggap selesai apabila:

- Seluruh fitur memiliki permission yang jelas.
- Permission diterapkan pada API dan UI.
- Menu mengikuti Role pengguna.
- Aksi tanpa permission ditolak oleh sistem.
