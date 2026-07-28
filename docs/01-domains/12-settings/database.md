# Settings Database

**Project:** LIM Digital Platform

**Domain:** Settings

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan struktur database pada Domain Settings.

Domain Settings menyimpan seluruh konfigurasi global yang digunakan oleh LIM Digital Platform, termasuk pengaturan aplikasi, organisasi, keamanan, notifikasi, storage, integrasi, dan feature flag.

---

# Overview

Domain Settings menjadi pusat konfigurasi sistem.

Seluruh domain membaca konfigurasi dari Domain Settings agar perilaku aplikasi tetap konsisten.

---

# Entity Relationship

```text id="setdb01"
Setting
    │
    ├─────────────┬──────────────┬──────────────┐
    ▼             ▼              ▼              ▼
Category     Feature Flag    Integration     Audit
```

---

# Main Tables

## settings

Menyimpan konfigurasi sistem.

| Field       | Type      | Description         |
| ----------- | --------- | ------------------- |
| id          | UUID      | Primary Key         |
| categoryId  | UUID      | Kategori            |
| key         | String    | Configuration Key   |
| value       | Text      | Configuration Value |
| dataType    | Enum      | Jenis Data          |
| description | Text      | Deskripsi           |
| status      | Enum      | Status              |
| createdAt   | Timestamp | Dibuat              |
| updatedAt   | Timestamp | Diubah              |
| deletedAt   | Timestamp | Soft Delete         |

---

## settings_category

Kategori konfigurasi.

| Field       | Type   |
| ----------- | ------ |
| id          | UUID   |
| code        | String |
| name        | String |
| description | Text   |

---

## settings_feature_flag

Feature Flag.

| Field       | Type    |
| ----------- | ------- |
| id          | UUID    |
| key         | String  |
| name        | String  |
| enabled     | Boolean |
| description | Text    |

---

## settings_integration

Konfigurasi integrasi eksternal.

| Field         | Type           |
| ------------- | -------------- |
| id            | UUID           |
| provider      | String         |
| clientId      | String         |
| clientSecret  | Encrypted Text |
| configuration | JSON           |
| status        | Enum           |

---

## settings_audit

Riwayat perubahan konfigurasi.

| Field     | Type      |
| --------- | --------- |
| id        | UUID      |
| settingId | UUID      |
| changedBy | UUID      |
| oldValue  | Text      |
| newValue  | Text      |
| changedAt | Timestamp |

---

# Relationships

| Source       | Relation    | Target           |
| ------------ | ----------- | ---------------- |
| Category     | 1 : N       | Settings         |
| Settings     | 1 : N       | Audit            |
| User         | 1 : N       | Audit            |
| Feature Flag | Independent | System           |
| Integration  | Independent | External Service |

---

# Indexes

```text id="setdb02"
settings.key

settings.status

settings.categoryId

settings_feature_flag.key

settings_integration.provider

settings_category.code
```

---

# Constraints

## Settings

* key wajib unik.
* categoryId wajib.
* dataType wajib.

---

## Category

* code wajib unik.
* name wajib.

---

## Feature Flag

* key wajib unik.

---

## Integration

* provider wajib unik.
* clientSecret wajib dienkripsi.

---

# Soft Delete

Menggunakan Soft Delete:

* settings
* settings_category

Feature Flag, Integration, dan Audit bersifat permanen.

---

# Status Enum

## Settings

```text id="setdb03"
Active

Inactive

Archived
```

---

## Data Type

```text id="setdb04"
String

Number

Boolean

JSON

Array
```

---

# Database Rules

* Key konfigurasi selalu unik.
* Credential disimpan dalam bentuk terenkripsi.
* Seluruh perubahan disimpan pada Audit.
* Konfigurasi dibaca melalui Configuration Service.
* Seluruh akses database menggunakan Repository Pattern.

---

# Future Tables

```text id="setdb05"
settings_environment

settings_localization

settings_theme

settings_backup

settings_version
```

---

# Related Documents

* README.md
* business-rules.md
* workflow.md
* api.md
* permissions.md
* validation.md
* ui.md
* roadmap.md

---

# Acceptance Criteria

* Struktur database mendukung seluruh konfigurasi sistem.
* Key konfigurasi unik.
* Credential terenkripsi.
* Audit perubahan tersedia.
* Seluruh akses database menggunakan Repository Pattern.
