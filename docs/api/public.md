# API Contract — Public Endpoints

**Status:** Batch 5  
**Base path:** `/api/v1`  
**Tag:** `Public`  
**Spec:** `openapi/public.yaml`

## Endpoint
| Method | Path | Deskripsi | Auth |
|---|---|---|---|
| GET | `/public/letters/verify/{slug}` | Verifikasi surat via QR/slug (data terbatas) | publik |
| GET | `/falak/jadwal`, `/falak/config` | Jadwal & konfigurasi falak | publik |
| GET | `/cms/categories`, `/cms/articles`, `/cms/articles/slug/{slug}` | Konten publik | publik |
| POST | `/dakwah/events/register` | Pendaftaran event | publik |

Semua endpoint publik memakai `security: []`, rate limit ketat, envelope standar. Tidak ada inbound webhook / realtime (out of scope).
