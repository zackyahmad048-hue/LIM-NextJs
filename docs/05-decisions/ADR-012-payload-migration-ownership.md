# ADR-012: Kepemilikan Skema Database Payload CMS

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Accepted

**Date:** 2026-09-29

---

# Context

LIM memakai **dua** tool untuk satu database PostgreSQL (Neon):

- **Prisma 7** — mengelola model domain aplikasi (User, Role, Program, OutgoingMail, Falak, dan seterusnya). Migrasinya ada di `prisma/migrations/`.
- **Payload CMS 3.90** — mengelola konten dan data operasional lewat 29 collection + 2 global. Migrasinya ada di `migrations/` (drizzle), dijalankan lewat `payload migrate`.

Keduanya menulis ke database yang sama, dan sebelumnya **kedua tool mendeklarasikan tabel yang sama**.

`prisma/schema.prisma` mendeklarasikan 46 model `payload_*` dan 6 model array (`bb`, `bb_members`, `jsp`, `rb`, `rb_members`, `twk`) — 52 deklarasi dari tabel yang sebenarnya dibuat oleh drizzle, bukan Prisma. Bukti:

- `grep 'CREATE TABLE "payload_'` di `prisma/migrations/` menghasilkan **nol hasil**. Tabel-tabel itu dibuat oleh `migrations/*.ts` (drizzle).
- `payload_migrations` mencatat 25 migrasi yang sudah diterapkan — semua dari drizzle.
- **Nol** pemanggilan `prisma.payloadXxx` di seluruh repo. Model-model itu tidak pernah dipakai.

Bahaya: `prisma migrate dev` akan melihat 52 tabel itu "dimiliki" Prisma dan bisa menghasilkan migration yang **DROP** tabel produksi. itu milik Payload, berisi data produksi (`payload_media` 54 baris, `payload_units` 132, `payload_outgoing_mails` 22, `payload_wajib_khidmah_lembagas` 5, `payload_pages` 7, `payload_users` 4).

# Decision

**Prisma dan Payload masing-masing memiliki schema yang terpisah dan tidak tumpang tindih.**

| Tool | Kepemilikan | Lokasi migrasi |
| --- | --- | --- |
| Prisma | 36 model domain aplikasi | `prisma/migrations/` |
| Payload (drizzle) | 29 collection + 2 global | `migrations/` (root) |

Semua deklarasi `payload_*` dan keenam model array dihapus dari `prisma/schema.prisma`. Prisma sekarang hanya mendeklarasikan tabel yang benar-benar ia buat.

**Aturan yang berlaku ke depan:**

1. Tabel `payload_*` hanya boleh diubah lewat `payload migrate:create` + `payload migrate`. **Jangan** pernah mengeditnya di `prisma/schema.prisma`.
2. Model Prisma hanya boleh diubah lewat `prisma migrate:create` + `prisma migrate deploy`.
3. `prisma migrate dev` aman sekarang karena schema Prisma tidak lagi mendeklarasikan tabel milik Payload.
4. Kedua direktori migrasi bernama sama (`migrations/` vs `prisma/migrations/`) tapi milik tool berbeda. Jangan menggabungkannya.

# Consequences

**Positif**

- Tidak ada lagi yang bisa menghasilkan `DROP TABLE payload_*`.
- `prisma generate` lebih cepat dan hasilnya lebih kecil (88 → 36 model).
- Kepemilikan schema bisa dibaca langsung dari deklarasi tool: tabel yang tidak ada di `prisma/schema.prisma` milik Payload.

**Negatif / yang perlu diperhatikan**

- Developer baru yang melihat tabel `payload_*` di database tidak akan menemukannya di `prisma/schema.prisma`. Itu memang disengaja — gunakan `payload.config.ts` + `collections/` sebagai referensi.
- `prisma migrate dev` pada database yang sudah punya 25 migrasi drizzle tetap tidak boleh destructive terhadap tabel `payload_*`. Aturan 1 di atas yang menjamin itu.

# Alternatives considered

**Biarkan 52 model tetap ada, tapi hanya pernah pakai `prisma migrate deploy`.**
Ditolak._changesnya nol, tapi landmine tetap ada untuk siapa pun yang menjalankan `migrate dev` tanpa membaca dokumen ini. Prisma tidak punya mekanisme `@@ignore` untuk model, jadi tidak ada cara besides menghapus deklarasinya.

**Pisahkan Payload ke schema PostgreSQL terpisah (`postgresAdapter({ schemaName: 'payload' })`).**
Ditolak untuk sekarang. Drizzle bisa memancarkan `SET search_path`, yang tidak kompatibel dengan mode transaksi Neon PgBouncer. Selain itu, memindahkan 25 migrasi yang sudah diterapkan ke database produksi adalah risiko yang jauh lebih besar daripada manfaat namespace-nya.

# References

- `payload.config.ts` — konfigurasi Payload, 29 collection + 2 global
- `collections/` — definisi collection
- `migrations/index.ts` — barrel 25 migrasi drizzle
- `prisma.config.ts` — konfigurasi Prisma 7
- ADR-006 — Storage Strategy
