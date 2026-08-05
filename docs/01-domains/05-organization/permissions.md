# Organization Permissions

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 2.0

**Status:** Draft

---

# Purpose

Dokumen ini mendefinisikan hak akses (Permission) yang digunakan pada Domain Organization.

Permission digunakan untuk mengendalikan akses terhadap seluruh data organisasi, cabang, dan kepengurusan berdasarkan Role yang dimiliki pengguna.

---

# Permission Model

Domain Organization menggunakan **Role Based Access Control (RBAC)**.

Alur pemeriksaan hak akses:

```text id="orgpm01"
User

↓

Role

↓

Permission

↓

Organization Module
```

Permission diberikan kepada **Role**, bukan langsung kepada User.

---

# Permission Naming Standard

Format penamaan:

```text id="orgpm02"
resource.action
```

Contoh:

```text id="orgpm03"
organization.view

organization.create

organization.update

organization.delete
```

---

# Organization Permissions

| Permission          | Description             |
| ------------------- | ----------------------- |
| organization.view   | Melihat data organisasi |
| organization.create | Membuat organisasi      |
| organization.update | Mengubah organisasi     |
| organization.delete | Menghapus organisasi    |

---

# Branch Permissions

| Permission                 | Description      |
| -------------------------- | ---------------- |
| organization.branch.view   | Melihat cabang   |
| organization.branch.create | Menambah cabang  |
| organization.branch.update | Mengubah cabang  |
| organization.branch.delete | Menghapus cabang |

---

# Central Board Permissions

| Permission                       | Description            |
| -------------------------------- | ---------------------- |
| organization.central-board.view  | Melihat pengurus pusat |
| organization.central-board.create | Menetapkan pengurus pusat |
| organization.central-board.update | Mengubah data pengurus pusat |
| organization.central-board.delete | Menghapus pengurus pusat |

---

# Regional Board Permissions

| Permission                       | Description              |
| -------------------------------- | ------------------------ |
| organization.regional-board.view | Melihat pengurus wilayah |
| organization.regional-board.create | Menetapkan pengurus wilayah |
| organization.regional-board.update | Mengubah data pengurus wilayah |
| organization.regional-board.delete | Menghapus pengurus wilayah |

---

# Branch Board Permissions

| Permission                       | Description             |
| -------------------------------- | ----------------------- |
| organization.branch-board.view   | Melihat pengurus cabang |
| organization.branch-board.create | Menetapkan pengurus cabang |
| organization.branch-board.update | Mengubah data pengurus cabang |
| organization.branch-board.delete | Menghapus pengurus cabang |

---

# Member Permissions

| Permission              | Description        |
| ----------------------- | ------------------ |
| organization.member.view | Melihat anggota    |
| organization.member.create | Menambah anggota  |
| organization.member.update | Mengubah data anggota |
| organization.member.delete | Menghapus anggota |

---

# Permission Matrix

| Permission        | Super Admin | Admin | Secretariat | User |
| ----------------- | :---------: | :---: | :---------: | :--: |
| View              |     ✅      |  ✅   |     ✅      | Sesuai Hak Akses |
| Create            |     ✅      |  ✅   |     ❌      |        ❌        |
| Update            |     ✅      |  ✅   |     ❌      |        ❌        |
| Delete            |     ✅      |  ❌   |     ❌      |        ❌        |
| Assign Board      |     ✅      |  ✅   |     ❌      |        ❌        |

Role dapat disesuaikan berdasarkan kebutuhan organisasi.

---

# Menu Authorization

Menu **Organization** hanya ditampilkan apabila pengguna memiliki:

```text id="orgpm04"
organization.view
```

Submenu hanya ditampilkan apabila pengguna memiliki permission yang sesuai.

Contoh:

```text id="orgpm05"
organization.branch.view

organization.central-board.view

organization.regional-board.view

organization.branch-board.view

organization.member.view
```

---

# Action Authorization

Setiap aksi wajib memeriksa permission sebelum diproses.

| Action                    | Permission                          |
| ------------------------- | ----------------------------------- |
| Create Organization       | organization.create                 |
| Update Organization       | organization.update                 |
| Delete Organization       | organization.delete                 |
| Create Branch             | organization.branch.create          |
| Update Branch             | organization.branch.update          |
| Delete Branch             | organization.branch.delete          |
| Assign Central Board      | organization.central-board.create   |
| Assign Regional Board     | organization.regional-board.create  |
| Assign Branch Board       | organization.branch-board.create    |
| Add Member                | organization.member.create          |

---

# Business Rules

- Permission diperiksa pada setiap request.
- Pengguna tanpa permission menerima HTTP 403 Forbidden.
- Tombol aksi hanya ditampilkan apabila permission tersedia.
- Menu mengikuti Role pengguna.
- Public API tidak menggunakan permission, hanya menampilkan data publik yang telah ditentukan.

---

# Security Rules

- Permission tidak boleh dilewati.
- Tidak boleh menggunakan pengecekan Role secara langsung di UI.
- Seluruh pemeriksaan akses dilakukan pada Service Layer.
- Perubahan Role dan Permission wajib dicatat pada Audit Log.

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

Permission Organization dianggap selesai apabila:

- Seluruh fitur memiliki permission yang jelas.
- Permission diterapkan pada UI dan API.
- Menu mengikuti hak akses pengguna.
- Aksi tanpa permission ditolak.
- Seluruh perubahan mengikuti RBAC dan Business Rules.