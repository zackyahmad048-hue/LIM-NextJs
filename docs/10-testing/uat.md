# User Acceptance Testing (UAT)

**Project:** LIM Digital Platform

**Folder:** `10-testing`

**Document:** `uat.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar pelaksanaan **User Acceptance Testing (UAT)** pada LIM Digital Platform.

UAT merupakan tahap pengujian akhir yang dilakukan oleh perwakilan pengguna (Business Owner atau End User) untuk memastikan sistem telah memenuhi kebutuhan bisnis dan siap digunakan di lingkungan Production.

---

# Objectives

UAT bertujuan untuk:

- Memastikan sistem memenuhi kebutuhan pengguna.
- Memvalidasi Business Process.
- Memastikan User Experience sesuai harapan.
- Menjadi dasar persetujuan Release.
- Mengurangi risiko setelah Go-Live.

---

# Scope

UAT mencakup seluruh domain:

- Authentication
- Authorization
- Organization
- Dashboard
- CMS
- Program
- Secretariat
- Letter
- Certificate
- Media
- Notification
- Settings
- Knowledge
- Falak

---

# UAT Participants

| Role                    | Responsibility                   |
| ----------------------- | -------------------------------- |
| Product Owner           | Persetujuan akhir UAT            |
| Business Representative | Menjalankan skenario bisnis      |
| QA Engineer             | Mendampingi proses UAT           |
| Developer               | Memperbaiki temuan UAT           |
| Project Manager         | Mengoordinasikan pelaksanaan UAT |

---

# Entry Criteria

UAT dapat dimulai apabila:

- Development selesai.
- Integration Test lulus.
- Critical Bug telah diperbaiki.
- Staging Environment siap.
- Test Data tersedia.

---

# UAT Scenarios

Pengujian dilakukan berdasarkan proses bisnis nyata.

Contoh:

### Authentication

- Login
- Logout
- Forgot Password

---

### Program

- Membuat Program
- Registrasi Peserta
- Menutup Registrasi
- Menyelesaikan Program

---

### Letter

- Membuat Draft
- Review
- Approval
- Publish

---

### Certificate

- Generate Sertifikat
- Download
- Verify QR Code

---

### Knowledge

- Membuat Artikel
- Review
- Publish
- Search Artikel

---

### Falak

- Hitung Waktu Salat
- Hitung Arah Kiblat
- Konversi Kalender Hijriah

---

# UAT Checklist

Setiap fitur dinilai berdasarkan:

- Fungsi berjalan.
- Data benar.
- Tampilan sesuai.
- Navigasi mudah.
- Tidak ada Error.
- Performance memadai.

---

# Acceptance Status

Status UAT:

- Passed
- Passed with Minor Issue
- Failed
- Deferred

---

# Defect Classification

| Severity | Description                   |
| -------- | ----------------------------- |
| Critical | Sistem tidak dapat digunakan  |
| High     | Fitur utama gagal             |
| Medium   | Gangguan pada fungsi tertentu |
| Low      | Masalah kosmetik atau minor   |

---

# UAT Report

Laporan UAT minimal berisi:

- Ringkasan Pengujian
- Daftar Skenario
- Hasil Pengujian
- Daftar Temuan
- Status Perbaikan
- Kesimpulan

---

# Exit Criteria

UAT dinyatakan selesai apabila:

- Seluruh skenario Critical lulus.
- Tidak ada Critical Bug.
- Business Representative menyetujui hasil.
- Product Owner memberikan Approval.

---

# Sign-Off

Persetujuan UAT dilakukan oleh:

| Role                    | Approval |
| ----------------------- | -------- |
| Product Owner           | Required |
| Business Representative | Required |
| QA Lead                 | Required |
| Project Manager         | Required |

---

# Best Practices

- Gunakan data yang menyerupai kondisi nyata.
- Libatkan pengguna akhir dari setiap domain.
- Catat seluruh masukan, termasuk peningkatan (enhancement).
- Fokus pada proses bisnis, bukan implementasi teknis.
- Dokumentasikan seluruh hasil UAT sebagai bagian dari Release.

---

# Related Documents

- README.md
- test-plan.md
- test-cases.md
- performance-testing.md
- security-testing.md

---

# Acceptance Criteria

- Seluruh proses bisnis telah diuji oleh pengguna.
- Tidak ada Critical Issue yang tersisa.
- UAT mendapatkan persetujuan resmi.
- Dokumentasi hasil UAT lengkap.
- UAT menjadi dasar keputusan Go-Live LIM Digital Platform.
