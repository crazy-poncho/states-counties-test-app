# Agent guidance

Conventions for humans and coding agents working in this repo.

## Identifiers (UUIDv7)

Use **PostgreSQL-native UUIDv7** for all primary keys and foreign keys across the portal (backend now, frontend/API contracts later).

### Why

- Time-sortable (better for indexes, pagination, and debugging than UUIDv4)
- Generated in the database (`uuidv7()`), so raw SQL and Prisma stay consistent
- Opaque to clients (no sequential enumeration)

### Prisma pattern

```prisma
id      String @id @default(dbgenerated("uuidv7()")) @db.Uuid
parentId String @map("parent_id") @db.Uuid
```

### SQL / migrations

- Require **PostgreSQL 18+** (built-in `uuidv7()`)
- Prefer DB defaults over app-generated IDs for persisted entities
- Do **not** use `SERIAL` / `BIGSERIAL` / autoincrement integers for entity IDs
- Do **not** use UUIDv4 (`gen_random_uuid()`) for new entity IDs unless there is a strong reason

### API / TypeScript

- Treat IDs as `string` (UUID text form)
- Never expose or rely on numeric sequential IDs

## Modules / exports

- Prefer **named exports**; do not use `export default` in our code.
- Example: `export const prisma = new PrismaClient()` / `import { prisma } from "./lib/prisma.js"`
- Default imports from third-party packages are fine when that is the package’s API.

## Stack notes

- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
- Run via Docker Compose when possible
- Schema changes go through Prisma migrations (`prisma migrate dev`)
