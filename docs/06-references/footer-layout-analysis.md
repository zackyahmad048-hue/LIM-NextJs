# Analisis Kualitas Layout Footer (Web & Admin)

**Project:** LIM Digital Platform

**Folder:** `06-references`

**Document:** `footer-layout-analysis.md`

**Version:** 1.0

**Status:** Draft (Catatan analisis — bukan standar normatif)

**Tanggal:** 2026-08-04

---

# Ringkasan Eksekutif

Footer situs publik (`components/website/layout/footer.tsx`) secara struktur sudah
responsif (stack → 2 kolom → 4 kolom) dan lolos WCAG AA untuk kontras teks di atas
latar oranye — tetapi **tidak sesuai dengan satu-satunya spesifikasi grid footer
yang terdokumentasi di repo ini**, dan mengandung banyak nilai arbitrer,
warna hardcoded, serta ikon di luar library/aturan resmi. Kombinasi inilah yang
membuatnya tampak "jelek": kolom menu lebih sempit dari desain terdokumentasi,
tepi atas kolom tidak rata, tagline 10px sulit dibaca, hover memakai putih murni
bukan token, dan satu tombol sosial mati (`href="#"`).

Kesimpulan utamanya bukan "ada satu bug render", melainkan **footer tidak dibangun
mengikuti design system yang sudah didokumentasikan**, dan dokumen `layout.md`
sebagian sudah tidak sinkron dengan pola nyata di seluruh kode. Berikut temuan
diranking berdasarkan dampak visual:

1. Grid footer menyimpang dari spek `spacing.md` / `responsive.md` (gap & fraksi kolom).
2. Tepi atas kolom grid tidak rata (`mt-4` pada kolom deskripsi).
3. Nilai tipografi arbitrer (`text-[10px]`, `tracking-[0.32em]`) — tagline nyaris tak terbaca.
4. Warna hardcoded (`bg-white`, `hover:text-white`) menggantikan design token.
5. Ikon dari `react-icons` (bukan Lucide) dengan ukuran di luar skala.
6. Tombol sosial "X" mati (`href="#"`).
7. Touch target sosial/WhatsApp < 44px di mobile (aturan `responsive.md`).
8. Footer admin adalah file kosong dan tidak pernah dirender.
9. Inkonsistensi kontainer: halaman falak `max-w-4xl` vs footer `max-w-6xl`.
10. Duplikasi konten kontak, campuran font Roboto/Hanken di dalam satu komponen,
    dan tautan footer di-hardcode padahal spek CMS menyebut "Footer Menu" dikelola CMS.

---

# Metodologi & Sumber

Analisis ini membandingkan implementasi footer terhadap sumber primer repo:

- **Implementasi:** `components/website/layout/footer.tsx` (dibaca penuh),
  `components/admin/layout/footer.tsx` (file kosong), parent layout
  `app/(public)/layout.tsx` dan `app/(dashboard)/admin/layout.tsx`,
  pembanding `components/website/layout/navbar.tsx`.
- **Spek design system (13 file):** `docs/08-design-system/{README,layout,spacing,
  typography,colors,responsive,navigation,components,icons,theme}.md`.
- **Spek domain & arsitektur:** `docs/07-specifications/cms-spec.md`,
  `docs/02-architecture/frontend.md`, `docs/00-overview/16-DESIGN_SYSTEM.md`.
- **Verifikasi token/stack:** `app/globals.css` (`@theme inline`),
  `app/layout.tsx` (next/font), `tailwind.config.ts`, `postcss.config.mjs`,
  `package.json`.
- **Verifikasi orfandad:** `grep` import footer admin (tidak ditemukan),
  `git log` (footer belum pernah diubah sejak `ee39a16` "initial commit" —
  jadi ini bukan regresi, melainkan masalah desain awal).
- **Perhitungan kontras:** skrip Node (oklch → sRGB → luminance → rasio WCAG)
  terhadap token `--primary` light/dark + `--primary-foreground` dengan opasitas
  70/80/100%. Hasil: semua lolos AA (lihat bagian "Yang sudah dicek").

