# Motion

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `motion.md`

**Version:** 1.2

**Status:** Approved

Perubahan pada 1.2: penambahan pola Marquee auto-scroll, clarifikasi reduced-motion untuk marquee.
Perubahan pada 1.1: clarifikasi reduced-motion (entrance mati, hover/transition tetap); penambahan pola ikon animated dengan `motion/react`.

---

# Overview

Dokumen ini mendefinisikan sistem gerak (motion) LIM Digital Platform: token easing/spring, primitif animasi situs publik, pola transisi CMS, dan aturan aksesibilitas.

Prinsip dasar:

- Gerak harus purposeful — masuk, menegaskan hubungan spasial, atau memberi umpan balik.
- Hanya properti murah yang dianimasikan: `transform` dan `opacity`.
- UI transition ≤ 300ms (`ease-out`); entrance konten boleh hingga 600ms.
- **Reduced motion**: entrance/decorative animations mati; hover/focus transition **tetap jalan** (preserve umpan balik interaktif).
- Ikon: Lucide React + `motion/react` untuk animasi stroke/path.

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

> **⚠️ Catatan skop untuk Situs Publik.** Token easing/spring dan primitif `Reveal` di bawah adalah infrastruktur animasi yang tetap dipakai. Hover pada kartu publik memakai perubahan `border-color` (`hover:border-primary`) — **bukan** translate-lift (lihat `DESIGN.md` §2/§6). Warna accent mengikuti token `primary` di `app/globals.css`.

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

## Marquee Auto-Scroll

**Lokasi:** `components/website/sections/bidang-carousel.tsx` (Client Component).

Scroll kontinu horizontal untuk konten promosi/carousel card. Menggunakan `@keyframes marquee-seamless` di `app/globals.css`:

```text
@keyframes marquee-seamless {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

Pola implementasi:

```tsx
"use client";
import { useReducedMotion } from "motion/react";

const reduced = useReducedMotion();
const items = BIDANG.map((b) => <Card key={b.slug} {...b} />);

<div className="relative overflow-hidden">
  {/* Gradient fade di tepi */}
  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background to-transparent" />
  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background to-transparent" />

  <div
    className="flex w-max gap-4"
    style={reduced ? undefined : { animation: "marquee-seamless 30s linear infinite" }}
  >
    {items} {/* set pertama */}
    {items} {/* duplikasi untuk seamless loop */}
  </div>
</div>
```

Aturan:

- Item diduplikasi — `-50%` translate menghasilkan loop seamless.
- Durasi 30s default; sesuaikan dengan jumlah item (lebih banyak = lebih cepat).
- Pause on hover: `onMouseEnter` set `animationPlayState = "paused"`, `onMouseLeave` set `"running"`.
- Gradient fade di tepi kiri-kanan (`w-12 bg-linear-to-r/to-l from-background to-transparent`).
- **Reduced motion**: `useReducedMotion()` → animasi dimatikan, konten statis.
- Lebar item: `w-[18rem] sm:w-[20rem] md:w-[22rem]` (responsive).

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

Chrome admin (header, rail sidebar) memakai permukaan solid dari `components/admin/shared/chrome.ts` (`chrome`); kartu konten memakai `.glass` global (`app/globals.css`). Detail token di `theme.md`.

## Transisi Tema (light ⇄ dark)

Pergantian tema memakai "swap" cross-fade (`components/theme-toggle.tsx`):

- Bila browser mendukung **View Transitions API** → `document.startViewTransition()` (cross-fade native).
- **Fallback** → overlay penuh layar berwarna `--background` lama: fade-in 300ms, kelas tema ditukar di baliknya, lalu fade-out 300ms menampilkan tema baru.
- **Hanya `opacity` + warna latar overlay yang dianimasikan** — sesuai kaidah "hanya transform/opacity".
- `prefers-reduced-motion` → swap instan tanpa animasi.

---

# Reduced Motion

Wajib pada semua gerak:

- CSS: pasangkan `motion-reduce:transition-none` (atau reset transform) pada setiap transisi.
- JS (`motion/react`): cabang `useReducedMotion()` seperti pada `Reveal`.
- **Marquee**: `useReducedMotion()` → jangan terapkan `style={{ animation: ... }}`; konten tampil statis.
- Safety net global di `app/globals.css` `@media (prefers-reduced-motion: reduce)`:
  - **Entrance/decorative** di-skip (`animation-duration: 0.01ms`).
  - **Hover/focus transition** tetap jalan dengan durasi 200ms, hanya properti `color/background-color/border-color/box-shadow/opacity/outline/text-decoration-color` (bukan transform/layout) — umpan balik interaktif utuh.
- Jangan mengandalkan safety net global sebagai pengganti reset lokal.

---

# Ikon Animated

Ikon memakai **Lucide React**, dianimasikan dengan `motion/react` ketika ikon perlu memberi umpan balik (bukan entrance).

Pola:

```tsx
import { motion } from "motion/react";
import { Check, X } from "lucide-react";

// Path morph — ikon berubah saat state berubah
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", ... }}
  key={state} /* re-mount per state untuk morph */
>
  {isSuccess ? <Check /> : <X />}
</motion.div>
```

Aturan:

- Ikon statis default; animasi hanya saat umpan balik (press, state change, success/error).
- Animasikan `opacity`/`scale`/`pathLength`/`rotate` — bukan layout.
- Durasi ≤ 300ms; `useReducedMotion()` → ikon tampil langsung tanpa animasi.
- Hindari animasi ikon dekoratif di nav/header; fokus pada aksi kontekstual.

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