# FAQ

**Project:** LIM Digital Platform

**Folder:** `13-handbook`

**Version:** 1.0

**Status:** Approved

---

# Overview

Pertanyaan yang sering diajukan oleh developer baru.

---

# Development

### Bagaimana cara menjalankan project lokal?

`bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
`

Lihat [Local Setup](./local-setup.md) untuk panduan lengkap.

---

### Bagaimana cara menambah halaman baru?

1. Buat folder di `app/(public)/[nama-halaman]/`.
2. Buat file `page.tsx` di dalamnya.
3. Gunakan `PageContainer` dan komponen yang tersedia.

``tsx
// app/(public)/artikel/page.tsx
import SectionHeading from "@/components/shared/section-heading";

export default function ArtikelPage() {
return (
<section className="py-16 sm:py-20">
<div className="mx-auto max-w-6xl px-4 sm:px-6">
<SectionHeading
          badge="Artikel"
          title="Artikel & Kajian"
          description="Artikel, kajian, dan tulisan dari LIM."
        />
</div>
</section>
);
}
``

---

### Bagaimana cara menambah domain module baru?

1. Buat folder di `modules/[domain]/`.
2. Buat struktur: `application/`, `infrastructure/`, `validation/`.
3. Buat Repository, Service, dan Schema.

Lihat [Developer Guide](./developer-guide.md) untuk detail.

---

### Bagaimana cara menambah komponen UI?

1. Jalankan `npx shadcn@latest add [komponen]`.
2. Komponen akan ditambahkan ke `components/ui/`.
3. Gunakan komponen sesuai kebutuhan.

---

### Di mana meletakkan Business Rules?

Business Rules hanya boleh berada di **Service Layer** (`modules/[domain]/infrastructure/[domain].service.ts`).

Tidak diperbolehkan di:

- Component (UI)
- Repository
- Server Actions

---

### Bagaimana cara validasi form?

Gunakan Zod schema:

``typescript
// modules/cms/validation/category.schema.ts
import { z } from "zod";

export const categorySchema = z.object({
name: z.string().min(1, "Nama harus diisi"),
slug: z.string().min(1, "Slug harus diisi"),
});
``

Client validation dengan React Hook Form + Zod Resolver.

---

# Database

### Bagaimana cara membuat migrasi?

``bash

# Edit schema.prisma

npm run prisma:migrate
``

Atau push langsung (development):

`bash
npm run db:push
`

---

### Bagaimama cara melihat database?

`bash
npm run prisma:studio
`

Ini akan membuka Prisma Studio di browser.

---

### Bagaimana cara reset database?

`bash
npx prisma migrate reset
npm run prisma:migrate
npm run db:seed
`

---

# Authentication

### Bagaimana cara login admin?

Buka `/admin/login` dan gunakan akun admin yang sudah dibuat.

---

### Bagaimana cara membuat akun admin baru?

Jalankan seed data atau buat melalui Prisma Studio.

---

# Navigation

### Bagaimana cara menambah menu navbar?

Edit file `components/website/layout/navbar.tsx`.

Maksimal 5 menu utama sesuai design system.

---

### Bagaimana cara menambah submenu Profil?

Edit array `profilChildren` dan `bidangItems` di `navbar.tsx`.

---

# Related Documents

- [Getting Started](./getting-started.md) - Pengantar cepat.
- [Local Setup](./local-setup.md) - Setup lokal.
- [Developer Guide](./developer-guide.md) - Panduan pengembangan.
- [Troubleshooting](./troubleshooting.md) - Solusi error.
