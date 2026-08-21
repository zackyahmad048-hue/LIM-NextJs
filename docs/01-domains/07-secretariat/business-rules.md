# Secretariat Business Rules

**Project:** LIM Digital Platform

**Domain:** Secretariat

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan bisnis (Business Rules) pada Domain Secretariat.

Domain Secretariat menjadi pusat administrasi organisasi yang mengelola surat, disposisi, arsip, dan dokumen resmi.

---

# General Rules

- Seluruh administrasi organisasi dikelola melalui Domain Secretariat.
- Setiap dokumen memiliki identitas yang unik.
- Seluruh aktivitas administrasi dicatat pada Audit Log.
- Dokumen hanya dapat diakses oleh pengguna yang memiliki permission.

---

# Incoming Mail Rules

Setiap Surat Masuk wajib memiliki:

- Nomor Agenda
- Nomor Surat
- Tanggal Surat
- Tanggal Diterima
- Pengirim
- Perihal
- Lampiran (Opsional)
- Status

---

# Outgoing Mail Rules

Setiap Surat Keluar wajib memiliki:

- Perihal
- Tanggal Surat
- Penerima (Opsional)
- Penandatangan (Opsional)
- Status

Nomor surat mengikuti format penomoran organisasi.

Penomoran & QR:

- Nomor surat dan QR verifikasi diterbitkan **otomatis** saat surat ditandai terkirim (`DRAFT → SENT`).
- Format nomor, jumlah digit urut, periode kepengurusan, dan kode tingkat bersifat **konfigurable** dan dikelola super admin (halaman Penomoran Surat).
- Nomor urut berjalan per periode kepengurusan dan dapat dikoreksi manual oleh super admin.
- Mengubah tingkat/kategori surat yang sudah bernomor akan memutakhirkan nomor surat otomatis.
- Surat yang diarsipkan tidak dapat diubah.

---

# Disposition Rules

Disposisi hanya dapat dibuat untuk Surat Masuk.

Setiap disposisi memiliki:

- Penerima
- Instruksi
- Tanggal Disposisi
- Status

Status:

```text id="sec01"
Pending

In Progress

Completed

Cancelled
```

---

# Archive Rules

Dokumen yang telah selesai diproses dipindahkan ke Arsip.

Dokumen arsip:

- Tetap dapat dicari.
- Tidak dapat diubah.
- Tidak dapat dihapus secara permanen melalui aplikasi.

---

# Administrative Document Rules

Dokumen administrasi meliputi:

- SK
- Berita Acara
- Notulen
- Memorandum
- Dokumen Internal

Seluruh dokumen memiliki nomor dokumen yang unik.

---

# Agenda Rules

Setiap surat yang diterima atau diterbitkan dicatat pada Buku Agenda.

Nomor agenda dibuat otomatis berdasarkan urutan penerimaan atau pengiriman.

---

# Document Tracking Rules

Status dokumen dapat berupa:

```text id="sec02"
Draft

Submitted

Approved

Rejected

Archived
```

Riwayat perubahan status harus tersimpan.

---

# Attachment Rules

Lampiran menggunakan Domain Media.

Sekretariat hanya menyimpan referensi file.

---

# Delete Rules

Menggunakan Soft Delete.

Dokumen yang telah:

- Diarsipkan,
- Memiliki disposisi,
- Menjadi referensi domain lain,

tidak dapat dihapus.

---

# Audit Rules

Aktivitas berikut wajib dicatat:

- Create Document
- Update Document
- Create Incoming Mail
- Create Outgoing Mail
- Create Disposition
- Archive Document
- Restore Document
- Delete Document

---

# Security Rules

- Authentication wajib.
- Permission wajib.
- Dokumen rahasia hanya dapat diakses oleh Role yang berwenang.
- Seluruh perubahan tercatat pada Audit Log.

---

# Acceptance Criteria

Business Rules dianggap selesai apabila:

- Seluruh surat memiliki nomor unik.
- Disposisi hanya dapat dibuat untuk Surat Masuk.
- Arsip tidak dapat diubah.
- Dokumen mengikuti alur status yang ditentukan.
- Seluruh aktivitas tercatat pada Audit Log.

---

# Related Documents

- README.md
- workflow.md
- database.md
- api.md
- permissions.md
- validation.md
- ui.md
- roadmap.md
