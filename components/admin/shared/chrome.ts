/**
 * Chrome bersama admin — permukaan solid untuk bar & nav.
 *
 * Keputusan layout (tata ulang): glass hanya untuk kartu & widget konten;
 * chrome (topbar, rail sidebar, panel navigasi) wajib solid agar navigasi
 * terbaca sebagai lapisan tegas, bukan kaca transparan.
 *
 * File biasa (bukan "use client") agar aman dipakai Server Component.
 * Sumber tunggal: jangan duplikasi string kelas ini di komponen lain.
 */

/** Chrome solid topbar/nav admin. */
export const chrome =
  "border-admin-border/60 bg-admin-card-bg";