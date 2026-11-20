# API Contract — Modul Digital Falak

**Status:** Batch 3  
**Base path:** `/api/v1`  
**Tag:** `Falak`  
**Spec:** `openapi/falak.yaml`

## Endpoint
| Method | Path | Deskripsi | Auth |
|---|---|---|---|
| GET | `/falak/jadwal` | Jadwal shalat (publik). `?tanggal=...` → satu/null, atau `?from&to` → daftar | publik |
| POST | `/falak/jadwal/generate` | Generate/upsert jadwal (Idempotency-Key) | OWNER, `falak:write` |
| GET | `/falak/config` | Konfigurasi falak aktif | publik |

`shortcut:` endpoint penetapan awal bulan belum diekspos; fokus jadwal shalat & konfigurasi.
