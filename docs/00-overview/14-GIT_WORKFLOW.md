# GIT_WORKFLOW

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

**Document Type:** Git Workflow Standard

---

# Purpose

Dokumen ini mendefinisikan standar penggunaan Git dan GitHub pada LIM Digital Platform.

Tujuannya adalah menjaga kualitas source code, histori perubahan, dan proses kolaborasi selama pengembangan.

Seluruh kontributor wajib mengikuti workflow ini.

---

# Workflow Principles

Pengelolaan source code mengikuti prinsip berikut:

* One Feature, One Branch
* Small and Focused Changes
* Pull Request Required
* Review Before Merge
* Always Deployable
* Traceable History

---

# Repository

Seluruh source code disimpan pada satu repository Git.

Repository menjadi **Single Source of Truth** bagi seluruh tim.

Tidak diperbolehkan melakukan pengembangan di luar version control.

---

# Branch Structure

Repository menggunakan branch berikut.

```text id="gw01"
main

develop

feature/*

fix/*

hotfix/*

docs/*
```

---

# Main Branch

Branch:

```text id="gw02"
main
```

Aturan:

* Selalu stabil.
* Selalu siap dirilis.
* Tidak boleh direct push.
* Perubahan hanya melalui Pull Request.

---

# Develop Branch

Branch:

```text id="gw03"
develop
```

Digunakan sebagai branch integrasi seluruh fitur sebelum masuk ke `main`.

---

# Feature Branch

Format:

```text id="gw04"
feature/<feature-name>
```

Contoh:

```text id="gw05"
feature/cms

feature/program

feature/falak

feature/certificate
```

Satu feature branch hanya mengerjakan satu fitur.

---

# Fix Branch

Format:

```text id="gw06"
fix/<issue-name>
```

Contoh:

```text id="gw07"
fix/login

fix/category-slug

fix/program-validation
```

---

# Hotfix Branch

Digunakan untuk perbaikan pada Production.

Format:

```text id="gw08"
hotfix/<issue-name>
```

---

# Documentation Branch

Perubahan dokumentasi menggunakan:

```text id="gw09"
docs/<topic>
```

Contoh:

```text id="gw10"
docs/database

docs/api

docs/architecture
```

---

# Commit Convention

Format commit:

```text id="gw11"
type(scope): description
```

Contoh:

```text id="gw12"
feat(program): add participant management

fix(certificate): validate duplicate number

docs(api): update authentication endpoint

refactor(user): simplify repository
```

---

# Commit Types

Jenis commit yang digunakan:

* feat
* fix
* docs
* refactor
* perf
* test
* chore
* ci

---

# Pull Request

Setiap perubahan wajib melalui Pull Request.

Pull Request harus:

* Fokus pada satu tujuan.
* Memiliki deskripsi yang jelas.
* Menjelaskan perubahan yang dilakukan.
* Menyebutkan Issue apabila ada.

---

# Pull Request Checklist

Sebelum Pull Request dibuat, pastikan:

* Build berhasil.
* TypeScript tanpa error.
* Lint tanpa error.
* Dokumentasi diperbarui jika diperlukan.
* Tidak ada `console.log()`.
* Business Rules dipatuhi.

---

# Code Review

Setiap Pull Request wajib direview.

Review minimal mencakup:

* Architecture
* Business Rules
* Security
* Code Quality
* Performance
* Documentation

---

# Merge Strategy

Strategi merge yang digunakan:

```text id="gw13"
Squash and Merge
```

Tujuan:

* Histori repository lebih bersih.
* Satu fitur menjadi satu commit utama.
* Mudah melakukan rollback.

---

# Protected Branch

Branch berikut wajib diproteksi:

```text id="gw14"
main

develop
```

Aturan:

* Tidak boleh force push.
* Tidak boleh direct push.
* Wajib Pull Request.
* Wajib Review.

---

# Release Flow

Alur release:

```text id="gw15"
feature

↓

develop

↓

Testing

↓

main

↓

Release
```

---

# Versioning

Menggunakan Semantic Versioning.

Format:

```text id="gw16"
MAJOR.MINOR.PATCH
```

Contoh:

```text id="gw17"
1.0.0

1.1.0

1.1.1

2.0.0
```

---

# Git Ignore

File berikut tidak boleh masuk repository:

* `.env`
* `node_modules`
* Build Output
* Cache
* Log File
* Temporary File

Gunakan `.gitignore` yang sesuai dengan teknologi proyek.

---

# Large Files

File berukuran besar tidak disimpan di repository kecuali benar-benar diperlukan.

Media dan dokumen dikelola melalui Media Service atau Object Storage.

---

# Conflict Resolution

Apabila terjadi konflik:

1. Tarik perubahan terbaru.
2. Selesaikan konflik secara lokal.
3. Jalankan build.
4. Lakukan pengujian.
5. Push kembali perubahan.

---

# Release Tag

Setiap release resmi diberi Git Tag.

Contoh:

```text id="gw18"
v1.0.0

v1.1.0

v2.0.0
```

---

# Governance

Seluruh aktivitas version control pada LIM Digital Platform wajib mengikuti dokumen ini.

Perubahan workflow Git hanya dapat dilakukan melalui pembaruan dokumentasi dan persetujuan maintainer.

---

# Closing

Git Workflow memastikan seluruh proses pengembangan berjalan secara konsisten, terdokumentasi, mudah ditelusuri, dan siap mendukung kolaborasi tim dalam jangka panjang.
