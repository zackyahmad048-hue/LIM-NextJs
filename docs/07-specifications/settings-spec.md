# Settings Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `settings-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Settings Domain**.

Settings Domain bertanggung jawab mengelola seluruh konfigurasi sistem yang digunakan oleh domain lain, seperti konfigurasi aplikasi, organisasi, keamanan, notifikasi, storage, integrasi, dan parameter operasional.

Settings Domain menjadi **Single Source of Configuration** pada LIM Digital Platform.

---

# Objectives

Settings harus mampu:

- Mengelola Konfigurasi Sistem.
- Mengelola Konfigurasi Organisasi.
- Mengelola Feature Flag.
- Mengelola Parameter Aplikasi.
- Mengelola Integrasi.
- Mengelola Konfigurasi Notifikasi.
- Mengelola Konfigurasi Storage.

---

# Actors

| Actor               | Description                      |
| ------------------- | -------------------------------- |
| Super Administrator | Mengelola seluruh konfigurasi    |
| Administrator       | Mengelola konfigurasi organisasi |
| System              | Membaca konfigurasi              |
| DevOps              | Mengelola konfigurasi deployment |

---

# Functional Requirements

## System Settings

Mengelola:

- Application Name
- Timezone
- Locale
- Theme
- Date Format
- Number Format

---

## Organization Settings

Mengelola:

- Organization Profile
- Logo
- Contact Information
- Default Language

---

## Feature Flags

Mengelola:

- Enable Feature
- Disable Feature
- Beta Feature
- Experimental Feature

---

## Notification Settings

Mengelola:

- Email Notification
- Push Notification
- Reminder
- Daily Digest

---

## Storage Settings

Mengelola:

- Storage Provider
- Upload Limit
- Allowed MIME Types
- Retention Policy

---

## Security Settings

Mengelola:

- Password Policy
- Session Timeout
- Login Attempt Limit
- MFA Configuration (Future)

---

# Non Functional Requirements

Settings harus:

- Response < 200 ms.
- Cached.
- Highly Available.
- Audit Enabled.

---

# Preconditions

- User telah Login.
- Memiliki Permission.
- Nilai konfigurasi valid.

---

# Postconditions

- Konfigurasi diperbarui.
- Cache diperbarui.
- Audit Log dibuat.
- Domain Event diterbitkan.

---

# Main Flow

```text id="setting01"
Request

↓

Authentication

↓

Authorization

↓

Validation

↓

Settings Service

↓

Repository

↓

Database

↓

Cache Refresh

↓

Publish Event

↓

Response
```

---

# Alternative Flow

```text id="setting02"
Cache Available

↓

Read Cache

↓

Response
```

---

# Exception Flow

- Setting tidak ditemukan.
- Nilai konfigurasi tidak valid.
- Permission ditolak.
- Cache gagal diperbarui.

---

# Sequence Diagram

```text id="setting03"
Client

↓

Settings API

↓

Application

↓

Repository

↓

Database

↓

Cache

↓

Response
```

---

# State Diagram

```text id="setting04"
Current

↓

Updated

↓

Applied
```

---

# Domain Model

Entity:

- Setting
- FeatureFlag

Aggregate:

- Settings

Value Object:

- SettingKey
- SettingValue
- ConfigurationScope

---

# Database Mapping

Tables:

```text id="setting05"
settings

feature_flags

organization_settings
```

---

# API Specification

| Method | Endpoint                  |
| ------ | ------------------------- |
| GET    | /api/v1/settings          |
| PATCH  | /api/v1/settings          |
| GET    | /api/v1/settings/features |
| PATCH  | /api/v1/settings/features |

---

# Validation Matrix

| Field | Rule                        |
| ----- | --------------------------- |
| key   | Required                    |
| value | Required                    |
| scope | Enum (System, Organization) |

---

# Permission Matrix

| Action               | Super Admin | Admin | User |
| -------------------- | :---------: | :---: | :--: |
| View Settings        |     ✅      |  ✅   |  ❌  |
| Update Settings      |     ✅      |  ❌   |  ❌  |
| View Feature Flags   |     ✅      |  ✅   |  ❌  |
| Update Feature Flags |     ✅      |  ❌   |  ❌  |

---

# Error Catalog

| Code        | Description            |
| ----------- | ---------------------- |
| SETTING_001 | Setting Not Found      |
| SETTING_002 | Invalid Setting Value  |
| SETTING_003 | Feature Flag Not Found |
| SETTING_004 | Configuration Conflict |

---

# Notification Matrix

| Event                   | Notification  |
| ----------------------- | ------------- |
| System Setting Changed  | Administrator |
| Feature Flag Enabled    | Administrator |
| Security Policy Updated | Administrator |

---

# Domain Events

```text id="setting06"
SettingUpdated

FeatureFlagEnabled

FeatureFlagDisabled

OrganizationSettingUpdated
```

---

# Acceptance Test

- Konfigurasi berhasil diperbarui.
- Feature Flag berhasil diaktifkan.
- Cache diperbarui.
- Audit Log tercatat.
- Domain Event diterbitkan.

---

# Performance Requirement

- Read Settings < 100 ms.
- Update Settings < 300 ms.
- Cache Hit Ratio > 95%.

---

# Security Requirement

- Hanya Super Administrator yang dapat mengubah System Settings.
- Seluruh perubahan dicatat pada Audit Log.
- Konfigurasi sensitif tidak boleh diekspos melalui API publik.
- Secret tetap dikelola melalui Environment Variable atau Secret Manager.
- Seluruh endpoint menggunakan HTTPS.

---

# Acceptance Criteria

- Seluruh konfigurasi sistem dikelola melalui Settings Domain.
- Feature Flag berfungsi sesuai konfigurasi.
- Cache dan Audit Log berjalan dengan baik.
- API mengikuti API Standard.
- Specification siap digunakan sebagai dasar implementasi Settings Domain.
