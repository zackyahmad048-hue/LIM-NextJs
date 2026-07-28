# Organization Permissions

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan hak akses (Permission) yang digunakan pada Domain Organization.

Permission digunakan untuk mengendalikan akses terhadap seluruh data organisasi, cabang, wilayah, jabatan, dan kepengurusan berdasarkan Role yang dimiliki pengguna.

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

# Region Permissions

| Permission                 | Description       |
| -------------------------- | ----------------- |
| organization.region.view   | Melihat wilayah   |
| organization.region.create | Menambah wilayah  |
| organization.region.update | Mengubah wilayah  |
| organization.region.delete | Menghapus wilayah |

---

# Branch Permissions

| Permission                 | Description      |
| -------------------------- | ---------------- |
| organization.branch.view   | Melihat cabang   |
| organization.branch.create | Menambah cabang  |
| organization.branch.update | Mengubah cabang  |
| organization.branch.delete | Menghapus cabang |

---

# Department Permissions

| Permission                     | Description      |
| ------------------------------ | ---------------- |
| organization.department.view   | Melihat bidang   |
| organization.department.create | Menambah bidang  |
| organization.department.update | Mengubah bidang  |
| organization.department.delete | Menghapus bidang |

---

# Position Permissions

| Permission                   | Description       |
| ---------------------------- | ----------------- |
| organization.position.view   | Melihat jabatan   |
| organization.position.create | Menambah jabatan  |
| organization.position.update | Mengubah jabatan  |
| organization.position.delete | Menghapus jabatan |

---

# Management Period Permissions

| Permission                   | Description          |
| ---------------------------- | -------------------- |
| organization.period.view     | Melihat periode      |
| organization.period.create   | Membuat periode      |
| organization.period.update   | Mengubah periode     |
| organization.period.activate | Mengaktifkan periode |
| organization.period.close    | Menutup periode      |

---

# Management Permissions

| Permission                     | Description            |
| ------------------------------ | ---------------------- |
| organization.management.view   | Melihat pengurus       |
| organization.management.create | Menambah pengurus      |
| organization.management.update | Mengubah data pengurus |
| organization.management.delete | Menghapus pengurus     |

---

# Permission Matrix

| Permission        | Super Admin | Admin | Secretariat |       User       |
| ----------------- | :---------: | :---: | :---------: | :--------------: |
| View              |      ✅      |   ✅   |      ✅      | Sesuai Hak Akses |
| Create            |      ✅      |   ✅   |      ❌      |         ❌        |
| Update            |      ✅      |   ✅   |      ❌      |         ❌        |
| Delete            |      ✅      |   ❌   |      ❌      |         ❌        |
| Activate Period   |      ✅      |   ✅   |      ❌      |         ❌        |
| Assign Management |      ✅      |   ✅   |      ❌      |         ❌        |

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

organization.position.view

organization.management.view
```

---

# Action Authorization

Setiap aksi wajib memeriksa permission sebelum diproses.

| Action              | Permission                     |
| ------------------- | ------------------------------ |
| Create Organization | organization.create            |
| Update Organization | organization.update            |
| Delete Organization | organization.delete            |
| Create Branch       | organization.branch.create     |
| Update Branch       | organization.branch.update     |
| Delete Branch       | organization.branch.delete     |
| Create Position     | organization.position.create   |
| Assign Management   | organization.management.create |
| Activate Period     | organization.period.activate   |

---

# Business Rules

* Permission diperiksa pada setiap request.
* Pengguna tanpa permission menerima HTTP 403 Forbidden.
* Tombol aksi hanya ditampilkan apabila permission tersedia.
* Menu mengikuti Role pengguna.
* Public API tidak menggunakan permission, hanya menampilkan data publik yang telah ditentukan.

---

# Security Rules

* Permission tidak boleh dilewati.
* Tidak boleh menggunakan pengecekan Role secara langsung di UI.
* Seluruh pemeriksaan akses dilakukan pada Service Layer.
* Perubahan Role dan Permission wajib dicatat pada Audit Log.

---

# Future Permissions

Versi berikutnya dapat menambahkan:

```text id="orgpm06"
organization.export

organization.import

organization.approval

organization.audit
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

Permission Organization dianggap selesai apabila:

* Seluruh fitur memiliki permission yang jelas.
* Permission diterapkan pada UI dan API.
* Menu mengikuti hak akses pengguna.
* Aksi tanpa permission ditolak.
* Seluruh perubahan mengikuti RBAC dan Business Rules.
