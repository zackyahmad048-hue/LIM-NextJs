# Design System & UI/UX Guidelines — LIM CMS

> Dokumen ini berisi audit desain, standar UI/UX, dan rekomendasi perbaikan
> untuk website publik dan admin dashboard LIM CMS.

---

## Daftar Isi

1. [Audit Kondisi Saat Ini](#1-audit-kondisi-saat-ini)
2. [Design System](#2-design-system)
3. [Website Publik — Panduan & Perbaikan](#3-website-publik--panduan--perbaikan)
4. [Admin Dashboard — Panduan & Perbaikan](#4-admin-dashboard--panduan--perbaikan)
5. [Struktur Project — Inkonsistensi & Perbaikan](#5-struktur-project--inkonsistensi--perbaikan)
6. [Implementasi Roadmap](#6-implementasi-roadmap)

---

## 1. Audit Kondisi Saat Ini

### 1.1 Website Publik

| Masalah | Lokasi | Severity |
|---|---|---|
| Homepage hanya punya 2 section (Hero + About) — sangat tipis | `app/(public)/page.tsx` | High |
| Tidak ada section Berita/Artikel terbaru di homepage | Homepage | High |
| Tidak ada section Program/kegiatan unggulan di homepage | Homepage | High |
| Tidak ada CTA section atau newsletter signup | Homepage | High |
| Halaman Artikel masih placeholder (dummy data `[1,2,3,4]`) | `artikel/page.tsx` | High |
| Halaman Media masih placeholder (8 kotak kosong) | `media/page.tsx` | High |
| Profil page menampilkan visi-misi yang seharusnya di `/profil/visi-misi` | `profil/page.tsx` | Medium |
| Navbar dropdown tidak ada animasi transisi | `navbar.tsx` | Low |
| Footer tidak ada back-to-top button | `footer.tsx` | Low |
| Tidak ada breadcrumb navigasi di halaman sub-profil | Profil pages | Medium |
| Setiap halaman pakai pola berbeda untuk spacing & layout | Semua public pages | Medium |

### 1.2 Admin Dashboard

| Masalah | Lokasi | Severity |
|---|---|---|
| **Dua sistem tabel berbeda** — `AdminTable` vs `DataTable` (TanStack) | 8 halaman vs 1 halaman | Critical |
| `StatCard` component hanya dipakai di Falak, halaman lain inline markup | `stat-card.tsx` vs 4+ pages | High |
| **Tidak ada delete confirmation** kecuali di Categories | Posts, Secretariat, Program | Critical |
| **Tiga pendekatan form berbeda** — react-hook-form, native form, manual state | PostForm, HeroForm, PageForm | High |
| `formatDate` di-copy-paste di 6+ file | Multiple list pages | Medium |
| `statusLabels` di-duplicate di 6+ file | Multiple list pages | Medium |
| 6 file komponen kosong/placeholder (dead code) | `nav-item.tsx`, `nav-group.tsx`, `search-input.tsx`, `dashboard/*.tsx` | Medium |
| `DataLoading` dan `DataError` component tidak dipakai | `data-table/data-loading.tsx` | Low |
| `as any[]` type casting di multiple list pages | Secretariat & Program lists | Medium |
| Breadcrumb hanya tampilkan 1 segment (kapitalisasi last path) | `breadcrumb.tsx` | Medium |
| 5 sub-layout file pass-through (dead indirection) | content/layout, secretariat/layout, dll | Low |
| Dashboard home pakai `PageContainer className="gap-0 p-0"` lalu re-inject styles | `admin/page.tsx` | Low |

### 1.3 Design System

| Masalah | Severity |
|---|---|
| Website publik hardcoded warna `orange-500` di很多 tempat, tidak pakai design tokens | High |
| Tidak ada animasi entrance untuk public pages kecuali homepage | Medium |
| Motion components tersedia (TiltCard, TextReveal, Marquee, Dock) tapi tidak dimanfaatkan | Medium |
| Tidak ada loading skeleton untuk halaman public | Low |
| Tidak ada error boundary untuk halaman public | Low |

---

## 2. Design System

### 2.1 Warna

**Primary Palette** — Warm Orange/Amber (sudah OK di `globals.css`):

```
Light: oklch(0.553 0.195 38.402)  → #E07020 approx
Dark:  oklch(0.47 0.157 37.304)   → darker variant
```

**Aturan Warna:**

- Gunakan **hanya CSS custom properties** (`text-primary`, `bg-primary`, `border-primary`, dll)
- Jangan hardcode `orange-500`, `sky-500`, `slate-950` di komponen — gunakan tokens
- Navbar publik: gunakan `bg-background/80 backdrop-blur-xl` bukan `bg-white/80`
- Footer: gunakan `bg-background` dengan `border-t` bukan hardcoded `bg-slate-950`
- Dark mode border: pakai `border-border` (yang sudah punya opacity) bukan `border-slate-700`

**Status Colors:**

| Status | Badge Variant | Icon Color |
|---|---|---|
| Success/Aktif | `default` (primary bg) | `text-green-500` |
| Warning/Pending | `secondary` | `text-yellow-500` |
| Error/Dibatalkan | `destructive` | `text-red-500` |
| Info/Draft | `outline` | `text-blue-500` |

### 2.2 Typography

```
Font:        Inter (body), Inter (heading) — sudah di globals.css
Heading:     text-2xl/3xl font-bold tracking-tight
Subheading:  text-lg font-bold
Body:        text-sm leading-7 (public), text-sm leading-6 (admin)
Caption:     text-xs leading-5 text-muted-foreground
Badge:       text-[11px] font-semibold uppercase tracking-wider
```

### 2.3 Spacing & Layout

**Website Publik:**

```
Page section:     py-16 sm:py-20
Content max-w:    max-w-6xl (72rem / 1152px)
Horizontal pad:   px-4 sm:px-6
Section gap:      mt-12 (antara heading dan konten)
Card gap:         gap-6 (grid), gap-4 (flex)
Card padding:     p-6 sm:p-8 (card besar), p-5 (card kecil)
```

**Admin Dashboard:**

```
Page container:   p-4 lg:p-5 (via PageContainer)
Section gap:      gap-4 (between cards)
Card padding:     p-6 (via SectionCard)
Header height:    h-12 (48px)
Sidebar width:    224px expanded, 56px collapsed
```

### 2.4 Component Patterns

#### SectionHeading (Public)
```tsx
// Sudah ada — gunakan di SEMUA halaman public
<SectionHeading
  badge="Label"
  title="Judul Utama"
  description="Deskripsi singkat"
  center={true} // default
/>
```

#### PageHeader (Admin)
```tsx
// Sudah ada — gunakan di SEMUA halaman admin
<PageHeader
  title="Judul Halaman"
  description="Deskripsi"
  actions={<Button>Tindakan</Button>}
/>
```

#### StatCard (Admin)
```tsx
// Sudah ada — gunakan di SEMUA dashboard admin, bukan inline markup
<StatCard
  title="Jumlah Data"
  value={42}
  description="Deskripsi singkat"
  icon={FileText}
/>
```

#### SectionCard (Admin)
```tsx
// Wrapper card — gunakan untuk semua panel admin
<SectionCard className="optional-class">
  {children}
</SectionCard>
```

---

## 3. Website Publik — Panduan & Perbaikan

### 3.1 Homepage (`app/(public)/page.tsx`)

**Kondisi saat ini:** Hanya Hero + About section.

**Target — Homepage harus punya minimal 6 section:**

```
1. Hero          → Sudah ada, bagus
2. About         → Sudah ada, bagus
3. Statistik     → NEW: Angka-angka penting (wilayah, muballigh, program)
4. Program       → NEW: Program unggulan (Safari Ramadan, Kaderisasi, dll)
5. Berita        → NEW: 3-4 artikel terbaru dari database
6. Media         → NEW: Galeri dokumentasi ringkas
7. CTA           → NEW: Ajakan bergabung / hubungi
8. Footer        → Sudah ada
```

**Implementasi:**
- Buat folder `components/website/sections/` untuk setiap section
- Setiap section pakai `SectionHeading` + pattern yang konsisten
- Statistik section pakai `Marquee` component yang sudah ada untuk animasi angka
- Berita section ambil data dari `getLatestPosts()` query
- Media section ambil data dari media query
- CTA section pakai gradient background + `TextReveal` animation

### 3.2 Halaman Profil

**Kondisi saat ini:**
- `/profil` — Menampilkan visi-misi (duplikat dari `/profil/visi-misi`)
- `/profil/tentang` — Sejarah + Keunggulan + Tujuan (terlalu banyak konten di satu halaman)
- `/profil/visi-misi` — Visi + Misi (sudah bagus)
- `/profil/pengurus-pusat` — Grid kartu pengurus (sudah bagus)

**Perbaikan:**
- `/profil` → Ubah menjadi halaman overview/profil ringkas dengan link ke sub-halaman
- `/profil/tentang` → Pisahkan "Keunggulan" ke section terpisah atau gunakan tabs
- Tambahkan breadcrumbs: `Beranda > Profil > Tentang Kami`
- Setiap halaman profil tambahkan animasi entrance (fadeUp) seperti About section

### 3.3 Halaman Artikel

**Kondisi saat ini:** Placeholder dummy data `[1,2,3,4]`.

**Target:**
- Ambil data dari database via query
- Tampilkan dalam format card grid dengan gambar, judul, tanggal, excerpt
- Tambahkan filter/kategori
- Tambahkan pagination atau "Load More"
- Layout: featured article (1 besar) + grid article lainnya

### 3.4 Halaman Media

**Kondisi saat ini:** 8 kotak kosong (placeholder).

**Target:**
- Ambil data dari media query
- Tampilkan dalam masonry/lightbox grid
- Tambahkan filter (Foto/Video)
- Hover effect: zoom + overlay info
- Klik untuk lightbox/modal view

### 3.5 Halaman Kontak

**Kondisi saat ini:** 3 kartu kontak saja.

**Perbaikan:**
- Tambahkan Google Maps embed
- Tambahkan form kontak (nama, email, pesan)
- Tambahkan FAQ section

### 3.6 Halaman Falak

**Kondisi saat ini:** 4 kartu link ke sub-halaman.

**Perbaikan:**
- Tambahkan widget jadwal shalat hari ini di halaman utama falak
- Tambahkan tanggal Hijriah hari ini
- Masing-masing sub-halaman sudah ada widget sendiri — pastikan konsisten

### 3.7 Animasi & Transisi

**Yang sudah tersedia tapi belum dimanfaatkan:**

| Component | Gunakan Untuk |
|---|---|
| `TextReveal` | Hero title, section headings |
| `TiltCard` | Kartu program unggulan, kartu pengurus |
| `Marquee` | Statistik scrolling, testimoni |
| `ShaderBackground` | Hero section alternatif, CTA section |
| `motion/react` fadeUp/fadeLeft | Entrance animation semua section |

**Pattern entrance animation untuk semua section:**
```tsx
import { motion } from "motion/react";
import { fadeUp } from "@/modules/shared/utils/motion";

<motion.div
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  <SectionHeading ... />
  {/* content */}
</motion.div>
```

### 3.8 Responsive Design

**Breakpoints (sudah di Tailwind):**
```
sm:  640px   — tablet landscape
md:  768px   — tablet portrait
lg:  1024px  — desktop
xl:  1280px  — large desktop
```

**Grid patterns:**
```
Mobile:     1 column (grid-cols-1)
Tablet:     2 columns (sm:grid-cols-2)
Desktop:    3-4 columns (lg:grid-cols-3 atau lg:grid-cols-4)
```

---

## 4. Admin Dashboard — Panduan & Perbaikan

### 4.1 Standar Pattern Setiap Halaman

**Setiap halaman admin WAJIB menggunakan:**

```tsx
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

export default function SomePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Judul Halaman"
        description="Deskripsi"
        actions={<Button>Aksi</Button>}
      />

      {/* Konten */}
      <SectionCard>
        {/* Isi */}
      </SectionCard>
    </PageContainer>
  );
}
```

### 4.2 Tabel — Standarisasi ke `DataTable` (TanStack)

**Masalah:** 8 halaman pakai `AdminTable` (tanpa fitur), 1 halaman pakai `DataTable` (fitur lengkap).

**Solusi:** Migrasi SEMUA halaman ke `DataTable`:
- Posts list
- Incoming mail list
- Outgoing mail list
- Document list
- Disposition list
- Program list
- Users list
- Roles list

**Benefits:**
- Sorting, filtering, pagination konsisten
- User experience seragam
- Lebih mudah maintain

**Pattern:**
```tsx
// components/admin/category/columns.tsx → buat per module
"use client";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<DataType>[] = [
  { accessorKey: "name", header: "Nama" },
  // ...
];
```

### 4.3 StatCard — Gunakan Component yang Sudah Ada

**Masalah:** Hanya Falak dashboard pakai `StatCard`, halaman lain inline markup serupa.

**Solusi:** Ganti SEMUA inline stat cards di:
- `admin/page.tsx` (dashboard home)
- `admin/content/page.tsx`
- `admin/secretariat/page.tsx`
- `admin/program/page.tsx`
- `admin/reports/page.tsx`

Dengan:
```tsx
import { StatCard } from "@/components/admin/shared/stat-card";

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <StatCard title="Total Data" value={42} icon={FileText} />
  <StatCard title="Aktif" value={12} icon={CheckCircle} />
  <StatCard title="Pending" value={5} icon={Clock} />
  <StatCard title="Dibatalkan" value={3} icon={XCircle} />
</div>
```

### 4.4 Delete Confirmation — Wajib di Semua Hapus Data

**Masalah:** Hanya Categories ada `ConfirmDialog`, halaman lain hapus langsung tanpa konfirmasi.

**Solusi:** Buat `ConfirmDialog` reusable dan pakai di SEMUA aksi hapus:
- Posts delete
- Incoming mail delete
- Outgoing mail delete
- Document delete
- Disposition delete
- Program delete
- Users delete

**Pattern:**
```tsx
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";

<ConfirmDialog
  title="Hapus Data"
  description="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
  onConfirm={() => deleteAction(id)}
>
  <Button variant="destructive" size="sm">Hapus</Button>
</ConfirmDialog>
```

### 4.5 Form — Standarisasi ke react-hook-form + zod

**Masalah:** 3 pendekatan form berbeda.

**Solusi:** Standarisasi ke **react-hook-form + zod + server action**:

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  // ...
});

type FormData = z.infer<typeof schema>;

export function SomeForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    "use server";
    await serverAction(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("name")} />
      {form.formState.errors.name && (
        <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
      )}
      <Button type="submit">Simpan</Button>
    </form>
  );
}
```

**Untuk form sederhana (settings/hero/about):** Boleh pakai native `<form action={serverAction}>` tapi pastikan ada client-side validation.

### 4.6 Breadcrumb — Perbaiki menjadi Full Trail

**Masalah:** Breadcrumb hanya tampilkan 1 segment.

**Solusi:** Update `breadcrumb.tsx` untuk generate full trail:
```
Admin > Konten > Berita > Edit
Admin > Sekretariat > Surat Masuk
```

### 4.7 Loading & Error States

**Masalah:** `DataLoading` dan `DataError` ada tapi tidak dipakai.

**Solusi:**
- Setiap halaman list yang punya `loading.tsx` → gunakan skeleton yang sesuai
- Setiap halaman yang bisa error → gunakan `error.tsx` boundary
- Tambahkan loading state untuk form submission

### 4.8 Halaman Dashboard Home

**Masalah:** `PageContainer className="gap-0 p-0"` lalu re-inject styles.

**Solusi:** Render `DashboardClient` langsung tanpa wrapper `PageContainer`, atau update `DashboardClient` untuk pakai `PageContainer` sendiri.

---

## 5. Struktur Project — Inkonsistensi & Perbaikan

### 5.1 File Duplikasi — Extract ke Shared Utilities

**`formatDate`** — Extract ke `lib/format.ts`:
```ts
// lib/format.ts
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy", { locale: id });
}
```

**`statusLabels`** — Extract ke module masing-masing:
```ts
// modules/secretariat/domain/status.ts
export const INCOMING_MAIL_STATUS = { ... } as const;
export const OUTGOING_MAIL_STATUS = { ... } as const;

// modules/program/domain/status.ts
export const PROGRAM_STATUS = { ... } as const;
```

### 5.2 Dead Files — Hapus

File yang harus dihapus:
- `components/admin/navigation/nav-item.tsx` (kosong)
- `components/admin/navigation/nav-group.tsx` (kosong)
- `components/admin/shared/search-input.tsx` (kosong)
- `components/admin/dashboard/stat-card.tsx` (kosong, ada yang lain)
- `components/admin/dashboard/overview.tsx` (kosong)
- `components/admin/dashboard/recent-news.tsx` (kosong)

### 5.3 Sub-Layouts — Pertimbangkan Dihapus

5 layout file yang hanya render `<>{children}</>`:
- `app/(dashboard)/admin/content/layout.tsx`
- `app/(dashboard)/admin/secretariat/layout.tsx`
- `app/(dashboard)/admin/program/layout.tsx`
- `app/(dashboard)/admin/falak/layout.tsx`
- `app/(dashboard)/admin/system/layout.tsx` (belum dicek)

**Solusi:** Hapus kecuali ada rencana pakai untuk shared context/provider.

### 5.4 Type Safety — Hapus `as any[]`

Di halaman list secretariat dan program, ganti `data={items as any[]}` dengan type yang benar:
```ts
// Definisikan tipe yang benar untuk AdminTable columns
interface Column<T> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render: (item: T) => React.ReactNode;
}
```

### 5.5 Action Pattern — Konsisten

**Saat ini:** Posts pakai `_actions` co-located, lainnya pakai module presentation layer.

**Solusi:** Standarisasi ke module presentation layer:
```ts
// modules/posts/presentation/post.action.ts
"use server";
export async function deletePost(id: string) { ... }
```

---

## 6. Implementasi Roadmap

### Phase 1 — Critical Fixes (Minggu 1)

- [ ] **Delete confirmation** — Tambahkan `ConfirmDialog` di SEMUA aksi hapus
- [ ] **StatCard** — Gunakan component yang ada di semua dashboard pages
- [ ] **Extract `formatDate`** ke `lib/format.ts`
- [ ] **Extract `statusLabels`** ke module domain files
- [ ] **Hapus dead files** (6 file kosong)
- [ ] **Fix `as any[]`** type casting

### Phase 2 — Homepage & Public Pages (Minggu 2-3)

- [ ] **Homepage** — Tambah section: Statistik, Program, Berita, Media, CTA
- [ ] **Artikel page** — Connect ke database, buat real content
- [ ] **Media page** — Connect ke database, buat gallery grid
- [ ] **Profil page** — Ubah menjadi overview dengan links
- [ ] **Kontak page** — Tambah form + maps
- [ ] **Breadcrumb navigasi** — Tambah di semua halaman sub-profil
- [ ] **Entrance animations** — Tambah fadeUp di semua section

### Phase 3 — Admin Standardization (Minggu 3-4)

- [ ] **Migrate ke DataTable** — Semua list pages
- [ ] **Standardize forms** — react-hook-form + zod
- [ ] **Fix breadcrumb** — Full trail
- [ ] **Fix dashboard home** — Remove double PageContainer
- [ ] **Remove dead sub-layouts**
- [ ] **Standardize action imports** — Module presentation layer

### Phase 4 — Polish & Motion (Minggu 4-5)

- [ ] **TiltCard** — Kartu program unggulan
- [ ] **Marquee** — Testimoni atau stat scrolling
- [ ] **TextReveal** — Section headings
- [ ] **Loading skeletons** — Semua halaman public
- [ ] **Error boundaries** — Semua halaman public
- [ ] **Mobile responsive polish** — Navbar animation, footer layout

---

## Referensi

- **shadcn/ui docs:** https://ui.shadcn.com
- **Motion library:** https://motion.dev/docs
- **Tailwind CSS v4:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/primitives/docs
- **TanStack Table:** https://tanstack.com/table
- **React Hook Form:** https://react-hook-form.com
- **Zod:** https://zod.dev