Setiap klaim diberi kutipan `file:baris`. Hal yang bersifat tafsir ditandai
`[inferensi]`.

---

# Temuan

## T1 (TINGGI) — Grid footer tidak mengikuti spek grid footer yang terdokumentasi

Spek repo **mendefinisikan persis** grid footer publik di dua dokumen:

> `docs/08-design-system/spacing.md:121` — `grid gap-7 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_1fr_1fr]  /* Footer grid */`

> `docs/08-design-system/responsive.md:119` — `<div className="grid gap-7 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_1fr_1fr]">`

Implementasi (`components/website/layout/footer.tsx:86`):

```tsx
<div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.6fr_0.8fr_1fr]">
```

Perbedaan:

| Aspek        | Spek (`spacing.md:121`) | Implementasi (`footer.tsx:86`) |
| ------------ | ----------------------- | ------------------------------ |
| `gap`        | `gap-7` (28px)          | `gap-10` (40px)                |
| Kolom 2 (Menu) | `0.7fr`               | `0.6fr`                        |
| Kolom 3 (Falak) | `1fr`                | `0.8fr`                        |

Dampak [inferensi, dengan hitung di bawah]: pada viewport ≥1024px dengan kontainer
`max-w-6xl` (1152px) dan padding `px-6`, 1fr ≈ 270px; kolom Menu jadi ≈162px
(spek ≈181px) dan kolom Falak ≈216px (spek ≈258px). Kolom Menu/Falak ~11–16% lebih
sempit dari desain terdokumentasi sehingga link-nya terasa sesak, dan kolom
berakhir dengan tinggi tidak seimbang. Ini adalah penyimpangan paling mudah
diukur dari sumber primer.

## T2 (TINGGI) — Tepi atas kolom grid tidak rata (kolom deskripsi turun 16px)

`components/website/layout/footer.tsx:88`:

```tsx
<p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/80">
```

Paragraf deskripsi di kolom 1 diberi `mt-4`, sementara heading `h3` kolom lain
mulai dari tepi atas grid tanpa margin (`footer.tsx:95`, `:110`, `:125`):

```tsx
<h3 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground">
```

Akibatnya pada desktop, baris atas kolom 1 (deskripsi) dimulai 16px lebih rendah
dari heading "Menu", "Falak", "Hubungi Kami" — tepi atas grid tampak bergelombang.
`[inferensi]: margin ini mungkin dimaksudkan agar deskripsi sejajar dengan isi
daftar, tetapi karena heading kolom lain tidak diberi margin serupa, hasilnya
staggered dan terlihat tidak rapi.`

## T3 (SEDANG) — Nilai tipografi arbitrer; tagline `text-[10px]` nyaris tak terbaca

`components/website/layout/footer.tsx:71`:

```tsx
<p className="mt-1 text-[10px] font-medium uppercase tracking-[0.32em] text-primary-foreground/70">
  Menebar Cahaya
</p>
```

Serta `tracking-[0.2em]` di `footer.tsx:95`, `:110`, `:125`. Pola sama di navbar
(`components/website/layout/navbar.tsx:100`, `:121` — `text-[11px]`).

Pelanggaran spek:

- `docs/08-design-system/spacing.md:110–112` — "Gunakan skala spacing Tailwind.
  Hindari penggunaan nilai acak."
- `docs/08-design-system/spacing.md:129` — "Jangan hardcode nilai spacing".
- `docs/08-design-system/typography.md:235` — "Tidak menggunakan ukuran terlalu kecil."
- `docs/08-design-system/typography.md:245` — "Hindari terlalu banyak variasi ukuran."

Dampak: `text-[10px]` tanpa varian responsif (`sm:`/`md:`) — pada mobile
(breakpoint default) tagline "MENEBAR CAHAYA" dirender 10px dengan `tracking` 0.32em,
sulit dibaca. Ini kandidat utama kesan "footer jelek".

## T4 (SEDANG) — Warna hardcoded menggantikan design token

`components/website/layout/footer.tsx`:

