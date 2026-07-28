# Docker

**Project:** LIM Digital Platform

**Folder:** `04-deployment`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar penggunaan **Docker** pada LIM Digital Platform.

Docker digunakan untuk memastikan lingkungan pengembangan, pengujian, dan deployment memiliki konfigurasi yang konsisten sehingga aplikasi dapat dijalankan di berbagai environment tanpa perbedaan konfigurasi.

---

# Objectives

Penggunaan Docker bertujuan untuk:

* Menyamakan environment.
* Mempermudah deployment.
* Mengurangi masalah dependency.
* Mendukung CI/CD.
* Memudahkan scaling.

---

# Architecture

```text id="docker01"
Internet

↓

Nginx

↓

Application Container

↓

Redis

↓

PostgreSQL

↓

Object Storage
```

---

# Container Structure

```text id="docker02"
docker/

Dockerfile

Dockerfile.dev

docker-compose.yml

docker-compose.dev.yml

docker-compose.prod.yml

nginx/

scripts/
```

---

# Main Containers

Container utama:

| Container | Purpose             |
| --------- | ------------------- |
| app       | Backend Application |
| nginx     | Reverse Proxy       |
| postgres  | Database            |
| redis     | Cache & Queue       |
| worker    | Background Jobs     |
| scheduler | Scheduled Tasks     |

---

# Docker Images

Image menggunakan versi yang stabil.

Contoh:

```text id="docker03"
Node.js LTS

PostgreSQL 16

Redis 7

Nginx Stable

Alpine Linux
```

Versi dapat diperbarui sesuai kebutuhan proyek.

---

# Docker Network

```text id="docker04"
frontend-network

backend-network
```

Komunikasi antar container dilakukan melalui Docker Network, bukan IP Address statis.

---

# Docker Volumes

Volume digunakan untuk:

```text id="docker05"
database-data

application-storage

logs

redis-data
```

Volume memastikan data tetap tersimpan meskipun container diganti.

---

# Environment Integration

Docker membaca konfigurasi dari:

```text id="docker06"
.env

↓

Docker Compose

↓

Container

↓

Application
```

Tidak ada konfigurasi yang di-hardcode di dalam image.

---

# Health Check

Setiap service wajib memiliki Health Check.

Contoh:

```text id="docker07"
Application

↓

HTTP Health Endpoint

↓

Healthy / Unhealthy
```

Container yang gagal Health Check dapat di-restart secara otomatis.

---

# Build Strategy

Tahapan build:

```text id="docker08"
Source Code

↓

Install Dependencies

↓

Run Test

↓

Build

↓

Create Image
```

Gunakan **Multi-stage Build** untuk mengurangi ukuran image Production.

---

# Security Rules

* Jalankan container menggunakan non-root user.
* Gunakan image resmi atau image yang telah diverifikasi.
* Hindari menyimpan secret di Dockerfile.
* Scan image terhadap kerentanan sebelum deployment.
* Perbarui base image secara berkala.

---

# Logging

Seluruh container mengirim log ke:

* Standard Output (stdout)
* Standard Error (stderr)

Log kemudian dikumpulkan oleh sistem monitoring.

---

# Best Practices

* Gunakan satu proses utama per container.
* Gunakan image sekecil mungkin (misalnya Alpine jika sesuai).
* Gunakan tag versi yang spesifik, hindari `latest`.
* Bersihkan dependency yang tidak diperlukan saat build.
* Pisahkan konfigurasi Development dan Production.

---

# Production Deployment

Deployment Production menggunakan:

```text id="docker09"
Docker Compose

↓

Reverse Proxy

↓

Application

↓

Worker

↓

Database
```

Untuk kebutuhan skala besar, arsitektur dapat dimigrasikan ke Kubernetes tanpa perubahan Business Rules.

---

# Related Documents

* README.md
* environment.md
* ci-cd.md
* server.md
* backup.md
* monitoring.md
* security.md

---

# Acceptance Criteria

* Seluruh service berjalan dalam container.
* Konfigurasi dipisahkan berdasarkan environment.
* Image Production menggunakan Multi-stage Build.
* Container memiliki Health Check.
* Docker menjadi standar deployment LIM Digital Platform.
