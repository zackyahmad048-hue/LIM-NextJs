# Developer Guide

**Project:** LIM Digital Platform

**Folder:** `13-handbook`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini menjadi panduan utama bagi developer dalam mengembangkan fitur di LIM Digital Platform. Panduan ini mencakup cara kerja, struktur kode, dan best practices yang berlaku.

---

# Folder Structure

``
app/
+-- (public)/               # Public website routes
|   +-- page.tsx            # Homepage (/)
|   +-- profil/             # Profil routes
|   +-- artikel/            # Artikel routes
|   +-- media/              # Media routes
|   +-- kontak/             # Kontak routes
+-- (dashboard)/            # Admin dashboard routes
|   +-- admin/
|       +-- page.tsx        # Dashboard (/admin)
|       +-- homepage/       # Homepage settings
|       +-- content/        # Content management
|       +-- system/         # System settings
+-- api/                    # REST API routes
+-- layout.tsx              # Root layout
``

---

# Layer Architecture

Seluruh kode mengikuti arsitektur layer berikut:

``text
Presentation (UI Component)
      |
Action / API (Server Actions, Route Handlers)
      |
Service Layer (Business Rules)
      |
Repository Layer (Database Access)
      |
Prisma ORM
      |
PostgreSQL
``

Aturan:
- Layer tidak boleh dilewati.
- Business Rules hanya di Service Layer.
- Database access hanya melalui Repository.

---

# Module Structure

Setiap domain module memiliki struktur:

``
modules/
+-- [domain]/
    +-- index.ts              # Public exports
    +-- application/          # Use cases, server actions
    |   +-- create.ts
    |   +-- update.ts
    |   +-- delete.ts
    +-- infrastructure/       # Implementation details
    |   +-- [domain].repository.ts
    |   +-- [domain].service.ts
    +-- validation/           # Zod schemas
    |   +-- [domain].schema.ts
``

---

# Naming Conventions

| Item | Convention | Contoh |
|------|-----------|--------|
| Folder | kebab-case | `category-management` |
| File | kebab-case | `category.service.ts` |
| Component | PascalCase | `CategoryForm` |
| Variable | camelCase | `categoryName` |
| Constant | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| Function | camelCase | `createCategory()` |
| Type/Interface | PascalCase | `CategoryType` |

---

# Component Rules

### Server Component (Default)

``
export default async function Page() {
  const data = await fetchData();
  return <div>{data.name}</div>;
}
``

### Client Component

``
"use client";

export function InteractiveWidget() {
  const [state, setState] = useState();
  return <div onClick={() => setState(!state)}>...</div>;
}
``

Aturan:
- Gunakan Server Component jika memungkinkan.
- Tambahkan `"use client"` hanya jika diperlukan (state, event handler, browser API).
- Component harus fokus pada satu tugas.
- Component tidak boleh berisi Business Rules.

---

# Import Rules

Urutan import:

``typescript
// 1. External Library
import { useState } from "react";
import { z } from "zod";

// 2. Internal Alias
import { Button } from "@/components/ui/button";
import { categoryService } from "@/modules/cms/application/category.service";

// 3. Relative Import
import "./style.css";
``

---

# Server Actions

Server Actions digunakan untuk operasi data (create, update, delete):

``typescript
"use server";

import { revalidatePath } from "next/cache";
import { categoryService } from "@/modules/cms/application/category.service";

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name"));

  await categoryService.create({ name });

  revalidatePath("/admin/content/categories");
}
``

Aturan:
- Gunakan `"use server"` directive.
- Panggil Service Layer, bukan Repository langsung.
- Gunakan `revalidatePath` atau `revalidateTag` setelah perubahan data.

---

# Validation

Seluruh validasi menggunakan Zod:

``typescript
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  slug: z.string().min(1, "Slug harus diisi"),
  description: z.string().optional(),
});
``

Aturan:
- Validasi di Client membantu UX.
- Validasi di Server tetap wajib (security).
- Selalu gunakan Zod schema yang sama untuk keduanya.

---

# Database Access

### Repository Pattern

``typescript
// modules/cms/infrastructure/category.repository.ts
import { prisma } from "@/lib/prisma";

export const categoryRepository = {
  async findAll() {
    return prisma.category.findMany();
  },

  async findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },

  async create(data: CreateCategoryInput) {
    return prisma.category.create({ data });
  },

  async update(id: string, data: UpdateCategoryInput) {
    return prisma.category.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};
``

Aturan:
- Selalu gunakan Repository untuk akses database.
- Tidak boleh ada query Prisma di luar Repository.
- Repository tidak boleh berisi Business Rules.

---

# Error Handling

Gunakan error message yang informatif:

``typescript
// Baik
throw new Error("Kategori tidak ditemukan.");
throw new Error("Slug sudah digunakan.");

// Tidak baik
throw new Error("Error");
throw new Error("Not found");
``

---

# Testing Checklist

Sebelum submit kode:

1. Jalankan `npm run check` - Pastikan lint dan typecheck pass.
2. Jalankan `npm run build` - Pastikan build berhasil.
3. Test secara manual di browser.
4. Pastikan tidak ada `console.log()` yang tertinggal.
5. Pastikan tidak ada hardcoded value.

---

# Related Documents

- [Getting Started](./getting-started.md) - Pengantar cepat.
- [Architecture Guide](./architecture-guide.md) - Arsitektur sistem.
- `docs/00-overview/10-CODING_STANDARDS.md` - Coding standards.
- `docs/03-development/coding-standards.md` - Coding standards detail.
- `docs/08-design-system/navigation.md` - Navigation standards.
