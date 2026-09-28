# Rencana Implementasi — Redesign Stone Hangat-Samar

## Ringkasan

Redesign seluruh situs LIM (public + admin) dengan konsep **"Register & Meja Sekretariat"**:
- Netral → stone hangat-samar (hue 65, chroma 0.005)
- Jingga = satu-satunya warna kromatis
- Glass + orbs dipertahankan, tints dikurangi chroma ~60%
- Layout register (tabel, daftar, hierarki) bukan kartu seragam
- Hapus ALL-CAPS eyebrows, ArrowRight links, mono labels non-data

---

## P0: Token Warna (globals.css)

**File:** `app/globals.css`

### Light Theme (`:root`)

| Token | Sebelum | Sesudah |
|---|---|---|
| `--background` | `oklch(0.985 0.004 80)` | `oklch(0.985 0.005 65)` |
| `--foreground` | `oklch(0.2 0.01 70)` | `oklch(0.2 0.008 65)` |
| `--card` | `oklch(0.985 0.004 80)` | `oklch(0.985 0.005 65)` |
| `--card-foreground` | `oklch(0.2 0.01 70)` | `oklch(0.2 0.008 65)` |
| `--popover` | `oklch(0.985 0.004 80)` | `oklch(0.985 0.005 65)` |
| `--popover-foreground` | `oklch(0.2 0.01 70)` | `oklch(0.2 0.008 65)` |
| `--primary` | `oklch(0.45 0.195 38.402)` | TIDAK DIUBAH |
| `--primary-foreground` | `oklch(0.98 0.016 73.684)` | TIDAK DIUBAH |
| `--secondary` | `oklch(0.955 0.006 85)` | `oklch(0.955 0.005 65)` |
| `--secondary-foreground` | `oklch(0.21 0.006 285.885)` | `oklch(0.21 0.008 65)` |
| `--muted` | `oklch(0.96 0.005 85)` | `oklch(0.96 0.005 65)` |
| `--muted-foreground` | `oklch(0.45 0.015 80)` | `oklch(0.45 0.01 65)` |
| `--accent` | `oklch(0.955 0.008 85)` | `oklch(0.955 0.005 65)` |
| `--accent-foreground` | `oklch(0.205 0 0)` | TIDAK DIUBAH |
| `--border` | `oklch(0.9 0.008 80)` | `oklch(0.9 0.005 65)` |
| `--input` | `oklch(0.9 0.008 80)` | `oklch(0.9 0.005 65)` |
| `--ring` | `oklch(0.708 0 0)` | TIDAK DIUBAH |

### Light Theme — Tints

| Token | Sebelum | Sesudah |
|---|---|---|
| `--tint-falak` | `oklch(0.52 0.13 262)` | `oklch(0.52 0.05 262)` |
| `--tint-program` | `oklch(0.52 0.12 162)` | `oklch(0.52 0.05 162)` |
| `--tint-sekretariat` | `oklch(0.66 0.17 78)` | `oklch(0.66 0.07 78)` |
| `--tint-konten` | `oklch(0.56 0.16 16)` | `oklch(0.56 0.06 16)` |
| `--tint-sistem` | `oklch(0.52 0.05 262)` | `oklch(0.52 0.02 262)` |

### Light Theme — Sidebar

| Token | Sebelum | Sesudah |
|---|---|---|
| `--sidebar` | `oklch(0.958 0.012 262)` | `oklch(0.958 0.005 65)` |
| `--sidebar-foreground` | `oklch(0.2 0.02 262)` | `oklch(0.2 0.008 65)` |
| `--sidebar-primary` | `oklch(0.47 0.14 60)` | TIDAK DIUBAH |
| `--sidebar-primary-foreground` | `oklch(0.98 0.016 73.684)` | TIDAK DIUBAH |
| `--sidebar-accent` | `oklch(0.9 0.03 262)` | `oklch(0.9 0.005 65)` |
| `--sidebar-accent-foreground` | `oklch(0.2 0.02 262)` | `oklch(0.2 0.008 65)` |
| `--sidebar-border` | `oklch(0.87 0.02 262)` | `oklch(0.87 0.005 65)` |
| `--sidebar-ring` | `oklch(0.708 0 0)` | TIDAK DIUBAH |

### Light Theme — Admin Sidebar

| Token | Sebelum | Sesudah |
|---|---|---|
| `--admin-sidebar-bg` | `oklch(0.95 0.014 60)` | `oklch(0.95 0.005 65)` |
| `--admin-sidebar-fg` | `oklch(0.2 0.02 60)` | `oklch(0.2 0.008 65)` |
| `--admin-sidebar-border` | `oklch(0.86 0.02 60 / 0.6)` | `oklch(0.86 0.005 65 / 0.6)` |
| `--admin-sidebar-accent` | `oklch(0.47 0.14 60)` | TIDAK DIUBAH (active state) |
| `--admin-sidebar-accent-fg` | `oklch(0.98 0.012 90)` | `oklch(0.98 0.005 65)` |
| `--admin-content-bg` | `oklch(0.975 0.006 85)` | `oklch(0.975 0.005 65)` |
| `--admin-content-fg` | `var(--foreground)` | TIDAK DIUBAH |
| `--admin-card-bg` | `oklch(0.99 0.006 85)` | `oklch(0.99 0.005 65)` |
| `--admin-card-border` | `oklch(0.88 0.01 80 / 0.6)` | `oklch(0.88 0.005 65 / 0.6)` |
| `--admin-border` | `oklch(0.88 0.01 80)` | `oklch(0.88 0.005 65)` |
| `--admin-input-bg` | `oklch(0.99 0.006 85)` | `oklch(0.99 0.005 65)` |
| `--admin-input-border` | `oklch(0.88 0.01 80)` | `oklch(0.88 0.005 65)` |

