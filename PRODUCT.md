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
- Situs publik: beranda, profil (tentang, visi-misi, pengurus pusat), artikel, media, kontak, layanan falak (jadwal shalat, kiblat, kalender Hijriah, hisab, rukyat, eclipse) dengan REST API publik.
- Admin CMS: konten (posts, kategori, halaman, media), homepage (hero, about), falak, program, sekretariat (surat, disposisi, agenda, arsip), sistem (users, roles).
- Mobile-first; dark mode default dengan toggle; dual-mode untuk seluruh permukaan (keputusan yang sudah dikonfirmasi sebelumnya — detail visual dipertanyakan lagi oleh pemilik).
- Font Hanken Grotesk (situs) + Newsreader (display) + Spline Sans Mono (data) + Reem Kufi (Arab). Catatan deviasi: `layout.tsx` juga memuat Roboto sebagai `--font-sans` — perlu dibersihkan.
- Glassmorphism ("Kaca Kristal") dipakai terbatas pada **chrome** (navbar, sidebar admin, topbar) dan **kartu/panel** (taqwim hero, kartu dashboard, kartu konten), CSS-only dengan fallback `prefers-reduced-transparency`. Tabel, form, dan teks panjang tetap solid.
- Aset: logo.png, orangelim.png, iksadari.JPG (foto hero saat ini).
- Konten artikel/media saat ini masih placeholder di beberapa halaman (dummy).

## Brand Commitments

- Nama organisasi: Lembaga Ittihadul Muballighin (LIM); tagline "Menebar Dakwah, Memasyarakatkan Pesantren".
- Keputusan terdahulu (grilling): mobile-first, glassmorphism, dual-mode, default dark, hamburger nav — **pemilik menyatakan tampilan hasilnya "jelek banget" dan meminta dunia visual baru dari nol**; keputusan warna/aksen/bahan boleh diganti, keputusan fungsional (mobile-first, dual-mode, default dark, hamburger) tetap berlaku. Glassmorphism kini dikembalikan secara terbatas ("Kaca Kristal"): hanya chrome + kartu, bukan permukaan luas/aurora.
- Bahasa situs: Indonesia; slug rute Bahasa Indonesia.
- Narasi dan copy ditulis sendiri oleh pemilik untuk tahap lanjut.

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
