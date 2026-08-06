<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview

Indonesian organizational platform ("LIM Digital Platform"): public website + admin CMS. Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Prisma 7 (PostgreSQL on Neon, driver adapters) + Better Auth. UI copy and route slugs are in Indonesian (e.g. `/profil`, `/artikel`, `/falak`).

## Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run check        # lint + typecheck — the verification gate
npm run build        # prisma generate && next build (deploy regenerates the client)
npm run format       # Prettier write
npm run format:check # Prettier check only
npm run e2e          # vitest run tests/e2e — Playwright E2E against production
npm run e2e:watch    # vitest tests/e2e (watch)

npm run prisma:generate  # Regenerate client → ../generated/client
npm run prisma:migrate   # Create & apply migration
npm run db:push          # Push schema without migration
npm run db:seed          # Run tsx prisma/seed.ts
npm run db:deploy        # prisma migrate deploy && seed (runs on every Vercel build via vercel.json)
npm run prisma:studio    # DB browser
```

## Architecture

```
app/                       # App Router
  (public)/                # Website (Indonesian routes)
  (dashboard)/admin/       # Admin CMS; layout redirects to /admin/login if no session
  (auth)/admin/            # admin/login, admin/setup (bootstrap admin)
  api/auth/                # Better Auth catch-all route
  api/v1/falak/            # Public REST routes (prayer-times, qibla, hijri-calendar, rukyat, hisab, eclipse)
modules/                   # DDD modules — each has an index.ts barrel exporting its public API
  authentication/  authorization/  cms/  dashboard/  falak/
  media/  program/  secretariat/  settings/  shared/
  # domain/          entities + repository interfaces
  # infrastructure/  Prisma repository impls
  # application/     services (business rules)
  # presentation/    server actions (*.action.ts)
  # queries/         read-model queries (delegate to repositories)
  # validations/     zod schemas
components/                # ui/ (shadcn primitives), admin/, website/, motion/
config/                    # app, site, navigation, roles, permissions, hero, feature
actions/                   # create-admin.ts
prisma/                    # schema.prisma, migrations, seed.ts
generated/client/          # Auto-generated Prisma client (gitignored)
docs/                      # Master docs (Indonesian); docs/README.md is the map
```

## Key Conventions

- **Import alias**: `@/*` → project root
- **Prisma client**: Prisma 7 (`provider = "prisma-client"`) emits to `../generated` — import from `@/generated/client`
- **Single PrismaClient**: instantiated in `modules/shared/infrastructure/prisma.ts` with the `PrismaNeon` driver adapter. The schema has NO `url` — adapters supply the connection. Never create another `PrismaClient`.
- **Data access**: Prisma is only touched in `infrastructure/` repositories; `presentation/*.action.ts` → `application/` services + `queries/`, which delegate to repositories. Business rules live in services.
- **Auth**: Better Auth (`modules/authentication/infrastructure/better-auth.ts`); check sessions with `getSession()` from `session.helper.ts`. `requireSession()` throws `"UNAUTHORIZED"` if missing.
- **shadcn/ui**: `radix-maia` style (components.json), Tailwind v4 via PostCSS plugin
- **UI**: Server Components by default; `"use client"` only for interactivity
- **Dark mode**: Tailwind `class` strategy via `next-themes`
- **Docs-first**: `docs/` is the approved source of truth (architecture, business rules, DB). Read the relevant spec before major feature work; keep docs in Indonesian.

## Gotchas

- `generated/` is gitignored — run `npm run prisma:generate` (or `npm install`, which postinstalls it) after a fresh clone or schema change
- `build` runs `prisma generate` first; Vercel deploys depend on it
- `.env.example` is stale: it shows a SQLite `file:...` URL, but the schema is PostgreSQL/Neon. Set a real Neon `DATABASE_URL` in `.env`
- Neon driver needs `ws` — `neonConfig.webSocketConstructor = ws` is already wired in `prisma.ts`
- `tailwind.config.ts` AND `postcss.config.mjs` both exist (Tailwind v4 uses the PostCSS plugin)
- No `.prettierrc` (Prettier defaults); vitest + Playwright (E2E in `tests/e2e/`, `npm run e2e`); husky/commitlint/lint-staged installed but unconfigured (no hooks)
- ESLint ignores `.next/`, `out/`, `build/`, `next-env.d.ts`
- `docs/` describes 14 domains, but only the modules above are implemented — organization, knowledge, certificate, notification are spec/roadmap-only (letter lives in `modules/secretariat`)

## Agent skills

### Issue tracker

Issues and PRDs live as GitHub issues on this repo (via the `gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. Read `CONTEXT.md` (root) and ADRs in `docs/05-decisions/` before exploring. See `docs/agents/domain.md`.
