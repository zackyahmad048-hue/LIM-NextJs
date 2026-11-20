# API Contract — Audit Log

**Status:** Batch 4  
**Base path:** `/api/v1`  
**Tag:** `Audit`  
**Spec:** `openapi/audit.yaml`

## Endpoint
| Method | Path | Deskripsi | Auth |
|---|---|---|---|
| GET | `/audit/logs` | Daftar audit log (filter entity/action/userId, offset pagination) | OWNER/ADMIN_SEKRETARIAT, `audit:read` |

Read-only.
