
# Implementasi Platform (Catatan Teknis)

> Dokumen di bawah adalah ketentuan resmi organisasi. Bagian ini mencatat
> bagaimana ketentuan tersebut diimplementasikan di LIM Digital Platform.

- Format nomor **konfigurable** melalui halaman Penomoran Surat
  (`/admin/system/penomoran`, khusus super admin) dan tersimpan di tabel
  `Setting` (prefiks `secretariat.numbering.*`). Default:
  `{seq}/{level}/{category}/{bulan}/{tahun}` dengan digit urut 3.
- Placeholder yang dikenali: `{seq}`, `{level}`, `{category}`, `{bulan}`, `{tahun}`.
- Nomor urut berjalan **per periode kepengurusan** (kolom 5 memakai tahun awal
  periode aktif, bukan tahun kalender). Periode dapat dikonfigurasi.
- Nomor urut di-pad dengan nol di depan sesuai `sequenceDigits`.
- Nomor surat dan QR verifikasi diterbitkan **otomatis saat surat keluar
  ditandai terkirim** (status `SENT`), bukan saat persetujuan.
- Kode indeks tingkat (PP, PP.I–PP.IX, PW.*, PC.*) dapat dikelola sebagai opsi
  pada pengaturan penomoran.
- Logika format berada di `modules/secretariat/application/letter-number.rules.ts`
  (murni, tanpa akses data) dan dikonfigurasi via
  `modules/secretariat/infrastructure/letter-numbering.config.ts`.

---


NOMOR SURAT
Nomor surat adalah nomor urut pada buku agenda surat keluar beserta kode-kode yang telah ditetapkan;
Nomor surat terdiri dari lima kolom yang dipisah dengan garis miring, yaitu:
Kolom 1 (satu) nomor surat yang dimulai dari pergantian pengurus;
Kolom 2 (dua) kode indeks tingkat kepengurusan;
Kolom 3 (tiga) kode kategori surat dan jenis surat;
Kolom 4 (empat) bulan ditulis dengan angka romawi;
Kolom 5 (lima) tahun ditulis empat angka terakhir;
Jarak pemisah kolom indeks ditandai dengan garis miring (/);
Letak nomor surat kategori biasa di bawah kepala surat sebelah kiri, sedangkan letak nomor surat kategori khusus berada di tengah dengan posisi di bawah judul surat.


LAMPIRAN SURAT
Lampiran, diisi jika memang terdapat lampiran yang disertakan bersama surat tersebut sebagai tambahan/penjelasan yang mempunyai kaitan langsung;
Jumlah lampiran ditulis dengan angka dan huruf.


PERIHAL SURAT
Perihal, ditulis isi atau pokok persoalan yang dimaksud.


DAFTAR KODE INDEKS
Daftar kode indeks Pengurus Pusat, Pengurus Wilayah, dan Pengurus Cabang se-Indonesia:
Kode indeks Pengurus Pusat cukup ditulis dengan (PP);
Kode indeks Bidang-Bidang Pengurus Pusat:
NOMOR
BIDANG
PP.I
Bidang Safari Dakwah Rutinan;
PP.II
Bidang Penelitian dan Pengembangan;
PP.III
Bidang Safari Ramadan;
PP.IV
Bidang Pesantren Ramadan;
PP.V
Bidang Dakwah Digital;
PP.VI
Bidang Wajib Khidmah;
PP.VII
Bidang Pemberdayaan Ekonomi;
PP.VIII
Bidang Pendidikan dan Kaderisasi;
PP.IX
Bidang Kajian Karya Ilmiah.

Kode indeks Pengurus Wilayah se-Indonesia:
NOMOR
WILAYAH
PW.I
Jawa Timur
PW.II
Jawa Tengah
PW.III
Daerah Istimewa Yogyakarta
PW.IV
Jawa Barat
PW.V
Jabodetabek
PW.VI
Banten
PW.VII
Lampung
PW.VIII
Sumatera Selatan
PW.IX
Bangka Belitung
PW.X
Bengkulu
PW.XI
Jambi
PW.XII
Riau
PW.XIII
Sumatera Utara
PW.XIV
Aceh
PW.XV
Kalimantan Timur
PW.XVI
Kalimantan Barat
PW.XVII
Bali

Kode indeks Pengurus Cabang se-Jawa Timur:
NOMOR
CABANG
PC.I.1
Cabang Kediri
PC.I.2
Cabang Nganjuk
PC.I.3
Cabang Blitar
PC.I.4
Cabang Tulungagung
PC.I.5
Cabang Trenggalek
PC.I.6
Cabang Jombang
PC.I.7
Cabang Mojokerto
PC.I.8
Cabang Surabaya
PC.I.9
Cabang Sidoarjo
PC.I.10
Cabang Malang Raya
PC.I.11
Cabang Pasuruan
PC.I.12
Cabang Probolinggo
PC.I.13
Cabang Jember
PC.I.14
Cabang Lumajang
PC.I.15
Cabang Bondowoso & Situbondo
PC.I.16
Cabang Banyuwangi
PC.I.17
Cabang Ponorogo
PC.I.18
Cabang Magetan
PC.I.19
Cabang Ngawi
PC.I.20
Cabang Madiun
PC.I.21
Cabang Pacitan
PC.I.22
Cabang Bojonegoro
PC.I.23
Cabang Tuban
PC.I.24
Cabang Lamongan
PC.I.25
Cabang Bangkalan
PC.I.26
Cabang Sampang
PC.I.27
Cabang Pamekasan
PC.I.28
Cabang Sumenep

