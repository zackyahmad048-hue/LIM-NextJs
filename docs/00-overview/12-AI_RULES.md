# AI_RULES

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

**Document Type:** AI Development Guidelines

---

# Purpose

Dokumen ini menetapkan aturan penggunaan Artificial Intelligence (AI) dalam pengembangan LIM Digital Platform.

AI digunakan sebagai alat bantu pengembangan, bukan sebagai pengambil keputusan utama.

Seluruh hasil kerja AI tetap menjadi tanggung jawab developer dan maintainer proyek.

---

# Scope

Dokumen ini berlaku untuk seluruh AI yang digunakan dalam proyek, termasuk namun tidak terbatas pada:

- ChatGPT
- Codex
- Claude
- Gemini
- GitHub Copilot
- AI Assistant lainnya

---

# AI Principles

Penggunaan AI mengikuti prinsip berikut:

- Documentation First
- Architecture First
- Business Rules First
- Security First
- Human Review Required

AI membantu mempercepat pekerjaan, tetapi tidak menggantikan proses engineering.

---

# Source of Truth

AI wajib menjadikan dokumen berikut sebagai acuan utama:

1. Product Vision
2. Project Overview
3. Blueprint
4. Architecture
5. Business Rules
6. Database
7. Security
8. Coding Standards
9. API Documentation

Apabila terdapat konflik, AI harus mengikuti dokumen dengan prioritas lebih tinggi.

---

# Allowed Tasks

AI diperbolehkan membantu:

- Menulis kode.
- Refactoring.
- Menulis dokumentasi.
- Membuat unit test.
- Membuat migration.
- Membuat query database.
- Menjelaskan kode.
- Membantu code review.
- Membuat dokumentasi API.
- Membantu debugging.

---

# Restricted Tasks

AI tidak boleh secara mandiri:

- Mengubah arsitektur.
- Mengubah Business Rules.
- Mengubah struktur database.
- Menghapus fitur.
- Mengubah sistem keamanan.
- Mengubah workflow utama.

Perubahan tersebut harus mendapat persetujuan maintainer.

---

# Documentation Rule

AI tidak boleh mengimplementasikan fitur besar sebelum dokumentasi terkait tersedia.

Minimal harus tersedia:

- Business Rules
- Database Design
- API Specification
- UI Specification (jika ada)

---

# Business Rules

AI tidak boleh membuat asumsi terhadap aturan bisnis.

Jika aturan bisnis belum terdokumentasi, implementasi harus ditunda sampai aturan tersebut ditetapkan.

---

# Coding Standards

Seluruh kode yang dihasilkan AI wajib mengikuti:

- Coding Standards
- Project Structure
- Repository Pattern
- Service Layer
- Naming Convention

---

# Repository Rules

AI tidak boleh:

- Mengakses Prisma di luar Repository.
- Menulis query database di Component.
- Menempatkan Business Rules di UI.

---

# Service Rules

Business Rules hanya boleh berada pada Service Layer.

AI wajib menjaga pemisahan tanggung jawab antar layer.

---

# Security Rules

AI tidak boleh:

- Hardcode secret.
- Menyimpan password.
- Menonaktifkan validasi.
- Menghilangkan pemeriksaan permission.
- Menampilkan informasi sensitif kepada pengguna.

---

# Documentation Update

Apabila AI menghasilkan perubahan besar, dokumentasi terkait harus diperbarui sebelum perubahan dianggap selesai.

---

# Code Review

Seluruh hasil AI wajib melalui review manusia sebelum digabungkan ke branch utama.

Review mencakup:

- Arsitektur
- Business Rules
- Keamanan
- Performa
- Konsistensi kode

---

# Pull Request

Kode hasil AI tetap mengikuti workflow proyek.

Tidak ada pengecualian terhadap:

- Pull Request
- Code Review
- CI/CD
- Testing

---

# Testing

AI wajib menghasilkan kode yang:

- Dapat dibangun (build).
- Lulus pemeriksaan TypeScript.
- Lulus lint.
- Tidak menghasilkan error yang diketahui.

---

# AI Communication

AI harus:

- Memberikan jawaban yang jelas.
- Menjelaskan risiko jika ada.
- Tidak membuat klaim yang tidak dapat dipastikan.
- Mengakui apabila informasi belum tersedia.

---

# Decision Making

