# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Empat audiens publik yang saling tumpang tindih (semua dikonfirmasi oleh pemilik produk):

1. **Jamaah umum** — mencari informasi dakwah dan berita kegiatan LIM (artikel, media, jadwal kegiatan).
2. **Jamaah pengguna falak** — mencari jadwal shalat, arah kiblat, kalender Hijriah, hisab/rukyat, gerhana.
3. **Calon kolaborasi/donatur** — menilai kredibilitas LIM untuk kerja sama; butuh kesan organisasi yang kredibel, terawat, dan berwibawa.
4. **Muballigh & cabang** — anggota organisasi yang mencari program, pendaftaran peserta, dan informasi cabang.

Admin internal (sekretariat, pengelola konten, pengelola falak) memakai CMS di `/admin`.

## Product Purpose

LIM Digital Platform adalah situs resmi + CMS dari Lembaga Ittihadul Muballighin (LIM), lembaga dakwah dan pembinaan muballigh dari Pondok Pesantren Lirboyo, Kediri. Situs publik menyebarkan informasi dakwah, berita, profil organisasi, dan layanan falak yang akurat; CMS memungkinkan sekretariat mengelola seluruh konten tanpa developer. Sukses = jamaah menemukan informasi dan layanan dengan cepat, dan situs memantulkan wibawa Lirboyo.

## Positioning

Kredibilitas Lirboyo — otoritas pesantren salaf terkemuka. Yang membedakan: nama besar pesantren sebagai sumber pengetahuan (ilmu falak yang dipegang tradisi pesantren), bukan sekadar portal berita dakwah generik. Semua konten disajikan dalam bahasa Indonesia; lokasi Kediri, Jawa Timur.

## Operating Context

- Bahasa Indonesia; penulisan tanggal Gregorian + Hijriah; arah kiblat & waktu shalat untuk kota-kota Indonesia.
- Tradisi pesantren: hisab dan rukyat adalah praktik nyata yang dijalankan organisasi, bukan sekadar fitur web.
- Konten dirawat oleh sekretariat melalui admin CMS; konten rill berupa berita, profil, program, dan data falak.
- Statistik hero (100+ wilayah, 3000+ delegasi Ramadan, 1000+ titik dakwah) adalah angka organisasi.

## Capabilities and Constraints

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Prisma 7 (PostgreSQL/Neon) + Better Auth.
- **Situs publik sedang dibangun ulang dari nol** (kecuali menu navigasi yang dipertahankan). Seluruh tampilan, komponen, dan struktur halaman diganti dengan dunia visual baru.
- Rute publik: beranda, profil (tentang, visi-misi, pengurus pusat, bidang), artikel, media, kontak, layanan falak (jadwal shalat, kiblat, kalender Hijriah, hisab, rukyat, eclipse), wajib-khidmah/permohonan.
- Admin CMS: konten (posts, kategori, halaman, media), homepage (hero, about), falak, program, sekretariat (surat, disposisi, agenda, arsip), sistem (users, roles). **Admin CMS tidak termasuk dalam rebuild ini.**
- Mobile-first; dark mode default dengan toggle; dual-mode untuk seluruh permukaan — keputusan fungsional yang dikonfirmasi.
- Hamburger nav pada mobile — keputusan fungsional yang dikonfirmasi.
- Aset: logo.png, orangelim.png, iksadari.JPG (foto hero).
- Konten artikel/media saat ini masih placeholder di beberapa halaman (dummy).
- **Incumbent visual details (akan diganti):** Font Hanken Grotesk + Newsreader + Spline Sans Mono + Reem Kufi; glassmorphism "Kaca Kristal" (CSS-only, chrome + kartu saja); Roboto sebagai `--font-sans` di `layout.tsx` (perlu dibersihkan). Detail visual ini tidak mengikat untuk dunia baru.

## Brand Commitments

- Nama organisasi: Lembaga Ittihadul Muballighin (LIM); tagline "Memasyarakatkan Pesantren, Memesantrenkan Masyarakat".
- **Rebuild total situs publik dari nol** — pemilik menyatakan tampilan sebelumnya "jelek banget" dan meminta dunia visual baru. Keputusan fungsional (mobile-first, dual-mode, default dark, hamburger nav) tetap berlaku. Menu navigasi dipertahankan.
- Dunia visual: arah **"Ruang Gelap" (amber darkroom) dicabut** — dinilai kemungkinan hasil AI-generated tanpa dasar kuat, tidak direkomendasikan pemilik produk. Arah pengganti yang dikonfirmasi: **tema gelap (dark mode) sebagai basis, dengan keserasian warna** sebagai prinsip utama — belum ada nama/konsep bertema, palet & tipografi definitif masih terbuka.
- Bahasa situs: Indonesia; slug rute Bahasa Indonesia.
- Narasi dan copy ditulis sendiri oleh pemilik untuk tahap lanjut.
- Build path: **code-led** (tidak ada image generation yang tersedia; ambisi tertulis dalam direction contract).

## Evidence on Hand

- Logo resmi: `/public/images/logo.png`, `/public/images/orangelim.png`.
- Foto hero: `/public/images/iksadari.JPG`.
- Data falak aktual: jadwal shalat untuk kota-kota Indonesia, kiblat, kalender Hijriah.
- Tidak ada testimoni, kasus studi, atau materi pers yang dapat dipakai; jangan mengarang klaim komersial.

## Product Principles

1. Wibawa menyala dari konten dan keterampilan, bukan ornamen — kredibilitas Lirboyo harus terbaca dari materi presentasi.
2. Layanan falak adalah bukti keahlian — tampilkan sebagai keahlian yang nyata, bukan widget generik.
3. Mobile-first: tata letak dimulai dari layar kecil; desktop adalah perpanjangan, bukan tujuan.
4. Dual-mode dengan default gelap; kontras dan keterbacaan tetap terjaga di kedua mode.
5. Bahasa dan budaya Nusantara/pesantren adalah rumah visual yang sah — tanpa stereotip dekoratif.

## Accessibility & Inclusion

- WCAG 2.1 AA untuk kontras teks di kedua mode.
- Konten tidak boleh bergantung pada warna saja untuk menyampaikan makna.