Kode indeks Pengurus Cabang se-Jawa Tengah:
NOMOR
CABANG
PC.II.1
Cabang Sragen
PC.II.2
Cabang Karanganyar
PC.II.3
Cabang Boyolali
PC.II.4
Cabang Wonogiri
PC.II.5
Cabang Klaten
PC.II.6
Cabang Rembang
PC.II.7
Cabang Blora
PC.II.8
Cabang Pati
PC.II.9
Cabang Grobogan
PC.II.10
Cabang Demak
PC.II.11
Cabang Kudus
PC.II.12
Cabang Jepara
PC.II.13
Cabang Semarang & Salatiga
PC.II.14
Cabang Kota Semarang
PC.II.15
Cabang Kendal
PC.II.16
Cabang Magelang
PC.II.17
Cabang Purworejo
PC.II.18
Cabang Temanggung
PC.II.19
Cabang Wonosobo
PC.II.20
Cabang Banjarnegara
PC.II.21
Cabang Kebumen
PC.II.22
Cabang Purbalingga
PC.II.23
Cabang Banyumas
PC.II.24
Cabang Cilacap
PC.II.25
Cabang Pekalongan
PC.II.26
Cabang Pemalang
PC.II.27
Cabang Batang
PC.II.28
Cabang Brebes
PC.II.29
Cabang Tegal

Kode indeks Pengurus Cabang se-Jawa Barat:
NOMOR
CABANG
PC.IV.1
Cabang Cirebon
PC.IV.2
Cabang Indramayu
PC.IV.3
Cabang Karawang - Purwakarta
PC.IV.4
Cabang Subang
PC.IV.5
Cabang Kuningan
PC.IV.6
Cabang Priangan
PC.IV.7
Cabang Priangan Timur
PC.IV.8
Cabang Majalengka
PC.IV.9
Cabang Cianjur
PC.IV.10
Cabang Sukabumi

Kode indeks Pengurus Cabang se-Jabodetabek:
NOMOR
CABANG
PC.V.1
Cabang Depok & Bogor
PC.V.2
Cabang Jakarta Timur & Pusat
PC.V.3
Cabang Jakarta Barat
PC.V.4
Cabang Jakata Utara
PC.V.5
Cabang Jakarta Selatan
PC.V.6
Cabang Bekasi Raya
PC.V.7
Cabang Tangerang Raya

Kode indeks Pengurus Cabang se-Banten:
NOMOR
CABANG
PC.VI.1
Cabang Kota Pandeglang
PC.VI.2
Cabang Lebak
PC.VI.3
Cabang Kota Serang
PC.VI.4
Cabang Serang Barat
PC.VI.5
Cabang Serang Timur
PC.VI.6
Cabang Kab. Pandeglang
PC.VI.7
Cabang Tangerang 

Kode indeks Pengurus Cabang se-Lampung:
NOMOR
CABANG
PC.VII.1
Cabang Pringsewu
PC.VII.2
Cabang Tanggamus
PC.VII.3
Cabang Lampung Timur
PC.VII.4
Cabang Lampung Selatan
PC.VII.5
Cabang Tulang Bawang
PC.VII.6
Cabang Pesawaran
PC.VII.7
Cabang Lampung Tengah
PC.VII.8
Cabang Way Kanan
PC.VII.9
Cabang Mesuji
PC.VII.10
Cabang Lampung Barat
PC.VII.11
Cabang Lampung Utara
PC.VII.12
Cabang Bandar Lampung
PC.VII.13
Cabang Tulang Bawang Barat

Kode indeks Pengurus Cabang se-Sumatera Selatan:
NOMOR
CABANG
PC.VIII.1
Cabang Ogan Komering Ilir
PC.VIII.2
Cabang Ogan Komering Ulu Timur
PC.VIII.3
Cabang Banyuasin
PC.VIII.4
Cabang Musi Banyuasin
PC.VIII.5
Cabang Ogan Komering Ulu
PC.VIII.6
Cabang Muara Enim
PC.VIII.7
Cabang Musirawas

Kode indeks Pengurus Cabang daerah lain:
NOMOR
CABANG
PC.XVIII.1
Cabang Lombok
PC.XVIII.2
Cabang Batam
PC.XVIII.3
Cabang Jambi Barat
PC.XVIII.4
Cabang Jambi Timur

Ketentuan mengenai kode indeks Pengurus Anak Cabang diatur oleh Pengurus Cabang;
Ketentuan mengenai kode indeks Bidang-Bidang pada tingkat Wilayah, Cabang, dan Anak Cabang diatur oleh Pengurus tingkat masing-masing;


DAFTAR KATEGORI DAN JENIS SURAT
Daftar kode kategori surat dan jenis surat:
KODE
CABANG
A
Surat Keputusan
B
Undangan
C
Permohonan
D
Pemberitahuan
E
Instruksi
F
Pengantar
G
Jawaban Permohonan
H
Surat Tugas/Mandat Tugas
I
Surat Kuasa
J
Rekomendasi
K
Surat Pernyataan
L
Surat Peringatan
M
Pengumuman
N
Surat Perjanjian
O
Surat Edaran
P
Berita Acara
Q
Nota Dinas
R
Surat Keterangan
S
Laporan
T
Notulen Rapat



TANGGAL SURAT
Surat menggunakan tanggal masehi serta tahun ditulis lengkap, terletak di sudut kanan atas sejajar dengan nomor surat dan didahului dengan nama daerah dikeluarkannya surat;
Selain surat rutin penulisan tanggal berada di bawah penutup.
