# Desain Visual — "Oranye LIM"

Dunia visual resmi situs publik LIM. Menggantikan seluruh resep visual "Papan Rute" (kraft board + cap merah) dan mengoreksi resep sementara "NU Hijau" (aksen hijau #017534) yang tidak pernah terpasang di CSS. Palet nyata di `globals.css` memakai skala **oranye** Tailwind sebagai aksen resmi — dokumentasi ini mencatat nilai yang benar-benar terpasang.

## Tesis

LIM adalah lembaga resmi dunia pesantren — oranye resmi dan hangat, bersih seperti portal resmi, dan buktinya adalah data falak hidup (jadwal shalat hari ini, perhitungan hisab) yang tertempel di beranda. Kredibilitas Lirboyo ditunjukkan lewat data nyata, bukan ornamen. Satu-satunya hijau di dunia ini adalah **aurora ambient** di belakang permukaan situs — bukan identitas.

## Bahan Dunia

Nilai berikut adalah kebenaran di `app/globals.css` (Preset shadcn `radix-maia`). Hex hanyalah perkiraan; token oklch adalah sumber kebenaran.

| Token | Peran | Siang (light) | Malam (dark) |
|---|---|---|---|
| `--background` | permukaan latar | putih `oklch(100% 0 0)` (#ffffff) | `neutral-950` `oklch(14.5% 0 0)` (#0a0a0a) |
| `--card` | kartu, wadah | putih | `#020202`-ish `oklch(20.5% 0 0)` (neutral-900) |
| `--foreground` | teks utama | `oklch(14.5% 0 0)` (neutral-950) | `oklch(98.5% 0 0)` (#fafafa) |
| `--primary` | aksen resmi (oranye) | `orange-700` `oklch(55.3% 0.195 38.402)` (#c2410c) | `orange-800` `oklch(47% 0.157 37.304)` (#9a3412) |
| `--primary-foreground` | teks di atas primary | `orange-50` `oklch(98% 0.016 73.684)` (#fffbeb) | = light |
| `--secondary` | tint abu | `zinc-100` `oklch(96.7% 0.001 286.375)` (#f4f4f5) | `zinc-800` `oklch(27.4% 0.006 286.033)` (#27272a) |
| `--accent` | hover/tint | `neutral-100` `oklch(97% 0 0)` (#f5f5f5) | `neutral-800` `oklch(26.9% 0 0)` (#262626) |
| `--ring` | fokus | `neutral-400` `oklch(70.8% 0 0)` (#a3a3a3) | `neutral-600` `oklch(43.9% 0 0)` (#525252) |
| `--chart-*` | data admin | oranye 300→800 (38°–66°) | sama |
| `--sidebar-primary` | aksen sidebar | `orange-600` (#ea580c) | `orange-500` (#f97316) |

- Preset shadcn `radix-maia` sebagai base (radius `0.625rem`, komponen UI, sidebar).
- Kertas **tidak tembus cahaya**: semua kartu/wadah solid. `backdrop-blur` dilarang sebagai hiasan.
- Kedalaman = bayangan offset + blur lembut (kartu bertumpuk), bukan halo tanpa offset.
- Warna dingin hanya boleh muncul di chart admin (warna data), tidak di permukaan.

## Identitas

- **Oranye LIM** (orange-700 siang / orange-800 malam) untuk semua aksi resmi: tombol primer, tautan, garis rute, pin peta, band footer.
- **Band oranye solid** di footer (latar primary, teks primary-foreground).
- **Tint abu netral** (zinc/neutral) untuk permukaan sekunder dan hover — bukan mint.
- **Aurora hijau** (hue 155–165) hanya sebagai lapisan ambient di belakang permukaan `.site` dan `login-aurora` (cream hangat, hue 88) — bergerak pelan, tidak pernah di atas kartu. Ini satu-satunya kehadiran hijau.
- **Peta jaringan dakwah**: garis rute oranye putus-putus menggambar diri dari Kediri ke enam wilayah (motion authored).
- Foto berwarna alami, dibingkai kartu dengan bayangan.
- Satu momen gerak authored: garis rute menggambar dirinya (stroke dashoffset) saat hero tampil.

## Tipografi

- `--f-site` (Hanken Grotesk): body dan display situs publik. Semibold, `tracking-tight`, heading 28px (mobile) → 48px (desktop).
- `--font-sans` (Roboto): admin dan komponen preset shadcn.
- Tidak ada eyebrow/kicker di atas heading.

## Pola Halaman

1. **Portal Resmi** (hero): judul, aksi oranye, statistik capaian dakwah sebagai kartu angka, kartu jadwal shalat hari ini dengan data falak.
2. **Profil** (profil): teks naratif + kartu nilai; garis bawah tipis.
3. **Layanan Falak** (falak): grid kartu layanan + tabel waktu perhitungan.
4. **Artikel/Media** (artikel, media): kartu berita dengan gambar dan bayangan.
5. **Kontak** (kontak): kartu alamat + formulir.

## Aturan Rinci

- Header: solid `bg-background/90`, garis bawah tipis, tidak blur. Logo `dark:invert`.
- Footer: band oranye solid (latar primary, teks primary-foreground), WhatsApp sebagai tombol putih.
- Kontras teks body ≥ 4.5:1 terhadap background/card; teks pada oranye ≥ 4.5:1 (pakai primary-foreground orange-50).
- Copy dalam bahasa Indonesia, khas organisasi.

## Catatan

- Dokumentasi ini adalah satu-satunya sumber resep visual. Resep lama (Papan Rute: `board/paper/ink/mute/stamp/chalk/string`, cap RESMI, ledger Catatan Sekretariat) dicabut; resep "NU Hijau" (#017534, tint mint) ditolak karena tidak sesuai CSS terpasang.
- **CSS terkunci**: token dan nilai di `globals.css` tidak boleh diubah; perubahan visual cukup lewat pemakaian kelas dan token yang ada.
- Kontrak build: seed `lim-oranye-2026`.
