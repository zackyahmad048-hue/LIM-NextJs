# Dashboard Permissions

**Project:** LIM Digital Platform

**Domain:** Dashboard

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan Permission yang digunakan oleh Domain Dashboard.

Permission digunakan untuk menentukan informasi dan widget yang dapat diakses oleh setiap pengguna berdasarkan Role yang dimiliki.

---

# Permission Model

Dashboard menggunakan Role Based Access Control (RBAC).

Alur pemeriksaan hak akses:

```text
User

↓

Role

↓

Permission

↓

Dashboard Access
```

---

# Standard Permission

Domain Dashboard menggunakan permission berikut.

| Permission              | Description                 |
| ----------------------- | --------------------------- |
| dashboard.view          | Melihat Dashboard           |
| dashboard.statistics    | Melihat statistik Dashboard |
| dashboard.activities    | Melihat aktivitas terbaru   |
| dashboard.announcements | Melihat pengumuman          |
| dashboard.system        | Melihat informasi sistem    |

---

# Permission Details

## dashboard.view

Hak untuk membuka halaman Dashboard.

Tanpa permission ini, pengguna tidak dapat mengakses Dashboard.

---

## dashboard.statistics

Hak untuk melihat seluruh kartu statistik.

Statistik hanya ditampilkan apabila pengguna memiliki permission terhadap modul sumber data.

Contoh:

- Total Program → membutuhkan `program.view`
- Total Surat → membutuhkan `letter.view`
- Total Sertifikat → membutuhkan `certificate.view`

---

## dashboard.activities

Hak untuk melihat daftar aktivitas terbaru.

Aktivitas yang ditampilkan hanya berasal dari modul yang dapat diakses oleh pengguna.

---

## dashboard.announcements

Hak untuk melihat pengumuman internal pada Dashboard.

---

## dashboard.system

Hak untuk melihat informasi sistem.

Contoh:

- Versi aplikasi
- Status database
- Environment
- Build Version

Permission ini hanya diberikan kepada Super Administrator atau Administrator yang berwenang.

---

# Permission Matrix

| Role                | View |    Statistics     |    Activities     | Announcement |      System       |
| ------------------- | :--: | :---------------: | :---------------: | :----------: | :---------------: |
| Super Administrator |  ✅  |        ✅         |        ✅         |      ✅      |        ✅         |
| Administrator       |  ✅  |        ✅         |        ✅         |      ✅      | Sesuai Permission |
| Operator            |  ✅  |        ✅         |        ✅         |      ✅      |        ❌         |
| User                |  ✅  | Sesuai Permission | Sesuai Permission |      ✅      |        ❌         |

---

# Widget Authorization

Setiap widget memiliki permission masing-masing.

Apabila permission tidak dimiliki:

- Widget tidak ditampilkan.
- Tidak menampilkan pesan error.
- Layout Dashboard tetap normal.

---

# Security Rules

Dashboard tidak boleh:

- Menampilkan widget tanpa permission.
- Menampilkan statistik dari modul yang tidak dapat diakses.
- Menampilkan informasi sistem kepada pengguna yang tidak berwenang.

---

# Future Permissions

Permission berikut dapat ditambahkan pada versi berikutnya:

```text
dashboard.analytics

dashboard.export

dashboard.customize

dashboard.manage
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

Permission Dashboard dianggap benar apabila:

- Hak akses diperiksa sebelum Dashboard dimuat.
- Widget mengikuti Permission pengguna.
- Informasi sistem hanya dapat diakses oleh pengguna yang berwenang.
- Tidak ada data yang ditampilkan tanpa hak akses yang sesuai.
