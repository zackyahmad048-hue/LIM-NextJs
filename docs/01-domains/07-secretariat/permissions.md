# Secretariat Permissions

**Project:** LIM Digital Platform

**Domain:** Secretariat

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan hak akses (Permission) pada Domain Secretariat.

Permission digunakan untuk mengatur akses terhadap seluruh proses administrasi organisasi menggunakan Role Based Access Control (RBAC).

---

# Permission Model

Domain Secretariat menggunakan model RBAC.

```text id="secpm01"
User

↓

Role

↓

Permission

↓

Secretariat Module
```

Permission diberikan kepada **Role**, bukan langsung kepada User.

---

# Permission Naming Standard

Format:

```text id="secpm02"
secretariat.resource.action
```

Contoh:

```text id="secpm03"
secretariat.view

secretariat.incoming-mail.create

secretariat.document.archive
```

---

# Secretariat Permissions

| Permission            | Description                   |
| --------------------- | ----------------------------- |
| secretariat.view      | Melihat Modul Secretariat     |
| secretariat.dashboard | Melihat Dashboard Secretariat |

---

# Incoming Mail Permissions

| Permission                       | Description           |
| -------------------------------- | --------------------- |
| secretariat.incoming-mail.view   | Melihat Surat Masuk   |
| secretariat.incoming-mail.create | Menambah Surat Masuk  |
| secretariat.incoming-mail.update | Mengubah Surat Masuk  |
| secretariat.incoming-mail.delete | Menghapus Surat Masuk |

---

# Outgoing Mail Permissions

| Permission                       | Description            |
| -------------------------------- | ---------------------- |
| secretariat.outgoing-mail.view   | Melihat Surat Keluar   |
| secretariat.outgoing-mail.create | Membuat Surat Keluar   |
| secretariat.outgoing-mail.update | Mengubah Surat Keluar  |
| secretariat.outgoing-mail.delete | Menghapus Surat Keluar |
| secretariat.outgoing-mail.send   | Mengirim Surat         |

---

# Disposition Permissions

| Permission                       | Description             |
| -------------------------------- | ----------------------- |
| secretariat.disposition.view     | Melihat Disposisi       |
| secretariat.disposition.create   | Membuat Disposisi       |
| secretariat.disposition.update   | Mengubah Disposisi      |
| secretariat.disposition.complete | Menyelesaikan Disposisi |

---

# Administrative Document Permissions

| Permission                   | Description          |
| ---------------------------- | -------------------- |
| secretariat.document.view    | Melihat Dokumen      |
| secretariat.document.create  | Membuat Dokumen      |
| secretariat.document.update  | Mengubah Dokumen     |
| secretariat.document.delete  | Menghapus Dokumen    |
| secretariat.document.archive | Mengarsipkan Dokumen |
| secretariat.document.restore | Memulihkan Dokumen   |

---

# Archive Permissions

| Permission                  | Description      |
| --------------------------- | ---------------- |
| secretariat.archive.view    | Melihat Arsip    |
| secretariat.archive.restore | Memulihkan Arsip |

---

# Agenda Permissions

| Permission              | Description         |
| ----------------------- | ------------------- |
| secretariat.agenda.view | Melihat Buku Agenda |

Agenda Book bersifat Read Only.

---

# Role Matrix

| Permission           | Super Admin | Admin | Secretary | Operator |
| -------------------- | :---------: | :---: | :-------: | :------: |
| View                 |     ✅      |  ✅   |    ✅     |    ✅    |
| Create               |     ✅      |  ✅   |    ✅     |    ✅    |
| Update               |     ✅      |  ✅   |    ✅     |    ✅    |
| Delete               |     ✅      |  ❌   |    ❌     |    ❌    |
| Archive              |     ✅      |  ✅   |    ✅     |    ❌    |
| Restore              |     ✅      |  ✅   |    ✅     |    ❌    |
| Send Mail            |     ✅      |  ✅   |    ✅     |    ❌    |
| Complete Disposition |     ✅      |  ✅   |    ✅     |    ✅    |

