# Test Cases

**Project:** LIM Digital Platform

**Folder:** `10-testing`

**Document:** `test-cases.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar penyusunan **Test Case** pada LIM Digital Platform.

Test Case digunakan sebagai acuan untuk memverifikasi bahwa setiap fitur telah diimplementasikan sesuai Functional Requirement, Business Rules, dan Acceptance Criteria.

Seluruh Test Case harus dapat dijalankan berulang (repeatable), terdokumentasi, dan menghasilkan keluaran yang dapat diverifikasi.

---

# Objectives

Test Case bertujuan untuk:

- Memverifikasi setiap fitur.
- Menjamin implementasi sesuai spesifikasi.
- Mempermudah Regression Testing.
- Menjadi referensi QA dan Developer.
- Mendukung otomatisasi pengujian.

---

# Test Case Structure

Setiap Test Case minimal memiliki:

- Test Case ID
- Module
- Feature
- Preconditions
- Test Steps
- Test Data
- Expected Result
- Actual Result
- Status
- Tester
- Execution Date

---

# Test Case Categories

## Functional Test

Memastikan fitur bekerja sesuai kebutuhan.

Contoh:

- Login
- Logout
- CRUD Data
- Search
- Filter
- Export

---

## Validation Test

Menguji validasi input.

Contoh:

- Required Field
- Format Email
- Panjang Password
- File Upload
- Duplicate Data

---

## Permission Test

Memastikan RBAC berjalan.

Contoh:

- Guest tidak dapat mengakses Dashboard.
- User tidak dapat menghapus Role.
- Admin dapat mengelola Program.

---

## API Test

Memastikan:

- Status Code
- Response Body
- Validation
- Authentication
- Authorization

sesuai spesifikasi API.

---

## UI Test

Memastikan:

- Layout
- Responsiveness
- Navigation
- Theme
- Accessibility

berjalan sesuai Design System.

---

# Test Case Template

| Field           | Description                    |
| --------------- | ------------------------------ |
| Test Case ID    | Identitas unik                 |
| Module          | Nama Domain                    |
| Feature         | Nama Fitur                     |
| Priority        | Critical / High / Medium / Low |
| Preconditions   | Kondisi awal                   |
| Steps           | Langkah pengujian              |
| Expected Result | Hasil yang diharapkan          |
| Actual Result   | Hasil aktual                   |
| Status          | Pass / Fail / Blocked          |

---

# Sample Test Case

## Authentication Login

| Field        | Value          |
| ------------ | -------------- |
| Test Case ID | AUTH-001       |
| Module       | Authentication |
| Feature      | Login          |
| Priority     | Critical       |

### Preconditions

- User aktif.
- Email telah diverifikasi.

### Steps

1. Buka halaman Login.
2. Masukkan Email valid.
3. Masukkan Password valid.
4. Klik **Login**.

### Expected Result

- Login berhasil.
- Dashboard ditampilkan.
- Session dibuat.
- JWT diterbitkan.

---

# Negative Test

Contoh:

- Password salah.
- Email tidak ditemukan.
- Akun dinonaktifkan.
- Session kedaluwarsa.
- File melebihi batas ukuran.
- Input tidak valid.

---

# Edge Case Test

Contoh:

- Input kosong.
- Input maksimum.
- Input minimum.
- Karakter Unicode.
- Karakter khusus.
- Request berulang (Duplicate Submit).

---

# Regression Test

Regression dilakukan pada:

- Bug yang telah diperbaiki.
- Fitur yang berubah.
- API yang diperbarui.
- Database Migration.
- Release Candidate.

---

# Automation

Test Case yang direkomendasikan untuk otomatisasi:

- Authentication
- Authorization
- CRUD
- API
- Notification
- Program Registration
- Certificate Generation

---

# Traceability

Setiap Test Case harus memiliki keterkaitan dengan:

- Functional Requirement
- Technical Specification
- Acceptance Criteria
- Bug Report

---

# Execution Status

Status Test Case:

- Not Started
- In Progress
- Passed
- Failed
- Blocked
- Skipped

---

# Reporting

Hasil pengujian minimal memuat:

- Total Test Case
- Passed
- Failed
- Blocked
- Pass Rate
- Daftar Bug

---

# Best Practices

- Satu Test Case menguji satu skenario utama.
- Gunakan Test Data yang realistis.
- Hindari ketergantungan antar Test Case.
- Beri ID yang konsisten.
- Perbarui Test Case ketika Requirement berubah.

---

# Related Documents

- README.md
- test-plan.md
- uat.md
- performance-testing.md
- security-testing.md

---

# Acceptance Criteria

- Seluruh fitur memiliki Test Case.
- Test Case dapat dijalankan berulang.
- Test Case memiliki Expected Result yang jelas.
- Traceability terhadap spesifikasi tersedia.
- Test Cases menjadi acuan resmi pengujian LIM Digital Platform.
