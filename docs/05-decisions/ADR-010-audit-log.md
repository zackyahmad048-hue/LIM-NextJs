# ADR-010: Audit Log

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Accepted

**Date:** 2026-07-14

---

# Context

LIM Digital Platform mengelola data penting seperti:

- User
- Organization
- Program
- Letter
- Certificate
- Knowledge
- Falak
- Settings

Perubahan terhadap data tersebut harus dapat ditelusuri untuk:

- Investigasi insiden.
- Kepatuhan (Compliance).
- Keamanan.
- Debugging.
- Akuntabilitas pengguna.

Tanpa Audit Log, perubahan data sulit dilacak dan penyebab suatu masalah menjadi sulit diidentifikasi.

---

# Decision

LIM Digital Platform menerapkan **Audit Log** sebagai mekanisme pencatatan seluruh aktivitas penting sistem.

Audit Log merupakan fitur lintas domain (**Cross-Cutting Concern**) yang digunakan oleh seluruh modul.

Audit Log bersifat **append-only**, sehingga catatan yang telah dibuat tidak boleh diubah maupun dihapus melalui proses bisnis normal.

---

# Rationale

Audit Log dipilih karena:

- Mendukung keamanan sistem.
- Memenuhi kebutuhan audit internal.
- Memudahkan investigasi.
- Meningkatkan akuntabilitas pengguna.
- Menjadi dasar analisis aktivitas sistem.

---

# Audit Scope

Audit wajib mencatat aktivitas berikut:

## Authentication

- Login
- Logout
- Login Failed
- Password Changed
- Password Reset

---

## Authorization

- Role Created
- Role Updated
- Permission Changed
- User Role Assigned

---

## Business Data

- Create
- Update
- Delete
- Archive
- Restore
- Approve
- Reject
- Publish

---

## System Activity

- Deployment
- Configuration Change
- Backup
- Restore
- Security Event

---

# Audit Architecture

```text id="adr01001"
Business Action

↓

Application Layer

↓

Audit Service

↓

Audit Repository

↓

Audit Database
```

Audit tidak mengubah Business Logic.

---

# Audit Record

Minimal setiap Audit Log berisi:

```text id="adr01002"
AuditId

Timestamp

UserId

Module

Action

Resource

ResourceId

IPAddress

UserAgent

Status

Metadata
```

---

# Storage Strategy

Audit Log disimpan pada database khusus atau tabel terpisah.

Karakteristik:

- Append Only.
- Tidak dapat diedit.
- Tidak dapat dihapus oleh pengguna biasa.
- Mendukung pencarian dan filtering.

---

# Retention Policy

| Data               | Retention                   |
| ------------------ | --------------------------- |
| Audit Log          | Minimum 5 Tahun             |
| Security Event     | Sesuai kebijakan organisasi |
| Authentication Log | Minimum 1 Tahun             |

Retensi dapat disesuaikan dengan kebutuhan organisasi dan regulasi yang berlaku.

---

# Security

Audit Log wajib:

- Dilindungi dengan RBAC.
- Tidak boleh dimodifikasi.
- Tidak boleh menyimpan Password atau Secret.
- Memiliki Backup berkala.
- Menggunakan Timestamp yang konsisten.

---

# Alternatives Considered

## Application Log Only

Kelebihan:

- Mudah diterapkan.

Kekurangan:

- Tidak mencatat aktivitas bisnis secara lengkap.
- Sulit digunakan untuk audit.

---

## Database Trigger

Kelebihan:

- Otomatis.

Kekurangan:

- Sulit dipelihara.
- Tidak mengetahui konteks bisnis.
- Bergantung pada database tertentu.

---

## Dedicated Audit Service (Chosen)

Kelebihan:

- Konsisten.
- Independen.
- Mudah dikembangkan.
- Mendukung Clean Architecture.

Kekurangan:

- Menambah komponen aplikasi.
- Membutuhkan penyimpanan tambahan.

---

# Consequences

Keuntungan:

- Seluruh aktivitas penting dapat ditelusuri.
- Mendukung Compliance.
- Mempermudah Incident Investigation.
- Meningkatkan transparansi sistem.

Konsekuensi:

- Membutuhkan ruang penyimpanan tambahan.
- Perlu kebijakan retensi.
- Monitoring Audit Log menjadi bagian operasional sistem.

---

# Related Decisions

- ADR-004 Role-Based Access Control
- ADR-005 Event Driven Architecture
- ADR-009 Validation Strategy

---

# References

- OWASP Logging Cheat Sheet
- NIST SP 800-92 Guide to Computer Security Log Management
- Architecture Documentation (`01-domains/*/audit-log.md`)

---

# Status

**Accepted**

---

# Acceptance Criteria

- Seluruh aktivitas penting tercatat pada Audit Log.
- Audit Log bersifat append-only.
- Audit Log tidak menyimpan data sensitif.
- Audit Log dapat ditelusuri berdasarkan pengguna, waktu, modul, dan aksi.
- Audit Log menjadi standar pencatatan aktivitas pada LIM Digital Platform.
