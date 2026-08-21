# Responsive Design

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar responsive design pada seluruh antarmuka LIM Digital Platform. Seluruh UI dirancang Mobile First.

---

# Breakpoints

| Breakpoint | Width   | Device         | Tailwind |
| ---------- | ------- | -------------- | -------- |
| Default    | 0px+    | Mobile         | ``       |
| sm         | 640px+  | Small Mobile   | `sm:`    |
| md         | 768px+  | Tablet         | `md:`    |
| lg         | 1024px+ | Laptop/Desktop | `lg:`    |
| xl         | 1280px+ | Large Desktop  | `xl:`    |
| 2xl        | 1536px+ | Wide Screen    | `2xl:`   |

---

# Mobile First

Seluruh implementasi dimulai dari mobile:

``tsx
// Default: Mobile
<div className="grid grid-cols-1 gap-3">

// Tablet: 2 columns
  <div className="md:grid-cols-2">

    // Desktop: 4 columns
    <div className="xl:grid-cols-4">

``

---

# Layout Responsive

### Public Website

| Component | Mobile     | Tablet         | Desktop             |
| --------- | ---------- | -------------- | ------------------- |
| Container | `px-4`     | `px-4 sm:px-6` | `max-w-6xl mx-auto` |
| Navbar    | Drawer     | Drawer         | Navigation Menu     |
| Footer    | Stacked    | 2 columns      | 4 columns           |
| Content   | Full width | Full width     | Max width           |

### Admin Dashboard

| Component | Mobile     | Tablet     | Desktop    |
| --------- | ---------- | ---------- | ---------- |
| Sidebar   | Drawer     | Fixed      | Fixed      |
| Header    | Full width | Full width | Full width |
| Grid      | 1 column   | 2 columns  | 4 columns  |
| Content   | Full width | Full width | Flex       |

---

# Navigation Responsive

### Desktop (lg+)

`text
Logo  |  Menu Items  |  Theme Toggle + Admin Button
`

### Mobile (<lg)

`text
Logo  |  Theme Toggle + Hamburger Menu
`

Drawer:

`text
Menu Items (stacked)
Login Admin Button
`

---

# Grid Responsive

### Dashboard Stats

``tsx
<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
  // Mobile: 1 column
  // Tablet: 2 columns
  // Desktop: 4 columns
</div>
``

### Dashboard Content

``tsx
<div className="grid gap-3 xl:grid-cols-[1fr_320px]">
  // Mobile: stacked
  // Desktop: content + sidebar
</div>
``

### Public Footer

``tsx
<div className="grid gap-7 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_1fr_1fr]">
  // Mobile: stacked
  // Tablet: 2 columns
  // Desktop: 4 columns
</div>
``

---

# Typography Responsive

``tsx
// Mobile: 24px, Tablet+: 30px, Desktop+: 36px
<h1 className="text-2xl sm:text-3xl lg:text-4xl">

// Mobile: 16px, Tablet+: 18px
<p className="text-sm sm:text-base">

// Mobile: 12px, Tablet+: 14px
<p className="text-xs sm:text-sm">
``

---

# Spacing Responsive

``tsx
// Section padding
<section className="py-16 sm:py-20">

// Container padding
<div className="px-4 sm:px-6">

// Gap
<div className="gap-3 sm:gap-4 lg:gap-6">
``

---

# Responsive Rules

1. Selalu dimulai dari Mobile First.
2. Gunakan breakpoints Tailwind CSS.
3. Test di seluruh breakpoints.
4. Gunakan responsive typography.
5. Gunakan responsive spacing.
6. Hindari horizontal scroll di mobile.
7. Pastikan touch target minimal 44px di mobile.

---

# Related Documents

- `README.md` - Design System overview.
- `layout.md` - Layout standards.
- `spacing.md` - Spacing standards.