### Dark Theme (`.dark`)

| Token | Sebelum | Sesudah |
|---|---|---|
| `--background` | `oklch(0.155 0.02 260)` | `oklch(0.155 0.005 65)` |
| `--foreground` | `oklch(0.95 0.008 90)` | `oklch(0.95 0.005 65)` |
| `--card` | `oklch(0.2 0.025 260)` | `oklch(0.2 0.005 65)` |
| `--card-foreground` | `oklch(0.95 0.008 90)` | `oklch(0.95 0.005 65)` |
| `--popover` | `oklch(0.2 0.025 260)` | `oklch(0.2 0.005 65)` |
| `--popover-foreground` | `oklch(0.95 0.008 90)` | `oklch(0.95 0.005 65)` |
| `--primary` | `oklch(0.47 0.157 37.304)` | TIDAK DIUBAH |
| `--primary-foreground` | `oklch(0.98 0.016 73.684)` | TIDAK DIUBAH |
| `--secondary` | `oklch(0.24 0.018 270)` | `oklch(0.24 0.005 65)` |
| `--secondary-foreground` | `oklch(0.985 0 0)` | TIDAK DIUBAH |
| `--muted` | `oklch(0.23 0.015 262)` | `oklch(0.23 0.005 65)` |
| `--muted-foreground` | `oklch(0.7 0.015 90)` | `oklch(0.7 0.008 65)` |
| `--accent` | `oklch(0.235 0.02 262)` | `oklch(0.235 0.005 65)` |
| `--accent-foreground` | `oklch(0.985 0 0)` | TIDAK DIUBAH |
| `--border` | `oklch(0.85 0.01 90 / 0.14)` | `oklch(0.85 0.005 65 / 0.14)` |
| `--input` | `oklch(1 0 0 / 0.15)` | TIDAK DIUBAH |
| `--ring` | `oklch(0.556 0 0)` | TIDAK DIUBAH |

### Dark Theme — Tints

| Token | Sebelum | Sesudah |
|---|---|---|
| `--tint-falak` | `oklch(0.68 0.14 262)` | `oklch(0.68 0.05 262)` |
| `--tint-program` | `oklch(0.72 0.13 162)` | `oklch(0.72 0.05 162)` |
| `--tint-sekretariat` | `oklch(0.78 0.15 78)` | `oklch(0.78 0.06 78)` |
| `--tint-konten` | `oklch(0.72 0.16 20)` | `oklch(0.72 0.06 20)` |
| `--tint-sistem` | `oklch(0.66 0.06 262)` | `oklch(0.66 0.02 262)` |

### Dark Theme — Sidebar

| Token | Sebelum | Sesudah |
|---|---|---|
| `--sidebar` | `oklch(0.175 0.025 262)` | `oklch(0.175 0.005 65)` |
| `--sidebar-foreground` | `oklch(0.95 0.01 95)` | `oklch(0.95 0.005 65)` |
| `--sidebar-primary` | `oklch(0.705 0.213 47.604)` | TIDAK DIUBAH |
| `--sidebar-primary-foreground` | `oklch(0.98 0.016 73.684)` | TIDAK DIUBAH |
| `--sidebar-accent` | `oklch(0.24 0.03 262)` | `oklch(0.24 0.005 65)` |
| `--sidebar-accent-foreground` | `oklch(0.95 0.01 95)` | `oklch(0.95 0.005 65)` |
| `--sidebar-border` | `oklch(1 0 0 / 10%)` | TIDAK DIUBAH |
| `--sidebar-ring` | `oklch(0.556 0 0)` | TIDAK DIUBAH |

### Dark Theme — Admin Sidebar

