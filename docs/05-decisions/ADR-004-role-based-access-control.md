# ADR-004: Role-Based Access Control (RBAC)

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Accepted

**Date:** 2026-07-14

---

# Context

LIM Digital Platform memiliki banyak jenis pengguna dengan hak akses yang berbeda, seperti:

- Super Administrator
- Administrator
- Operator
- Editor
- Contributor
- Observer
- Public User

Mengelola permission langsung pada setiap pengguna (**User-Based Access Control**) akan menyebabkan kompleksitas tinggi, sulit dipelihara, dan rentan terhadap kesalahan konfigurasi.

Diperlukan mekanisme otorisasi yang terstruktur, fleksibel, dan mudah dikelola.

---

# Decision

LIM Digital Platform menggunakan **Role-Based Access Control (RBAC)** sebagai mekanisme utama Authorization.

Model akses:

```text id="adr00401"
User

↓

Role

↓

Permission

↓

Resource
```

Permission diberikan kepada **Role**, sedangkan User memperoleh hak akses melalui Role yang dimilikinya.

---

# Rationale

RBAC dipilih karena:

- Mudah dikelola.
- Mendukung prinsip Least Privilege.
- Mengurangi duplikasi Permission.
- Mudah dikembangkan ketika jumlah modul bertambah.
- Menjadi standar industri untuk aplikasi enterprise.

---

# Alternatives Considered

## User-Based Access Control

Kelebihan:

- Fleksibel untuk pengguna tertentu.

Kekurangan:

- Sulit dikelola.
- Permission mudah tidak konsisten.
- Tidak cocok untuk sistem berskala besar.

---

## Attribute-Based Access Control (ABAC)

Kelebihan:

- Sangat fleksibel.
- Mendukung aturan kompleks.

Kekurangan:

- Implementasi lebih kompleks.
- Sulit dipahami dan dipelihara.
- Belum diperlukan untuk kebutuhan saat ini.

---

## Hybrid RBAC + ABAC

Kelebihan:

- Sangat fleksibel.

Kekurangan:

- Overengineering pada fase awal proyek.

Pendekatan ini dapat dipertimbangkan di masa depan apabila diperlukan.

---

# Consequences

Keuntungan:

- Hak akses lebih mudah dikelola.
- Penambahan Role baru lebih sederhana.
- Konsisten di seluruh domain.
- Mendukung Audit dan Compliance.

Konsekuensi:

- Memerlukan manajemen Role yang baik.
- Permission harus terdokumentasi dengan jelas.
- Perubahan struktur Role harus melalui proses evaluasi.

---

# Implementation Rules

Permission menggunakan format:

```text id="adr00402"
domain.resource.action
```

Contoh:

```text id="adr00403"
program.create

letter.approve

certificate.generate

knowledge.publish

falak.hisab.calculate
```

Authorization dilakukan pada:

- API Endpoint
- Application Layer
- UI Navigation
- Action Button

---

# Security Principles

RBAC wajib menerapkan:

- Least Privilege
- Default Deny
- Explicit Permission
- Audit Logging

Seluruh perubahan Role dan Permission wajib dicatat pada Audit Log.

---

# Related Decisions

- ADR-001 Domain Driven Design
- ADR-002 Clean Architecture
- ADR-010 Audit Log

---

# References

- NIST Role-Based Access Control Model
- OWASP Authorization Cheat Sheet
- Architecture Documentation (`01-domains/authorization/`)

---

# Status

**Accepted**

---

# Acceptance Criteria

- Seluruh hak akses menggunakan RBAC.
- Permission mengikuti format standar.
- Authorization diterapkan pada UI dan API.
- Seluruh perubahan Role dan Permission diaudit.
- RBAC menjadi standar Authorization LIM Digital Platform.
