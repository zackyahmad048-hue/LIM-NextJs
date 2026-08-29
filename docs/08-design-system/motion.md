# Motion

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `motion.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan sistem gerak (motion) LIM Digital Platform: token easing/spring, primitif animasi situs publik, pola transisi CMS, dan aturan aksesibilitas.

Prinsip dasar:

- Gerak harus purposeful — masuk, menegaskan hubungan spasial, atau memberi umpan balik.
- Hanya properti murah yang dianimasikan: `transform` dan `opacity`.
- UI transition ≤ 300ms (`ease-out`); entrance konten boleh hingga 600ms.
- Reduced motion bukan opsional — setiap gerak wajib punya jalur non-animasi.

Detail aksesibilitas gerak juga diatur di `accessibility.md`.

---

# Easing Tokens (`lib/ease.ts`)

| Token                                            | Nilai                             | Penggunaan                                |
| ------------------------------------------------ | --------------------------------- | ----------------------------------------- |
| `EASE_OUT`                                       | `cubic-bezier(0.23, 1, 0.32, 1)`  | Entrance & hover standar seluruh platform |
| `EASE_IN_OUT`                                    | `cubic-bezier(0.77, 0, 0.175, 1)` | Perpindahan dua arah                      |
| `EASE_DRAWER`                                    | `cubic-bezier(0.32, 0.72, 0, 1)`  | Drawer/sheet                              |
| `SPRING_PRESS`                                   | spring 500/30/0.6                 | Umpan balik tekan tombol                  |
| `SPRING_SWAP`                                    | spring 460/30/0.55                | Pertukaran isi dalam satu kontrol         |
| `SPRING_PANEL`                                   | spring 420/40/0.5                 | Modal & sheet                             |
| `SPRING_LAYOUT`                                  | spring 360/32/0.6                 | Shared-layout (pill indikator)            |
| `SPRING_MOUSE`                                   | spring 200/15/0.3                 | Dekorasi mengikuti kursor                 |
| `SPRING_MOVE` / `SPRING_ROTATE` / `SPRING_SHEET` | preset Apple fluid (ζ/τ)          | Reposisi, rotasi, drawer                  |

Aturan:

- Jangan membuat kurva baru per komponen; pilih dari tabel di atas.
- Kurva `EASE_OUT` identik dengan referensi visual DIGDAYA.

---

> **⚠️ Catatan skop untuk Situs Publik.** Token easing/spring dan primitif `Reveal` di bawah adalah infrastruktur animasi — kemungkinan besar tetap dipakai apa pun dunia visualnya. Namun contoh kelas yang menyertakan warna literal (mis. `border-primary/45` pada Hover Lift) mengasumsikan palet "Oranye LIM" yang berstatus incumbent (lihat `colors.md`); verifikasi ulang terhadap palet baru situs publik begitu tersedia (arah "Ruang Gelap" dicabut; pengganti: dark-mode-first + palet harmonis).

# Primitif Situs Publik

## `Reveal`

**Lokasi:** `components/website/motion/reveal.tsx` (Client Component).

Entrance berbasis viewport untuk section dan kartu. Render sekali (`once: true`, ambang `amount: 0.2`).

```tsx
<Reveal from="up" index={i}>
  <PostCard post={post} />
</Reveal>
```

Properti:

| Prop    | Tipe                                   | Default | Keterangan                                                                            |
| ------- | -------------------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `from`  | `up \| down \| left \| right \| scale` | `up`    | Arah masuk; offset y ±24px, x ±28px, scale 0.96                                       |
| `index` | `number`                               | —       | Stagger otomatis: +70ms per item, **dibatasi 350ms** agar grid panjang tidak menunggu |
| `delay` | `number`                               | `0`     | Delay tambahan manual (detik)                                                         |

Durasi tetap 600ms dengan easing `EASE_OUT`. Saat `useReducedMotion()` aktif, initial/whileInView dibatalkan — konten tampil langsung tanpa gerak.

Aturan pemakaian:

- Bungkus di level section/kartu, bukan per node kecil.
- `index` hanya untuk daftar yang terlihat serentak dalam satu viewport.
- Jangan menumpuk `Reveal` bersarang.

## Hover Lift Kartu

**Lokasi:** `components/website/motion/hover.ts` (file biasa, aman untuk Server Component).

```tsx
import { cardLift } from "@/components/website/motion/hover";

<article className={cn(kelasKartu, cardLift)}>...</article>;
```

Efek: naik `-translate-y-1` + border menguat ke `border-primary/45`, durasi 300ms `ease-out`. Sudah termasuk `motion-reduce:` reset.

---

# Pola Transisi CMS

## Expand Submenu Sidebar

**Lokasi:** `components/admin/navigation/sidebar-item.tsx`.

Submenu membuka-tutup dengan teknik CSS grid — tinggi melenting tanpa mengukur konten:

```text
Tertutup : invisible grid-rows-[0fr] opacity-0
Terbuka  : grid-rows-[1fr] opacity-100
Transisi : transition-all duration-300 ease-in-out motion-reduce:transition-none
```

Syarat: anak langsung ber-`overflow-hidden`. Konten tertutup memakai `aria-hidden={!open}` agar tidak bisa ter-focus keyboard.

## Chrome & Permukaan

Header, sidebar, dan kartu admin memakai token glass dari `components/admin/shared/chrome.ts` (`glassChrome`, `glassCard`, `softCard`). Detail token di `theme.md`.

---

# Reduced Motion

Wajib pada semua gerak:

- CSS: pasangkan `motion-reduce:transition-none` (atau reset transform) pada setiap transisi.
- JS (`motion/react`): cabang `useReducedMotion()` seperti pada `Reveal`.
- Safety net global `prefers-reduced-motion` ada di `app/globals.css`; jangan mengandalkannya sebagai pengganti reset lokal.

---

# Anti-Pattern

- Animasi `width`/`height`/`top`/`left` (gunakan transform atau grid-rows).
- Entrance `< 100ms` atau `> 800ms`.
- Stagger melebihi total 350ms.
- Gerak dekoratif tanpa informasi (bounce, wiggle).
- Parallax atau animasi scroll-jacking.

---

# Related Documents

- `accessibility.md` (Motion & Reduced Motion)
- `theme.md` (token glass)
- `navigation.md` (kapsul navbar)
- `layout.md`

---

# Acceptance Criteria

- Semua gerak memakai token easing/spring dari `lib/ease.ts`.
- Setiap animasi punya jalur reduced motion.
- Hanya `transform`/`opacity` yang dianimasikan.
- Entrance konten memakai `Reveal`, bukan implementasi ad-hoc per halaman.