- `:148` — `bg-white ... text-primary ... hover:bg-white/90` (tombol WhatsApp)
- `:101` dan `:116` — `hover:text-white` (link menu/falak)
- `:172` — `hover:bg-white hover:text-primary` (lingkaran sosial)

Pelanggaran spek:

- `docs/08-design-system/README.md:68` — "Tidak menggunakan hardcoded color."
  (dan `:125–131` contoh larangan literal: `bg - white; text - black;`).
- `docs/08-design-system/colors.md:247` — "Jangan menggunakan warna hardcoded pada komponen."
- `docs/08-design-system/theme.md:183` — "Hindari warna langsung (Hardcoded)."

Dampak visual: pada hover, link berubah ke putih murni, bukan token
`text-primary-foreground` (krem, `globals.css:69`) — pergeseran hue yang halus namun
konsisten menyimpang dari sistem token, dan tidak akan ikut berubah bila tema
di-override. Alternatif token yang sudah tersedia: `text-primary-foreground`,
`bg-primary-foreground/90`.

## T5 (SEDANG) — Ikon dari `react-icons`, bukan Lucide; ukuran di luar skala

`components/website/layout/footer.tsx:5–12`:

```tsx
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { FaThreads, FaXTwitter } from "react-icons/fa6";
```

Dan pemakaian ukuran lewat prop `size`: `:150` `<FaWhatsapp size={15} />`,
`:174` `<Icon size={14} />`.

Pelanggaran spek:

- `docs/08-design-system/icons.md:21` — "Menggunakan **Lucide React** sebagai icon
  library utama."
- `docs/08-design-system/icons.md:144` — "Gunakan Lucide React untuk seluruh icon."
- Skala ukuran `icons.md:49–58` hanya memuat 12/14/16/18/20/24px — `size={15}` tidak ada.

Catatan: `react-icons` di `package.json` memang terpasang (`^5.7.0`), dan ikon brand
(X/Threads/TikTok/Facebook/Instagram/YouTube) tidak tersedia di Lucide — jadi ini
mungkin kompromi sadar. Namun spek tidak mendokumentasikan pengecualian apa pun
(lihat `docs/05-decisions/` — tidak ada ADR tentang ikon brand). Tanpa pengecualian
terdokumentasi, ini tetap pelanggaran spek; dampak visualnya: dua gaya ikon berbeda
(stroke vs fill) dalam satu footer.

## T6 (SEDANG) — Tombol sosial "X" mati (`href="#"`)

`components/website/layout/footer.tsx:51–54`:

```tsx
{
  label: "X",
  href: "#",
  icon: FaXTwitter,
},
```

Klik link mengarah ke `#` (lompat ke atas halaman) — tombol tampak dapat diklik
tapi tidak membawa pengguna ke mana pun, tidak seperti 5 tombol sosial lain yang
`target="_blank"` ke URL nyata. Ini "jelek" dari sisi UX dan menimbulkan
ketidakpercayaan pada seluruh baris sosial.

## T7 (SEDANG) — Touch target < 44px di mobile

`components/website/layout/footer.tsx:172` — lingkaran sosial `h-8 w-8` (32px);
`:148` — tombol WhatsApp `px-4 py-2` dengan `text-xs` (tinggi ≈32–36px).

Spek `docs/08-design-system/responsive.md:166`:

> "7. Pastikan touch target minimal 44px di mobile."

Kedua target interaksi berada di bawah 44px pada breakpoint mobile.

## T8 (SEDANG) — Footer admin: file kosong, tidak pernah dirender

`components/website/layout/footer.tsx` dirender dari `app/(public)/layout.tsx:15`,
tetapi:

- `components/admin/layout/footer.tsx` adalah **file kosong (0 baris)**.
- `app/(dashboard)/admin/layout.tsx:36–48` tidak mengimpor footer apa pun.
- `grep` seluruh `app/` dan `components/` untuk `admin/layout/footer` → nol hasil.

