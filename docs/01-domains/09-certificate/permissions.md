# Certificate Permissions

**Project:** LIM Digital Platform

**Domain:** Certificate

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan hak akses (Permission) pada Domain Certificate.

Permission digunakan untuk mengatur akses terhadap seluruh proses pembuatan, penerbitan, penandatanganan, distribusi, verifikasi, dan pengarsipan sertifikat menggunakan Role Based Access Control (RBAC).

---

# Permission Model

Domain Certificate menggunakan RBAC.

```text id="crtpm01"
User

↓

Role

↓

Permission

↓

Certificate Module
```

Permission diberikan kepada **Role**, bukan langsung kepada User.

---

# Permission Naming Standard

Format:

```text id="crtpm02"
certificate.resource.action
```

Contoh:

```text id="crtpm03"
certificate.view

certificate.generate

certificate.publish
```

---

# Certificate Permissions

| Permission           | Description             |
| -------------------- | ----------------------- |
| certificate.view     | Melihat sertifikat      |
| certificate.create   | Membuat sertifikat      |
| certificate.update   | Mengubah sertifikat     |
| certificate.delete   | Menghapus sertifikat    |
| certificate.generate | Generate sertifikat     |
| certificate.publish  | Publish sertifikat      |
| certificate.revoke   | Mencabut sertifikat     |
| certificate.archive  | Mengarsipkan sertifikat |
| certificate.restore  | Memulihkan sertifikat   |

---

# Template Permissions

| Permission                  | Description        |
| --------------------------- | ------------------ |
| certificate.template.view   | Melihat template   |
| certificate.template.create | Membuat template   |
| certificate.template.update | Mengubah template  |
| certificate.template.delete | Menghapus template |

---

# Signature Permissions

| Permission                 | Description               |
| -------------------------- | ------------------------- |
| certificate.signature.view | Melihat tanda tangan      |
| certificate.signature.sign | Menandatangani sertifikat |

---

# Distribution Permissions

| Permission                      | Description               |
| ------------------------------- | ------------------------- |
| certificate.distribution.view   | Melihat distribusi        |
| certificate.distribution.send   | Mengirim sertifikat       |
| certificate.distribution.resend | Mengirim ulang sertifikat |

---

# Verification Permissions

| Permission                      | Description                     |
| ------------------------------- | ------------------------------- |
| certificate.verification.view   | Melihat data verifikasi         |
| certificate.verification.verify | Melakukan verifikasi sertifikat |

Endpoint verifikasi publik tidak memerlukan Authentication.

---

# Role Matrix

| Permission | Super Admin | Admin | Certificate Officer | Signer |
| ---------- | :---------: | :---: | :-----------------: | :----: |
| View       |      ✅      |   ✅   |          ✅          |    ✅   |
| Create     |      ✅      |   ✅   |          ✅          |    ❌   |
| Update     |      ✅      |   ✅   |          ✅          |    ❌   |
| Delete     |      ✅      |   ❌   |          ❌          |    ❌   |
| Generate   |      ✅      |   ✅   |          ✅          |    ❌   |
| Publish    |      ✅      |   ✅   |          ✅          |    ❌   |
| Sign       |      ✅      |   ❌   |          ❌          |    ✅   |
| Send       |      ✅      |   ✅   |          ✅          |    ❌   |
| Archive    |      ✅      |   ✅   |          ✅          |    ❌   |
| Restore    |      ✅      |   ✅   |          ✅          |    ❌   |
| Revoke     |      ✅      |   ✅   |          ❌          |    ❌   |

---

# Menu Authorization

Menu **Certificate** hanya ditampilkan apabila pengguna memiliki:

```text id="crtpm04"
certificate.view
```

---

# Action Authorization

| Action               | Permission                    |
| -------------------- | ----------------------------- |
| Create Certificate   | certificate.create            |
| Generate Certificate | certificate.generate          |
| Publish Certificate  | certificate.publish           |
| Sign Certificate     | certificate.signature.sign    |
| Send Certificate     | certificate.distribution.send |
| Revoke Certificate   | certificate.revoke            |
| Archive Certificate  | certificate.archive           |
| Restore Certificate  | certificate.restore           |
| Manage Template      | certificate.template.update   |

---

# Business Rules

* Authentication wajib dilakukan sebelum pemeriksaan Permission.
* Permission diperiksa pada setiap request.
* Pengguna tanpa permission menerima HTTP 403 Forbidden.
* Tombol aksi mengikuti permission pengguna.
* Penandatangan hanya dapat menandatangani sertifikat yang menjadi kewenangannya.
* Endpoint verifikasi publik tidak menggunakan RBAC.

---

# Security Rules

* Permission tidak boleh dilewati.
* Pemeriksaan dilakukan pada Service Layer.
* Seluruh perubahan dicatat pada Audit Log.
* Hak akses mengikuti prinsip Least Privilege.

---

# Future Permissions

```text id="crtpm05"
certificate.export

certificate.import

certificate.audit

certificate.bulk-generate

certificate.analytics
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
