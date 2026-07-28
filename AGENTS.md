<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview

Indonesian organizational website with admin CMS. Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Prisma (PostgreSQL on Neon) + Better Auth.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run check        # lint + typecheck (run before commits)
npm run format       # Prettier write
npm run format:check # Prettier check only

# Prisma (run after schema changes)
npm run prisma:generate  # Regenerate client → ../generated/client
npm run prisma:migrate   # Create & apply migration
npm run db:push          # Push schema without migration
npm run db:seed          # Run tsx prisma/seed.ts
```

## Architecture

```
app/                    # Next.js App Router pages
  (auth)/               # Auth routes (login, register)
  (dashboard)/admin/    # Admin CMS (protected by session check)
  (public)/             # Public website pages
  api/auth/             # Better Auth API catch-all route
modules/                # Domain modules (DDD-style)
  authentication/       # Login, register, session, Better Auth config
  authorization/        # Roles & permissions
  cms/                  # Posts, categories, media, hero content
  dashboard/            # Dashboard queries
  media/                # Media repository
  settings/             # Settings repository
  shared/               # Prisma client, base entities, utilities
components/
  ui/                   # shadcn/ui primitives (radix-maia style)
  admin/                # Admin layout, sidebar, data-table, nav
  website/              # Public site components (hero, navbar, footer)
  motion/               # Animation components (motion library)
config/                 # App config, navigation, roles, permissions
actions/                # Server actions (create-admin)
prisma/                 # schema.prisma, migrations, seed.ts
generated/client/       # Auto-generated Prisma client (do not edit)
```

## Key Conventions

- **Import alias**: `@/*` → project root (e.g., `@/modules/...`, `@/components/...`)
- **Prisma client**: Import from `@/generated/client` (custom output path in schema)
- **Module structure**: Each module has `domain/`, `infrastructure/`, `application/`, `presentation/` layers
- **shadcn/ui**: Uses `radix-maia` style, components in `components/ui/`, configured in `components.json`
- **Auth**: Better Auth with Prisma adapter, session checked in admin layout via `getSession()`
- **Database**: PostgreSQL (Neon). `.env` contains `DATABASE_URL` — never commit secrets
- **Dark mode**: Tailwind `class` strategy, toggled via `next-themes`
- **UI**: Prefer Server Components. Use `"use client"` only when needed (interactivity, hooks)

## Gotchas

- Prisma generates to `../generated/client` (not default location) — always import from `@/generated/client`
- Admin routes redirect to `/admin/login` if no session — test auth flows carefully
- `tailwind.config.ts` and `postcss.config.mjs` both exist — Tailwind v4 uses PostCSS plugin
- ESLint ignores `.next/`, `out/`, `build/`, `next-env.d.ts`
- No `.prettierrc` — Prettier uses defaults
