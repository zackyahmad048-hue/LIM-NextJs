# Program Permissions

**Project:** LIM Digital Platform

**Domain:** Program

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan hak akses (Permission) pada Domain Program.

Permission digunakan untuk mengatur akses terhadap seluruh fitur Program menggunakan Role Based Access Control (RBAC).

---

# Permission Model

Domain Program menggunakan model RBAC.

```text id="prgpm01"
User

↓

Role

↓

Permission

↓

Program Module
```

Permission diberikan kepada **Role**, bukan langsung kepada User.

---

# Permission Naming Standard

Format:

```text id="prgpm02"
program.resource.action
```

Contoh:

```text id="prgpm03"
program.view

program.create

program.publish
```

---

# Program Permissions

| Permission       | Description           |
| ---------------- | --------------------- |
| program.view     | Melihat Program       |
| program.create   | Membuat Program       |
| program.update   | Mengubah Program      |
| program.delete   | Menghapus Program     |
| program.publish  | Publish Program       |
| program.cancel   | Membatalkan Program   |
| program.complete | Menyelesaikan Program |
| program.archive  | Mengarsipkan Program  |

---

# Schedule Permissions

| Permission              | Description      |
| ----------------------- | ---------------- |
| program.schedule.view   | Melihat Jadwal   |
| program.schedule.create | Menambah Jadwal  |
| program.schedule.update | Mengubah Jadwal  |
| program.schedule.delete | Menghapus Jadwal |

---

# Committee Permissions

| Permission               | Description       |
| ------------------------ | ----------------- |
| program.committee.view   | Melihat Panitia   |
| program.committee.create | Menambah Panitia  |
| program.committee.update | Mengubah Panitia  |
| program.committee.delete | Menghapus Panitia |

---

# Participant Permissions

| Permission                 | Description           |
| -------------------------- | --------------------- |
| program.participant.view   | Melihat Peserta       |
| program.participant.create | Menambah Peserta      |
| program.participant.update | Mengubah Data Peserta |
| program.participant.delete | Menghapus Peserta     |

---

# Attendance Permissions

| Permission                | Description          |
| ------------------------- | -------------------- |
| program.attendance.view   | Melihat Absensi      |
| program.attendance.create | Check In / Check Out |
| program.attendance.update | Mengubah Absensi     |
| program.attendance.delete | Menghapus Absensi    |

---

# Documentation Permissions

| Permission                   | Description           |
| ---------------------------- | --------------------- |
| program.documentation.view   | Melihat Dokumentasi   |
| program.documentation.create | Upload Dokumentasi    |
| program.documentation.update | Mengubah Dokumentasi  |
| program.documentation.delete | Menghapus Dokumentasi |

---

# Role Matrix

| Permission    | Super Admin | Admin | Operator Program | Panitia |
| ------------- | :---------: | :---: | :--------------: | :-----: |
| View          |     ✅      |  ✅   |        ✅        |   ✅    |
| Create        |     ✅      |  ✅   |        ✅        |   ❌    |
| Update        |     ✅      |  ✅   |        ✅        |   ❌    |
| Delete        |     ✅      |  ❌   |        ❌        |   ❌    |
| Publish       |     ✅      |  ✅   |        ✅        |   ❌    |
| Complete      |     ✅      |  ✅   |        ✅        |   ❌    |
| Attendance    |     ✅      |  ✅   |        ✅        |   ✅    |
| Documentation |     ✅      |  ✅   |        ✅        |   ✅    |

---

# Menu Authorization

Menu **Program** hanya tampil apabila pengguna memiliki:

```text id="prgpm04"
program.view
```

Submenu mengikuti permission masing-masing.

---

# Action Authorization

| Action               | Permission                   |
| -------------------- | ---------------------------- |
| Create Program       | program.create               |
| Update Program       | program.update               |
| Publish Program      | program.publish              |
| Cancel Program       | program.cancel               |
| Complete Program     | program.complete             |
| Create Schedule      | program.schedule.create      |
| Assign Committee     | program.committee.create     |
| Register Participant | program.participant.create   |
| Check Attendance     | program.attendance.create    |
| Upload Documentation | program.documentation.create |

---

# Business Rules

- Seluruh request wajib melalui Authentication.
- Permission diperiksa pada setiap request.
- Pengguna tanpa permission menerima HTTP 403 Forbidden.
- Tombol aksi hanya tampil apabila permission tersedia.
- Public API tidak menggunakan permission.

---

# Security Rules

- Permission tidak boleh dilewati.
- Pemeriksaan permission dilakukan pada Service Layer.
- Perubahan data Program wajib tercatat pada Audit Log.

---

# Future Permissions

Versi berikutnya dapat menambahkan:

```text id="prgpm05"
program.export

program.import

program.approval

program.report

program.analytics
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

Permission Program dianggap selesai apabila:

- Seluruh fitur memiliki permission.
- Permission diterapkan pada UI dan API.
- Menu mengikuti Role pengguna.
- Aksi tanpa permission ditolak.
- Seluruh akses mengikuti standar RBAC.
