# AGENT GUIDELINES

- **Project:** LIM Digital Platform
- **Organization:** Lembaga Ittihadul Muballighin (LIM) — Pondok Pesantren Lirboyo
- **Version:** 1.1
- **Status:** Mandatory
- **File:** `AGENTS.md` (root)
- **Audience:** AI Coding Agents (Cursor, Copilot, Claude, opencode) & Human Developers

> This file is the **first source of truth** for any agent working in this repository.
> Read it fully before writing, editing, or deleting any code.
> If a request conflicts with this document, **stop and ask** — do not improvise.

---

## 📑 Table of Contents
1. [Prime Directive](#1-prime-directive)
2. [Project Context](#2-project-context)
3. [Locked Tech Stack](#3-locked-tech-stack)
4. [Commands](#4-commands)
5. [Architecture Rules (DDD)](#5-architecture-rules-ddd)
6. [Coding Standards](#6-coding-standards)
7. [Database Rules](#7-database-rules)
8. [Auth & Authorization](#8-auth--authorization)
9. [Security Non-Negotiables](#9-security-non-negotiables)
10. [UI & Styling Rules](#10-ui--styling-rules)
11. [Testing Requirements](#11-testing-requirements)
12. [Known Pitfalls (Learned the Hard Way)](#12-known-pitfalls-learned-the-hard-way)
13. [Workflow Expectations](#13-workflow-expectations)
14. [Hard Bans](#14-hard-bans)
15. [Documentation Map](#15-documentation-map)

---

## 1. Prime Directive

You are working on a **production system for a real Islamic organization**. Data includes personal identities, official letters, financial honorarium status, and institutional records.

Priority order — never invert:
1. **Correctness & Security**
2. **Data Integrity**
3. **Maintainability**
4. **Performance**
5. **Developer convenience**

Rules of engagement:
- **Never invent** business rules. Organization rules come from PKO MUNAS II 2025 and the docs folder.
- **Never guess** field names, roles, or enum values. Read `prisma/schema.prisma` first.
- **Small, surgical diffs.** Do not refactor unrelated files.
- If uncertain → **ask**, do not fabricate.
- No placeholder/slop code (`// TODO: implement later`) in critical paths.

---

## 2. Project Context

LIM Digital Platform is an integrated organizational platform covering:

| Domain | Purpose |
|--------|---------|
| Authentication & Authorization | Personal + Organizational accounts, 15 roles |
| Kepengurusan | Periode khidmat, unit organisasi, bidang, jabatan, penugasan struktural |
| Persuratan (Letter) | Dynamic numbering, approval flow, QR verification |
| Wajib Khidmah | Guru bantu placement, weekly reports, cross-check, mediation |
| Safari Ramadan | Titik safari, delegasi, daily journals, sidak |
| Pesantren Ramadan | Sekolah mitra, bank materi, pengajar reports |
| Digital Falak | Prayer times (Tashilul Amtsilah), awal bulan determination |
| CMS & Dakwah Digital | Articles, webinars, podcasts, events |
| Daerah Binaan | Monthly reports from underdeveloped regions |

**Two account models coexist:**
- `PERSONAL` — one human, one account.
- `ORGANIZATIONAL` — one shared account per organization (PW/PC/Pondok/Lembaga). Every mutation from this account **must** record `namaPengisi` and `jabatanPengisi`.

**Special flow — LEMBAGA_EKSTERNAL:**
Public form (no login) → `DIAJUKAN` → approved by pusat → account auto-created with role `LEMBAGA_EKSTERNAL` → can submit reports & feedback.

---

## 3. Locked Tech Stack

Do **not** substitute, upgrade, or add alternatives without an approved ADR.

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js | **16.x** | App Router only, Turbopack, React Compiler ON, **proxy.ts** (not middleware.ts) |
| Language | TypeScript | 5.x | `strict: true`, no `any` |
| Runtime / PM | **Bun** | 1.1+ | Use `bun` / `bunx`, not npm/pnpm/yarn |
| ORM | **Prisma** | **6.x (pinned)** | ⚠️ NOT 7, NOT 8 — see §12 |
| Database | PostgreSQL (Neon) | Serverless | Branching per environment |
| Auth | Better Auth | latest | Prisma adapter, custom RBAC |
| Validation | Zod | latest | Mandatory on every input |
| Styling | Tailwind CSS | **v4** | CSS-first, no `tailwind.config.ts` |
| UI | shadcn/ui | latest | Do not hand-edit `components/ui/*` |
| Animation | Framer Motion | v12 | Sparingly, purposeful only |
| Icons | lucide-react | latest | — |
| Tests | Vitest + Playwright | latest | — |
| Storage | Cloudflare R2 / S3 | — | Private bucket + presigned URL |

---

## 4. Commands

```bash
# Development
bun run dev                  # Next.js dev server (Turbopack)
bun run lint                 # ESLint
bun run typecheck            # tsc --noEmit
bun run format               # Prettier

# Database (ALWAYS pin Prisma 6)
bunx prisma@6 generate       # Generate client → generated/client
bunx prisma@6 validate       # Validate schema without touching DB
bunx prisma@6 format         # Format schema.prisma
bunx prisma@6 db push        # Sync schema (development only)
bunx prisma@6 studio         # Visual DB browser
bun run db:seed              # Idempotent seed
bunx prisma@6 migrate dev --name <name>    # Create migration
bunx prisma@6 migrate deploy               # Apply migrations (production)

# Testing
bun run test
bun run test:watch
bun run test:coverage
bun run test:e2e

# Production
bun run build
bun run start
````

**Before declaring any task done, run**: `bun run lint && bun run typecheck`

---

## 5. Architecture Rules (DDD)

Modular Monolith. Every business domain lives in `modules/<domain>/`:

```text
modules/<domain>/
├── domain/           # Pure entities, value objects, Zod schemas, repository interfaces
├── application/      # Use cases, orchestration, business services
├── infrastructure/   # Prisma repositories, storage, email, external APIs
└── presentation/     # Server Actions, DTOs, domain-specific components
```

### Boundary Rules (enforced)

- `domain/` must not import `@/generated/client`, `next/*`, or any framework.
- `infrastructure/` is the **only** layer importing `@/generated/client`.
- `presentation/` talks to `application/` only — never directly to Prisma.
- Cross-domain access goes through the other domain's `application/` public API, never its `infrastructure/`.

### Directory Map

```text
app/                      # Next.js App Router
├── (public)/             # Portal, falak, QR verification
├── (auth)/               # login, register, reset
├── (dashboard)/          # admin | organisasi | personal
└── api/                  # public endpoints & webhooks ONLY
modules/                  # DDD domains
components/               # ui/ (shadcn), forms/, layout/
lib/                      # prisma.ts, auth.ts, auth-client.ts, utils.ts
proxy.ts                  # Next.js 16 proxy (replaces middleware.ts)
generated/client/         # Prisma output — never edit manually
```

Import alias: always `@/*` → `./*` (project root). No deep relative chains (`../../../`).

---

## 6. Coding Standards

### TypeScript

  - `any` is banned. Use precise types, generics, or `unknown` + type guard.
  - `interface` for object shapes; `type` for unions/intersections.
  - Naming: `PascalCase` (types, components, Prisma models) · `camelCase` (functions, vars, fields) · `UPPER_SNAKE_CASE` (constants, enum values).

### React / Next.js 16

  - Server Components by default. Add `'use client'` only when browser interactivity is required.
  - React Compiler is active → never write `useMemo`, `useCallback`, `React.memo` manually.
  - `params`, `searchParams`, `cookies()`, `headers()` are **Promises** → always `await`.
  - Use `<Suspense>` for async boundaries; no manual loading-flag spaghetti.
  - **Proxy (not middleware)**: Route protection and request interception use `proxy.ts` (Next.js 16), not `middleware.ts` (Next.js 15).

### Server Actions — The Golden Flow

Every mutation follows this exact order:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { letterSchema } from '@/modules/letter/domain'
import { createLetter } from '@/modules/letter/application'

export async function createLetterAction(formData: FormData) {
  // 1. VALIDATE (Zod) — never trust the client
  const parsed = letterSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  // 2. AUTHENTICATE
  const session = await getSession()
  if (!session) return { success: false, error: 'Unauthorized' }

  // 3. AUTHORIZE (role + scope) — server-side, never UI-only
  //    see docs/backend/RBAC_MATRIX.md

  // 4. BUSINESS LOGIC (application layer)
  const result = await createLetter(parsed.data, session.user.id)

  // 5. REVALIDATE
  revalidatePath('/dashboard/letters')

  return { success: true, data: result }
}
```

### Response Contract

```typescript
type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}
```

Never return raw Prisma objects containing sensitive fields (`password`, tokens).

### Error Handling

- No silent `catch {}`.
- Log with context: `console.error('[createLetterAction]', error`).
- Map Prisma errors to safe user-facing messages; never leak SQL or stack traces to the client.

---

## 7. Database Rules

  - Prisma Client output: generated/client (root). Import only from @/generated/client.
  - Primary key: id String @id @default(cuid()).
  - Every model: createdAt, updatedAt. Business entities add createdById, updatedById, deletedAt.
  - Soft delete (deletedAt) for business entities: Letter, User, Penugasan, Article.
  - Hard delete (onDelete: Cascade) for child/lookup/join tables.
  - Enums: one value per line. Inline enums are a parse error.
  - Every relation must be bidirectional. A @relation without its opposite field fails validation.
  - Many-to-many must use an explicit join table (never implicit Model[] ↔ Model[]).
  - Index every foreign key, filter field, sort field, slug, email, and letter number.
  - Avoid N+1: use include / select, never query inside a loop.
  - Counters (letter numbering) require $transaction with isolationLevel: 'Serializable'.
  - Letter numbers are generated only on transition to SENT, and reset per PeriodeKhidmat — not per calendar year.
  - Production schema changes go through migrate deploy. Never db push to production.

---

## 8. Auth & Authorization

### 15 Roles (final — do not add/remove without ADR)

**Pusat (6)**: `OWNER`, `ADMIN_SEKRETARIAT`, `TIM_WAJIB_KHIDMAH`, `CONTENT_MANAGER`, `ADMIN_BIDANG_SAFARI`, `ADMIN_BIDANG_PESANTREN_RAMADAN`

**Wilayah/Cabang (2)**: `PW`, `PC`

**Operasional — temporary per event (3)**: `PANITIA_SAFARI_DAERAH`, `DELEGASI_SAFARI_DAERAH`, `PENGAJAR_PESANTREN_RAMADAN`

**Pendidikan/Lembaga (3)**: `GURU_BANTU`, `LEMBAGA_EKSTERNAL`, `PONDOK_INTERNAL`

>`PONDOK_INTERNAL` sub-types (Unit HMC, P3HM, Lirboyo IV Cabang Bakung, etc. — 20+ each) live in `UnitOrganisasi.subKategori`, not as roles.
`DOSEN` was removed — lecturers submit via spreadsheet import.

### Authorization Rules

  - Effective permission = `role` + active `PenugasanStruktural` + active `PeriodeKhidmat`.
  - Row-Level Security is mandatory. PC Surabaya must never read PC Malang data. Scope every query by the caller's organization.
  - Proxy (`proxy.ts`) protects routes; **Server Actions re-check authorization independently**. UI hiding is not security.
  - MFA required for `OWNER`, `ADMIN_SEKRETARIAT`, `ADMIN_BIDANG_*`.
  - Full matrix: `docs/backend/06.RBAC.md`.

---

## 9. Security Non-Negotiables

  - Zod validation on **every** Server Action and API route. No exceptions.
  - No `$queryRawUnsafe`. No string concatenation/interpolation into SQL. Tagged `$queryRaw `only when unavoidable.
  - Rich text sanitized with DOMPurify before persist/render.
  - Uploads: validate MIME + size server-side (5MB PDF, 2MB image), random filename, private bucket, presigned URL (1h).
  - Secrets never prefixed `NEXT_PUBLIC_`. Never logged. Never committed.
  - Audit log required for: login/logout, letter → `SENT`, penugasan → `DICABUT`/`SELESAI`, deletes, role changes, `ACCESS_DENIED`.

  ---

  ## 10. UI & Styling Rules

  - Tailwind &&v4 CSS-first**: tokens in `app/globals.css` via `@theme`. **No** `tailwind.config.ts`.
  - Design language: **"Tenang Modern"** — earth-tone/terracotta, calm surfaces, low eye strain for long dashboard sessions.
  - Admin and public share the same token world; `--admin-*` are aliases of global tokens.
  - Use `shadcn/ui` primitives. Do not hand-edit `components/ui/*`; extend via wrappers.
  - Framer Motion for purposeful transitions only — no decorative animation noise.
  - Responsive across mobile, tablet, laptop, desktop. Mobile-first.
  - Accessibility: WCAG 2.1 AA contrast, keyboard reachable, visible focus, correct `aria-*`.
  - No hardcoded user-facing strings that belong in config; no hardcoded roles or `levelCode`.

  ---

## 11. Testing Requirements

| Priority | Scope                                                                                         |
| -------- | --------------------------------------------------------------------------------------------- |
| 🔴 P1    | Letter numbering (format + race condition), RBAC isolation, WK cross-check, Falak calculation |
| 🟡 P2    | Zod schemas, Server Action happy/error paths, organizational \`namaPengisi\` enforcement      |
| 🟢 P3    | Helper utilities; UI covered by E2E only                                                      |

Coverage targets: `domain/` 90%+ · `application/` 80%+ · `infrastructure/` 70%+ · `presentation/` 60%+.

Rules: colocate `*.test.ts` beside source · AAA pattern · descriptive test names · independent tests · never run tests against production data.

---

## 12. Known Pitfalls (Learned the Hard Way)

These caused real failures in this repo. Do not repeat them.

| Symptom                                                     | Root Cause                                                                                            | Correct Action                                            |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `No command registered for 'generate'`                    | `prisma@latest` resolved to Prisma 8 RC (new platform CLI, no `generate`/`migrate`/`db push`) | Pin **`prisma@6`** and **`@prisma/client@6`** |
| `definePrismaConfig is not a function`                    | Leftover `prisma.config.ts` from a Prisma 8 attempt                                                 | Delete `prisma.config.ts`                               |
| `P1012: datasource property 'url' is no longer supported` | Prisma 7+ moved connection URL out of schema                                                          | Stay on Prisma 6; keep `url = env("DATABASE_URL")`      |
| `This line is not an enum value definition`               | Enum written inline `{ A, B, C }`                                                                   | One enum value per line                                   |
| `missing an opposite relation field`                      | One-way relation                                                                                      | Add the reverse field on the related model                |
| `bunx prisma ...` resolving wrong binary                  | Bun cache / global shim                                                                               | Pin version explicitly: `bunx prisma@6 <cmd>`           |
| `middleware.ts` not working                               | Next.js 16 uses `proxy.ts`, not `middleware.ts\`                                                   | Use `proxy.ts` for route protection                     |

### Additional guardrails:

  - Never delete `generated/client` manually — regenerate it.
  - Never assume directories exist; verify before setting Prisma `output`.
  - `db push --force-reset` destroys all data. Only on explicit user instruction, development only.

  ---

## 13. Workflow Expectations

### Branching

`feat/<scope>` · `fix/<scope>` · `refactor/<scope>` · `docs/<scope>` · `chore/<scope>` · `hotfix/<scope>`
Never push directly to main or staging.

### Commits — Conventional Commits

```
<type>(<scope>): <subject>
```

---

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `revert`

Scopes: `auth`, `letter`, `wk`, `safari`, `pesantren`, `falak`, `cms`, `dakwah`, `binaan`, `db`, `ui`

Example: `feat(letter)`: `implement race-condition safe numbering`

## Definition of Done

  - Zod validation present on every new input path
  - Authorization + organizational scope enforced server-side
  - No `any`, no `console.log`, no dead code
  - Schema changes: enums multiline, relations bidirectional, indexes added
  - `bun run lint` and `bun run typecheck` pass
  - Tests written for P1/P2 logic touched
  - Relevant doc in `docs/backend/` updated
  - Architectural decision recorded in `docs/backend/09.ADR.md`

### Communication

  - State assumptions explicitly before large changes.
  - Report what changed, which files, and why — briefly.
  - Surface risk (data loss, migration, breaking change) before acting.
---

## 14. Hard Bans

### Architecture

  - ❌ `pages/` directory
  - ❌ Prisma imported in `domain/` or `presentation/`
  - ❌ Cross-domain import of another module's `infrastructure/`
  - ❌ `middleware.ts` (Next.js 16 uses `proxy.ts`)

### Stack

  - ❌ npm / pnpm / yarn commands
  - ❌ Prisma 7 or 8
  - ❌ `tailwind.config.ts`
  - ❌ `unstable_cache` (use Cache Components)

### Code

  - ❌ `any` type
  - ❌ Manual `useMemo` / `useCallback` / `memo`
  - ❌ Un-awaited `params` / `searchParams` / `cookies()` / `headers()`
  - ❌ Silent catch blocks
  - ❌ Leftover `console.log` in production paths

### Data

  - ❌ Import from `@prisma/client`
  - ❌ Inline enums
  - ❌ One-way relations
  - ❌ Implicit many-to-many
  - ❌ Hardcoded `DATABASE_URL`, roles, or `levelCode`
  - ❌ Letter number generated before `SENT`
  - ❌ `db push` / `--force-reset` against production

### Security

  - ❌ Zod bypass
  - ❌ UI-only authorization
  - ❌ Cross-organization data access
  - ❌ Secrets in client bundle, logs, or Git
  - ❌ Sensitive files in `/public`

### Process

  - ❌ Direct push to `main` / `staging`
  - ❌ Merging with failing CI or unresolved conflicts
  - ❌ Architectural change without an ADR
  - ❌ Inventing business rules not present in docs

---

## 15. Documentation Map

Read the relevant document before implementing.

| Document                            | Covers                                               |
| ----------------------------------- | ---------------------------------------------------- |
| `docs/backend/01.TECH_STACK.md`      | Stack, DDD layering, role model, golden flow         |
| `docs/backend/02.RISMA_SCHEMA.md`   | Naming, indexing, soft delete, relations, migrations |
| `docs/backend/03.API_CONVENTIONS.md` | Action/REST contracts, pagination, revalidation      |
| `docs/backend/04.SECURITY.md`        | Auth, RBAC, validation, uploads, audit               |
| `docs/backend/05.TESTING.md`         | Priorities, patterns, coverage, CI                   |
| `docs/backend/06.RBAC.md`     | Per-role, per-module permission matrix               |
| `docs/backend/07.DEPLOYMENT.md`      | Environments, CI/CD, rollback, backup                |
| `docs/backend/08.DEVELOPMENT.md`     | Setup, git workflow, review, standards               |
| `docs/backend/09.ADR.md`             | Why decisions were made                              |
| `docs/backend/AUTH_SETUP.md`      | Better Auth config + seed data                       |
| `prisma/schema.prisma`            | Ground truth for models, fields, enums               |

**Escalation rule**: if the docs and the code disagree, report the conflict — do not silently pick one.

---
*This document is a contract, not a suggestion. Deviations require an approved ADR. When in doubt: read the schema, read the docs, then ask.*