Keputusan berikut hanya dapat dilakukan oleh maintainer:

- Perubahan Blueprint.
- Perubahan Architecture.
- Perubahan Business Rules.
- Perubahan Database.
- Perubahan Security Policy.

AI hanya dapat memberikan rekomendasi.

---

# Knowledge Boundary

AI hanya boleh menggunakan:

- Dokumentasi proyek.
- Source code proyek.
- Informasi yang diberikan pengguna.

AI tidak boleh menganggap contoh umum sebagai aturan proyek apabila belum terdokumentasi.

---

# Quality Checklist

Sebelum hasil AI diterima, pastikan:

- Mengikuti Blueprint.
- Mengikuti Business Rules.
- Mengikuti Coding Standards.
- Mengikuti Project Structure.
- Tidak melanggar Security Rules.
- Dokumentasi diperbarui bila diperlukan.

---

# Governance

Dokumen AI_RULES menjadi pedoman resmi penggunaan AI dalam LIM Digital Platform.

Seluruh AI diperlakukan sebagai alat bantu pengembangan yang harus bekerja sesuai dokumentasi proyek dan selalu berada di bawah pengawasan maintainer.

---

# Closing

LIM Digital Platform memanfaatkan AI untuk meningkatkan produktivitas, kualitas dokumentasi, dan kecepatan pengembangan.

Namun seluruh keputusan arsitektur, aturan bisnis, keamanan, dan kualitas akhir sistem tetap menjadi tanggung jawab manusia agar platform tetap konsisten, aman, dan berkelanjutan.

# AI_RULES

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

**Document Type:** AI Development Guidelines

---

# Purpose

Dokumen ini menetapkan aturan penggunaan Artificial Intelligence (AI) dalam pengembangan LIM Digital Platform.

AI digunakan sebagai alat bantu pengembangan, bukan sebagai pengambil keputusan utama.

Seluruh hasil kerja AI tetap menjadi tanggung jawab developer dan maintainer proyek.

---

# Scope

Dokumen ini berlaku untuk seluruh AI yang digunakan dalam proyek, termasuk namun tidak terbatas pada:

- ChatGPT
- Codex
- Claude
- Gemini
- GitHub Copilot
- AI Assistant lainnya

---

# AI Principles

Penggunaan AI mengikuti prinsip berikut:

- Documentation First
- Architecture First
- Business Rules First
- Security First
- Human Review Required

AI membantu mempercepat pekerjaan, tetapi tidak menggantikan proses engineering.

---

# Source of Truth

AI wajib menjadikan dokumen berikut sebagai acuan utama:

1. Product Vision
2. Project Overview
3. Blueprint
4. Architecture
5. Business Rules
6. Database
7. Security
8. Coding Standards
9. API Documentation

Apabila terdapat konflik, AI harus mengikuti dokumen dengan prioritas lebih tinggi.

---

# Allowed Tasks

AI diperbolehkan membantu:

- Menulis kode.
- Refactoring.
- Menulis dokumentasi.
- Membuat unit test.
- Membuat migration.
- Membuat query database.
- Menjelaskan kode.
- Membantu code review.
- Membuat dokumentasi API.
- Membantu debugging.

---

# Restricted Tasks

AI tidak boleh secara mandiri:

- Mengubah arsitektur.
- Mengubah Business Rules.
- Mengubah struktur database.
- Menghapus fitur.
- Mengubah sistem keamanan.
- Mengubah workflow utama.

Perubahan tersebut harus mendapat persetujuan maintainer.

---

# Documentation Rule

AI tidak boleh mengimplementasikan fitur besar sebelum dokumentasi terkait tersedia.

Minimal harus tersedia:

- Business Rules
- Database Design
- API Specification
- UI Specification (jika ada)

---

# Business Rules

AI tidak boleh membuat asumsi terhadap aturan bisnis.

Jika aturan bisnis belum terdokumentasi, implementasi harus ditunda sampai aturan tersebut ditetapkan.

---

# Coding Standards

Seluruh kode yang dihasilkan AI wajib mengikuti:

- Coding Standards
- Project Structure
- Repository Pattern
- Service Layer
- Naming Convention

---

# Repository Rules

AI tidak boleh:

- Mengakses Prisma di luar Repository.
- Menulis query database di Component.
- Menempatkan Business Rules di UI.

---

# Service Rules

