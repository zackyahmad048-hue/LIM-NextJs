# Organization Business Rules

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 2.0

**Status:** Draft

---

# Purpose

Dokumen ini mendefinisikan aturan bisnis pada Domain Organization.

Domain Organization menjadi sumber data resmi (Single Source of Truth) mengenai struktur kepengurusan organisasi LIM berdasarkan AD/ART.

---

# General Rules

- Setiap organisasi memiliki identitas yang unik.
- Struktur kepengurusan mengikuti AD/ART organisasi.
- Seluruh domain menggunakan data organisasi dari domain ini.
- Data organisasi tidak boleh diduplikasi oleh domain lain.
- Periode kepengurusan bersifat tetap: **2024–2029**.

---

# Organization Rules

Setiap organisasi wajib memiliki:

- Nama Organisasi
- Singkatan (Opsional)
- Logo
- Alamat
- Kontak
- Status

---

# Branch Rules

Setiap Cabang (tingkat kabupaten/kota):

- Memiliki nama unik dalam satu Organization.
- Berada pada satu provinsi dan kabupaten/kota.
- Memiliki status aktif atau nonaktif.
- Dapat memiliki banyak Pengurus Cabang dan Anggota.

---

# Central Board Rules

Pengurus Pusat (Central Board):

- Terhubung dengan User.
- Tidak terikat Branch.
- Memiliki periode kepengurusan tetap (2024–2029).
- Status aktif atau nonaktif.
- Satu User dapat menjadi Pengurus Pusat untuk satu Organization.

---

# Regional Board Rules

Pengurus Wilayah (Regional Board — tingkat provinsi):

- Terhubung dengan User.
- Tidak terikat Branch.
- Menunjuk ke provinsi.
- Memiliki periode kepengurusan tetap (2024–2029).
- Status aktif atau nonaktif.
- Satu User dapat menjadi Pengurus Wilayah untuk beberapa provinsi apabila diizinkan oleh organisasi.

---

# Branch Board Rules

Pengurus Cabang (Branch Board — tingkat kabupaten/kota):

- Terhubung dengan User.
- Terikat pada satu Branch.
- Memiliki periode kepengurusan tetap (2024–2029).
- Status aktif atau nonaktif.
- Satu User dapat menjadi Pengurus Cabang untuk beberapa Branch apabila diizinkan oleh organisasi.

---

# Member Rules

Anggota:

- Terhubung dengan User.
- Terikat pada satu Branch.
- Memiliki periode kepengurusan tetap (2024–2029).
- Status aktif atau nonaktif.
- Satu User dapat menjadi Anggota di beberapa Branch apabila diizinkan oleh organisasi.

---

# Active Status Rules

Data aktif digunakan oleh:

- Dashboard
- Program
- Secretariat
- Letter
- Certificate

Data nonaktif tetap disimpan sebagai arsip.

---

# Delete Rules

Penghapusan menggunakan Soft Delete.

Data tidak dapat dihapus apabila masih digunakan oleh domain lain.

---

# Audit Rules

Aktivitas berikut dicatat:

- Create Organization
- Update Organization
- Create Branch
- Update Branch
- Assign Central Board
- Update Central Board
- Assign Regional Board
- Update Regional Board
- Assign Branch Board
- Update Branch Board
- Add Member
- Update Member

---

# Security Rules

- Hanya Administrator yang dapat mengubah struktur organisasi dan kepengurusan.
- Pengguna biasa hanya dapat melihat data sesuai hak akses.
- Seluruh perubahan wajib melalui Permission Check.

---

# Acceptance Criteria

Business Rules dianggap selesai apabila:

- Struktur organisasi konsisten.
- Pengurus Pusat, Pengurus Wilayah, Pengurus Cabang, dan Anggota mengikuti aturan AD/ART.
- Hanya satu periode aktif (2024-2029).
- Seluruh perubahan tercatat pada Audit Log.

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