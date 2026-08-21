# Code Review

**Project:** LIM Digital Platform

**Folder:** `03-development`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar **Code Review** pada LIM Digital Platform.

Code Review bertujuan menjaga kualitas kode, mencegah bug masuk ke Production, menyebarkan pengetahuan dalam tim, serta memastikan implementasi mengikuti Architecture dan Coding Standards.

---

# Objectives

Code Review bertujuan untuk:

- Menjaga kualitas kode.
- Memastikan kepatuhan terhadap arsitektur.
- Mengurangi bug.
- Meningkatkan keamanan aplikasi.
- Berbagi pengetahuan antar developer.
- Menjaga konsistensi implementasi.

---

# Review Workflow

```text id="cr01"
Development

↓

Local Test

↓

Push

↓

Pull Request

↓

CI Pipeline

↓

Reviewer

↓

Revision (if needed)

↓

Approval

↓

Merge
```

---

# Pull Request Requirements

Setiap Pull Request wajib:

- Memiliki judul yang jelas.
- Menjelaskan perubahan.
- Mengacu pada Issue (jika ada).
- Lulus seluruh CI Pipeline.
- Tidak memiliki konflik.
- Mengikuti Commit Convention.

---

# Review Checklist

Reviewer wajib memeriksa:

## Architecture

- Mengikuti Clean Architecture.
- Mengikuti DDD.
- Tidak ada pelanggaran Dependency Rules.
- Tidak ada Circular Dependency.

---

## Business Logic

- Business Rules benar.
- Tidak ada logika yang duplikat.
- Use Case sesuai kebutuhan.
- Error Handling memadai.

---

## Code Quality

- Mudah dibaca.
- Nama variabel jelas.
- Function pendek.
- Tidak ada Code Smell.
- Tidak ada kode mati (_dead code_).

---

## Security

Periksa:

- Input Validation.
- Authorization.
- Authentication.
- SQL Injection.
- XSS.
- Secret Management.
- File Upload Validation.

---

## Performance

Periksa:

- Query Database.
- Pagination.
- N+1 Query.
- Caching.
- Memory Usage.

---

## Testing

Pastikan:

- Unit Test tersedia.
- Test berhasil.
- Coverage tidak menurun.
- Business Rules diuji.

---

# Approval Rules

Pull Request dapat di-merge apabila:

- Minimal 1 Approval.
- CI berhasil.
- Tidak ada komentar kritis yang belum diselesaikan.
- Tidak ada konflik.

Untuk perubahan besar disarankan minimal **2 Reviewer**.

---

# Reviewer Responsibilities

Reviewer harus:

- Memberikan masukan yang konstruktif.
- Fokus pada kualitas kode.
- Menghindari komentar yang bersifat personal.
- Memberikan alasan apabila meminta perubahan.

---

# Author Responsibilities

Author harus:

- Menjelaskan perubahan.
- Menjawab komentar reviewer.
- Memperbaiki temuan review.
- Menjalankan ulang test setelah revisi.

---

# Things to Avoid

Hindari:

- Approve tanpa membaca kode.
- Merge dengan CI gagal.
- Merge saat masih ada komentar kritis.
- Menambahkan perubahan di luar scope Pull Request.

---

# Pull Request Size

Disarankan:

| Size          | Recommendation                        |
| ------------- | ------------------------------------- |
| ≤300 baris    | Ideal                                 |
| 300–700 baris | Masih dapat direview                  |
| >700 baris    | Sebaiknya dipecah menjadi beberapa PR |

---

# Review Checklist

```text id="cr02"
□ Architecture sesuai.

□ Business Rules benar.

□ Coding Standards dipenuhi.

□ Naming Convention sesuai.

□ Security diperiksa.

□ Performance diperiksa.

□ Unit Test tersedia.

□ CI Pipeline berhasil.

□ Dokumentasi diperbarui bila diperlukan.
```

---

# Best Practices

- Review secepat mungkin.
- Berikan komentar yang spesifik.
- Sarankan solusi, bukan hanya menunjukkan masalah.
- Fokus pada kode, bukan orangnya.
- Gunakan Pull Request kecil agar mudah direview.

---

# Related Documents

- README.md
- coding-standards.md
- naming-conventions.md
- git-workflow.md
- testing-strategy.md
- branching-strategy.md
- commit-convention.md

---

# Acceptance Criteria

- Seluruh perubahan melalui Code Review.
- Pull Request memenuhi checklist review.
- CI Pipeline wajib berhasil sebelum merge.
- Reviewer dan Author mengikuti tanggung jawab masing-masing.
- Code Review menjadi proses wajib pada seluruh pengembangan LIM Digital Platform.
