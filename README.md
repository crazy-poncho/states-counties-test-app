# States & Counties App

Full-stack app for browsing US states and their counties. Backend is ready; frontend can be added later under `frontend/`.

## Stack

- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** PostgreSQL 18+ (native `uuidv7()` primary keys)
- **Runtime:** Docker Compose

See `AGENTS.md` for project-wide conventions (including UUIDv7 IDs).

## Project layout

```
.
├── backend/                 # Express API + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/      # Versioned DB schema changes
│   └── src/
├── docker-compose.yml       # Postgres + backend
└── frontend/                # (planned)
```

## Data model

- **IDs:** PostgreSQL UUIDv7 (`uuidv7()`) for all PKs/FKs — not serial integers
- **State** — `name` (unique), `population`
- **County** — `name`, `population`, belongs to one **State** (`state_id`)
- County names are unique within a state
- Deleting a state cascades to its counties
- County count in API responses is derived from related records (ready for JSON seeding later)

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/states` | List all states |
| `GET` | `/state/:name` | State detail (includes counties) |

### Example list item

```json
{
  "state": "Alabama",
  "population": 4833722,
  "counties": 67,
  "detail": "http://localhost:3000/state/Alabama"
}
```

### Example detail

```json
{
  "state": "Alabama",
  "population": 4833722,
  "counties": 67,
  "detail": "http://localhost:3000/state/Alabama",
  "countyList": [
    { "county": "Autauga County", "population": 54571 }
  ]
}
```

## Run with Docker (recommended)

```bash
cp .env.example .env
docker compose up --build
```

API: http://localhost:3000

Migrations run automatically on backend startup (`prisma migrate deploy`).

> If you previously ran an older Postgres image from this compose file, recreate the volume once:
> `docker compose down -v && docker compose up --build`
>
> Postgres 18 mounts data at `/var/lib/postgresql` (not `/var/lib/postgresql/data`).

## Local development

```bash
# Start Postgres only
docker compose up db -d

# Backend deps + Prisma client
cd backend && npm install && npx prisma generate

# Apply migrations
npx prisma migrate deploy

# Dev server (hot reload)
npm run dev
```

## Schema changes

After editing `backend/prisma/schema.prisma`:

```bash
cd backend
npx prisma migrate dev --name describe_your_change
```

That creates a new migration under `prisma/migrations/` and applies it locally.
