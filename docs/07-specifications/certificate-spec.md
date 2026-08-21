# Certificate Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `certificate-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Certificate Domain**.

Certificate Domain bertanggung jawab mengelola seluruh proses penerbitan sertifikat digital, mulai dari validasi kelayakan peserta, pembuatan nomor sertifikat, rendering dokumen, penerbitan, verifikasi, hingga pencabutan sertifikat.

Domain ini terintegrasi dengan Program, Organization, Media, Notification, dan Dashboard Domain.

---

# Objectives

Certificate harus mampu:

- Mengelola Template Sertifikat.
- Menghasilkan Nomor Sertifikat.
- Menerbitkan Sertifikat Digital.
- Memverifikasi Keaslian Sertifikat.
- Mengelola QR Code.
- Mengelola Revocation.
- Mengelola Riwayat Sertifikat.

---

# Actors

| Actor               | Description                      |
| ------------------- | -------------------------------- |
| Super Administrator | Mengelola seluruh sertifikat     |
| Administrator       | Menyetujui penerbitan sertifikat |
| Operator            | Mengelola proses penerbitan      |
| Participant         | Mengunduh sertifikat             |
| Public User         | Memverifikasi sertifikat         |

---

# Functional Requirements

## Certificate Generation

Mengelola:

- Generate Certificate
- Generate PDF
- Generate QR Code
- Digital Signature (Future)

---

## Template Management

Template mendukung:

- Background
- Logo
- Signature
- Dynamic Placeholder
- QR Code

---

## Verification

Sistem menyediakan:

- Certificate Lookup
- QR Verification
- Certificate Status
- Verification Page

---

## Revocation

Administrator dapat:

- Revoke Certificate
- Restore Certificate (sesuai kebijakan)

---

## Download

Peserta dapat:

- Download PDF
- View Certificate
- Verify Certificate

---

# Non Functional Requirements

Certificate harus:

- Response < 500 ms.
- PDF Generation < 2 detik.
- Audit Enabled.
- Highly Available.

---

# Preconditions

- Program telah selesai.
- Peserta memenuhi syarat.
- Administrator memiliki Permission.

---

# Postconditions

- Sertifikat diterbitkan.
- PDF dibuat.
- QR Code dibuat.
- Notification dikirim.
- Audit Log dibuat.
- Domain Event diterbitkan.

---

# Main Flow

```text id="cert01"
Request

↓

Authentication

↓

Authorization

↓

Eligibility Validation

↓

Generate Certificate Number

↓

Generate PDF

↓

Store File

↓

Database

↓

Publish Event

↓

Response
```

---

# Alternative Flow

```text id="cert02"
Generate Draft

↓

Review

↓

Issue Certificate
```

---

# Exception Flow

- Peserta tidak memenuhi syarat.
- Sertifikat sudah diterbitkan.
- Template tidak ditemukan.
- PDF gagal dibuat.
- Storage tidak tersedia.

---

# Sequence Diagram

```text id="cert03"
Client

↓

Certificate API

↓

Application

↓

Certificate Aggregate

↓

Repository

↓

PDF Generator

↓

Storage

↓

Database

↓

Notification
```

---

# State Diagram

```text id="cert04"
Draft

↓

Generated

↓

Issued

↓

Revoked

↓

Archived
```

---

# Domain Model

Entity:

- Certificate
- CertificateTemplate
- CertificateVerification

Aggregate:

- Certificate

Value Object:

- CertificateNumber
- QRCode
- CertificateStatus

---

# Database Mapping

Tables:

```text id="cert05"
certificates

certificate_templates

certificate_verifications
```

---

# API Specification

| Method | Endpoint                             |
| ------ | ------------------------------------ |
| GET    | /api/v1/certificates                 |
| GET    | /api/v1/certificates/{id}            |
| POST   | /api/v1/certificates/generate        |
| GET    | /api/v1/certificates/verify/{number} |
| POST   | /api/v1/certificates/{id}/revoke     |
| GET    | /api/v1/certificates/{id}/download   |

---

# Validation Matrix

| Field         | Rule     |
| ------------- | -------- |
| participantId | Required |
| programId     | Required |
| templateId    | Required |
| issueDate     | Required |

---

# Permission Matrix

| Action   | Admin | Operator | Participant | Public |
| -------- | :---: | :------: | :---------: | :----: |
| Generate |  ✅   |    ✅    |     ❌      |   ❌   |
| Download |  ✅   |    ✅    |     ✅      |   ❌   |
| Verify   |  ✅   |    ✅    |     ✅      |   ✅   |
| Revoke   |  ✅   |    ❌    |     ❌      |   ❌   |

---

# Error Catalog

| Code     | Description                |
| -------- | -------------------------- |
| CERT_001 | Certificate Not Found      |
| CERT_002 | Certificate Already Issued |
| CERT_003 | Participant Not Eligible   |
| CERT_004 | Template Not Found         |
| CERT_005 | Verification Failed        |
| CERT_006 | Certificate Revoked        |

---

# Notification Matrix

| Event                  | Notification |
| ---------------------- | ------------ |
| Certificate Issued     | Email / Push |
| Certificate Revoked    | Email        |
| Certificate Downloaded | Audit Only   |

---

# Domain Events

```text id="cert06"
CertificateGenerated

CertificateIssued

CertificateDownloaded

CertificateVerified

CertificateRevoked
```

---

# Acceptance Test

- Sertifikat berhasil dibuat.
- Nomor sertifikat unik.
- PDF berhasil dihasilkan.
- QR Code dapat diverifikasi.
- Sertifikat dapat diunduh.
- Revocation berjalan.
- Notification terkirim.
- Audit Log tercatat.

---

# Performance Requirement

- Generate Certificate < 2 detik.
- Verify Certificate < 300 ms.
- Download Certificate < 1 detik.

---

# Security Requirement

- RBAC diterapkan.
- Nomor sertifikat tidak dapat diubah.
- QR Code menggunakan URL verifikasi yang aman.
- File PDF disimpan pada Object Storage.
- Audit Log aktif.
- Seluruh endpoint menggunakan HTTPS.

---

# Acceptance Criteria

- Seluruh Business Rules Certificate berjalan sesuai spesifikasi.
- Nomor sertifikat unik dan dapat diverifikasi.
- PDF dan QR Code dihasilkan secara otomatis.
- Notification dan Domain Event berjalan sesuai desain.
- Specification siap digunakan sebagai dasar implementasi Certificate Domain.
