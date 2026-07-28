# Glossary

**Project:** LIM Digital Platform

**Folder:** `06-references`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan istilah-istilah (Glossary) yang digunakan pada LIM Digital Platform.

Tujuannya adalah memastikan seluruh anggota tim menggunakan **Ubiquitous Language** yang konsisten dalam proses analisis, desain, implementasi, pengujian, dan operasional.

---

# General Terms

| Term           | Definition                                                                |
| -------------- | ------------------------------------------------------------------------- |
| Domain         | Area bisnis dengan tanggung jawab tertentu.                               |
| Module         | Implementasi teknis dari sebuah Domain.                                   |
| Entity         | Objek bisnis yang memiliki identitas unik.                                |
| Value Object   | Objek tanpa identitas yang merepresentasikan suatu nilai.                 |
| Aggregate      | Kumpulan Entity dan Value Object yang diperlakukan sebagai satu kesatuan. |
| Repository     | Abstraksi akses data Domain.                                              |
| Use Case       | Proses bisnis yang dijalankan oleh aplikasi.                              |
| Domain Service | Logika bisnis yang tidak dimiliki oleh Entity tertentu.                   |
| DTO            | Data Transfer Object untuk pertukaran data antar layer.                   |

---

# Architecture Terms

| Term                      | Definition                                       |
| ------------------------- | ------------------------------------------------ |
| DDD                       | Domain Driven Design.                            |
| Bounded Context           | Batas model bisnis dalam DDD.                    |
| Clean Architecture        | Arsitektur dengan Dependency Rule menuju Domain. |
| Hexagonal Architecture    | Pola Ports & Adapters.                           |
| CQRS                      | Pemisahan Command dan Query.                     |
| Event Driven Architecture | Komunikasi menggunakan Domain Event.             |
| Dependency Injection      | Teknik penyediaan dependency dari luar objek.    |
| Repository Pattern        | Pola abstraksi akses data.                       |

---

# API Terms

| Term          | Definition                                        |
| ------------- | ------------------------------------------------- |
| REST          | Representational State Transfer.                  |
| Endpoint      | URL yang menyediakan layanan API.                 |
| Resource      | Representasi objek pada REST API.                 |
| Request       | Permintaan dari Client ke Server.                 |
| Response      | Balasan dari Server ke Client.                    |
| Payload       | Data yang dikirim dalam Request atau Response.    |
| Pagination    | Teknik membagi hasil menjadi beberapa halaman.    |
| Rate Limiting | Pembatasan jumlah Request dalam periode tertentu. |

---

# Security Terms

| Term           | Definition                                 |
| -------------- | ------------------------------------------ |
| Authentication | Proses verifikasi identitas pengguna.      |
| Authorization  | Proses menentukan hak akses pengguna.      |
| RBAC           | Role-Based Access Control.                 |
| Permission     | Hak untuk melakukan suatu aksi.            |
| Role           | Sekumpulan Permission.                     |
| JWT            | JSON Web Token.                            |
| Secret         | Informasi rahasia yang digunakan aplikasi. |
| Audit Log      | Catatan aktivitas penting sistem.          |

---

# Database Terms

| Term        | Definition                                                     |
| ----------- | -------------------------------------------------------------- |
| Primary Key | Identitas unik data.                                           |
| Foreign Key | Relasi antar tabel.                                            |
| Index       | Struktur untuk mempercepat pencarian data.                     |
| Migration   | Perubahan struktur database.                                   |
| Seed        | Data awal database.                                            |
| Transaction | Sekumpulan operasi database yang dijalankan sebagai satu unit. |

---

# Deployment Terms

| Term         | Definition                                  |
| ------------ | ------------------------------------------- |
| CI           | Continuous Integration.                     |
| CD           | Continuous Deployment/Delivery.             |
| Docker       | Platform containerization.                  |
| Health Check | Pemeriksaan kesehatan service.              |
| Rollback     | Mengembalikan aplikasi ke versi sebelumnya. |
| Backup       | Salinan data untuk pemulihan.               |
| Restore      | Proses mengembalikan data dari Backup.      |

---

# Monitoring Terms

| Term          | Definition                                                           |
| ------------- | -------------------------------------------------------------------- |
| Metrics       | Data numerik kondisi sistem.                                         |
| Log           | Catatan aktivitas aplikasi.                                          |
| Trace         | Jejak perjalanan request.                                            |
| Alert         | Notifikasi ketika terjadi kondisi tertentu.                          |
| Uptime        | Persentase waktu layanan tersedia.                                   |
| Observability | Kemampuan memahami kondisi sistem melalui Metrics, Logs, dan Traces. |

---

# Falak Terms

| Term           | Definition                       |
| -------------- | -------------------------------- |
| Hisab          | Perhitungan astronomi Islam.     |
| Rukyat         | Observasi hilal secara langsung. |
| Hilal          | Bulan sabit awal bulan Hijriah.  |
| Kiblat         | Arah menuju Ka'bah.              |
| Prayer Time    | Jadwal waktu salat.              |
| Eclipse        | Gerhana Matahari atau Bulan.     |
| Hijri Calendar | Kalender Hijriah.                |

---

# Documentation Terms

| Term                | Definition                                      |
| ------------------- | ----------------------------------------------- |
| ADR                 | Architecture Decision Record.                   |
| README              | Dokumen pengantar suatu folder atau modul.      |
| Acceptance Criteria | Kriteria keberhasilan suatu dokumen atau fitur. |
| Workflow            | Urutan proses bisnis atau teknis.               |
| Roadmap             | Rencana pengembangan jangka panjang.            |

---

# Glossary Rules

* Seluruh istilah bisnis harus menggunakan Ubiquitous Language.
* Definisi harus konsisten di seluruh dokumentasi.
* Istilah baru harus ditambahkan ke Glossary sebelum digunakan secara luas.
* Hindari penggunaan sinonim untuk istilah inti yang sama.

---

# Related Documents

* README.md
* coding-reference.md
* api-reference.md
* database-reference.md
* external-references.md

---

# Acceptance Criteria

* Seluruh istilah utama terdokumentasi.
* Definisi konsisten di seluruh proyek.
* Glossary menjadi referensi resmi bagi seluruh anggota tim.
