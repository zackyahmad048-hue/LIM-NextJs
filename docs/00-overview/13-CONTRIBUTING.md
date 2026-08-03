# CONTRIBUTING

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

**Document Type:** Contribution Guidelines

---

# Purpose

Dokumen ini menjelaskan tata cara kontribusi dalam pengembangan LIM Digital Platform.

Tujuannya adalah menjaga kualitas source code, konsistensi dokumentasi, serta memastikan seluruh perubahan mengikuti Blueprint proyek.

Dokumen ini berlaku untuk seluruh kontributor, baik internal maupun eksternal.

---

# Core Principles

Seluruh kontributor wajib mengikuti prinsip berikut:

- Documentation First
- Architecture First
- Business Rules First
- Security First
- Quality Over Speed

---

# Before You Start

Sebelum mulai mengembangkan fitur, setiap kontributor wajib membaca dokumen berikut:

1. README
2. Product Vision
3. Blueprint
4. Architecture
5. Business Rules
6. Coding Standards
7. AI Rules (jika menggunakan AI)

---

# Development Workflow

Alur kerja pengembangan:

```text id="ct01"
Issue

↓

Documentation

↓

Development

↓

Testing

↓

Pull Request

↓

Review

↓

Merge
```

---

# Branch Strategy

Branch utama:

```text id="ct02"
main
```

Branch pengembangan:

```text id="ct03"
develop
```

Branch fitur:

```text id="ct04"
feature/<feature-name>
```

Contoh:

```text id="ct05"
feature/program

feature/certificate

feature/falak
```

Branch perbaikan:

```text id="ct06"
fix/<issue-name>
```

---

# Commit Convention

Format commit:

```text id="ct07"
type(scope): description
```

Contoh:

```text id="ct08"
feat(program): add participant module

fix(category): prevent duplicate slug

docs(api): update certificate endpoint

refactor(auth): simplify session service
```

Jenis commit yang digunakan:

- feat
- fix
- docs
- refactor
- test
- perf
- chore
- ci

---

# Pull Request

Satu Pull Request hanya mengerjakan satu tujuan.

Contoh:

✅ Menambahkan modul Program.

❌ Menambahkan modul Program sekaligus mengubah sistem Login.

---

# Pull Request Checklist

Sebelum membuat Pull Request:

- Build berhasil.
- TypeScript tanpa error.
- Lint tanpa error.
- Dokumentasi diperbarui jika diperlukan.
- Tidak ada `console.log()`.
- Mengikuti Coding Standards.

---

# Code Review

Reviewer memeriksa:

- Arsitektur.
- Business Rules.
- Keamanan.
- Konsistensi kode.
- Dampak terhadap modul lain.
- Kualitas dokumentasi.

---

# Documentation

Dokumentasi wajib diperbarui apabila terjadi perubahan pada:

- Business Rules
- Database
- API
- Architecture
- Workflow
- UI
- Security

---

# Testing

Minimal dilakukan:

- Manual Testing
- Type Checking
- Lint Checking
- Build Verification

Untuk fitur penting disarankan menambahkan Unit Test dan Integration Test.

---

# Security

Kontributor tidak boleh:

- Menyimpan secret di repository.
- Menghapus validasi keamanan.
- Mengubah permission tanpa dokumentasi.
- Mengakses data privat tanpa hak.

---

# AI Contribution

Kontribusi yang menggunakan AI tetap mengikuti:

- AI Rules
- Coding Standards
- Business Rules
- Architecture

Seluruh hasil AI wajib direview sebelum digabungkan.

---

# Definition of Done

Suatu pekerjaan dianggap selesai apabila:

- Fitur selesai.
- Build berhasil.
- Dokumentasi diperbarui.
- Review disetujui.
- Siap digabungkan ke branch utama.

---

# Maintainer Responsibilities

Maintainer bertanggung jawab untuk:

- Meninjau Pull Request.
- Menjaga kualitas proyek.
- Menyetujui perubahan arsitektur.
- Menjaga konsistensi dokumentasi.
- Mengelola proses release.

---

# Governance

Dokumen CONTRIBUTING menjadi pedoman resmi kontribusi pada LIM Digital Platform.

Seluruh kontributor wajib mengikuti dokumen ini agar proyek tetap konsisten, aman, dan mudah dipelihara.

---

# Closing

Kontribusi yang baik bukan hanya menghasilkan fitur baru, tetapi juga menjaga kualitas platform, dokumentasi, dan pengalaman kerja seluruh tim.

Setiap perubahan diharapkan memberikan manfaat jangka panjang bagi keberlanjutan LIM Digital Platform.
