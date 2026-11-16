# Module: cms

Domain-Driven Design module. See `docs/backend/01.TECH_STACK.md` §2 and `docs/backend/08.DEVELOPMENT.md` §8.

## Layers
- `domain/` — pure entities, value objects, Zod schemas, repository interfaces. No framework imports.
- `application/` — use cases / orchestration.
- `infrastructure/` — Prisma repositories, storage, external APIs. Only layer importing `@/generated/client`.
- `presentation/` — Server Actions (`actions/`), queries (`queries/`), domain components.

## Status
Scaffold only. Business logic to be implemented per `docs/backend/`.
