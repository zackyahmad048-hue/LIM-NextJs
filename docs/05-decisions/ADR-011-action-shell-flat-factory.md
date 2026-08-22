# ADR-011: Action Shell sebagai Flat Factory (`defineAction`) tanpa Port DI

**Status:** Accepted
**Date:** 2026-08-21

---

# Context

81 server action di 17 file mengulang scaffolding yang sama: cek sesi/permission, parsing input, pemetaan error, revalidasi cache ("action shell"). Terdapat 8 varian bentuk hasil dan 6 salinan `getErrorMessage` yang melakukan string-matching terhadap magic string `"UNAUTHORIZED"`/`"FORBIDDEN"`. Interface seragam dibutuhkan agar error protocol, permission gating, dan bentuk hasil hidup di satu tempat.

Tiga desain interface dibandingkan secara paralel (design-it-twice):

1. **Flat factory** — `defineAction({ permission, schema, revalidate?, handler })`, satu fungsi, tanpa instance modul.
2. **Module builder** — `createActionModule({ basePath, defaultRevalidate })` dengan default per-file.
3. **Injectable runner** — `createActionRunner({ gate?, onError?, revalidate? })` dengan port yang di-inject untuk pengujian.

# Decision

Mengadopsi **Desain A: flat factory** `defineAction`, dengan dua tambahan kecil: konstanta path revalidate per-file (bukan registry global), dan kelas dasar `ActionError` untuk error *expected*.

Pengujian dilakukan dengan **mock modul guard** (`vi.mock` pada satu path), **bukan** dependency injection. Port `gate`/`onError`/`revalidate` ala Desain C ditolak: repo ini tidak memiliki budaya DI, port `onError`/`revalidate` hanya menggantikan `vi.spyOn`/`vi.mock` bawaan Vitest, dan leverage Desain B nol di luar secretariat (program hanya punya satu path).

# Consequences

- Semua action hasil migrasi mengembalikan `ActionResult<T>` kanonik; toast sukses menjadi tanggung jawab komponen client.
- Pemanggil action berbasis id mengirim `FormData`, bukan argumen posisi.
- Bila di masa depan testing melalui seam modul terbukti tidak cukup, port `gate` adalah satu-satunya yang layak ditambahkan — jangan menambahkan port lain tanpa kebutuhan nyata.
