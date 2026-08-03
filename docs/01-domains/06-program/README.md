# Program Domain Overview

**Project:** LIM Digital Platform
**Folder:** `01-domains/04-program`
**Document:** `README.md`
**Version:** 1.0
**Status:** Approved

# Overview

Domain Program bertanggung jawab mengelola siklus hidup seluruh kegiatan, program kerja, pelatihan, seminar, _workshop_, dan aktivitas organisasi yang diselenggarakan oleh LIM Digital Platform. Domain ini menjadi pusat operasional kegiatan mulai dari tahap perencanaan, pembukaan registrasi, pelaksanaan, hingga evaluasi peserta.

# Objectives

Domain Program bertujuan untuk:

- Mengotomatisasi pengelolaan kegiatan organisasi.
- Menyediakan sistem registrasi peserta yang tervalidasi dan transparan.
- Memusatkan penjadwalan dan alokasi sumber daya (lokasi/kapasitas).
- Mengintegrasikan proses penyelesaian program dengan penerbitan sertifikat digital.
- Mendukung evaluasi dan pelaporan pasca-kegiatan.

# Scope

Domain Program mencakup:

- Program Management (CRUD Program)
- Category & Metadata Management
- Schedule & Venue Management
- Registration & Participant Management
- Program Status Lifecycle
- Program Evaluation & Feedback

# Actors

- **Super Administrator:** Mengelola seluruh program lintas organisasi.
- **Administrator:** Mengelola program spesifik pada unit organisasinya.
- **Operator:** Mengeksekusi operasional program harian, memverifikasi peserta, dan memantau registrasi.
- **Participant:** Mendaftar, mengikuti program, dan mengisi evaluasi.
- **Public User:** Melihat daftar program yang berstatus _Published_.

# Dependencies

- **Authentication & Authorization:** Untuk verifikasi identitas dan hak akses (_RBAC_).
- **Organization:** Untuk menautkan program ke unit kerja penyelenggara.
- **Certificate:** Untuk _trigger_ penerbitan sertifikat saat program berstatus _Completed_[cite: 2].
- **Notification:** Untuk mengirim email/push notification terkait status registrasi dan pengingat jadwal[cite: 2].
- **Media:** Untuk menyimpan _banner_ program dan lampiran materi[cite: 2].