Spek `docs/08-design-system/layout.md:52–64` menyatakan Admin Layout =
`Header ↓ Sidebar + Content ↓ Footer (Optional)` — footer admin memang opsional,
tetapi keberadaan file kosong menandakan implementasi yang tertinggal setengah
jalan (entah dihapus atau dilengkapi). Akibatnya dashboard admin sama sekali tidak
memiliki penutup bawah; jika keluhan "footer jelek" juga menyangkut admin, ini
penjelasannya: tidak ada footer sama sekali.

## T9 (RENDAH–SEDANG) — Kontainer tidak mengikuti skala `layout.md`; halaman falak `max-w-4xl` vs footer `max-w-6xl`

`components/website/layout/footer.tsx:65`:

```tsx
<div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
```

- Tabel kontainer `docs/08-design-system/layout.md:70–77` hanya memuat
  `lg: 1024px`, `xl: 1280px`, `2xl: 1400px` — **tidak ada 1152px (`max-w-6xl`)**.
- Namun `docs/08-design-system/responsive.md:56` justru menulis
  "Container: `px-4` | `px-4 sm:px-6` | `max-w-6xl mx-auto`" — **dokumen saling
  bertentangan**, dan implementasi mengikuti `responsive.md`, bukan `layout.md`.
- Konsistensi nyata: navbar (`navbar.tsx:43`) dan hampir semua halaman publik
  memakai `max-w-6xl` (grep: `artikel/page.tsx:28`, `profil/page.tsx:20`,
  `kontak/page.tsx:39`, dst.) — sehingga footer sejajar dengan konten mayoritas
  halaman. Pengecualian: halaman falak memakai `max-w-4xl`
  (`app/(public)/falak/jadwal-shalat/page.tsx:18`, `falak/kiblat/page.tsx:18`,
  `falak/kalender-hijriah/page.tsx:18`) — pada halaman-halaman itu footer lebih
  lebar dari konten sehingga garis tepi tidak sejajar.

Kesimpulan: masalahnya dua arah — (a) `layout.md:70–77` sudah usang terhadap pola
nyata seluruh situs, dan (b) halaman falak menyimpang dari pola mayoritas.

## T10 (RENDAH) — Duplikasi konten kontak (dua sumber kebenaran)

Alamat + email dirender dua kali, muncul bergantian per breakpoint:

- `footer.tsx:75–83` — blok kanan atas (`hidden sm:block`), berisi alamat + email.
- `footer.tsx:131–143` — kolom "Hubungi Kami" (`sm:hidden` untuk MapPin/Mail).

Konten identik ditulis dua kali → risiko drift (mengubah email di satu tempat tanpa
yang lain) dan sedikit pemborosan. Tidak terlihat bersamaan (breakpoint saling
menyembunyikan), jadi bukan cacat visual langsung.

## T11 (RENDAH) — Campuran keluarga font dalam satu komponen (Roboto vs Hanken Grotesk)

- Heading footer memakai `font-sans` (`footer.tsx:68`, `:95`, `:110`, `:125`);
  pola sama di brand navbar (`navbar.tsx:61`).
- `app/layout.tsx:9` — Roboto di-var-kan ke `--font-sans`
  (`Roboto({subsets:["latin"],variable:'--font-sans'})`), dan
  `globals.css:10` meneruskan token `--font-sans: var(--font-sans)` — rangkaian
  ini valid, `font-sans` = Roboto.
- Seluruh teks lain di situs mewarisi Hanken Grotesk (`app/layout.tsx:11–16`
  `variable: "--f-site"`; `globals.css:142` `.site { font-family: var(--f-site), ... }`).

Akibatnya di dalam satu footer: heading (Roboto) berbeda keluarga dengan body
(Hanken). `docs/08-design-system/typography.md:243` membolehkan maksimal dua
keluarga, tetapi prinsip "Typography yang konsisten" (`README.md:69`) dan
"Konsisten" (`typography.md:40`) dilanggar pada level komponen. Dampak visual
halus, namun berkontribusi pada kesan kurang menyatu.

## T12 (INFORMASI) — Tautan footer di-hardcode, padahal spek CMS menyebut "Footer Menu"

