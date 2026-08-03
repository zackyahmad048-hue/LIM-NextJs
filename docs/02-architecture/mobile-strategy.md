# Mobile App & API Integration Strategy

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Document:** `mobile-strategy.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan strategi integrasi antara aplikasi mobile (Android & iOS) dengan backend LIM Digital Platform.

Strategi ini memastikan backward compatibility, performa, dan pengalaman pengguna yang optimal pada perangkat mobile.

---

# API Versioning

Untuk menjaga backward compatibility pada aplikasi mobile (karena pengguna tidak selalu update aplikasi), semua endpoint API harus menggunakan versioning di URL:

```text
GET /api/v1/falak/prayer-times
GET /api/v1/programs
GET /api/v1/certificates
```

Jika ada perubahan breaking/schema, buat `v2` tanpa menghapus `v1`.

---

# Versioning Rules

- Format: `/api/v{major}/`
- Minor changes (field tambahan) tidak memerlukan versi baru.
- Breaking changes (field dihapus, type berubah) wajib versi baru.
- Versi lama tetap aktif minimal 6 bulan setelah versi baru dirilis.
- Deprecation notice dikirimkan melalui response header.

---

# Push Notifications

Menggunakan **Firebase Cloud Messaging (FCM)** untuk pengiriman notifikasi ke perangkat mobile.

## Flow

```text
Backend Domain Event
      |
Notification Worker
      |
FCM API
      |
Mobile Device
```

## Event Types

| Event                  | Description                 | Target                  |
| ---------------------- | --------------------------- | ----------------------- |
| HilalSightedEvent      | Hilal terlihat              | Seluruh user di wilayah |
| ProgramPublishedEvent  | Program baru dipublikasikan | Seluruh user            |
| CertificateIssuedEvent | Sertifikat diterbitkan      | Peserta program         |
| LetterApprovedEvent    | Surat disetujui             | Pemohon                 |
| ScheduleUpdatedEvent   | Jadwal sholat berubah       | Seluruh user di wilayah |

---

# Mobile App Architecture

```text
UI Layer (React Native / Flutter)
      |
State Management
      |
API Service Layer
      |
HTTP Client (dio / axios)
      |
REST API (Backend)
```

---

# Offline Support

Aplikasi mobile harus mendukung mode offline untuk fitur tertentu:

- Jadwal sholat (cache lokal).
- Lokasi musholla (cache lokal).
- Dokumen sertifikat (download untuk akses offline).

---

# Sync Strategy

```text
Online Mode
      |
Real-time API call
      |
Update local cache
```

```text
Offline Mode
      |
Read from local cache
      |
Queue pending changes
      |
Sync when online
```

---

# Security

- Token autentikasi disimpan di secure storage (Keychain / Keystore).
- Certificate pinning untuk mencegah MITM attacks.
- Token refresh otomatis saat expired.
- Logout membersihkan seluruh local data.

---

# Related Documents

- `README.md` - Architecture overview.
- `architecture-overview.md` - High level architecture.
- `frontend.md` - Frontend architecture.
- `dependency-rules.md` - Dependency rules.

---

# Acceptance Criteria

- API versioning terimplementasi pada seluruh endpoint.
- Push notification berfungsi untuk seluruh event types.
- Offline support tersedia untuk fitur yang diizinkan.
- Security best practices terimplementasi.
- Backward compatibility terjaga antar versi aplikasi.
