# LIM Digital Platform

Platform manajemen organisasi LIM — sekretariat surat-menyurat, penomoran surat,
falak, program, dan konten publik, dibangun sebagai modul-modul fitur di atas
Next.js App Router.

## Language

### Surat Menyurat

**Surat Masuk**:
Surat yang diterima organisasi dari pihak luar. Berada pada status `RECEIVED`
saat pertama kali dicatat, dan `ARCHIVED` setelah selesai ditangani.
_Avoid_: surat baru, surat pending, surat masuk otomatis

**Surat Keluar**:
Surat yang diterbitkan organisasi ke pihak luar. Nomor resminya terbit saat
status berubah menjadi `SENT` — bukan saat draft dibuat.
_Avoid_: surat draft bernomor, surat baru

**Disposisi**:
Instruksi tertulis atas sebuah Surat Masuk, mencatat siapa yang ditugaskan
menanganinya dan kapan harus selesai. Satu Surat Masuk dapat memiliki banyak
Disposisi.
_Avoid_: tugas, disposisi surat

**Petugas**:
Orang yang ditugaskan menangani Disposisi atas nama unit kerjanya.
_Avoid_: officer, user sekretariat

**Unit Kerja**:
Struktur organisasi yang memiliki Petugas di dalamnya; menjadi sumber pilihan
tingkat surat pada Surat Keluar.
_Avoid_: unit, organisasi, Satker

### Arsip

**Arsip**:
Status yang menandai sebuah dokumen sudah selesai dan tidak lagi dikerjakan —
bukan nama tempat penyimpanan. Halaman Arsip menampilkan dokumen berstatus
`ARCHIVED` dari Surat Masuk, Surat Keluar, dan Dokumen Administrasi.
_Avoid_: folder arsip, repositori arsip

**Dokumen Administrasi**:
Dokumen resmi yang disusun internal dan mengikuti alur persetujuan
DRAFT → SUBMITTED → APPROVED → ARCHIVED, berbeda dari surat yang terbit lewat
Surat Keluar.
_Avoid_: dokumen, arsip, dokumen resmi

### Penomoran

**Nomor Surat**:
Identifier resmi Surat Keluar yang terbit saat surat ditandai terkirim,
dibentuk dari tingkat, kategori, bulan Romawi, dan nomor urut dalam periode.
Draft tidak memiliki Nomor Surat. Nomor Surat tetap dipegang surat yang ditarik
kembali ke Draft setelah pernah terbit.
_Avoid_: nomor registrasi, nomor dokumen

### Verifikasi

**Verifikasi Surat**:
Pemeriksaan publik atas keaslian sebuah Surat Keluar, memakai Nomor Surat itu
sendiri sebagai kode — tidak ada kode terpisah. Hasilnya salah satu dari tiga:
Sah, Tidak Berlaku, atau Tidak Ditemukan. Buktinya metadata surat; dokumen asli
tidak diterbitkan lewat halaman ini.
_Avoid_: cek surat, validasi surat, kode verifikasi

**Surat Tidak Berlaku**:
Surat Keluar yang Nomor Suratnya pernah terbit tetapi kini berstatus Draft —
ditarik kembali oleh sekretariat. Verifikasi Surat menyatakannya tidak berlaku,
bukan tidak ditemukan.
_Avoid_: surat palsu, surat batal, surat kedaluwarsa

### Batasan yang harus diketahui

**Hapus Disposisi**:
Penghapusan lunak (mengisi `deletedAt`), sama seperti Surat Masuk, Surat Keluar,
dan Agenda. Tidak ada aksi pemulihan: disposisi terhapus tak tampil di mana pun.
_Avoid_: hapus permanen

**DocumentArchive**:
Entitas arsip tersendiri yang saat ini tidak dipakai halaman mana pun. Halaman
Arsip disusun dari dokumen berstatus `ARCHIVED`, bukan dari entitas ini.
_Avoid_: arsip