Business Rules hanya boleh berada pada Service Layer.

AI wajib menjaga pemisahan tanggung jawab antar layer.

---

# Security Rules

AI tidak boleh:

- Hardcode secret.
- Menyimpan password.
- Menonaktifkan validasi.
- Menghilangkan pemeriksaan permission.
- Menampilkan informasi sensitif kepada pengguna.

---

# Documentation Update

Apabila AI menghasilkan perubahan besar, dokumentasi terkait harus diperbarui sebelum perubahan dianggap selesai.

---

# Code Review

Seluruh hasil AI wajib melalui review manusia sebelum digabungkan ke branch utama.

Review mencakup:

- Arsitektur
- Business Rules
- Keamanan
- Performa
- Konsistensi kode

---

# Pull Request

Kode hasil AI tetap mengikuti workflow proyek.

Tidak ada pengecualian terhadap:

- Pull Request
- Code Review
- CI/CD
- Testing

---

# Testing

AI wajib menghasilkan kode yang:

- Dapat dibangun (build).
- Lulus pemeriksaan TypeScript.
- Lulus lint.
- Tidak menghasilkan error yang diketahui.

---

# AI Communication

AI harus:

- Memberikan jawaban yang jelas.
- Menjelaskan risiko jika ada.
- Tidak membuat klaim yang tidak dapat dipastikan.
- Mengakui apabila informasi belum tersedia.

---

# Decision Making

Keputusan berikut hanya dapat dilakukan oleh maintainer:

- Perubahan Blueprint.
- Perubahan Architecture.
- Perubahan Business Rules.
- Perubahan Database.
- Perubahan Security Policy.

AI hanya dapat memberikan rekomendasi.

---

# Knowledge Boundary

AI hanya boleh menggunakan:

- Dokumentasi proyek.
- Source code proyek.
- Informasi yang diberikan pengguna.

AI tidak boleh menganggap contoh umum sebagai aturan proyek apabila belum terdokumentasi.

---

# Quality Checklist

Sebelum hasil AI diterima, pastikan:

- Mengikuti Blueprint.
- Mengikuti Business Rules.
- Mengikuti Coding Standards.
- Mengikuti Project Structure.
- Tidak melanggar Security Rules.
- Dokumentasi diperbarui bila diperlukan.

---

# Governance

Dokumen AI_RULES menjadi pedoman resmi penggunaan AI dalam LIM Digital Platform.

Seluruh AI diperlakukan sebagai alat bantu pengembangan yang harus bekerja sesuai dokumentasi proyek dan selalu berada di bawah pengawasan maintainer.

---

# Closing

LIM Digital Platform memanfaatkan AI untuk meningkatkan produktivitas, kualitas dokumentasi, dan kecepatan pengembangan.

Namun seluruh keputusan arsitektur, aturan bisnis, keamanan, dan kualitas akhir sistem tetap menjadi tanggung jawab manusia agar platform tetap konsisten, aman, dan berkelanjutan.

# AI_RULES

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

**Document Type:** AI Development Guidelines

---

# Purpose

Dokumen ini menetapkan aturan penggunaan Artificial Intelligence (AI) dalam pengembangan LIM Digital Platform.

AI digunakan sebagai alat bantu pengembangan, bukan sebagai pengambil keputusan utama.

Seluruh hasil kerja AI tetap menjadi tanggung jawab developer dan maintainer proyek.

---

# Scope

Dokumen ini berlaku untuk seluruh AI yang digunakan dalam proyek, termasuk namun tidak terbatas pada:

- ChatGPT
- Codex
- Claude
- Gemini
- GitHub Copilot
- AI Assistant lainnya

---

# AI Principles

Penggunaan AI mengikuti prinsip berikut:

- Documentation First
- Architecture First
- Business Rules First
- Security First
- Human Review Required

AI membantu mempercepat pekerjaan, tetapi tidak menggantikan proses engineering.

---

# Source of Truth

AI wajib menjadikan dokumen berikut sebagai acuan utama:

1. Product Vision
2. Project Overview
3. Blueprint
4. Architecture
5. Business Rules
6. Database
7. Security
8. Coding Standards
9. API Documentation

Apabila terdapat konflik, AI harus mengikuti dokumen dengan prioritas lebih tinggi.

---

# Allowed Tasks

AI diperbolehkan membantu:

