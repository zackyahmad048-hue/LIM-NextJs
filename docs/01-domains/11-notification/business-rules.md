# Notification Business Rules

**Project:** LIM Digital Platform

**Domain:** Notification

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan bisnis (Business Rules) pada Domain Notification.

Domain Notification menjadi layanan terpusat untuk mengirim notifikasi kepada pengguna melalui berbagai kanal komunikasi.

---

# General Rules

- Seluruh notifikasi dikirim melalui Domain Notification.
- Setiap notifikasi memiliki ID unik.
- Seluruh aktivitas pengiriman dicatat pada Audit Log.
- Notifikasi dikirim sesuai preferensi pengguna.

---

# Notification Channels

Kanal yang didukung:

- In-App
- Email
- WhatsApp
- Push Notification
- SMS

Channel dapat diaktifkan atau dinonaktifkan melalui konfigurasi sistem.

---

# Notification Types

Jenis notifikasi meliputi:

- System Notification
- Program Notification
- Letter Notification
- Certificate Notification
- Reminder
- Announcement
- Warning
- Information

---

# Template Rules

Seluruh notifikasi menggunakan Template.

Template terdiri dari:

- Title
- Subject
- Message
- Variables
- Channel

---

# Queue Rules

Seluruh notifikasi masuk ke Queue sebelum dikirim.

Status Queue:

```text id="ntf01"
Pending

Processing

Sent

Failed

Cancelled
```

---

# Delivery Rules

Pengiriman mengikuti urutan:

1. Validasi penerima.
2. Validasi channel.
3. Generate message.
4. Kirim notifikasi.
5. Simpan Delivery Log.

Apabila pengiriman gagal, sistem dapat melakukan retry sesuai konfigurasi.

---

# User Preference Rules

Pengguna dapat mengatur:

- Enable/Disable Email
- Enable/Disable WhatsApp
- Enable/Disable Push Notification
- Enable/Disable SMS

Notifikasi In-App selalu tersedia.

---

# Read Rules

Notifikasi In-App memiliki status:

- Unread
- Read

Waktu membaca dicatat oleh sistem.

---

# Retry Rules

Notifikasi yang gagal dapat dikirim ulang.

Jumlah retry mengikuti konfigurasi sistem.

---

# Archive Rules

Riwayat notifikasi dapat diarsipkan.

Data arsip:

- Read Only.
- Tetap dapat dicari.

---

# Delete Rules

Menggunakan Soft Delete.

Riwayat pengiriman tidak boleh dihapus permanen tanpa hak khusus.

---

# Audit Rules

Aktivitas berikut wajib dicatat:

- Create Notification
- Queue Notification
- Send Notification
- Retry Notification
- Read Notification
- Archive Notification
- Delete Notification

---

# Security Rules

- Authentication wajib.
- Permission wajib.
- Data penerima tidak boleh diakses oleh pihak yang tidak berwenang.
- Seluruh aktivitas dicatat pada Audit Log.

---

# Acceptance Criteria

Business Rules dianggap selesai apabila:

- Seluruh notifikasi melalui Queue.
- Pengiriman mengikuti preferensi pengguna.
- Riwayat pengiriman tersedia.
- Retry berjalan sesuai konfigurasi.
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
