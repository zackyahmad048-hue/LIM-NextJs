# Letter Permissions

**Project:** LIM Digital Platform

**Domain:** Letter

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan hak akses (Permission) pada Domain Letter.

Permission digunakan untuk mengatur akses terhadap seluruh proses pembuatan, persetujuan, penandatanganan, distribusi, dan pengarsipan surat menggunakan Role Based Access Control (RBAC).

---

# Permission Model

Domain Letter menggunakan RBAC.

```text id="ltrpm01"
User

↓

Role

↓

Permission

↓

Letter Module
```

---

# Permission Naming Standard

Format:

```text id="ltrpm02"
letter.resource.action
```

Contoh:

```text id="ltrpm03"
letter.view

letter.create

letter.sign
```

---

# Letter Permissions

| Permission     | Description            |
| -------------- | ---------------------- |
| letter.view    | Melihat surat          |
| letter.create  | Membuat surat          |
| letter.update  | Mengubah surat         |
| letter.delete  | Menghapus surat        |
| letter.submit  | Submit surat           |
| letter.approve | Menyetujui surat       |
| letter.reject  | Menolak surat          |
| letter.sign    | Menandatangani surat   |
| letter.send    | Mengirim surat         |
| letter.archive | Mengarsipkan surat     |
| letter.restore | Memulihkan arsip surat |

---

# Template Permissions

| Permission             | Description        |
| ---------------------- | ------------------ |
| letter.template.view   | Melihat template   |
| letter.template.create | Membuat template   |
| letter.template.update | Mengubah template  |
| letter.template.delete | Menghapus template |

---

# Distribution Permissions

| Permission               | Description          |
| ------------------------ | -------------------- |
| letter.distribution.view | Melihat distribusi   |
| letter.distribution.send | Mengirim ulang surat |

---

# Role Matrix

| Permission | Super Admin | Admin | Secretary | Operator |
| ---------- | :---------: | :---: | :-------: | :------: |
| View       |     ✅      |  ✅   |    ✅     |    ✅    |
| Create     |     ✅      |  ✅   |    ✅     |    ✅    |
| Update     |     ✅      |  ✅   |    ✅     |    ✅    |
| Delete     |     ✅      |  ❌   |    ❌     |    ❌    |
| Submit     |     ✅      |  ✅   |    ✅     |    ✅    |
| Approve    |     ✅      |  ✅   |    ✅     |    ❌    |
| Sign       |     ✅      |  ✅   |    ✅     |    ❌    |
| Send       |     ✅      |  ✅   |    ✅     |    ✅    |
| Archive    |     ✅      |  ✅   |    ✅     |    ❌    |
| Restore    |     ✅      |  ✅   |    ✅     |    ❌    |

---

# Menu Authorization

Menu **Letter** hanya ditampilkan apabila pengguna memiliki:

```text id="ltrpm04"
letter.view
```

---

# Action Authorization

| Action          | Permission             |
| --------------- | ---------------------- |
| Create Letter   | letter.create          |
| Submit Letter   | letter.submit          |
| Approve Letter  | letter.approve         |
| Reject Letter   | letter.reject          |
| Sign Letter     | letter.sign            |
| Send Letter     | letter.send            |
| Archive Letter  | letter.archive         |
| Restore Letter  | letter.restore         |
| Manage Template | letter.template.update |

---

# Business Rules

- Authentication wajib dilakukan.
- Permission diperiksa pada setiap request.
- Pengguna tanpa permission menerima HTTP 403.
- Tombol aksi mengikuti permission pengguna.
- Approval dan Signature hanya dapat dilakukan oleh Role yang berwenang.

---

# Security Rules

- Pemeriksaan permission dilakukan pada Service Layer.
- Permission tidak boleh dilewati.
- Seluruh perubahan dicatat pada Audit Log.

---

# Future Permissions

```text id="ltrpm05"
letter.export

letter.import

letter.audit

letter.qr

letter.verify
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
- Menu mengikuti Role.
- Aksi tanpa permission ditolak.
- Mengikuti standar RBAC.