- Menulis kode.
- Refactoring.
- Menulis dokumentasi.
- Membuat unit test.
- Membuat migration.
- Membuat query database.
- Menjelaskan kode.
- Membantu code review.
- Membuat dokumentasi API.
- Membantu debugging.

---

# Restricted Tasks

AI tidak boleh secara mandiri:

- Mengubah arsitektur.
- Mengubah Business Rules.
- Mengubah struktur database.
- Menghapus fitur.
- Mengubah sistem keamanan.
- Mengubah workflow utama.

Perubahan tersebut harus mendapat persetujuan maintainer.

---

# Documentation Rule

AI tidak boleh mengimplementasikan fitur besar sebelum dokumentasi terkait tersedia.

Minimal harus tersedia:

- Business Rules
- Database Design
- API Specification
- UI Specification (jika ada)

---

# Business Rules

AI tidak boleh membuat asumsi terhadap aturan bisnis.

Jika aturan bisnis belum terdokumentasi, implementasi harus ditunda sampai aturan tersebut ditetapkan.

---

# Coding Standards

Seluruh kode yang dihasilkan AI wajib mengikuti:

- Coding Standards
- Project Structure
- Repository Pattern
- Service Layer
- Naming Convention

---

# Repository Rules

AI tidak boleh:

- Mengakses Prisma di luar Repository.
- Menulis query database di Component.
- Menempatkan Business Rules di UI.

---

# Service Rules

Business Rules hanya boleh berada pada Service Layer.

AI wajib menjaga pemisahan tanggung jawab antar layer.

---

# Security Rules

AI tidak boleh:

- Hardcode secret.
- Menyimpan password.
- Menonaktifkan validasi.
- Menghilangkan pemeriksaan permission.
- Menampilkan informasi sensitif kepada pengguna.

---

# Documentation Update

Apabila AI menghasilkan perubahan besar, dokumentasi terkait harus diperbarui sebelum perubahan dianggap selesai.

---

# Code Review

Seluruh hasil AI wajib melalui review manusia sebelum digabungkan ke branch utama.

Review mencakup:

- Arsitektur
- Business Rules
- Keamanan
- Performa
- Konsistensi kode

---

# Pull Request

Kode hasil AI tetap mengikuti workflow proyek.

Tidak ada pengecualian terhadap:

- Pull Request
- Code Review
- CI/CD
- Testing

---

# Testing

AI wajib menghasilkan kode yang:

- Dapat dibangun (build).
- Lulus pemeriksaan TypeScript.
- Lulus lint.
- Tidak menghasilkan error yang diketahui.

---

# AI Communication

AI harus:

- Memberikan jawaban yang jelas.
- Menjelaskan risiko jika ada.
- Tidak membuat klaim yang tidak dapat dipastikan.
- Mengakui apabila informasi belum tersedia.

---

# Decision Making

Keputusan berikut hanya dapat dilakukan oleh maintainer:

- Perubahan Blueprint.
- Perubahan Architecture.
- Perubahan Business Rules.
- Perubahan Database.
- Perubahan Security Policy.

AI hanya dapat memberikan rekomendasi.

---

# Knowledge Boundary

AI hanya boleh menggunakan:

- Dokumentasi proyek.
- Source code proyek.
- Informasi yang diberikan pengguna.

AI tidak boleh menganggap contoh umum sebagai aturan proyek apabila belum terdokumentasi.

---

# Quality Checklist

Sebelum hasil AI diterima, pastikan:

- Mengikuti Blueprint.
- Mengikuti Business Rules.
- Mengikuti Coding Standards.
- Mengikuti Project Structure.
- Tidak melanggar Security Rules.
- Dokumentasi diperbarui bila diperlukan.

---

# Governance

Dokumen AI_RULES menjadi pedoman resmi penggunaan AI dalam LIM Digital Platform.

Seluruh AI diperlakukan sebagai alat bantu pengembangan yang harus bekerja sesuai dokumentasi proyek dan selalu berada di bawah pengawasan maintainer.

---

# Closing

LIM Digital Platform memanfaatkan AI untuk meningkatkan produktivitas, kualitas dokumentasi, dan kecepatan pengembangan.

Namun seluruh keputusan arsitektur, aturan bisnis, keamanan, dan kualitas akhir sistem tetap menjadi tanggung jawab manusia agar platform tetap konsisten, aman, dan berkelanjutan.
