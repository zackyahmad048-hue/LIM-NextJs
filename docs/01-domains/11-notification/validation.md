# Notification Validation

**Project:** LIM Digital Platform

**Domain:** Notification

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan validasi pada Domain Notification.

Seluruh notifikasi wajib melalui proses validasi sebelum dimasukkan ke Queue dan dikirim ke penerima.

---

# Validation Principles

- Server-side Validation
- Client-side Validation
- Fail Fast
- Consistent Error Messages

---

# Notification Validation

## Recipient

- Wajib diisi.
- Harus merupakan User aktif.

---

## Title

- Wajib diisi.
- Minimum 3 karakter.
- Maksimum 255 karakter.

---

## Message

- Wajib diisi.
- Tidak boleh kosong.

---

## Type

Harus salah satu dari:

- System
- Program
- Letter
- Certificate
- Reminder
- Announcement
- Warning
- Information

---

## Channel

Harus salah satu dari:

- In-App
- Email
- WhatsApp
- Push
- SMS

Minimal satu channel harus dipilih.

---

# Template Validation

- Template harus tersedia.
- Template harus aktif.
- Variable template wajib valid.

---

# Queue Validation

Notifikasi hanya dapat masuk Queue apabila:

- Penerima valid.
- Channel aktif.
- Template valid.

---

# Delivery Validation

Pengiriman hanya dilakukan apabila:

- Queue Status = Pending.
- User mengaktifkan channel tersebut.
- Alamat tujuan tersedia (Email, Nomor WhatsApp, Device Token).

---

# Preference Validation

Pengguna hanya dapat mengubah preferensi miliknya sendiri.

Minimal satu channel harus tetap aktif.

---

# Retry Validation

Retry hanya dapat dilakukan apabila:

- Status = Failed.
- Retry Count belum melebihi batas konfigurasi.

---

# Archive Validation

Notifikasi hanya dapat diarsipkan apabila:

- Status = Delivered.
- Status = Read.

---

# Restore Validation

Notifikasi hanya dapat dipulihkan apabila:

- Status = Archived.

---

# Delete Validation

Notifikasi tidak dapat dihapus apabila:

- Masih berada di Queue.
- Sedang diproses.
- Menjadi bagian Audit Log.

---

# Search Validation

- search ≤ 100 karakter.

---

# Pagination Validation

- page ≥ 1
- limit 1–100

---

# Error Messages

| Validation               | Message                              |
| ------------------------ | ------------------------------------ |
| Recipient kosong         | Penerima wajib diisi.                |
| Template tidak ditemukan | Template notifikasi tidak valid.     |
| Channel tidak tersedia   | Channel tidak tersedia.              |
| Retry melebihi batas     | Retry telah mencapai batas maksimum. |
| Queue masih diproses     | Notifikasi sedang diproses.          |

---

# Validation Flow

```text id="ntfval01"
Request

↓

Validation

↓

Business Rules

↓

Queue

↓

Repository

↓

Database
```

---

# Acceptance Criteria

- Seluruh input tervalidasi.
- Penerima dan channel valid.
- Retry mengikuti konfigurasi.
- Queue hanya menerima data yang valid.
- Seluruh validasi dijalankan sebelum Business Rules.
