# Secretariat Validation

**Project:** LIM Digital Platform

**Domain:** Secretariat

**Version:** 1.0

**Status:** Approved

---

# Purpose

Mendefinisikan aturan validasi seluruh data pada Domain Secretariat.

---

# Validation Principles

- Server-side Validation
- Client-side Validation
- Fail Fast
- Consistent Error Message

---

# Incoming Mail Validation

Wajib:

- Agenda Number (otomatis)
- Letter Number
- Sender
- Subject
- Letter Date
- Received Date

Aturan:

- Nomor Surat unik.
- Received Date ≥ Letter Date.
- Lampiran (opsional) hanya dari hasil unggah Domain Media (`media.fileId`).

---

# Outgoing Mail Validation

Wajib:

- Subject
- Level Code
- Category Code
- Letter Date

Aturan:

- Nomor surat lengkap (fullNumber) unik saat diterbitkan.
- Nomor & QR hanya diterbitkan pada transisi ke status **SENT**.
- Template format nomor wajib memuat `{seq}` dan hanya boleh memakai placeholder: `{seq}`, `{level}`, `{category}`, `{bulan}`, `{tahun}`.
- Digit urut penomoran harus bilangan bulat 2–6.
- Periode kepengurusan tidak boleh tumpang tindih.

---

# Disposition Validation

Wajib:

- Incoming Mail
- Assigned User
- Instruction

Aturan:

- Hanya untuk Surat Masuk.
- Assigned User harus aktif.

---

# Administrative Document Validation

Wajib:

- Document Number
- Document Type
- Title

Aturan:

- Nomor Dokumen unik.
- Document Type harus valid.
- Lampiran (opsional) hanya dari hasil unggah Domain Media (`media.fileId`).

---

# Attachment Validation

- Menggunakan Domain Media.
- Format mengikuti standar Media.
- File wajib tersedia.

---

# Search Validation

- search ≤ 100 karakter.

---

# Pagination Validation

- page ≥ 1
- limit 1–100

---

# Archive Validation

Dokumen hanya dapat diarsipkan apabila:

- Status = Approved
- Tidak memiliki proses aktif.

---

# Restore Validation

Dokumen hanya dapat dipulihkan apabila:

- Status = Archived.

---

# Delete Validation

Data tidak dapat dihapus apabila:

- Memiliki relasi aktif.
- Sudah menjadi arsip.
- Digunakan domain lain.

---

# Error Messages

| Validation           | Message                      |
| -------------------- | ---------------------------- |
| Letter Number kosong | Nomor Surat wajib diisi.     |
| Nomor Surat duplikat | Nomor Surat sudah digunakan. |
| User tidak ditemukan | Pengguna tidak ditemukan.    |
| Status tidak valid   | Status dokumen tidak valid.  |

---

# Validation Flow

```text
Request
↓
Validation
↓
Business Rules
↓
Repository
↓
Database
```

---

# Acceptance Criteria

- Seluruh input tervalidasi.
- Nomor surat unik.
- Dokumen tidak valid ditolak.
- Validasi dijalankan sebelum Business Rules.