Semua daftar tautan di-hardcode di dalam komponen (`footer.tsx:14–60`:
`menuLinks`, `falakLinks`, `socialLinks`), sedangkan
`docs/07-specifications/cms-spec.md:86–94` mendefinisikan manajemen "Navigation
Menu" termasuk **"Footer Menu"** sebagai bagian dari CMS. Pada platform CMS,
tautan footer seharusnya bersumber dari data kelolaan. Ini isu arsitektur
(not-visual) dan selaras dengan catatan `AGENTS.md` bahwa modul `cms` sudah ada.

---

# Yang Sudah Dicek & Tidak Bermasalah

- **Kontras teks di atas latar footer** (dihitung dari token, bukan ditebak):
  `--primary` light `oklch(0.553 0.195 38.402)` (Y≈0.067) dan dark
  `oklch(0.47 0.157 37.304)` (Y≈0.023), foreground `oklch(0.98 0.016 73.684)`
  (Y≈0.87). Rasio: light `fg/100` 7.85:1, `fg/80` 6.48:1, `fg/70` 5.79:1;
  dark `fg/100` 12.68:1, `fg/80` 10.35:1, `fg/70` 9.18:1 — **semua lolos WCAG AA
  (4.5:1)**. Opasitas `/70` dan `/80` aman secara kontras; "samar" yang terasa
  hanyalah efek perseptual ukuran 10px (T3), bukan kegagalan kontras.
- **Sticky navbar vs `overflow-y-clip`** (`app/(public)/layout.tsx:10`,
  `globals.css:138` `overflow-x: clip`): `overflow: clip` tidak membentuk scroll
  container, sehingga sticky tetap berfungsi — bukan penyebab masalah.
- **Token yang dipakai footer** (`bg-primary`, `text-primary-foreground`,
  `border-primary-foreground/*`) **semuanya ada** di `globals.css:7–51`
  (`@theme inline`) — tidak ada token "tidak terdefinisi".
- **Responsif dasar**: mobile 1 kolom, `md` 2 kolom, `lg` 4 kolom sesuai
  `responsive.md:58` ("Footer: Stacked | 2 columns | 4 columns") dan
  `layout.md:92–105` (1/2/3–4 kolom).

---

# Rekomendasi Perbaikan

Setiap rekomendasi dipetakan ke dokumen yang mendefinisikan perilaku yang benar:

1. **Kembalikan grid footer ke spek** — `gap-7`, `lg:grid-cols-[1.25fr_0.7fr_1fr_1fr]`
   persis seperti `spacing.md:121` dan `responsive.md:119` (`footer.tsx:86`).
2. **Hilangkan `mt-4` pada deskripsi** (`footer.tsx:88`) agar tepi atas kolom rata;
   jika ingin kolom 1 diberi heading (mis. "Tentang Kami"), tambahkan `h3` konsisten
   dengan kolom lain — lihat struktur Section `layout.md:81–89` (Heading →
   Description → Content → Action).
3. **Ganti nilai arbitrer** `text-[10px]`/`tracking-[0.32em]`/`tracking-[0.2em]`
   dengan skala: `text-xs` (minimal) dengan `tracking-widest`/`tracking-wider`
   (`typography.md` skala & `spacing.md:110–112` "Hindari nilai acak"); tambahkan
   varian responsive bila tetap ingin kecil (`responsive.md:141` pola
   `text-xs sm:text-sm`). Ukuran minimum teks 10px tidak disarankan
   (`typography.md:235`).
4. **Ganti warna hardcoded** (`bg-white`, `hover:text-white`, `hover:bg-white/90`,
   `footer.tsx:148,101,116,172`) dengan token: `bg-primary-foreground`,
   `text-primary-foreground`, `hover:bg-primary-foreground/90` —
   `README.md:63–68`, `colors.md:227` "Implementasi Frontend harus menggunakan
   Design Token".
