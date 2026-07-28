# Test Plan

**Project:** LIM Digital Platform

**Folder:** `10-testing`

**Document:** `test-plan.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan rencana pengujian (Test Plan) untuk LIM Digital Platform.

Test Plan menjadi acuan resmi dalam merencanakan, melaksanakan, dan mengevaluasi seluruh aktivitas pengujian sebelum sistem dirilis ke lingkungan Production.

---

# Objectives

Test Plan bertujuan untuk:

* Memastikan seluruh kebutuhan bisnis terpenuhi.
* Memvalidasi implementasi sesuai spesifikasi.
* Mengurangi risiko kegagalan pada Production.
* Menentukan ruang lingkup dan strategi pengujian.
* Menjadi referensi bagi seluruh tim QA.

---

# Scope

Pengujian mencakup seluruh domain:

* Authentication
* Authorization
* Organization
* Dashboard
* CMS
* Program
* Secretariat
* Letter
* Certificate
* Media
* Notification
* Settings
* Knowledge
* Falak

---

# Test Objectives

Seluruh pengujian bertujuan memastikan:

* Functional Requirement terpenuhi.
* Business Rules berjalan benar.
* API sesuai spesifikasi.
* UI bekerja sesuai Design System.
* Security diterapkan.
* Performance memenuhi target.

---

# Testing Types

## Unit Testing

Menguji fungsi atau komponen secara individual.

Dilakukan oleh:

* Backend Developer
* Frontend Developer

---

## Integration Testing

Menguji interaksi antar service dan domain.

Contoh:

* Program → Certificate
* Letter → Notification
* Authentication → Authorization

---

## API Testing

Menguji:

* Request
* Response
* Validation
* Authentication
* Authorization
* Error Handling

---

## End-to-End Testing

Menguji alur bisnis utama dari awal hingga akhir.

Contoh:

* Login → Registrasi Program → Penerbitan Sertifikat.

---

## User Acceptance Testing (UAT)

Dilakukan oleh perwakilan pengguna untuk memastikan sistem memenuhi kebutuhan operasional.

---

## Performance Testing

Meliputi:

* Load Test
* Stress Test
* Endurance Test

---

## Security Testing

Meliputi:

* Authentication
* Authorization
* Input Validation
* Session Management
* OWASP Top 10

---

# Test Environment

Environment yang digunakan:

| Environment | Purpose             |
| ----------- | ------------------- |
| Development | Unit Testing        |
| Testing     | Integration Testing |
| Staging     | UAT & Performance   |
| Production  | Smoke Test          |

---

# Entry Criteria

Testing dapat dimulai apabila:

* Development selesai.
* Build berhasil.
* Database tersedia.
* Environment siap.
* Test Data tersedia.

---

# Exit Criteria

Testing dinyatakan selesai apabila:

* Seluruh Test Case Critical lulus.
* Tidak ada Critical Bug.
* UAT disetujui.
* Performance memenuhi target.
* Security Testing selesai.

---

# Test Deliverables

Output pengujian:

* Test Plan
* Test Cases
* Test Report
* Bug Report
* UAT Report
* Performance Report
* Security Report

---

# Roles & Responsibilities

| Role               | Responsibility                     |
| ------------------ | ---------------------------------- |
| QA Engineer        | Menyusun dan menjalankan Test Case |
| Backend Developer  | Unit Testing & Bug Fix             |
| Frontend Developer | UI Testing & Bug Fix               |
| DevOps Engineer    | Menyiapkan Environment             |
| Product Owner      | UAT Approval                       |

---

# Risk Management

Risiko yang perlu diperhatikan:

* Environment tidak siap.
* Test Data tidak lengkap.
* Perubahan Requirement.
* Keterlambatan Bug Fix.
* Ketidaksesuaian spesifikasi.

---

# Success Metrics

Target minimum:

| Metric            |            Target |
| ----------------- | ----------------: |
| Test Case Passed  |             ≥ 95% |
| Critical Bug      |                 0 |
| High Severity Bug | 0 sebelum Release |
| Test Coverage     |             ≥ 80% |
| UAT Approval      |              100% |

---

# Related Documents

* README.md
* test-cases.md
* uat.md
* performance-testing.md
* security-testing.md

---

# Acceptance Criteria

* Ruang lingkup pengujian terdokumentasi.
* Strategi pengujian jelas.
* Entry dan Exit Criteria terdokumentasi.
* Target kualitas terukur.
* Test Plan menjadi acuan resmi pelaksanaan QA pada LIM Digital Platform.
