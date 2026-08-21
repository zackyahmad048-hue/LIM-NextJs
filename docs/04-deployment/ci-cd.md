# CI/CD Pipeline

**Project:** LIM Digital Platform

**Folder:** `04-deployment`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar **Continuous Integration (CI)** dan **Continuous Deployment (CD)** pada LIM Digital Platform.

CI/CD bertujuan mengotomatisasi proses build, testing, quality assurance, dan deployment sehingga proses rilis menjadi lebih cepat, aman, dan konsisten.

---

# Objectives

CI/CD bertujuan untuk:

- Mengotomatisasi proses build.
- Menjalankan pengujian secara otomatis.
- Menjaga kualitas kode.
- Mempercepat deployment.
- Mengurangi human error.
- Mendukung release yang lebih sering.

---

# Pipeline Overview

```text id="cicd01"
Commit

↓

Push

↓

GitHub Actions

↓

Lint

↓

Static Analysis

↓

Unit Test

↓

Integration Test

↓

Build

↓

Docker Image

↓

Deploy Staging

↓

UAT

↓

Deploy Production
```

---

# CI Workflow

Continuous Integration dijalankan setiap:

- Push ke `develop`
- Pull Request
- Push ke `main`

Tahapan:

```text id="cicd02"
Checkout

↓

Install Dependency

↓

Lint

↓

Test

↓

Coverage

↓

Build
```

---

# CD Workflow

Deployment dilakukan setelah CI berhasil.

```text id="cicd03"
Build Image

↓

Push Image Registry

↓

Deploy

↓

Health Check

↓

Verification
```

---

# Branch Rules

| Branch    | Action             |
| --------- | ------------------ |
| feature/* | CI Only            |
| develop   | Deploy Development |
| release/* | Deploy Staging     |
| main      | Deploy Production  |

---

# Quality Gate

Pipeline hanya dapat dilanjutkan apabila:

- Linter berhasil.
- Static Analysis berhasil.
- Unit Test berhasil.
- Integration Test berhasil.
- Coverage memenuhi standar.
- Build berhasil.

---

# Build Artifacts

Artifact yang dihasilkan:

- Docker Image
- Build Output
- Coverage Report
- Test Report

Artifact disimpan sesuai kebijakan retensi proyek.

---

# Deployment Strategy

Environment:

```text id="cicd04"
Development

↓

Testing

↓

Staging

↓

Production
```

Deployment Production dilakukan setelah persetujuan (manual approval) apabila diperlukan.

---

# Rollback Strategy

Apabila deployment gagal:

```text id="cicd05"
Deployment Failed

↓

Rollback

↓

Previous Version

↓

Health Check
```

Rollback menggunakan image versi sebelumnya yang telah tervalidasi.

---

# Secret Management

CI/CD menggunakan Secret Manager untuk:

- Database Password
- JWT Secret
- API Key
- SMTP Credential
- Object Storage Credential
- Deployment Token

Secret tidak boleh ditulis di repository maupun workflow.

---

# Notifications

Pipeline mengirim notifikasi ketika:

- Build gagal.
- Test gagal.
- Deployment berhasil.
- Deployment gagal.
- Rollback dilakukan.

Media notifikasi dapat berupa:

- Email
- Slack
- Microsoft Teams
- WhatsApp (opsional)

---

# Monitoring

Pipeline mencatat:

- Build Duration
- Test Duration
- Deployment Time
- Success Rate
- Failure Rate

Seluruh aktivitas deployment dicatat pada Audit Log.

---

# Best Practices

- Jalankan pipeline sesingkat mungkin.
- Cache dependency untuk mempercepat build.
- Gunakan reusable workflow.
- Pisahkan workflow CI dan CD.
- Gunakan tag versi untuk deployment Production.
- Jangan deploy langsung dari branch feature.

---

# Related Documents

- README.md
- environment.md
- docker.md
- server.md
- backup.md
- monitoring.md
- security.md

---

# Acceptance Criteria

- CI berjalan otomatis pada setiap Pull Request.
- CD mengikuti alur deployment yang telah ditentukan.
- Pipeline memiliki Quality Gate.
- Rollback dapat dilakukan dengan cepat.
- CI/CD menjadi standar deployment LIM Digital Platform.