5. **Ikon**: gunakan Lucide untuk ikon yang tersedia (`icons.md:144`); untuk ikon
   brand, buat pengecualian terdokumentasi (ADR di `docs/05-decisions/`) atau
   pertahankan `react-icons` secara eksplisit disepakati; pindahkan `size={15}`
   ke skala (`size-3.5`/`h-3.5` = 14px, `icons.md:54`) dan `size={14}` ke `size-3.5`.
6. **Perbaiki link X** (`footer.tsx:52`): isi URL nyata, hapus item, atau beri label
   eksplisit "segera hadir" (jangan `#`).
7. **Touch target**: lingkaran sosial minimal `h-11 w-11` (44px) dan tombol WhatsApp
   `py-2.5`/`h-11` di mobile (`responsive.md:166`).
8. **Footer admin**: implementasikan (paling sederhana: baris kecil versi admin)
   atau hapus file kosong `components/admin/layout/footer.tsx`; sambungkan dari
   `app/(dashboard)/admin/layout.tsx` bila diimplementasikan (`layout.md:52–64`).
9. **Kontainer**: pilih satu skala. Opsi paling konsisten dengan kode saat ini
   adalah memperbarui tabel `layout.md:70–77` untuk memuat `max-w-6xl` (1152px),
   dan menyeragamkan halaman falak dari `max-w-4xl` ke `max-w-6xl`
   (`falak/jadwal-shalat/page.tsx:18` dst.) agar sejajar dengan footer & halaman lain.
10. **Kontak**: satukan sumber alamat/email menjadi satu (hindari duplikasi
    `footer.tsx:75–83` vs `:131–143`).
11. **Font**: tetapkan satu keluarga untuk footer (seragamkan `font-sans` heading
    dengan `--f-site` body, atau ganti `font-sans` → inherit) —
    `typography.md:40` (konsisten).
12. **Sumber kebenaran link**: pertimbangkan membaca menu footer dari modul `cms`
    sesuai `cms-spec.md:86–94` alih-alih array hardcoded
    (`footer.tsx:14–60`).

---

# Daftar Sumber

**Implementasi:**

- `components/website/layout/footer.tsx` (184 baris — objek analisis utama)
- `components/admin/layout/footer.tsx` (0 baris — file kosong)
- `app/(public)/layout.tsx` (renders Footer, baris 15)
- `app/(dashboard)/admin/layout.tsx` (tanpa footer)
- `components/website/layout/navbar.tsx` (pembanding pola; `font-sans`, `max-w-6xl`)
- `app/globals.css` (tokens `@theme inline`, `.site`, base layer)
- `app/layout.tsx` (next/font: Roboto `--font-sans`, Hanken `--f-site`)
- `tailwind.config.ts`, `postcss.config.mjs`, `package.json`
- Halaman publik `max-w-*`: `app/(public)/{artikel,profil,kontak,media,falak}/*/page.tsx`

**Dokumen spek:**

- `docs/08-design-system/layout.md` — kontainer (:70–77), section (:81–89), grid (:92–105)
- `docs/08-design-system/spacing.md` — aturan nilai acak (:110–112, :128–131), footer grid (:121)
- `docs/08-design-system/responsive.md` — breakpoints (:19–28), footer (:58, :116–124), touch target (:166)
- `docs/08-design-system/typography.md` — skala (:72–89), ukuran terlalu kecil (:235), variasi (:243–247)
- `docs/08-design-system/colors.md` — larangan hardcoded (:227, :247)
- `docs/08-design-system/theme.md` — larangan hardcoded (:183)
- `docs/08-design-system/icons.md` — library (:21, :144), skala ukuran (:49–58)
- `docs/08-design-system/README.md` — global standards (:63–70), server components (:233–234)
- `docs/08-design-system/navigation.md` — footer navigation (:233)
- `docs/08-design-system/accessibility.md` — target WCAG 2.1 AA (:21)
- `docs/07-specifications/cms-spec.md` — Footer Menu CMS (:86–94)
- `docs/02-architecture/frontend.md` — server components (:112–123)
- `docs/00-overview/16-DESIGN_SYSTEM.md` — struktur layout (:59–84)
