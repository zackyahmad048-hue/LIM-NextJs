1. Logika Pengisian Data (Panduan untuk Editor)
Editor wajib membaca aturan (logika) ini sebelum mengisi atau memvalidasi tabel Markdown:

A. Referensi Master Data (Pos Khidmah)
Data pada kolom Pos Khidmah HANYA boleh diisi dengan salah satu opsi berikut (tidak boleh mengarang sendiri):

0. Asuhan Dzuriyah

1. Pondok Induk

2. Pondok Unit

3. Pondok Cabang Zonasi

4. Pondok Cabang non Zonasi

5. MHM - Ma'had Aly

6. Lembaga Pemohon

7. TPQ - Madin

8. Binaan LIM

B. Logika Kondisional (If-Then) per Kolom

Kolom Asal Daerah:

Logika: Harus memuat dua entitas yang dipisah tanda strip (-).

Format: [Kota/Kabupaten] - [Provinsi]. Contoh: Kediri - Jawa Timur.

Kolom Status:

Logika: Hanya menerima 4 nilai mutlak (pilih salah satu): Aktif, Gugur, Bebas Tugas, atau Qodlo.

Kolom Keterangan (PENTING):

Logika 1: JIKA kolom Status = Aktif, MAKA kolom Keterangan harus diisi strip (-).

Logika 2: JIKA kolom Status = Gugur ATAU Bebas Tugas ATAU Qodlo, MAKA kolom Keterangan WAJIB DIISI dengan alasannya (misal: "Sakit", "Pulang tanpa izin", "Masa tugas selesai").

Kolom Catatan:

Logika: Bertipe String (teks bebas). Digunakan untuk mencatat progres, masalah, atau track record khusus peserta. Jika tidak ada, isi dengan strip (-).

Kolom Absensi:

Logika: Format penulisan wajib memuat Bulan Hijriyah dan Tahun Hijriyah. Contoh: Safar 1448 H.

2. Template Markdown (Untuk Di-copy Editor)
Editor dapat menyalin template kosong di bawah ini ke dalam editor Markdown.

Markdown
# Database Peserta Wajib Khidmah

