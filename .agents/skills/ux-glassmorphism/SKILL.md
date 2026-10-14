---
name: ux-glassmorphism
description: "Aturan UI/UX Glassmorphism \"Kaca Kristal\" repo ini: kapan memakai `.glass`, token warna dan radius, layout, aksesibilitas, tipografi, gerak, dan daftar anti AI slop. Pakai saat membuat atau mengubah UI publik maupun admin."
---

# UI/UX Glassmorphism "Kaca Kristal" (Anti AI Slop)

**Stack:** Next.js 16 · React 19 · TailwindCSS 4 · shadcn/ui. Semua token ada di `app/globals.css`; baca dan pakai yang sudah ada. Jangan menambah file, token, atau dependensi tanpa diminta (jika token yang dibutuhkan belum ada, tanyakan).

**Rujukan (urutan untuk situs publik):** `PRODUCT.md` → `DESIGN.md` → `app/globals.css` → `docs/08-design-system/`. Baca `DESIGN.md` sebelum mengubah UI publik. Area admin mengikuti `docs/08-design-system/components.md` (Admin CMS Shell).

## Prinsip
- Glass hanya untuk **kartu dan widget konten**. Chrome (navbar, admin rail, topbar), tabel, form, dan teks panjang tetap **solid**.
- Kedalaman = shadow offset + blur lembut (kertas tertumpuk), bukan glow tanpa offset.
- Aksen oranye ("Oranye LIM") dipakai secukupnya: CTA, status aktif, focus ring. Bukan latar kartu.

## Aturan Glass
- **Pakai kelas `.glass`** (dan varian `.glass-tint-{falak|program|sekretariat|konten|sistem}`). Jangan menulis ulang `backdrop-blur-*`, `bg-white/*`, atau border kaca secara manual.
- Satu tint modul per kartu, sesuai modulnya. Tint bukan pengganti `--primary`.
- Kaca butuh sesuatu di belakangnya: halaman harus memiliki lapisan `.ambient` (orb + grid). Tanpa ambient, jangan pakai glass.
- Maksimal dua lapis glass bertumpuk; jangan card di dalam card.
- Blur sudah dikurangi otomatis di mobile (`--glass-blur`) dan menjadi solid pada `prefers-reduced-transparency`. Jangan menimpa perilaku ini.
- Jangan menganimasikan `backdrop-filter`; animasi hanya `transform` dan `opacity`.

## Warna (hanya token `globals.css`)
Gunakan utility dari token: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `bg-secondary`, `bg-accent`, `bg-muted`, `bg-destructive`, `bg-success`, `bg-warning`, `ring-ring`, `chart-1..5`, serta `admin-*` di area admin. Opasitas lewat modifier (`bg-card/60`).
Dilarang: hex/rgb/oklch langsung, palette bawaan Tailwind (`white`, `black`, `gray-*`, `orange-*`, dll.), dan token baru tanpa izin. Dark mode otomatis lewat token, bukan `dark:` dengan warna manual. Tema default adalah gelap.

## Radius
Skala `rounded-sm … rounded-4xl` dihitung dari `--radius` (saat ini `0.75rem`).

- `rounded-xl`: standar kartu konten (public dan admin). `rounded-md`: input dan tombol. `rounded-lg`: form, panel kecil, elemen bersarang. `rounded-sm`: chip dan badge. `rounded-2xl`: hanya hero overlay. Navbar `rounded-full`. `rounded-3xl` ke atas tidak dipakai.
- Radius modal dan sheet: ikuti default shadcn sampai ada keputusan di `DESIGN.md` (bagian 10.4).
- Radius dalam lebih kecil dari radius luar (turun satu tingkat atau luar − padding).
- Elemen yang menempel tepi layar di mobile (bottom sheet, bar penuh) hanya membulatkan sisi bebas (`rounded-t-xl`).
- Jangan bervariasi radius antar kartu serupa dalam satu section.

### Radius responsive (usulan, belum diterapkan)
Agar radius proporsional dari mobile sampai layar lebar, ubah `--radius` menjadi fluid di `:root` (hanya setelah disetujui; seluruh `rounded-*` ikut tanpa token baru):

```css
--radius: clamp(0.625rem, 0.25vw + 0.5rem, 1rem);
```

| Utility | Mobile (390px) | Desktop (1440px) | Wide (2560px) | Maks |
|---|---|---|---|---|
| `rounded-sm` | ±6px | ±7px | ±8.6px | 9.6px |
| `rounded-md` | ±8px | ±9px | ±11.5px | 12.8px |
| `rounded-lg` | ±10px | ±12px | ±14.4px | 16px |
| `rounded-xl` | ±14px | ±16px | ±20px | 22px |
| `rounded-2xl` | ±18px | ±21px | ±26px | 29px |

Pada wide display, tambah spacing dan batasi lebar konten (`max-w-*`); jangan menambah radius melewati batas fluid.

## Layout & Spacing
Section publik memakai `SiteSection` (`max-w-6xl px-4 py-12 sm:px-6 lg:py-16`); jangan menulis ulang kelas container. Grid sub-content `gap-4 md:gap-6`, kartu `h-full`, jumlah kolom tidak dicampur dalam satu viewport. Mobile first, tanpa horizontal scroll.

## Keterbacaan & Aksesibilitas
- Kontras AA (4.5:1) diukur terhadap latar terburuk di balik kaca. Jika kurang, pakai permukaan solid.
- Fokus keyboard jelas (`ring-ring` solid), target sentuh minimal 44px, light dan dark diuji terpisah.
- Hormati `prefers-reduced-motion`; animasi dekoratif dimatikan oleh aturan global, jangan ditimpa.

## Tipografi
`font-heading` (Fraunces, serif editorial) untuk judul dengan title case; uppercase hanya untuk eyebrow/label kecil (`uppercase text-xs tracking-widest text-muted-foreground`, bukan serif). `font-body` (Inter) untuk isi, `font-data` (JetBrains Mono) untuk angka dan kode. Angka statistik memakai tabular nums.

## Gerak
Pakai token `lib/ease.ts` (`EASE_OUT`) dan primitif `Reveal` untuk entrance; hover memakai perubahan `border-color`, bukan translate-lift. Gerak singkat (150-300ms; entrance hingga 600ms), hanya `transform` dan `opacity`, dan selalu punya jalur reduced motion.

## Anti AI Slop (Dilarang)
- Gradient ungu-biru-pink generik, glow neon, atau orb warna di luar `.ambient` yang ada.
- Semua elemen dijadikan glass, atau card di dalam card.
- Emoji sebagai ikon (pakai satu set ikon konsisten, Lucide).
- Hero rata tengah generik: judul gradient, dua tombol, tiga kartu fitur identik.
- Copy klise ("Welcome to the future", "Seamless"), lorem ipsum, statistik, avatar, testimoni, atau klaim komersial karangan.
- `rounded-3xl` dan shadow besar di semua komponen, `hover:scale-105` di semua hal, pulse/bounce tanpa tujuan.
- Warna, radius, atau shadow di luar token; magic number acak.

## UX
Semua state lengkap (default, hover, focus, active, disabled, loading, empty, error). Satu aksi utama per layar.

## Sebelum Selesai
Token warna dan radius saja yang dipakai, glass hanya pada kartu/widget lewat `.glass`, ambient ada, kontras lolos di latar terburuk, tampil baik di mobile dan wide display, light maupun dark, dan tidak ada item slop. Jika perubahan memengaruhi aturan desain, ingatkan bahwa `DESIGN.md` dan `docs/08-design-system/` perlu diperbarui.