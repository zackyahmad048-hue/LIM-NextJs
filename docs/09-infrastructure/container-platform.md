# Container Platform

**Project:** LIM Digital Platform

**Folder:** `09-infrastructure`

**Document:** `container-platform.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar penggunaan container pada LIM Digital Platform.

Seluruh layanan dijalankan menggunakan container untuk memastikan konsistensi lingkungan, kemudahan deployment, portabilitas, dan skalabilitas.

Docker digunakan sebagai platform container utama, dengan dukungan orkestrasi menggunakan Docker Compose untuk Development dan Kubernetes sebagai opsi untuk Production berskala besar.

---

# Objectives

Container Platform bertujuan untuk:

- Menyeragamkan lingkungan Development.
- Mempermudah Deployment.
- Mendukung Horizontal Scaling.
- Mengisolasi setiap layanan.
- Mempermudah proses CI/CD.

---

# Platform Stack

Container Platform terdiri dari:

- Docker
- Docker Compose
- Container Registry
- Kubernetes (Roadmap Production)
- GitHub Actions CI/CD

---

# Container Architecture

```text id="container01"
Reverse Proxy

↓

Frontend Container

↓

Backend API Container

↓

Worker Container

↓

Scheduler Container

↓

PostgreSQL Container

↓

Redis Container

↓

Object Storage

↓

Monitoring Stack
```

---

# Container Responsibilities

## Frontend

Menjalankan:

- Web Application
- Static Assets

---

## Backend API

Menjalankan:

- REST API
- Authentication
- Business Logic

---

## Worker

Menjalankan:

- Notification
- Queue Processing
- PDF Generation
- Background Job

---

## Scheduler

Menjalankan:

- Cron Job
- Reminder
- Cleanup
- Scheduled Task

---

## PostgreSQL

Menyimpan seluruh data aplikasi.

Persistent Volume wajib digunakan.

---

## Redis

Digunakan untuk:

- Cache
- Queue
- Session
- Rate Limiting

---

# Container Networking

Seluruh container berada pada Internal Network.

Akses langsung hanya diberikan kepada:

- Reverse Proxy
- Monitoring

Database dan Redis tidak boleh diekspos ke Internet.

---

# Persistent Storage

Persistent Volume digunakan untuk:

- PostgreSQL
- Redis (opsional sesuai konfigurasi)
- Uploaded Files
- Logs

Container aplikasi bersifat stateless.

---

# Environment Configuration

Seluruh konfigurasi menggunakan Environment Variable.

Contoh konfigurasi:

```text id="container02"
APP_ENV

DATABASE_URL

REDIS_URL

JWT_SECRET

SMTP_HOST

STORAGE_ENDPOINT
```

Secret tidak boleh disimpan di dalam Image.

---

# Image Management

Seluruh Image harus:

- Menggunakan Base Image resmi.
- Memiliki Version Tag.
- Dipindai terhadap Vulnerability.
- Dibangun melalui CI/CD Pipeline.

Contoh:

```text id="container03"
lim-api:1.0.0

lim-worker:1.0.0

lim-web:1.0.0
```

---

# Deployment Strategy

Development:

- Docker Compose

Testing:

- Docker Compose / Kubernetes

Production:

- Kubernetes (Recommended)
- Docker Compose (Small Deployment)

---

# Scaling Strategy

Service yang dapat di-scale:

- API
- Worker
- Frontend

Service yang tidak di-scale sembarangan:

- Scheduler
- Database

---

# Health Check

Setiap container wajib menyediakan:

- Liveness Probe
- Readiness Probe
- Startup Probe

Container yang gagal Health Check harus direstart secara otomatis.

---

# Logging

Seluruh container mengirim log ke:

- STDOUT
- Centralized Logging

Log tidak disimpan permanen di dalam container.

---

# Security

Container wajib:

- Menjalankan Non-Root User.
- Menggunakan Read-Only Filesystem bila memungkinkan.
- Tidak menyimpan Secret di Image.
- Menggunakan Image resmi dan terbaru.
- Memiliki Vulnerability Scanning.
- Menggunakan Network Isolation.

---

# Monitoring

Monitoring dilakukan terhadap:

- CPU Usage
- Memory Usage
- Container Restart
- Health Status
- Network Traffic
- Disk Usage

---

# Best Practices

- Satu container untuk satu layanan utama.
- Gunakan Multi-Stage Build untuk Image Production.
- Hindari menyimpan data penting di dalam container.
- Gunakan Version Tag yang konsisten.
- Build Image melalui CI/CD Pipeline.
- Terapkan prinsip Immutable Container.

---

# Related Documents

- README.md
- server-architecture.md
- database-infrastructure.md
- cache-infrastructure.md
- monitoring-infrastructure.md

---

# Acceptance Criteria

- Seluruh layanan berjalan dalam container.
- Environment konsisten pada seluruh Deployment.
- Container bersifat Stateless.
- Monitoring dan Health Check aktif.
- Container Platform menjadi acuan resmi implementasi container LIM Digital Platform.
