# Definition of Ready

**Project:** LIM Digital Platform

**Folder:** `12-project-management`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan kriteria siap (Definition of Ready) untuk setiap item yang akan dimasukkan ke dalam sprint. Item yang belum memenuhi kriteria ini tidak boleh masuk sprint.

---

# Purpose

- Memastikan item sudah jelas sebelum mulai dikerjakan.
- Mengurangi blocking saat sprint berlangsung.
- Memudahkan perencanaan sprint.
- Meningkatkan velocity tim.

---

# Definition of Ready: User Story

### Requirement

- [ ] User Story memiliki format yang benar: `Sebagai [user], saya ingin [aksi], agar [tujuan]`.
- [ ] Acceptance Criteria tercantum dan jelas.
- [ ] Deskripsi lengkap dan tidak ambigu.
- [ ] User Story terhubung dengan Business Rules (jika ada).

### Design

- [ ] Wireframe atau desain UI tersedia (jika ada perubahan UI).
- [ ] Design mengikuti Design System.
- [ ] Responsive design terdefinisi.

### Technical

- [ ] Database schema terdefinisi (jika ada perubahan data).
- [ ] API contract terdefinisi (jika ada integrasi).
- [ ] Dependency teridentifikasi.
- [ ] Estimasi sudah dilakukan.

### Documentation

- [ ] Dokumentasi teknis tersedia (jika diperlukan).
- [ ] Business Rules terdokumentasi.

---

# Definition of Ready: Bug

### Reproduction

- [ ] Steps to reproduce jelas.
- [ ] Bug dapat direproduksi secara konsisten.
- [ ] Expected behavior terdefinisi.
- [ ] Actual behavior terdokumentasi.

### Environment

- [ ] Environment teridentifikasi (browser, OS, device).
- [ ] Screenshot atau recording tersedia (jika applicable).

### Impact

- [ ] Impact terhadap user teridentifikasi.
- [ ] Prioritas sudah ditentukan.

---

# Definition of Ready: Task

### Description

- [ ] Deskripsi task jelas dan lengkap.
- [ ] Tujuan task teridentifikasi.
- [ ] Link ke User Story atau Bug tercantum.

### Technical

- [ ] Approach atau solusi sudah teridentifikasi.
- [ ] Dependency teridentifikasi.
- [ ] Estimasi sudah dilakukan.

### Acceptance

- [ ] Kriteria penerimaan terdefinisi.
- [ ] Testing approach terdefinisi.

---

# Sprint Entry Criteria

Item boleh masuk sprint apabila:

| Kriteria | Wajib |
|----------|-------|
| User Story terdokumentasi | Ya |
| Acceptance Criteria jelas | Ya |
| Estimasi sudah dilakukan | Ya |
| Dependency teridentifikasi | Ya |
| Design tersedia (jika UI) | Ya |
| Business Rules terdokumentasi | Ya |
| Database design tersedia (jika ada perubahan) | Ya |

---

# Ready vs Not Ready

### Ready

- User Story lengkap dengan acceptance criteria.
- Design tersedia.
- Estimasi sudah dilakukan.
- Tidak ada blocking dependency.

### Not Ready

- User Story ambigu.
- Belum ada design.
- Belum ada estimasi.
- Ada blocking dependency.
- Business Rules belum terdokumentasi.

---

# Refinement Process

1. Product Owner menyiapkan item di backlog.
2. Tim melakukan refinement mingguan.
3. Item yang belum siap dikembalikan ke backlog.
4. Item yang sudah siap ditandai sebagai `Ready`.

---

# Related Documents

- [Definition of Done](./definition-of-done.md) - Kriteria selesai.
- [Backlog](./backlog.md) - Daftar backlog.
- [Milestone](./milestone.md) - Milestone proyek.
