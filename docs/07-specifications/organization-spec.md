# Organization Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `organization-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Organization Domain**.

Organization merupakan domain inti yang mengelola data organisasi, struktur organisasi, unit kerja, dan informasi dasar yang digunakan oleh domain lain.

Domain ini menjadi referensi utama bagi Program, Secretariat, Letter, Certificate, Dashboard, dan CMS.

---

# Objectives

Organization harus mampu:

* Mengelola profil organisasi.
* Mengelola struktur organisasi.
* Mengelola unit kerja.
* Mengelola jabatan.
* Mengelola anggota organisasi.
* Menyediakan data organisasi untuk domain lain.

---

# Actors

| Actor               | Description                  |
| ------------------- | ---------------------------- |
| Super Administrator | Mengelola seluruh organisasi |
| Administrator       | Mengelola organisasi         |
| Operator            | Memperbarui data organisasi  |
| User                | Melihat informasi organisasi |
| System              | Menggunakan data organisasi  |

---

# Functional Requirements

## Organization Profile

Administrator dapat:

* Create Organization
* Update Organization
* View Organization
* Archive Organization

---

## Organization Structure

Mengelola:

* Division
* Department
* Unit
* Branch

---

## Position Management

Mengelola:

* Position
* Job Title
* Leadership
* Organizational Hierarchy

---

## Member Assignment

Administrator dapat:

* Assign Member
* Remove Member
* Change Position

---

## Organization Status

Status organisasi:

* Active
* Inactive
* Archived

---

# Non Functional Requirements

Organization harus:

* Response < 300 ms
* Mendukung Pagination
* Audit Enabled
* Highly Available

---

# Preconditions

* User telah Login.
* Memiliki Permission yang sesuai.

---

# Postconditions

Perubahan data organisasi:

* Audit Log dibuat.
* Cache diperbarui.
* Domain Event diterbitkan.

---

# Main Flow

```text id="org01"
Request

↓

Authorization

↓

Validation

↓

Application Service

↓

Organization Aggregate

↓

Repository

↓

Database

↓

Publish Event

↓

Response
```

---

# Alternative Flow

```text id="org02"
Organization Exists

↓

Validation Failed

↓

Return Error
```

---

# Exception Flow

* Organization tidak ditemukan.
* Nama organisasi sudah digunakan.
* Parent Organization tidak valid.
* User tidak memiliki Permission.
* Data tidak valid.

---

# Sequence Diagram

```text id="org03"
Client

↓

Organization API

↓

Application

↓

Organization Repository

↓

Database

↓

Event Bus
```

---

# State Diagram

```text id="org04"
Draft

↓

Active

↓

Inactive

↓

Archived
```

---

# Domain Model

Entity:

* Organization
* Division
* Department
* Position
* Member

Aggregate:

* Organization

Value Object:

* OrganizationName
* OrganizationCode
* Address

---

# Database Mapping

Tables:

```text id="org05"
organizations

organization_units

organization_positions

organization_members
```

---

# API Specification

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | /api/v1/organizations      |
| GET    | /api/v1/organizations/{id} |
| POST   | /api/v1/organizations      |
| PATCH  | /api/v1/organizations/{id} |
| DELETE | /api/v1/organizations/{id} |

---

# Validation Matrix

| Field   | Rule                      |
| ------- | ------------------------- |
| name    | Required, Max 200, Unique |
| code    | Required, Unique          |
| email   | Optional, Email           |
| phone   | Optional                  |
| address | Required                  |

---

# Permission Matrix

| Action | Admin | Operator | User |
| ------ | :---: | :------: | :--: |
| View   |   ✅   |     ✅    |   ✅  |
| Create |   ✅   |     ❌    |   ❌  |
| Update |   ✅   |     ✅    |   ❌  |
| Delete |   ✅   |     ❌    |   ❌  |

---

# Error Catalog

| Code    | Description                 |
| ------- | --------------------------- |
| ORG_001 | Organization Not Found      |
| ORG_002 | Duplicate Organization Code |
| ORG_003 | Duplicate Organization Name |
| ORG_004 | Invalid Parent Organization |
| ORG_005 | Organization Archived       |

---

# Notification Matrix

| Event                 | Notification  |
| --------------------- | ------------- |
| Organization Created  | Administrator |
| Organization Updated  | Administrator |
| Organization Archived | Administrator |

---

# Domain Events

```text id="org06"
OrganizationCreated

OrganizationUpdated

OrganizationArchived

MemberAssigned

PositionChanged
```

---

# Acceptance Test

* Organisasi berhasil dibuat.
* Organisasi berhasil diperbarui.
* Struktur organisasi berhasil dibuat.
* Member berhasil ditambahkan.
* Permission divalidasi.
* Audit Log tercatat.
* Domain Event diterbitkan.

---

# Performance Requirement

* Create Organization < 500 ms.
* Search Organization < 300 ms.
* List Organization mendukung Pagination.

---

# Security Requirement

* RBAC diterapkan.
* Audit Log aktif.
* Input tervalidasi.
* Soft Delete digunakan.
* Seluruh endpoint menggunakan HTTPS.

---

# Acceptance Criteria

* Seluruh Business Rules Organization berjalan sesuai spesifikasi.
* API mengikuti API Standard.
* Domain Event diterbitkan untuk setiap perubahan penting.
* Audit Log mencatat seluruh aktivitas.
* Specification siap digunakan sebagai dasar implementasi Organization Domain.
