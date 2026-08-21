# Operational Checklist

**Project:** LIM Digital Platform

**Folder:** `11-operations`

**Document:** `operational-checklist.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan **Operational Checklist** yang digunakan sebagai daftar pemeriksaan standar untuk memastikan seluruh layanan LIM Digital Platform berjalan dengan baik sebelum, selama, dan setelah aktivitas operasional.

Checklist ini menjadi referensi utama bagi DevOps Engineer, System Administrator, dan Technical Support.

---

# Objectives

Operational Checklist bertujuan untuk:

- Menstandarkan pemeriksaan operasional.
- Mengurangi Human Error.
- Memastikan kesiapan sistem.
- Mempermudah proses audit operasional.
- Mendukung High Availability.

---

# Daily Checklist

Periksa setiap hari:

| Item                   | Status |
| ---------------------- | :----: |
| Server Online          |   ☐    |
| Reverse Proxy Healthy  |   ☐    |
| Backend API Healthy    |   ☐    |
| Frontend Healthy       |   ☐    |
| Worker Healthy         |   ☐    |
| Scheduler Healthy      |   ☐    |
| PostgreSQL Healthy     |   ☐    |
| Redis Healthy          |   ☐    |
| Object Storage Healthy |   ☐    |
| Monitoring Healthy     |   ☐    |

---

# Application Checklist

Pastikan:

- Login berhasil.
- Dashboard dapat diakses.
- API merespons normal.
- Upload File berhasil.
- Download File berhasil.
- Notification terkirim.
- Queue diproses.
- Search berjalan.

---

# Database Checklist

Periksa:

- Database aktif.
- Backup berhasil.
- Tidak ada Slow Query kritis.
- Storage mencukupi.
- Connection normal.
- Replication normal (jika digunakan).

---

# Infrastructure Checklist

Periksa:

- CPU Usage normal.
- Memory Usage normal.
- Disk Usage aman.
- Network normal.
- SSL Certificate masih berlaku.
- Firewall aktif.

---

# Security Checklist

Pastikan:

- Tidak ada Login mencurigakan.
- Secret tersimpan aman.
- Audit Log aktif.
- Tidak ada Vulnerability kritis.
- Dependency terbaru telah ditinjau.

---

# Backup Checklist

Verifikasi:

- Backup Database berhasil.
- Backup Storage berhasil.
- Backup Configuration berhasil.
- Backup tersimpan pada lokasi yang benar.
- Backup Log tersedia.

---

# Release Checklist

Sebelum Release:

- Build berhasil.
- CI/CD berhasil.
- UAT selesai.
- Backup tersedia.
- Rollback Plan tersedia.
- Release Notes selesai.
- Persetujuan Release lengkap.

---

# Post Release Checklist

Setelah Deployment:

- Health Check berhasil.
- Login berhasil.
- API normal.
- Dashboard normal.
- Monitoring normal.
- Error Rate normal.
- Queue normal.

---

# Incident Checklist

Saat terjadi insiden:

- Severity ditentukan.
- Owner ditugaskan.
- Stakeholder diberi informasi.
- Mitigasi dilakukan.
- Recovery diverifikasi.
- Incident Report dibuat.

---

# Maintenance Checklist

Sebelum Maintenance:

- Backup selesai.
- Maintenance Window aktif.
- Tim diberi informasi.
- Monitoring aktif.
- Rollback Plan siap.

Setelah Maintenance:

- Seluruh Service normal.
- Monitoring normal.
- Dokumentasi diperbarui.
- Maintenance ditutup.

---

# Documentation Checklist

Pastikan:

- Runbook terbaru.
- SOP terbaru.
- Architecture Diagram terbaru.
- Release Notes terdokumentasi.
- Incident Report terdokumentasi.
- Backup Report tersedia.

---

# Operational KPI

Parameter yang dipantau:

| KPI                     | Target  |
| ----------------------- | ------- |
| Availability            | ≥ 99.9% |
| Backup Success Rate     | 100%    |
| Deployment Success Rate | ≥ 95%   |
| Critical Incident       | 0       |
| MTTR                    | ≤ 2 Jam |
| Health Check Success    | 100%    |

---

# Best Practices

- Gunakan Checklist pada setiap aktivitas operasional.
- Jangan melewati item pemeriksaan.
- Dokumentasikan setiap penyimpangan.
- Perbarui Checklist jika terdapat perubahan prosedur.
- Lakukan Review Checklist secara berkala.

---

# Related Documents

- README.md
- runbook.md
- incident-response.md
- maintenance.md
- backup-recovery.md
- release-management.md

---

# Acceptance Criteria

- Seluruh aktivitas operasional memiliki Checklist.
- Pemeriksaan dilakukan secara konsisten.
- KPI operasional dapat dipantau.
- Checklist menjadi standar operasional harian LIM Digital Platform.
