# Environment Configuration

**Project:** LIM Digital Platform

**Folder:** `04-deployment`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar konfigurasi **Environment** pada LIM Digital Platform.

Tujuannya adalah memastikan setiap environment memiliki konfigurasi yang konsisten, aman, dan mudah dikelola.

---

# Environment Types

LIM Digital Platform menggunakan lima environment.

```text id="env01"
Local

↓

Development

↓

Testing

↓

Staging

↓

Production
```

---

# Environment Description

## Local

Digunakan oleh Developer.

Karakteristik:

- Docker Compose
- Debug Enabled
- Mock Service diperbolehkan
- Database lokal

---

## Development

Digunakan untuk integrasi antar developer.

Karakteristik:

- Shared Database
- Internal Access
- Debug terbatas
- Data non-produksi

---

## Testing

Digunakan untuk:

- QA
- Integration Test
- Automated Testing

Data dapat di-reset kapan saja.

---

## Staging

Menyerupai Production.

Digunakan untuk:

- User Acceptance Test (UAT)
- Performance Test
- Final Validation

Konfigurasi harus semirip mungkin dengan Production.

---

## Production

Digunakan oleh pengguna akhir.

Karakteristik:

- High Availability
- HTTPS Only
- Monitoring aktif
- Backup otomatis
- Audit Log aktif

---

# Environment Variables

Seluruh konfigurasi menggunakan **Environment Variable**.

Contoh:

```text id="env02"
APP_NAME

APP_ENV

APP_URL

APP_PORT

LOG_LEVEL
```

---

# Database Variables

```text id="env03"
DB_HOST

DB_PORT

DB_NAME

DB_USER

DB_PASSWORD
```

---

# Authentication Variables

```text id="env04"
JWT_SECRET

JWT_EXPIRES_IN

REFRESH_TOKEN_SECRET

REFRESH_TOKEN_EXPIRES_IN
```

---

# Storage Variables

```text id="env05"
STORAGE_DRIVER

STORAGE_BUCKET

STORAGE_ENDPOINT

STORAGE_ACCESS_KEY

STORAGE_SECRET_KEY
```

---

# Notification Variables

```text id="env06"
SMTP_HOST

SMTP_PORT

SMTP_USERNAME

SMTP_PASSWORD

FIREBASE_PROJECT_ID
```

---

# Security Rules

- Secret tidak boleh disimpan di repository.
- Gunakan `.env` atau Secret Manager.
- Password wajib dienkripsi.
- Production menggunakan Secret Management.
- Setiap environment memiliki secret yang berbeda.

---

# Configuration Rules

- Tidak boleh melakukan hardcode konfigurasi.
- Seluruh konfigurasi dibaca dari Environment Variable.
- Default Value hanya digunakan untuk Local Development.
- Perubahan konfigurasi Production harus melalui proses persetujuan.

---

# Environment Files

Contoh:

```text id="env07"
.env.example

.env.local

.env.development

.env.testing

.env.staging

.env.production
```

File `.env.production` tidak disimpan di repository.

---

# Deployment Flow

```text id="env08"
Environment Variables

↓

Configuration Loader

↓

Application

↓

Runtime
```

---

# Best Practices

- Gunakan `.env.example` sebagai template.
- Pisahkan konfigurasi per environment.
- Rotasi secret secara berkala.
- Dokumentasikan seluruh Environment Variable.
- Validasi konfigurasi saat aplikasi dijalankan.

---

# Related Documents

- README.md
- docker.md
- ci-cd.md
- server.md
- backup.md
- monitoring.md
- security.md

---

# Acceptance Criteria

- Seluruh konfigurasi menggunakan Environment Variable.
- Tidak ada secret yang tersimpan di repository.
- Setiap environment memiliki konfigurasi terpisah.
- Production menggunakan Secret Management.
- Konfigurasi terdokumentasi dengan lengkap.
