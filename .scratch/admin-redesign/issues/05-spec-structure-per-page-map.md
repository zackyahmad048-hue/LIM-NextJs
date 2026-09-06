# 05 — Struktur spec deliverable & peta per-halaman

Type: grilling
Status: resolved
Blocked by: 03, 04

## Question

Bagaimana **spec destinasi** disusun agar bisa dilacak (verifiable) dan siap di-handoff untuk diimplementasi?

- **Struktur dokumen spec**: bagian-bagian apa saja (sistem permukaan, peta per-halaman, kebijakan konsistensi, kriteria penerimaan, urutan implementasi?).
- **Peta per-halaman**: taksonomi halaman (dashboard / list / form / detail / print-cetak), format entri per halaman (pola dipakai, kartu dihapus, tabel ditukar), dan cara verifikasi konsistensi (daftar periksa per halaman).
- **Kriteria "selesai/nyaman" yang terukur**: mis. maks stat per halaman, tidak ada card-in-card, target jumlah surface per viewport — supaya tenang = terukur.

Resolusi: kerangka spec destinasi (outline) sebagai artifact final map. Konfirmasi manusia diterima.

## Answer

**Lokasi & siklus hidup**: draft `.scratch/admin-redesign/spec.md` → dipromosikan ke `docs/07-specifications/spec-admin-permukaan-tenang.md` saat map selesai & disetujui.

**Outline 7 bagian**:
1. Ringkasan & prinsip tenang.
2. Sistem permukaan — kompilasi 03+04 (S1–S4, L1–L4, N1–N2, V1–V2, F1–F4, T1–T6, X1).
3. Komposisi halaman — B split master–detail; rail opsional (≥2 item); mobile rail → blok baris.
4. Peta per-halaman (65) — entri ringkas: path, tipe (6 label fungsional: dashboard/list/form/detail/print-cetak/media-arid), komposisi, permukaan sebelum→sesudah, kap stat; + catatan detail hotspot (sekretariat, falak, dashboard, program, reports, content, twk).
5. Kriteria "tenang" terukur + daftar periksa: maks 4 stat menonjol · 0 kartu-dalam-kartu · 0 kartu navigasi di area kerja · maks 2 permukaan di atas fold (tugas) / 3 (landing) · kap stat per halaman tercantum · WCAG AA.
6. Revisi dokumen terkait (research 01): ui.md, PRD admin, components.md, spacing.md radius, responsive.md, permissions.md wording, README naming; call-out drift layout.tsx max-w-7xl.
7. Urutan implementasi disarankan — tracer-bullet: 1 list + 1 form + 1 dashboard, ukur tenang (bagian 5) sebagai gate, lalu per modul hotspot → biasa.

**Kosa kata primitif** (design-system, bukan CONTEXT.md): `band`, `rail`, `stat-strip`/`stat-row`, `list-row`, `data-table`, `form-group`.

Tidak berubah: fungsi eksisting, token visual, kewajiban a11y WCAG AA.