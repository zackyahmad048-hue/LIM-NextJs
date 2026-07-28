# Server Configuration

**Project:** LIM Digital Platform

**Folder:** `04-deployment`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar konfigurasi server pada LIM Digital Platform.

Tujuannya adalah memastikan server Production, Staging, dan Development memiliki konfigurasi yang aman, konsisten, stabil, dan mudah dikelola.

---

# Objectives

Konfigurasi server bertujuan untuk:

* Menjamin stabilitas sistem.
* Meningkatkan keamanan.
* Mendukung performa tinggi.
* Memudahkan proses deployment.
* Mempermudah monitoring dan maintenance.

---

# Server Architecture

```text id="server01"
Internet

↓

Firewall

↓

Load Balancer (Optional)

↓

Nginx

↓

Application Server

↓

Redis

↓

PostgreSQL

↓

Object Storage
```

---

# Operating System

Rekomendasi:

```text id="server02"
Ubuntu Server LTS
```

Atau distribusi Linux yang didukung organisasi.

---

# Server Roles

| Server        | Function       |
| ------------- | -------------- |
| Reverse Proxy | Nginx          |
| Application   | Backend API    |
| Database      | PostgreSQL     |
| Cache         | Redis          |
| Worker        | Background Job |
| Monitoring    | Metrics & Logs |

Pada deployment kecil, beberapa role dapat dijalankan pada server yang sama.

---

# Directory Structure

```text id="server03"
/opt/lim-platform/

/app/

/logs/

/backups/

/config/

/storage/
```

---

# Reverse Proxy

Menggunakan:

```text id="server04"
Nginx
```

Tugas:

* HTTPS Termination
* Reverse Proxy
* Compression
* Static File
* Rate Limiting
* Security Header

---

# SSL/TLS

Server wajib menggunakan:

* HTTPS
* TLS 1.2+
* Sertifikat valid
* Automatic Renewal (misalnya Let's Encrypt)

HTTP harus diarahkan ke HTTPS.

---

# Firewall

Port yang dibuka:

| Port | Service         |
| ---- | --------------- |
| 80   | HTTP (Redirect) |
| 443  | HTTPS           |
| 22   | SSH (dibatasi)  |

Port database tidak boleh diakses publik.

---

# Resource Recommendation

## Development

* 2 CPU
* 4 GB RAM
* 40 GB Storage

## Staging

* 4 CPU
* 8 GB RAM
* 100 GB Storage

## Production

* 8+ CPU
* 16+ GB RAM
* SSD Storage
* Backup Storage

---

# Process Management

Gunakan:

* Docker Compose
* Systemd
* Supervisor (jika diperlukan)

Worker harus dapat restart otomatis apabila gagal.

---

# Time Configuration

Server wajib:

* Menggunakan UTC atau zona waktu yang telah ditentukan.
* Sinkron dengan NTP Server.
* Memiliki waktu sistem yang akurat.

---

# Logging

Lokasi log:

```text id="server05"
/logs

↓

Application

Nginx

Worker

Audit
```

Log harus memiliki kebijakan rotasi (Log Rotation).

---

# Maintenance

Kegiatan rutin:

* Update keamanan.
* Patch sistem operasi.
* Membersihkan log lama.
* Memeriksa kapasitas disk.
* Memverifikasi backup.

---

# Security Hardening

Server wajib:

* Menonaktifkan login root melalui SSH.
* Menggunakan SSH Key Authentication.
* Mengaktifkan Firewall.
* Membatasi akses SSH.
* Menonaktifkan service yang tidak digunakan.
* Memperbarui paket keamanan secara berkala.

---

# Health Check

Server dipantau melalui:

* CPU Usage
* Memory Usage
* Disk Usage
* Network
* Service Status
* HTTP Health Endpoint

---

# Disaster Recovery

Apabila server gagal:

```text id="server06"
Restore Backup

↓

Deploy Application

↓

Restore Database

↓

Health Check

↓

Production Ready
```

---

# Related Documents

* README.md
* environment.md
* docker.md
* ci-cd.md
* backup.md
* monitoring.md
* security.md

---

# Acceptance Criteria

* Server memiliki konfigurasi standar.
* HTTPS diterapkan.
* Firewall aktif.
* Backup dan monitoring tersedia.
* Server Configuration menjadi standar operasional LIM Digital Platform.