---

# Menu Authorization

Menu **Secretariat** hanya ditampilkan apabila pengguna memiliki:

```text id="secpm04"
secretariat.view
```

Submenu mengikuti permission masing-masing.

---

# Action Authorization

| Action               | Permission                       |
| -------------------- | -------------------------------- |
| Create Incoming Mail | secretariat.incoming-mail.create |
| Update Incoming Mail | secretariat.incoming-mail.update |
| Create Outgoing Mail | secretariat.outgoing-mail.create |
| Send Outgoing Mail   | secretariat.outgoing-mail.send   |
| Create Disposition   | secretariat.disposition.create   |
| Complete Disposition | secretariat.disposition.complete |
| Create Document      | secretariat.document.create      |
| Archive Document     | secretariat.document.archive     |
| Restore Document     | secretariat.document.restore     |

---

# Business Rules

- Authentication wajib dilakukan sebelum pemeriksaan Permission.
- Permission diperiksa pada setiap request.
- Pengguna tanpa permission menerima HTTP 403 Forbidden.
- Tombol aksi hanya ditampilkan apabila permission tersedia.
- Arsip hanya dapat dipulihkan oleh Role yang berwenang.

---

# Security Rules

- Permission tidak boleh dilewati.
- Pemeriksaan dilakukan pada Service Layer.
- Seluruh perubahan data dicatat pada Audit Log.
- Dokumen rahasia hanya dapat diakses oleh Role yang memiliki hak akses.

---

# Future Permissions

Versi berikutnya dapat menambahkan:

```text id="secpm05"
secretariat.export

secretariat.import

secretariat.signature

secretariat.audit
```

---

# Temuan (Dokumen vs Kode)

Ketidaksesuaian berikut dicatat, bukan diperbaiki. Tiket ini tidak mengubah perilaku aplikasi.

- **Role Matrix vs matriks izin.** Role Matrix memberi Operator akses View, Create, Update, dan Complete Disposition di Secretariat, tetapi `permission.matrix.ts` hanya memberi peran `operator` izin FALAK, PROGRAM, dan TWK — nol izin Secretariat. Kebalikannya, kode memberi `administrator` seluruh izin (termasuk Delete) dan `sekretaris` seluruh izin SECRETARIAT (termasuk Delete), sedangkan Role Matrix menandai Admin dan Secretary `❌` pada Delete. Peran `editor` dan `viewer` yang ada di kode tidak muncul di Role Matrix.
- **Izin dideklarasikan tetapi tidak dipakai.** Tiga belas slug di `config/permission.ts` tidak diperiksa di mana pun: `secretariat.agenda.delete`, `secretariat.agenda.view`, `secretariat.archive.view`, `secretariat.disposition.complete`, `secretariat.disposition.view`, `secretariat.document.archive`, `secretariat.document.restore`, `secretariat.document.view`, `secretariat.incoming-mail.view`, `secretariat.letter.create`, `secretariat.letter.delete`, `secretariat.outgoing-mail.send`, dan `secretariat.outgoing-mail.view`. Sebabnya: transisi status memakai izin `*.update`, halaman baca hanya memakai `secretariat.view`, dan `agenda.delete` serta `letter.*` tidak memiliki aksi.
- **Izin di dokumen tanpa pasangan di kode.** `secretariat.dashboard` dan `secretariat.archive.restore` tidak ada di `config/permission.ts`. Sebaliknya, tabel Disposition Permissions di dokumen ini menghilangkan `secretariat.disposition.delete` yang ada di kode.

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

Permission Secretariat dianggap selesai apabila:

- Seluruh fitur memiliki permission yang jelas.
- Permission diterapkan pada UI dan API.
- Menu mengikuti Role pengguna.
- Aksi tanpa permission ditolak.
- Seluruh hak akses mengikuti standar RBAC.
