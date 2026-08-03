# Letter Business Rules

**Project:** LIM Digital Platform

**Domain:** Letter

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan bisnis (Business Rules) pada Domain Letter.

Domain Letter bertanggung jawab atas proses pembuatan, persetujuan, penomoran, penandatanganan, distribusi, dan pengarsipan surat resmi organisasi.

---

# General Rules

- Seluruh surat resmi dibuat melalui Domain Letter.
- Setiap surat memiliki nomor yang unik.
- Seluruh perubahan dicatat pada Audit Log.
- Surat hanya dapat diakses oleh pengguna yang memiliki permission.

---

# Letter Types

Jenis surat meliputi:

- Surat Keputusan (SK)
- Surat Tugas
- Surat Undangan
- Surat Pemberitahuan
- Surat Rekomendasi
- Surat Keterangan
- Surat Edaran
- Surat Internal
- Surat Eksternal

Jenis surat dapat ditambahkan melalui pengaturan sistem.

---

# Letter Status

Status surat:

```text id="ltr01"
Draft

Submitted

Reviewed

Approved

Signed

Sent

Archived

Rejected
```

---

# Draft Rules

- Masih dapat diubah.
- Belum memiliki nomor surat final.
- Tidak dapat didistribusikan.

---

# Approval Rules

Surat harus melalui proses persetujuan sebelum ditandatangani.

Persetujuan dilakukan oleh pejabat yang berwenang.

---

# Numbering Rules

Nomor surat:

- Dibuat otomatis.
- Bersifat unik.
- Tidak boleh diubah setelah disetujui.
- Mengikuti format organisasi.

---

# Signature Rules

Surat hanya dapat ditandatangani apabila:

- Status = Approved.
- Nomor surat telah dibuat.
- Penandatangan memiliki hak.

Mendukung:

- Tanda tangan digital.
- Tanda tangan manual (hasil scan).

---

# Distribution Rules

Surat dapat dikirim melalui:

- Unduh PDF.
- Email.
- WhatsApp (opsional).
- Cetak.

Riwayat distribusi harus tersimpan.

---

# Archive Rules

Surat yang telah dikirim dapat diarsipkan.

Surat arsip:

- Read Only.
- Tetap dapat dicari.
- Tidak dapat diubah.

---

# Template Rules

Setiap surat menggunakan Template Surat.

Template menentukan:

- Header
- Footer
- Logo
- Format Nomor
- Format Tanda Tangan

---

# Attachment Rules

Lampiran menggunakan Domain Media.

Domain Letter hanya menyimpan referensi file.

---

# Delete Rules

Menggunakan Soft Delete.

Surat tidak dapat dihapus apabila:

- Sudah ditandatangani.
- Sudah dikirim.
- Sudah menjadi arsip.
- Menjadi referensi domain lain.

---

# Audit Rules

Aktivitas berikut wajib dicatat:

- Create Letter
- Update Letter
- Submit Letter
- Approve Letter
- Reject Letter
- Generate Number
- Sign Letter
- Send Letter
- Archive Letter
- Delete Letter

---

# Security Rules

- Authentication wajib.
- Permission wajib.
- Nomor surat tidak dapat dimodifikasi setelah dibuat.
- Arsip bersifat Read Only.

---

# Acceptance Criteria

Business Rules dianggap selesai apabila:

- Seluruh surat mengikuti lifecycle yang ditentukan.
- Nomor surat selalu unik.
- Surat tidak dapat ditandatangani sebelum disetujui.
- Arsip tidak dapat diubah.
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