*(Referensi Kategori: 0. Asuhan Dzuriyah | 1. Pondok Induk | 2. Pondok Unit | 3. Pondok Cabang Zonasi | 4. Pondok Cabang non Zonasi | 5. MHM - Ma'had Aly | 6. Lembaga Pemohon | 7. TPQ - Madin | 8. Binaan LIM)*

| No | Nama | Asal Daerah | Pos Khidmah | Tempat Khidmah | Alamat Lembaga | Tugas Khidmah | Status | Keterangan | Catatan | Absensi |
|:--:|:---|:---|:---|:---|:---|:---|:--:|:---|:---|:---|
| 1 |  |  -  |  |  |  |  |  |  |  |  |
| 2 |  |  -  |  |  |  |  |  |  |  |  |
| 3 |  |  -  |  |  |  |  |  |  |  |  |
3. Contoh Pengisian yang Benar & Salah (Untuk Koreksi Editor)
Berikut adalah contoh tabel dengan penerapan logika di atas. Editor bisa melihat mana pengisian yang divalidasi dengan benar dan mana yang melanggar logika.

Markdown
| No | Nama | Asal Daerah | Pos Khidmah | Tempat Khidmah | Alamat Lembaga | Tugas Khidmah | Status | Keterangan | Catatan | Absensi |
|:--:|:---|:---|:---|:---|:---|:---|:--:|:---|:---|:---|
| 1 | M. Fulan | Kediri - Jawa Timur | 1. Pondok Induk | Asrama Sunan Ampel | Lirboyo | Pengajar | Aktif | - | Rajin | Safar 1448 H |
| 2 | Abdullah | Demak - Jawa Tengah | 3. Pondok Cabang Zonasi | PP. Demak | Demak Kota | Keamanan | Gugur | Melanggar tata tertib | Harus disidang | Muharram 1448 H |
| 3 | Zaid | Jombang - Jatim | Cabang | PP. Tebuireng | Jombang | Staf | Aktif | Cuti sakit | - | Agustus |
Analisis Evaluasi (Untuk Editor) dari tabel contoh di atas:

Baris 1 (Fulan): ✅ BENAR. Semua logika terpenuhi. Status Aktif, maka keterangan -.

Baris 2 (Abdullah): ✅ BENAR. Status Gugur, dan kolom keterangan diisi alasannya (Melanggar tata tertib).

Baris 3 (Zaid): ❌ SALAH. Terdapat beberapa pelanggaran logika:

Asal daerah disingkat ("Jatim" seharusnya "Jawa Timur").

Pos Khidmah tidak menggunakan referensi (hanya ditulis "Cabang", seharusnya angka & nama kategori, misal: 4. Pondok Cabang non Zonasi).

Logika berbenturan: Status Aktif tapi Keterangan berisi "Cuti sakit". Jika cuti sakit, seharusnya Status diganti menjadi Qodlo (atau status lain yang disepakati), atau jika tetap aktif, keterangannya harus -.

Absensi menggunakan kalender Masehi ("Agustus"), seharusnya Hijriyah.

---

# Lembaga Pemohon Guru Bantu

Lembaga pemohon guru bantu adalah lembaga eksternal yang mengajukan permintaan tenaga guru dari Pondok Pesantren Lirboyo untuk ditugaskan sebagai guru atau pengurus di lembaga tersebut. Alur: **form publik** yang diisi lembaga (via tautan, tanpa login) → data tercatat → **admin/sekretariat** memverifikasi di dashboard.

## Karakteristik

- Form publik diisi tanpa autentikasi, hanya diakses lewat tautan langsung (tidak tampil di navbar/menu publik).
- Belum ada lifecycle status permohonan (data dicatat, diverifikasi manual oleh admin).
- Satu lembaga dapat menautkan banyak anggota TWK (relasi `1 : N` ke `WajibKhidmahMember`).

## Entitas & Tabel

Model `WajibKhidmahLembaga` (`wajib_khidmah_lembaga`) berisi:

1. **Identitas Lembaga** — nama, RT/RW, desa/kelurahan, kecamatan, kabupaten/kota, provinsi, telepon, media sosial.
2. **Identitas Pemohon Guru Bantu** — dua blok pola sama: Pengasuh dan Penanggung Jawab. Masing-masing: nama, status (Alumni Lirboyo / Bukan Alumni / Wali Santri / Yang Lain), angkatan alumni (syarat Alumni), status lainnya (syarat "Yang Lain"), telepon, foto (3×4).
3. **Kondisi Lembaga** — lokasi madrasah (dalam/luar pesantren), jenis satuan pendidikan (enum), kitab bermakna (multi: Jawa/Madura/Sunda/Lainnya), bahasa pengantar (multi: Indonesia/Lainnya), jumlah pengurus & santri (putra/putri).
4. **Permohonan Guru Bantu** — jumlah guru bantu dimohon (1 atau 2), tugas yang diamanatkan, kitab yang akan diajarkan, catatan untuk calon guru bantu.
5. **Upload File** — dokumen permohonan PDF maksimal 5 MB.

Relasi: `WajibKhidmahMember.lembagaId → WajibKhidmahLembaga.id` (opsional, `ON DELETE SET NULL`).

## Route & Modul

- Form publik: `/wajib-khidmah/permohonan` (wizard 5 langkah, animasi, validasi per langkah).
- Admin: `/admin/twk/lembaga` daftar + `/admin/twk/lembaga/[id]` detail (baca saja).
- Modul: `modules/twk-lembaga/` (domain, application, infrastructure, validations, presentation, queries).
- File diunggah via Vercel Blob, metadata di tabel `media`, disajikan privat lewat `/api/media/:fileId`.

## Permission

- `twk.lembaga.view` — melihat daftar & detail lembaga pemohon di dashboard.