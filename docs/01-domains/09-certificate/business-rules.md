# Certificate Business Rules

**Project:** LIM Digital Platform

**Domain:** Certificate

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan bisnis (Business Rules) pada Domain Certificate.

Domain Certificate bertanggung jawab atas proses penerbitan, penomoran, penandatanganan, verifikasi, distribusi, dan pengarsipan sertifikat digital.

---

# General Rules

* Seluruh sertifikat dibuat melalui Domain Certificate.
* Setiap sertifikat memiliki nomor yang unik.
* Seluruh aktivitas dicatat pada Audit Log.
* Sertifikat hanya diterbitkan kepada peserta yang memenuhi syarat.

---

# Certificate Types

Jenis sertifikat meliputi:

* Sertifikat Peserta
* Sertifikat Panitia
* Sertifikat Pemateri
* Sertifikat Narasumber
* Sertifikat Penghargaan
* Sertifikat Apresiasi

Jenis sertifikat dapat ditambah melalui pengaturan sistem.

---

# Certificate Status

Status sertifikat:

```text id="crt01"
Draft

Generated

Signed

Published

Downloaded

Revoked

Archived
```

---

# Eligibility Rules

Sertifikat hanya dapat diterbitkan apabila:

* Program berstatus **Completed**.
* Peserta terdaftar pada Program.
* Peserta memenuhi persyaratan organisasi.
* Template sertifikat tersedia.

---

# Numbering Rules

Nomor sertifikat:

* Dibuat otomatis.
* Harus unik.
* Tidak dapat diubah setelah diterbitkan.

---

# QR Verification Rules

Setiap sertifikat memiliki:

* QR Code unik.
* Verification Code unik.
* Halaman verifikasi publik.

QR Code digunakan untuk memastikan keaslian sertifikat.

---

# Signature Rules

Sertifikat hanya dapat ditandatangani apabila:

* Status = Generated.
* Nomor sertifikat telah tersedia.
* Penandatangan memiliki hak.

Mendukung:

* Digital Signature.
* Manual Signature.

---

# Distribution Rules

Sertifikat dapat didistribusikan melalui:

* Download PDF.
* Email.
* WhatsApp (Opsional).

Riwayat distribusi harus tersimpan.

---

# Archive Rules

Sertifikat yang telah diterbitkan dapat diarsipkan.

Sertifikat arsip:

* Read Only.
* Tetap dapat diverifikasi.
* Tidak dapat diubah.

---

# Revocation Rules

Sertifikat dapat dicabut apabila:

* Terjadi kesalahan data.
* Sertifikat diterbitkan tidak sah.
* Diputuskan oleh Administrator.

Status berubah menjadi **Revoked** namun riwayat tetap disimpan.

---

# Delete Rules

Menggunakan Soft Delete.

Sertifikat yang telah diterbitkan tidak dapat dihapus.

---

# Audit Rules

Aktivitas berikut wajib dicatat:

* Create Certificate
* Generate Certificate
* Generate Number
* Sign Certificate
* Publish Certificate
* Download Certificate
* Revoke Certificate
* Archive Certificate

---

# Security Rules

* Authentication wajib.
* Permission wajib.
* QR Verification bersifat publik.
* Sertifikat tidak dapat dimodifikasi setelah Published.

---

# Acceptance Criteria

Business Rules dianggap selesai apabila:

* Nomor sertifikat selalu unik.
* Sertifikat hanya diterbitkan kepada peserta yang memenuhi syarat.
* QR Verification selalu tersedia.
* Sertifikat yang dicabut tetap memiliki riwayat.
* Seluruh aktivitas tercatat pada Audit Log.

---

# Related Documents

* README.md
* workflow.md
* database.md
* api.md
* permissions.md
* validation.md
* ui.md
* roadmap.md
