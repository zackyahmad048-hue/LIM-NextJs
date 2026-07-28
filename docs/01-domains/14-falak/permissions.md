# Falak Permissions

**Project:** LIM Digital Platform

**Domain:** Falak

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan hak akses (Permission) pada Domain Falak.

Permission digunakan untuk mengatur akses terhadap seluruh proses perhitungan, observasi, verifikasi, publikasi, dan pengelolaan data astronomi menggunakan Role Based Access Control (RBAC).

---

# Permission Model

Domain Falak menggunakan RBAC.

```text id="flkpm01"
User

↓

Role

↓

Permission

↓

Falak Module
```

Permission diberikan kepada **Role**, bukan langsung kepada User.

---

# Permission Naming Standard

Format:

```text id="flkpm02"
falak.resource.action
```

Contoh:

```text id="flkpm03"
falak.prayer-time.view

falak.hisab.calculate

falak.rukyat.verify
```

---

# Prayer Time Permissions

| Permission                 | Description               |
| -------------------------- | ------------------------- |
| falak.prayer-time.view     | Melihat jadwal salat      |
| falak.prayer-time.generate | Menghasilkan jadwal salat |

---

# Qibla Permissions

| Permission            | Description            |
| --------------------- | ---------------------- |
| falak.qibla.view      | Melihat arah kiblat    |
| falak.qibla.calculate | Menghitung arah kiblat |

---

# Hijri Calendar Permissions

| Permission           | Description                   |
| -------------------- | ----------------------------- |
| falak.hijri.view     | Melihat kalender Hijriah      |
| falak.hijri.generate | Menghasilkan kalender Hijriah |

---

# Hisab Permissions

| Permission            | Description                 |
| --------------------- | --------------------------- |
| falak.hisab.view      | Melihat hasil hisab         |
| falak.hisab.calculate | Melakukan perhitungan hisab |
| falak.hisab.archive   | Mengarsipkan hasil hisab    |

---

# Rukyat Permissions

| Permission           | Description             |
| -------------------- | ----------------------- |
| falak.rukyat.view    | Melihat observasi       |
| falak.rukyat.create  | Membuat observasi       |
| falak.rukyat.verify  | Memverifikasi observasi |
| falak.rukyat.confirm | Mengonfirmasi observasi |
| falak.rukyat.archive | Mengarsipkan observasi  |

---

# Eclipse Permissions

| Permission              | Description             |
| ----------------------- | ----------------------- |
| falak.eclipse.view      | Melihat data gerhana    |
| falak.eclipse.calculate | Menghitung data gerhana |

---

# Role Matrix

| Permission           | Super Admin | Admin | Operator Falak | Observer | User |
| -------------------- | :---------: | :---: | :------------: | :------: | :--: |
| Prayer Time View     |      ✅      |   ✅   |        ✅       |     ✅    |   ✅  |
| Prayer Time Generate |      ✅      |   ✅   |        ✅       |     ❌    |   ❌  |
| Qibla View           |      ✅      |   ✅   |        ✅       |     ✅    |   ✅  |
| Qibla Calculate      |      ✅      |   ✅   |        ✅       |     ❌    |   ❌  |
| Hijri View           |      ✅      |   ✅   |        ✅       |     ✅    |   ✅  |
| Hijri Generate       |      ✅      |   ✅   |        ✅       |     ❌    |   ❌  |
| Hisab Calculate      |      ✅      |   ✅   |        ✅       |     ❌    |   ❌  |
| Rukyat Create        |      ✅      |   ✅   |        ✅       |     ✅    |   ❌  |
| Rukyat Verify        |      ✅      |   ✅   |        ✅       |     ❌    |   ❌  |
| Rukyat Confirm       |      ✅      |   ✅   |        ✅       |     ❌    |   ❌  |
| Eclipse Calculate    |      ✅      |   ✅   |        ✅       |     ❌    |   ❌  |

---

# Menu Authorization

Menu **Falak** hanya ditampilkan apabila pengguna memiliki:

```text id="flkpm04"
falak.prayer-time.view
```

atau permission Falak lainnya.

---

# Action Authorization

| Action                  | Permission                 |
| ----------------------- | -------------------------- |
| Generate Prayer Time    | falak.prayer-time.generate |
| Calculate Qibla         | falak.qibla.calculate      |
| Generate Hijri Calendar | falak.hijri.generate       |
| Calculate Hisab         | falak.hisab.calculate      |
| Create Observation      | falak.rukyat.create        |
| Verify Observation      | falak.rukyat.verify        |
| Confirm Observation     | falak.rukyat.confirm       |
| Calculate Eclipse       | falak.eclipse.calculate    |

---

# Business Rules

* Authentication wajib untuk endpoint administrasi.
* Permission diperiksa pada setiap request.
* Endpoint publik hanya memerlukan permission baca apabila melalui Portal Admin.
* Observer hanya dapat membuat observasi.
* Verifikasi dan konfirmasi hanya dapat dilakukan oleh Operator Falak atau Administrator.

---

# Security Rules

* Permission tidak boleh dilewati.
* Pemeriksaan dilakukan pada Service Layer.
* Seluruh aktivitas dicatat pada Audit Log.
* Hak akses mengikuti prinsip Least Privilege.

---

# Future Permissions

```text id="flkpm05"
falak.export

falak.import

falak.analytics

falak.report.generate

falak.api.public
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

* Seluruh fitur memiliki permission yang jelas.
* Permission diterapkan pada UI dan API.
* Menu mengikuti Role pengguna.
* Aksi tanpa permission ditolak.
* Seluruh hak akses mengikuti standar RBAC.
