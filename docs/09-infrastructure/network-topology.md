# Network Topology

**Project:** LIM Digital Platform

**Folder:** `09-infrastructure`

**Document:** `network-topology.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan arsitektur jaringan (Network Topology) yang digunakan oleh LIM Digital Platform.

Topologi jaringan dirancang untuk memberikan:

* Keamanan
* Skalabilitas
* Ketersediaan tinggi (High Availability)
* Performa
* Kemudahan operasional

---

# Objectives

Network Topology bertujuan untuk:

* Mengisolasi layanan berdasarkan fungsi.
* Melindungi layanan internal.
* Mengurangi attack surface.
* Mendukung deployment cloud maupun on-premise.
* Mempermudah monitoring dan troubleshooting.

---

# Network Architecture

```text id="net01"
Internet

↓

DNS

↓

CDN (Optional)

↓

Firewall

↓

Reverse Proxy

↓

Load Balancer

↓

Application Network

├── Backend API
├── Frontend
├── Worker
└── Scheduler

↓

Internal Service Network

├── PostgreSQL
├── Redis
├── Object Storage
└── Monitoring

↓

Backup Network
```

---

# Network Segmentation

Jaringan dibagi menjadi beberapa segmen.

## Public Network

Berisi layanan yang dapat diakses publik:

* Reverse Proxy
* Load Balancer
* Frontend

---

## Application Network

Berisi:

* Backend API
* Worker
* Scheduler
* Internal API

Tidak dapat diakses langsung dari Internet.

---

## Data Network

Berisi:

* PostgreSQL
* Redis
* Object Storage

Hanya dapat diakses oleh Application Network.

---

## Management Network

Digunakan untuk:

* Monitoring
* Logging
* Backup
* Deployment
* Administration

Akses dibatasi hanya untuk Administrator.

---

# Network Flow

```text id="net02"
Client

↓

HTTPS

↓

Reverse Proxy

↓

Application Server

↓

Database / Cache / Storage

↓

Response
```

---

# Communication Rules

| Source        | Destination    | Allowed |
| ------------- | -------------- | ------- |
| Internet      | Reverse Proxy  | ✅       |
| Reverse Proxy | Backend API    | ✅       |
| Backend API   | PostgreSQL     | ✅       |
| Backend API   | Redis          | ✅       |
| Backend API   | Object Storage | ✅       |
| Internet      | PostgreSQL     | ❌       |
| Internet      | Redis          | ❌       |
| Internet      | Monitoring     | ❌       |

---

# Firewall Policy

Firewall wajib:

* Menutup seluruh port yang tidak digunakan.
* Mengizinkan hanya port layanan yang diperlukan.
* Membatasi akses administratif.
* Mendukung IP Allowlist untuk layanan internal.

---

# DNS Strategy

DNS digunakan untuk:

* Website
* API
* Admin Portal
* Monitoring (Internal)

Contoh:

```text id="net03"
example.com

api.example.com

admin.example.com
```

---

# HTTPS

Seluruh komunikasi publik wajib menggunakan:

* HTTPS
* TLS 1.2 atau lebih baru
* Sertifikat yang valid

HTTP harus diarahkan (redirect) ke HTTPS.

---

# Load Balancing

Load Balancer mendukung:

* Round Robin
* Health Check
* Session Persistence (jika diperlukan)
* Automatic Failover

---

# Security

Network wajib menerapkan:

* Firewall
* HTTPS
* Network Isolation
* Rate Limiting
* DDoS Protection (jika tersedia)
* Secret Management

---

# Monitoring

Jaringan dipantau menggunakan:

* Latency
* Packet Loss
* Availability
* Traffic
* Error Rate

Alert dikirim ketika melewati ambang batas yang ditentukan.

---

# Best Practices

* Jangan membuka akses langsung ke Database.
* Pisahkan jaringan publik dan internal.
* Gunakan Reverse Proxy sebagai titik masuk tunggal.
* Terapkan prinsip Least Privilege pada akses jaringan.
* Dokumentasikan setiap perubahan konfigurasi jaringan.

---

# Related Documents

* README.md
* server-architecture.md
* container-platform.md
* monitoring-infrastructure.md

---

# Acceptance Criteria

* Jaringan tersegmentasi dengan jelas.
* Database dan layanan internal tidak dapat diakses langsung dari Internet.
* Seluruh komunikasi publik menggunakan HTTPS.
* Firewall dan Network Isolation diterapkan.
* Network Topology menjadi acuan resmi implementasi jaringan LIM Digital Platform.
