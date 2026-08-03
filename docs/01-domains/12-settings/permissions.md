# Settings Permissions

**Project:** LIM Digital Platform

**Domain:** Settings

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan hak akses (Permission) pada Domain Settings.

Permission digunakan untuk mengatur akses terhadap seluruh konfigurasi sistem menggunakan Role Based Access Control (RBAC).

---

# Permission Model

Domain Settings menggunakan RBAC.

```text id="setpm01"
User

↓

Role

↓

Permission

↓

Settings Module
```

Permission diberikan kepada **Role**, bukan langsung kepada User.

---

# Permission Naming Standard

Format:

```text id="setpm02"
settings.resource.action
```

Contoh:

```text id="setpm03"
settings.view

settings.update

settings.feature-flag.update
```

---

# Settings Permissions

| Permission       | Description            |
| ---------------- | ---------------------- |
| settings.view    | Melihat konfigurasi    |
| settings.create  | Membuat konfigurasi    |
| settings.update  | Mengubah konfigurasi   |
| settings.delete  | Menghapus konfigurasi  |
| settings.restore | Memulihkan konfigurasi |

---

# Category Permissions

| Permission               | Description        |
| ------------------------ | ------------------ |
| settings.category.view   | Melihat kategori   |
| settings.category.create | Membuat kategori   |
| settings.category.update | Mengubah kategori  |
| settings.category.delete | Menghapus kategori |

---

# Feature Flag Permissions

| Permission                   | Description                             |
| ---------------------------- | --------------------------------------- |
| settings.feature-flag.view   | Melihat Feature Flag                    |
| settings.feature-flag.update | Mengaktifkan/menonaktifkan Feature Flag |

---

# Integration Permissions

| Permission                  | Description                    |
| --------------------------- | ------------------------------ |
| settings.integration.view   | Melihat konfigurasi integrasi  |
| settings.integration.update | Mengubah konfigurasi integrasi |
| settings.integration.test   | Melakukan pengujian integrasi  |

---

# Organization Permissions

| Permission                   | Description                    |
| ---------------------------- | ------------------------------ |
| settings.organization.view   | Melihat pengaturan organisasi  |
| settings.organization.update | Mengubah pengaturan organisasi |

---

# Security Permissions

| Permission               | Description                  |
| ------------------------ | ---------------------------- |
| settings.security.view   | Melihat pengaturan keamanan  |
| settings.security.update | Mengubah pengaturan keamanan |

---

# Notification Permissions

| Permission                   | Description                    |
| ---------------------------- | ------------------------------ |
| settings.notification.view   | Melihat pengaturan notifikasi  |
| settings.notification.update | Mengubah pengaturan notifikasi |

---

# Storage Permissions

| Permission              | Description                 |
| ----------------------- | --------------------------- |
| settings.storage.view   | Melihat pengaturan storage  |
| settings.storage.update | Mengubah pengaturan storage |

---

# Role Matrix

| Permission          | Super Admin | Admin | Operator | User |
| ------------------- | :---------: | :---: | :------: | :--: |
| View                |     ✅      |  ✅   |    ❌    |  ❌  |
| Create              |     ✅      |  ❌   |    ❌    |  ❌  |
| Update              |     ✅      |  ✅   |    ❌    |  ❌  |
| Delete              |     ✅      |  ❌   |    ❌    |  ❌  |
| Restore             |     ✅      |  ❌   |    ❌    |  ❌  |
| Category Management |     ✅      |  ❌   |    ❌    |  ❌  |
| Feature Flag        |     ✅      |  ✅   |    ❌    |  ❌  |
| Integration         |     ✅      |  ✅   |    ❌    |  ❌  |
| Security            |     ✅      |  ❌   |    ❌    |  ❌  |
| Storage             |     ✅      |  ✅   |    ❌    |  ❌  |

---

# Menu Authorization

Menu **Settings** hanya ditampilkan apabila pengguna memiliki:

```text id="setpm04"
settings.view
```

---

# Action Authorization

| Action              | Permission                   |
| ------------------- | ---------------------------- |
| Create Setting      | settings.create              |
| Update Setting      | settings.update              |
| Delete Setting      | settings.delete              |
| Restore Setting     | settings.restore             |
| Manage Category     | settings.category.update     |
| Update Feature Flag | settings.feature-flag.update |
| Update Integration  | settings.integration.update  |
| Test Integration    | settings.integration.test    |
| Update Security     | settings.security.update     |
| Update Storage      | settings.storage.update      |

---

# Business Rules

- Authentication wajib dilakukan.
- Permission diperiksa pada setiap request.
- Pengguna tanpa permission menerima HTTP **403 Forbidden**.
- Pengaturan keamanan hanya dapat diubah oleh **Super Administrator**.
- Credential sensitif tidak ditampilkan kepada pengguna selain yang berwenang.

---

# Security Rules

- Permission tidak boleh dilewati.
- Pemeriksaan dilakukan pada Service Layer.
- Seluruh perubahan dicatat pada Audit Log.
- Hak akses mengikuti prinsip **Least Privilege**.
- Credential terenkripsi tidak pernah dikembalikan dalam bentuk plaintext.

---

# Future Permissions

```text id="setpm05"
settings.export

settings.import

settings.backup

settings.restore-system

settings.audit
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
