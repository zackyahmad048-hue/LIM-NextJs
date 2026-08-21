# Icons

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar penggunaan icon pada seluruh antarmuka LIM Digital Platform.

---

# Icon Library

Menggunakan **Lucide React** sebagai icon library utama.

`bash
npm install lucide-react
`

---

# Usage

``tsx
import { Home, User, Settings } from "lucide-react";

// Default size
<Home />

// Custom size
<Home className="h-4 w-4" />
<Home className="h-5 w-5" />
<Home className="size-4" />

// Custom color
<Home className="text-orange-500" />
<Home className="text-muted-foreground" />
``

---

# Icon Sizes

| Size | Class                      | Penggunaan             |
| ---- | -------------------------- | ---------------------- |
| 12px | `h-3 w-3` / `size-3`       | Badge, indicator       |
| 14px | `h-3.5 w-3.5` / `size-3.5` | Small buttons, inline  |
| 16px | `h-4 w-4` / `size-4`       | Default, sidebar menu  |
| 18px | `h-4.5 w-4.5` / `size-4.5` | Medium buttons         |
| 20px | `h-5 w-5` / `size-5`       | Large buttons, headers |
| 24px | `h-6 w-6` / `size-6`       | Feature icons          |

---

# Icon Colors

Menggunakan design tokens:

| Token                   | Penggunaan              |
| ----------------------- | ----------------------- |
| `text-foreground`       | Default icon color      |
| `text-muted-foreground` | Subdued icon            |
| `text-orange-500`       | Accent/brand icon       |
| `text-white`            | Icon on dark background |
| `text-emerald-600`      | Success indicator       |
| `text-amber-600`        | Warning indicator       |
| `text-red-600`          | Error indicator         |

---

# Common Icons

### Navigation

| Icon        | Import         | Penggunaan  |
| ----------- | -------------- | ----------- |
| Home        | `lucide-react` | Beranda     |
| User        | `lucide-react` | Profil      |
| FileText    | `lucide-react` | Artikel     |
| Image       | `lucide-react` | Media       |
| Mail        | `lucide-react` | Kontak      |
| Menu        | `lucide-react` | Mobile menu |
| X           | `lucide-react` | Close       |
| ChevronDown | `lucide-react` | Dropdown    |

### Admin

| Icon            | Import         | Penggunaan |
| --------------- | -------------- | ---------- |
| LayoutDashboard | `lucide-react` | Dashboard  |
| FolderOpen      | `lucide-react` | Content    |
| Settings        | `lucide-react` | Settings   |
| Users           | `lucide-react` | Users      |
| Shield          | `lucide-react` | Roles      |
| LogOut          | `lucide-react` | Logout     |

### Actions

| Icon         | Import         | Penggunaan    |
| ------------ | -------------- | ------------- |
| Plus         | `lucide-react` | Add new       |
| Pencil       | `lucide-react` | Edit          |
| Trash2       | `lucide-react` | Delete        |
| Search       | `lucide-react` | Search        |
| ArrowUpRight | `lucide-react` | External link |
| Save         | `lucide-react` | Save          |

---

# Icon in Buttons

``tsx
// Icon only button
<Button size="icon-sm">
<Settings className="h-4 w-4" />
</Button>

// Button with icon
<Button size="sm">
<Save className="h-4 w-4" />
Simpan
</Button>

// Button with icon right
<Button asChild size="sm">
  <Link href="/admin">
    Hero Beranda
    <ArrowUpRight />
  </Link>
</Button>
``

---

# Rules

1. Gunakan Lucide React untuk seluruh icon.
2. Ukuran icon harus konsisten dalam konteks yang sama.
3. Gunakan design tokens untuk warna icon.
4. Jangan hardcode warna icon.
5. Icon harus accessible (berikan `aria-label` jika perlu).

---

# Related Documents

- `README.md` - Design System overview.
- `components.md` - Component standards.
- `typography.md` - Typography standards.
