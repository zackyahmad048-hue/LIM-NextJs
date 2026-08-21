# Commit Convention

**Project:** LIM Digital Platform

**Folder:** `03-development`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar penulisan commit pada LIM Digital Platform.

Commit yang konsisten memudahkan:

- Code Review
- Release Management
- Changelog Generation
- Debugging
- Kolaborasi Tim

LIM Digital Platform menggunakan standar **Conventional Commits**.

---

# Commit Format

Format umum:

```text id="commit01"
<type>(<scope>): <description>
```

Contoh:

```text id="commit02"
feat(program): add program approval workflow

fix(auth): resolve refresh token validation

docs(knowledge): update api documentation
```

---

# Commit Types

| Type     | Description                                   |
| -------- | --------------------------------------------- |
| feat     | Menambahkan fitur baru                        |
| fix      | Memperbaiki bug                               |
| docs     | Perubahan dokumentasi                         |
| style    | Perubahan format kode (tanpa mengubah logika) |
| refactor | Refactoring tanpa perubahan perilaku          |
| perf     | Optimasi performa                             |
| test     | Menambah atau memperbaiki test                |
| build    | Perubahan build system                        |
| ci       | Perubahan CI/CD                               |
| chore    | Tugas pemeliharaan umum                       |
| revert   | Membatalkan commit sebelumnya                 |

---

# Scope

Scope menunjukkan modul atau domain yang diubah.

Contoh:

```text id="commit03"
auth

program

letter

certificate

knowledge

falak

notification

deployment

docs
```

---

# Description Rules

Description harus:

- Menggunakan bahasa Inggris.
- Ditulis dalam **imperative mood**.
- Huruf kecil di awal.
- Tidak diakhiri tanda titik.

Baik:

```text id="commit04"
feat(program): add participant validation

fix(letter): prevent duplicate document number

docs(architecture): add clean architecture guide
```

Tidak disarankan:

```text id="commit05"
Added new feature.

Fix Bug

Update
```

---

# Breaking Change

Perubahan yang tidak kompatibel dengan versi sebelumnya ditandai dengan:

```text id="commit06"
feat(api)!: change authentication response format
```

Atau menggunakan footer:

```text id="commit07"
BREAKING CHANGE:
Authentication response has changed.
```

---

# Issue Reference

Jika menggunakan Issue Tracker:

```text id="commit08"
feat(program): add approval workflow

Refs: #123
```

atau

```text id="commit09"
fix(auth): resolve token expiration

Closes: #456
```

---

# Atomic Commit

Satu commit hanya untuk satu tujuan.

Baik:

```text id="commit10"
feat(program): add approval workflow
```

Tidak disarankan:

```text id="commit11"
feat: update program, fix auth, edit ui, update docs
```

---

# Commit Frequency

Developer disarankan:

- Commit kecil dan sering.
- Jangan menunggu pekerjaan selesai seluruhnya.
- Hindari commit yang terlalu besar.

---

# Forbidden Commits

Tidak diperbolehkan:

```text id="commit12"
update

fix

test

asdf

wip

final

123
```

Commit harus menjelaskan perubahan yang dilakukan.

---

# Release Versioning

Mengikuti **Semantic Versioning**:

```text id="commit13"
MAJOR.MINOR.PATCH
```

Contoh:

```text id="commit14"
v1.0.0

v1.1.0

v1.1.3

v2.0.0
```

---

# Changelog Generation

Conventional Commit memungkinkan pembuatan changelog otomatis.

Contoh kategori:

- Features
- Bug Fixes
- Documentation
- Performance
- Refactoring
- Breaking Changes

---

# Best Practices

- Gunakan satu commit untuk satu perubahan logis.
- Pastikan proyek dapat di-build setelah setiap commit.
- Jalankan formatter dan test sebelum commit.
- Hindari commit hasil merge yang tidak perlu.
- Tulis pesan commit yang mudah dipahami oleh seluruh tim.

---

# Related Documents

- README.md
- coding-standards.md
- naming-conventions.md
- git-workflow.md
- testing-strategy.md
- branching-strategy.md
- code-review.md

---

# Acceptance Criteria

- Seluruh commit mengikuti Conventional Commits.
- Scope sesuai dengan modul yang diubah.
- Commit bersifat atomic.
- Commit message konsisten dan mudah dipahami.
- Commit Convention menjadi standar resmi proyek.
