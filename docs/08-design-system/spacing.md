# Spacing

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar spacing yang digunakan pada seluruh antarmuka LIM Digital Platform. Spacing yang konsisten memastikan tampilan yang rapi dan terorganisir.

---

# Spacing Scale

Menggunakan skala spacing Tailwind CSS:

| Token             | Nilai | Penggunaan            |
| ----------------- | ----- | --------------------- |
| `p-0` / `m-0`     | 0px   | Tidak ada spacing     |
| `p-0.5` / `m-0.5` | 2px   | Spacing sangat kecil  |
| `p-1` / `m-1`     | 4px   | Spacing kecil         |
| `p-1.5` / `m-1.5` | 6px   | Spacing kecil         |
| `p-2` / `m-2`     | 8px   | Spacing default kecil |
| `p-3` / `m-3`     | 12px  | Spacing sedang kecil  |
| `p-4` / `m-4`     | 16px  | Spacing sedang        |
| `p-5` / `m-5`     | 20px  | Spacing sedang besar  |
| `p-6` / `m-6`     | 24px  | Spacing besar         |
| `p-8` / `m-8`     | 32px  | Spacing very big      |
| `p-10` / `m-10`   | 40px  | Spacing ekstra besar  |
| `p-12` / `m-12`   | 48px  | Spacing jumbo         |
| `p-16` / `m-16`   | 64px  | Spacing maksimal      |

---

# Layout Spacing

### Page Container

`css
.py-16 sm:py-20    /* Vertical padding halaman */
px-4 sm:px-6       /* Horizontal padding halaman */
max-w-6xl mx-auto  /* Max width container */
`

### Section Spacing

`css
space-y-4    /* Vertical spacing antar section */
gap-3        /* Grid/flex gap kecil */
gap-4        /* Grid/flex gap sedang */
gap-6        /* Grid/flex gap besar */
gap-8        /* Grid/flex gap very big */
`

### Card Spacing

`css
p-4           /* Padding dalam card */
p-5           /* Padding dalam card besar */
p-6           /* Padding dalam card very big */
`

---

# Component Spacing

### Navbar

`css
h-14                    /* Height navbar */
px-4 sm:px-6           /* Horizontal padding */
gap-6                   /* Gap antar menu items */
`

### Sidebar

`css
w-56                    /* Width expanded */
w-16                    /* Width collapsed */
p-2 / p-3              /* Padding sidebar */
space-y-0.5 / space-y-1 /* Gap antar menu items */
`

### Header Dashboard

`css
h-12                    /* Height header */
px-4                    /* Horizontal padding */
gap-3                    /* Gap antar elements */
`

### Card

`css
p-4                    /* Default card padding */
rounded-lg              /* Border radius */
space-y-3              /* Vertical spacing dalam card */
`

---

# Grid Spacing

### Dashboard Grid

`css
grid gap-3 md:grid-cols-2 xl:grid-cols-4    /* Stats grid */
grid gap-3 xl:grid-cols-[1fr_320px]          /* Content + sidebar */
`

### Public Page Grid

`css
grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4    /* Gallery grid */
grid gap-7 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_1fr_1fr]  /* Footer grid */
`

---

# Spacing Rules

1. Gunakan skala spacing Tailwind CSS.
2. Jangan hardcode nilai spacing (misal: `margin-top: 13px`).
3. Konsisten menggunakan token spacing yang sama untuk komponen serupa.
4. Gunakan responsive spacing (`sm:`, `md:`, `lg:`) sesuai kebutuhan.

---

# Related Documents

- `README.md` - Design System overview.
- `layout.md` - Layout standards.
- `components.md` - Component standards.