| Token | Sebelum | Sesudah |
|---|---|---|
| `--admin-sidebar-bg` | `oklch(0.15 0.03 60)` | `oklch(0.15 0.005 65)` |
| `--admin-sidebar-fg` | `oklch(0.93 0.01 95)` | `oklch(0.93 0.005 65)` |
| `--admin-sidebar-border` | `oklch(1 0 0 / 0.1)` | TIDAK DIUBAH |
| `--admin-sidebar-accent` | `oklch(0.75 0.13 85)` | TIDAK DIUBAH (active state) |
| `--admin-sidebar-accent-fg` | `oklch(0.2 0.02 60)` | `oklch(0.2 0.005 65)` |
| `--admin-content-bg` | `oklch(0.155 0.02 60)` | `oklch(0.155 0.005 65)` |
| `--admin-content-fg` | `var(--foreground)` | TIDAK DIUBAH |
| `--admin-card-bg` | `oklch(0.24 0.03 60)` | `oklch(0.24 0.005 65)` |
| `--admin-card-border` | `oklch(0.85 0.01 90 / 0.16)` | `oklch(0.85 0.005 65 / 0.16)` |
| `--admin-border` | `oklch(0.85 0.01 90 / 0.16)` | `oklch(0.85 0.005 65 / 0.16)` |
| `--admin-input-bg` | `oklch(0.24 0.03 60)` | `oklch(0.24 0.005 65)` |
| `--admin-input-border` | `oklch(0.85 0.01 90 / 0.2)` | `oklch(0.85 0.005 65 / 0.2)` |

### Komentar yang Perlu Diupdate

- Line 95: "kertas siang yang hangat" → "stone hangat-samar"
- Line 205: "malam indigo" → "stone malam"
- Line 150: "indigo" → "stone"
- Line 255: "indigo" → "stone"

---

## P1: Public Pages

### 1a. Navbar (`components/website/layout/navbar.tsx`)

- Hapus uppercase "LEMBAGA" label (line 82-84) → hanya tampilkan logo + "Ittihadul Muballighin"
- Hapus `uppercase` pada dropdown "Profil" section label (line 128)
- Pertahankan floating pill (rounded-full)

### 1b. Footer (`components/website/layout/footer.tsx`)

- Hapus `uppercase tracking-wider` pada column headers (lines 78, 93, 108) → sentence case

### 1c. Hero (`components/website/sections/Hero.tsx`)

- Hapus `uppercase tracking-wide` pada CTA buttons (lines 47, 59)
- Hapus `ArrowRight` pada CTA primary (line 52)

### 1d. About (`components/website/sections/about.tsx`)

- Hapus `<SectionLabel>Selayang Pandang</SectionLabel>` (line 33) → ganti dengan `<h2>` biasa atau hapus
- Hapus `<ArrowRight>` pada "Selengkapnya" CTA (line 89)

### 1e. BidangCarousel (`components/website/sections/bidang-carousel.tsx`)

- Konversi marquee → daftar register baris (bukan carousel)
- Hapus animasi marquee CSS

### 1f. ArticleBento (`components/website/sections/article-bento.tsx`)

- Hapus `<SectionLabel>{BENTO.label}</SectionLabel>` (line 31) → ganti dengan `<h2>` biasa

### 1g. StatRule (`components/website/taqwim/stat-rule.tsx`)

- Hapus `uppercase` pada labels → sentence case

### 1h. Semua link ArrowRight

- Hapus `<ArrowRight>` pada semua CTA links di seluruh halaman publik
- Ganti dengan underline hover state

---

## P2: Admin Shell

### 2a. Sidebar (`components/admin/layout/sidebar.tsx`)

- Token sudah berubah via P0
- Hapus uppercase pada nav labels jika ada (perlu cek sidebar-item.tsx)

### 2b. Header (`components/admin/layout/header.tsx`)

- Token sudah berubah via P0
- Pertahankan chrome class

### 2c. Content areas

- Token sudah berubah via P0

---

## P3: Secondary Pages

### 3a. Semua halaman publik

- Hapus `<SectionLabel>` (eyebrow) → ganti dengan `<h2>` biasa atau hapus
- Hapus `<ArrowRight>` pada semua CTA links
- Hapus `uppercase` pada labels

### 3b. Halaman falak

- Pertahankan data-driven layout
- Hapus eyebrow labels

### 3c. Halaman profil

- Pertahankan visi/misi layout
- Hapus eyebrow labels

### 3d. Form wajib-khidmah

- Pertahankan form layout
- Hapus dekoratif elements

---

## Urutan Eksekusi

1. **P0** — Token globals.css (1 file, dampak ke seluruh situs)
2. **Build + visual QA** — pastikan tidak ada yang patah
3. **P1a-i** — Public pages (navbar, footer, hero, about, bidang, article, statrule, ArrowRight cleanup)
4. **Build + visual QA**
5. **P2** — Admin shell (token sudah cover, mungkin sidebar-item.tsx)
6. **Build + visual QA**
7. **P3** — Secondary pages (grep + hapus SectionLabel/ArrowRight/uppercase)
8. **Final build + lint + typecheck**

---

## Validasi

Setelah setiap fase:
- `NODE_OPTIONS="--max-old-space-size=8192" npm run typecheck`
- `npm run lint`
- `NODE_OPTIONS="--max-old-space-size=8192" npm run build`

---

## Catatan

- 17 token perlu diubah (hue 260-270 → 65)
- 20 Tailwind theme tokens auto-cascade (tidak perlu edit manual)
- 5 glass-tint classes auto-cascade
- 2 ambient orbs auto-cascade
- 3 hardcoded hex values (TiltedCard, Aurora, login) — biarkan (komponen dekoratif)
- Glass + orbs dipertahankan (sudah ada reduced-transparency fallback)
- Module tints dipertahankan tapi chroma dikurangi ~60%
