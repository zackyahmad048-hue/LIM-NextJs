# AGENTS.md — LIM-NextJs

Aturan wajib untuk AI coding agent. Urutan prioritas: **P0 > P1 > P2 > P3 > P4**. Jika dua aturan bertabrakan, aturan dengan prioritas lebih tinggi menang. Instruksi eksplisit pengguna mengalahkan semuanya, kecuali P0.

**Stack:** Next.js 16 (App Router, TurboPack) · React 19 · TypeScript strict · TailwindCSS 4 · shadcn/ui · Prisma 7 + NeonDB · Better-Auth · Vitest · npm

**Rujukan:**
- Kode: skill `Strict Coding Agent` (alur proposal dan larangan teknis), `CONTEXT.md`, `docs/05-decisions/` (ADR).
- UI: skill `UI/UX Glassmorphism`, `PRODUCT.md`, `DESIGN.md`, `app/globals.css`, `docs/08-design-system/`.
- Fitur: `docs/` (cari lewat context7).

---

## P0 — Larangan Mutlak
- Jangan mengubah file di luar scope, membuat file baru, atau menginstal dependensi tanpa diminta eksplisit.
- Jangan menjalankan `prisma migrate`, `generate`, atau `db push` tanpa izin. Jangan edit `prisma/migrations/` atau Prisma Client hasil generate secara manual.
- Jangan menebak maksud, mengarang API/file/model/endpoint, atau menambah refactor, komentar, test, dan dokumentasi yang tidak diminta.
- Jangan pakai `any`, `@ts-ignore`, `@ts-nocheck`, `eval()`, `setTimeout` untuk race condition, atau `console.log` di production.
- Jangan hardcode atau mengekspos secret; variabel baru dicatat di `.env.example`.
- Jangan operasi Git destruktif (`reset --hard`, `clean -fd`, `checkout .`) dan jangan menimpa pekerjaan pengguna.
- Jangan mengubah rumus atau metode Falak secara diam-diam.

## P1 — Alur Kerja
1. **Pahami** permintaan. Riset atau analisis tidak boleh mengubah file.
2. **Cari docs** di `docs/` (gunakan context7), lalu **inspeksi kode** terkait dan pola yang sudah ada. Jangan menebak struktur folder.
3. **Proposal.** Untuk setiap perubahan kode, tulis tugas, file (path + baris), asumsi, dan risiko, lalu berhenti.
4. **Eksekusi** hanya setelah `APPROVED`, `PROCEED`, `LANJUTKAN`, atau `YA`. "Oke", "lanjut", dan emoji bukan persetujuan.
5. **Tinjau diff, validasi, laporkan.**

Tanpa proposal: membaca file, menjawab pertanyaan, analisis, dan debugging tanpa perubahan kode. Tanyakan hanya jika jawabannya tidak bisa didapat dari repo dan mempengaruhi arsitektur, data, keamanan, aturan bisnis, atau perhitungan (maksimal 3 pertanyaan spesifik). Berhenti dan eskalasi jika menyangkut migrasi database atau keputusan arsitektural besar.

## P2 — Arsitektur
- **Perubahan minimal.** Pertahankan arsitektur, gaya, dan penamaan yang ada. Cari dan pakai ulang component, util, hook, dan service sebelum membuat yang baru.
- **Server Component default.** `'use client'` hanya jika perlu (hooks, browser API, event), dan sedekat mungkin ke leaf. Jangan impor Prisma atau modul server-only ke client component maupun proxy/middleware.
- **Next.js 16:** `params`, `searchParams`, `cookies()`, `headers()` wajib di-`await`. Di Next.js 16 middleware bernama `proxy.ts`; cek file mana yang dipakai repo sebelum mengubah.
- **Domain di `modules/<domain>/`** (`domain`, `application`, `infrastructure`, `presentation`, `queries`, `validations`), sesuai ADR-001 (DDD) dan ADR-002 (Clean Architecture). Kode fitur tetap di modul domainnya, bukan di folder global. Logika Falak berada di `modules/falak/`, terpisah dari UI: deterministik, unit eksplisit, asumsi eksplisit.
- **Auth:** satu mekanisme saja (Better-Auth). Otorisasi wajib di server: autentikasi → otorisasi → validasi → eksekusi. UI bukan penjaga akses (ADR-004).
- **Data:** Prisma client singleton, baca schema dulu, `select`/`include` tepat, transaction untuk operasi terkait.

## P3 — Kualitas
- **Validasi input dengan Zod** di server (ADR-009); error ditangani dengan sengaja, bukan `catch` kosong.
- **Form:** label, pesan error jelas, state pending, aksesibel. **Aksesibilitas:** HTML semantik (`<button>`, bukan `<div>`), fokus keyboard, kontras AA, alt text.
- **UI:** ikuti design system dan skill Glassmorphism (token `globals.css`, `.glass`, tanpa AI slop). Untuk situs publik, `PRODUCT.md` → `DESIGN.md` → `app/globals.css` lebih tinggi daripada dokumen lain di `docs/08-design-system/`. Animasi bermakna, memakai token `lib/ease.ts`, dan menghormati `prefers-reduced-motion`.
- **Gambar:** `next/image` dengan dimensi dan alt yang tepat.
- **Dependensi:** cek yang sudah ada dan kemampuan native dulu.
- **Test (Vitest):** hanya jika diminta; untuk logika Falak, usulkan di proposal.
- **Dokumentasi:** perbarui hanya jika perubahan mengubah arsitektur, skema, navigasi, atau perilaku domain.

## P4 — Validasi & Laporan
Jalankan lewat script proyek, jangan memakai binary global (ESLint global di sistem usang dan tidak bisa membaca flat config):

```
npm run typecheck   # tsc --noEmit
npm run lint        # eslint . (flat config)
npm run test        # vitest run
npm run build       # prisma generate && next build
```

Jalankan hanya yang relevan; untuk perubahan besar jalankan semuanya. Bedakan error lama dari error baru. Perbaiki akar masalah, bukan gejala.

Format laporan (jangan klaim cek lulus jika tidak dijalankan):

```
### Changed
- path — ringkasan
### Validation
- TypeScript / ESLint / Tests / Build: hasil, atau "tidak dijalankan"
### Notes
- sisa masalah, jika ada
```

---

## Issue & Domain
Issue berupa file markdown di `.scratch/` (`docs/agents/issue-tracker.md`). Label triage: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix` (`docs/agents/triage-labels.md`). Domain: `CONTEXT.md` dan `docs/05-decisions/` (`docs/agents/domain.md`).

**Cek diri:** "Apakah saya mengerjakan yang proyek butuhkan, atau yang saya kira dibutuhkan?" Jika ragu: berhenti, inspeksi, cari docs.