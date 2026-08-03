# Knowledge Permissions

**Project:** LIM Digital Platform

**Domain:** Knowledge

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan hak akses (Permission) pada Domain Knowledge.

Permission digunakan untuk mengatur akses terhadap seluruh proses pembuatan, review, publikasi, pengarsipan, dan pengelolaan Knowledge Base menggunakan Role Based Access Control (RBAC).

---

# Permission Model

Domain Knowledge menggunakan RBAC.

```text id="knwpm01"
User

↓

Role

↓

Permission

↓

Knowledge Module
```

Permission diberikan kepada **Role**, bukan langsung kepada User.

---

# Permission Naming Standard

Format:

```text id="knwpm02"
knowledge.resource.action
```

Contoh:

```text id="knwpm03"
knowledge.view

knowledge.publish

knowledge.review
```

---

# Knowledge Permissions

| Permission        | Description            |
| ----------------- | ---------------------- |
| knowledge.view    | Melihat konten         |
| knowledge.create  | Membuat konten         |
| knowledge.update  | Mengubah konten        |
| knowledge.delete  | Menghapus konten       |
| knowledge.publish | Mempublikasikan konten |
| knowledge.archive | Mengarsipkan konten    |
| knowledge.restore | Memulihkan konten      |

---

# Review Permissions

| Permission               | Description       |
| ------------------------ | ----------------- |
| knowledge.review.view    | Melihat review    |
| knowledge.review.submit  | Submit review     |
| knowledge.review.approve | Menyetujui konten |
| knowledge.review.reject  | Menolak konten    |

---

# Category Permissions

| Permission                | Description        |
| ------------------------- | ------------------ |
| knowledge.category.view   | Melihat kategori   |
| knowledge.category.create | Membuat kategori   |
| knowledge.category.update | Mengubah kategori  |
| knowledge.category.delete | Menghapus kategori |

---

# Tag Permissions

| Permission           | Description   |
| -------------------- | ------------- |
| knowledge.tag.view   | Melihat tag   |
| knowledge.tag.create | Membuat tag   |
| knowledge.tag.update | Mengubah tag  |
| knowledge.tag.delete | Menghapus tag |

---

# Search Permissions

| Permission       | Description                     |
| ---------------- | ------------------------------- |
| knowledge.search | Menggunakan pencarian Knowledge |

---

# Role Matrix

| Permission          | Super Admin | Admin | Editor | Contributor | User |
| ------------------- | :---------: | :---: | :----: | :---------: | :--: |
| View                |     ✅      |  ✅   |   ✅   |     ✅      | ✅*  |
| Create              |     ✅      |  ✅   |   ✅   |     ✅      |  ❌  |
| Update              |     ✅      |  ✅   |   ✅   |     Own     |  ❌  |
| Delete              |     ✅      |  ✅   |   ❌   |     ❌      |  ❌  |
| Review              |     ✅      |  ✅   |   ✅   |     ❌      |  ❌  |
| Publish             |     ✅      |  ✅   |   ✅   |     ❌      |  ❌  |
| Archive             |     ✅      |  ✅   |   ❌   |     ❌      |  ❌  |
| Category Management |     ✅      |  ✅   |   ✅   |     ❌      |  ❌  |
| Tag Management      |     ✅      |  ✅   |   ✅   |     ❌      |  ❌  |

`*` Hanya konten berstatus **Published**.

---

# Menu Authorization

Menu **Knowledge** hanya ditampilkan apabila pengguna memiliki:

```text id="knwpm04"
knowledge.view
```

---

# Action Authorization

| Action          | Permission                |
| --------------- | ------------------------- |
| Create Content  | knowledge.create          |
| Edit Content    | knowledge.update          |
| Submit Review   | knowledge.review.submit   |
| Approve Review  | knowledge.review.approve  |
| Reject Review   | knowledge.review.reject   |
| Publish Content | knowledge.publish         |
| Archive Content | knowledge.archive         |
| Restore Content | knowledge.restore         |
| Manage Category | knowledge.category.update |
| Manage Tag      | knowledge.tag.update      |

---

# Business Rules

- Authentication wajib dilakukan.
- Permission diperiksa pada setiap request.
- Pengguna tanpa permission menerima HTTP **403 Forbidden**.
- Contributor hanya dapat mengubah konten miliknya sendiri.
- Pengguna umum hanya dapat melihat konten yang telah dipublikasikan.

---

# Security Rules

- Permission tidak boleh dilewati.
- Pemeriksaan dilakukan pada Service Layer.
- Seluruh perubahan dicatat pada Audit Log.
- Hak akses mengikuti prinsip **Least Privilege**.

---

# Future Permissions

```text id="knwpm05"
knowledge.export

knowledge.import

knowledge.comment

knowledge.rating

knowledge.analytics
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

- Seluruh fitur memiliki permission yang jelas.
- Permission diterapkan pada UI dan API.
- Menu mengikuti Role pengguna.
- Aksi tanpa permission ditolak.
- Seluruh hak akses mengikuti standar RBAC.
