# Laporan: Registry Animasi/Motion shadcn + Tailwind (Motion Primitives)

## 1. Registry pihak ketiga yang ditemukan (terverifikasi via Context7)
**Motion Primitives** — `/ibelick/motion-primitives` (Context7)
- Koleksi komponen animasi React dibangun dengan **Motion (framer-motion)** + Tailwind CSS.
- Dipasang via CLI-nya sendiri atau via **shadcn CLI dengan URL registry remote** (yang Anda minta).
- Sumber: https://motion-primitives.com, https://github.com/ibelick/motion-primitives

## 2. Cara pasang via shadcn CLI (third-party registry URL)
Per dokumen resmi Motion Primitives:

```bash
npx shadcn add "https://motion-primitives.com/c/<component>.json"
```

Contoh komponen yang tersedia (dari dokumentasi):
- `animated-number`, `animated-group`, `transition-panel`, `animated-background`, `sliding-number`, `in-view`, `text-morph`

Contoh:
```bash
npx shadcn add "https://motion-primitives.com/c/in-view.json"
npx shadcn add "https://motion-primitives.com/c/text-morph.json"
```

Catatan paket manajer: dokumentasi menyebut `npx` (npm). Proyek Anda menggunakan **bun**. Gunakan:
```bash
bunx shadcn add "https://motion-primitives.com/c/<component>.json"
```
atau via CLI Motion Primitives:
```bash
bunx motion-primitives add <component-name>
```
CLI otomatis mendeteksi paket manajer dari lock file.

## 3. Dependensi yang akan ditambahkan
Motion Primitives mengandalkan `framer-motion` (sudah terpasang di proyek, ^12) dan Tailwind. Tidak perlu dependensi baru di `package.json` kecuali CLI Motion Primitifs jika dipasang global.

## 4. Status proyek (terverifikasi lokal via filesystem)
- `components.json`: ada, Tailwind v4, `css: app/globals.css`, `"registries": {}` (belum ada registry pihak ketiga)
- `app/globals.css`: impor `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`; variabel oklch sudah didefinisikan
- `components/ui/`: 22 komponen shadcn sudah terpasang
- `lib/utils.ts`: `export { cn } from "cn"` tersedia
- `framer-motion` ^12 dan `tw-animate-css` ^1.4.0 sudah di `dependencies`

## 5. Rekomendasi styling Tailwind (Tenang Modern)
Gunakan token yang sudah ada di `app/globals.css` (oklch, `--primary`, `--muted`, dsb). Jangan buat `tailwind.config.ts` (dilarang AGENTS.md). Animasi via `framer-motion` (`motion.div`) atau utilitas `animate-*` dari `tw-animate-css`.

Contoh komponen gabungan (Motion Primitives + shadcn util `cn`):

```tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function PanelAnimate({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn('border rounded-lg p-4 bg-card text-card-foreground', className)}
    >
      {children}
    </motion.div>
  )
}
```

Perhatikan `prefers-reduced-motion` agar animasi tidak ganggu aksesibilitas (WCAG 2.1 AA).

## 6. Langkah selanjutnya
1. Pilih komponen dari motion-primitives.com yang dibutuhkan.
2. Jalankan `bunx shadcn add "https://motion-primitives.com/c/<komponen>.json"`.
3. Periksa file yang diunduh di `components/motion-primitives/` (jika ada).
4. Jalankan `bun run lint && bun run typecheck`.

## 7. Dilewati / belum dicek
- Belum menjalankan `bunx shadcn add` secara langsung (perlu komponen spesifik dari Anda).
- Belum menjalankan `bun run lint && bun run typecheck` setelah pemasangan.

## 8. Risiko
- Registry pihak ketiga (motion-primitives.com) harus kompatibel Tailwind v4 + Next.js 16 + RSC. Verifikasi setelah unduh.
- `bunx` vs `npx`: dokumen resmi pakai `npx`; coba `bunx` terlebih dahulu, fallback ke `npx` jika gagal.
- Animasi berlebihan melanggar standar "Tenang Modern".
