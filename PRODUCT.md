# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Tiga audiens publik yang saling tumpang tindih (semua dikonfirmasi oleh pemilik produk):

1. **Masyarakat Umum** — mencari informasi dakwah dan berita kegiatan LIM (artikel, media, jadwal kegiatan), mencari jadwal shalat, arah kiblat, kalender Hijriah, hisab/rukyat, gerhana.
2. **Kolaborator & Kepengurusan** — menilai kredibilitas LIM untuk kerja sama; butuh kesan organisasi yang kredibel, terawat, dan berwibawa.
3. **Kepengurusan & Internal** — anggota organisasi yang mencari program, pendaftaran peserta, dan informasi cabang.

Admin internal (sekretariat, pengelola konten, pengelola falak) memakai CMS di `/admin`.

## Product Purpose

LIM Digital Platform adalah situs resmi + CMS dari Lembaga Ittihadul Muballighin (LIM), lembaga dakwah dari Badan Otonom Himpunan Alumni Santri Pondok Pesantren Lirboyo, Kediri (HIMASAL P2L). Situs publik menyebarkan informasi dakwah, berita, profil organisasi, dan layanan falak yang akurat; CMS memungkinkan sekretariat mengelola seluruh konten tanpa developer. Sukses = masyarakat menemukan informasi dan layanan dengan cepat, dan situs memantulkan wibawa Lirboyo.

## Positioning

Kredibilitas Lirboyo — otoritas pesantren salaf terkemuka. Yang membedakan: nama besar pesantren sebagai sumber pengetahuan (ilmu agama yang dipegang tradisi pesantren), bukan sekadar portal berita dakwah generik. Semua konten disajikan dalam bahasa Indonesia; lokasi Kediri, Jawa Timur.

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
- **Fonts (implemented, `app/layout.tsx` via `next/font/google`):** Fraunces (`--font-heading`, serif editorial), Inter (`--font-body`), JetBrains Mono (`--font-data`), Reem Kufi (Arabic).

## Brand Commitments

- Nama organisasi: Lembaga Ittihadul Muballighin (LIM); tagline "Memasyarakatkan Pesantren, Memesantrenkan Masyarakat".
- **Rebuild total situs publik dari nol** — pemilik menyatakan tampilan sebelumnya "jelek banget" dan meminta dunia visual baru. Keputusan fungsional (mobile-first, dual-mode, default dark, hamburger nav) tetap berlaku. Menu navigasi dipertahankan.
- Dunia visual **Khusyu Minimalis** (implemented): dual-mode (dark default, light untuk seluruh permukaan). Sumber kebenaran single: token warna di `app/globals.css` — `--primary` oranye LIM `oklch(0.553 0.195 38.402)` sebagai accent taktis (CTA, underline, focus) dan `--background` putih `oklch(1 0 0)` / near-black `oklch(0.145 0 0)`. Font via `next/font/google`: Fraunces (heading, serif), Inter (body), JetBrains Mono (data/falak), Reem Kufi (Arab). Kartu memakai `border-primary/25` (1px) + hover `border-primary`; footer band tint oranye `primary/[8-12]%`; navbar glass (kapsul `rounded-full` saat di atas, melebar penuh `w-full rounded-none` saat scroll, easing `ease-in-out` 300ms); section beranda dipisah hairline; transisi tema light⇄dark memakai cross-fade 300ms (View Transitions bila tersedia). Detail final ada di `DESIGN.md` dan `app/globals.css`.
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