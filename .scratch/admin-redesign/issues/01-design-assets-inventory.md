# 01 — Inventaris aset desain yang membatasi permukaan admin

Type: research
Status: resolved
Blocked by: -

## Question

Dokumen mana yang saat ini mengatur/membatasi permukaan (surface) admin, dan aturan spesifik apa yang akan **berbenturan** bila sitem permukaan baru mengurangi jumlah kartu (stat grid dibatasi, daftar-dalam-kartu → divider-row, kartu hanya untuk form/tabel)?

Petakan satu per satu dan beri status per dokumen:

- `docs/08-design-system/*` — terutama `components.md` (Admin CMS Shell primitives), `theme.md` (glass tokens), `layout.md` (PageContainer full-width), `tables.md`, `forms.md`, `typography.md`, `colors.md`, `motion.md`, `navigation.md`, `accessibility.md`, `responsive.md`.
- `DESIGN.md` — klausa bahwa admin "ikut token keluarga yang sama" dengan public site.
- `docs/07-specifications/prd-admin-dashboard-refactor.md` — aturan surface yang "Completed" tapi font-nya sudah superseded.
- `docs/01-domains/03-dashboard/*` — README, ui.md (Header→Statistics→Quick Access→Recent→Announcements), permissions.md, roadmap.md.
- `.scratch/*` — status staleness (kaca-kristal-glass-overhaul, tema-swipe-skiper-ui, dsb.) yang relevan ke admin.
- `app/globals.css` — blok token `--admin-*` dan kelas `.admin`.

Keluaran: daftar per dokumen — (1) aturan yang relevan bagi sistem permukaan admin, (2) status bentrokan dengan arah "kurangi kartu" (bentrok / netral / mendukung), (3) revisi minimum yang disarankan.

## Answer

Hasil lengkap: `.scratch/admin-redesign/research/01-design-assets-inventory.md` (branch `research/admin-design-assets`).

Intisari:
- **Bentrokan terbesar**: `prd-admin-dashboard-refactor.md` (Status Completed) memprreskripsikan Welcome Card + Module Grid (1→2→4 solid cards) + 4 MiniStat + AC-06 hover-lift; font Bebas Neue/Lato-nya **sudah superseded** oleh Fraunces/Inter. Revisi minimal: tandai font superseded + klausa "superseded by calm-surfaces spec" pada preskripsi kartu.
- `docs/01-domains/03-dashboard/ui.md` memaksa urutan Header→Statistics→Quick Access→Recent→Announcements dan "Statistics Card = 5 totals" — bentrok dengan cap stat grid. Komposisi jadi kepemilikan spec; urutan jadi contoh, bukan mandate.
- `README.md` + `permissions.md` memakai bahasa "kartu statistik" dalam taksonomi fitur — revisi ke istilah surface-neutral; slug permission tak berubah.
- `components.md` §Cards membingkai "Statistics" sebagai usage kartu & StatCard/MiniStat "di dalam kartu lain" — pisahkan jadi surface-neutral (boleh render divider-row). §SectionCard `rounded-2xl`-nya kontradiksi kode+`theme.md` (`rounded-xl`).
- **Mendukung**: `theme.md` (data padat wajib solid → mendukung lebih sedikit kartu translusen), `colors.md`/`DESIGN.md` (keluarga Oranye LIM tetap), `tables.md`/`forms.md` (kartu tetap untuk form & tabel), `globals.css` `--admin-*` + `.admin` tak tersentuh, `layout.md` full-width selaras rows.
- **Dokumen stale**: PRD font Bebas/Lato; `.scratch/kaca-kristal-glass-overhaul/spec.md`; `components.md`/`spacing.md` radius kontradiktif; `motion.md` cross-fade superseded oleh tema-swipe-skiper-ui (admin out-of-scope sana); drift `layout.tsx:58-59` max-w-7xl vs `layout.md` unbounded.