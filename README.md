# States & Counties App

Full-stack app for browsing US states and their counties.

## Stack

- **Frontend:** React, TypeScript, Vite, TanStack Query, MUI (Nginx in Docker)
- **Backend:** Node.js 22.15.0, Express, TypeScript, Prisma
- **Database:** PostgreSQL 18+ (native `uuidv7()` primary keys)
- **Runtime:** Docker Compose

Use Node **22.15.0** locally (see `.nvmrc`; `nvm use` / `fnm use`).

See `AGENTS.md` for project-wide conventions (including UUIDv7 IDs).

## Project layout

```
.
├── backend/                 # Express API + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   ├── data/            # USA-states.json + states/*.json
│   │   └── migrations/      # Versioned DB schema changes
│   └── src/
├── frontend/                # React + Vite SPA
│   ├── src/
│   ├── nginx.conf           # Serves SPA + proxies API to backend
│   └── Dockerfile
└── docker-compose.yml       # Postgres + backend + frontend
```

## Data model

- **IDs:** PostgreSQL UUIDv7 (`uuidv7()`) for all PKs/FKs — not serial integers
- **State** — `name` (unique), `population`
- **County** — `name`, `population`, belongs to one **State** (`state_id`)
- County names are unique within a state
- Deleting a state cascades to its counties
- County count in API responses is derived from related records
- Seed data lives in `backend/prisma/data/` (`USA-states.json` + `states/<State>.json`)

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

- App (Nginx): http://localhost:8080
- API: http://localhost:3000

In Docker, Nginx serves the SPA and proxies `/health`, `/states`, and `/state/*` to the backend.

Migrations run automatically on backend startup (`prisma migrate deploy`).

> If you previously ran an older Postgres image from this compose file, recreate the volume once:
> `docker compose down -v && docker compose up --build`
>
> Postgres 18 mounts data at `/var/lib/postgresql` (not `/var/lib/postgresql/data`).

## Local development

```bash
# Env for Prisma / backend (DATABASE_URL, etc.)
cp backend/.env.example backend/.env

# Start Postgres only
docker compose up db -d

# Backend deps + Prisma client
cd backend && npm install && npx prisma generate

# Apply migrations (reads DATABASE_URL from backend/.env)
npx prisma migrate deploy

# Seed states + counties from backend/prisma/data/
npm run prisma:seed

# Backend (hot reload) — from repo root
npm run dev:backend

# Frontend (Vite) — from repo root; proxies API to :3000
cd frontend && npm install
npm run dev:frontend
```

Optional: pass another data directory with the same layout (`USA-states.json` + `states/`):

```bash
npm run prisma:seed -- /path/to/data
```

From the repo root: `npm run prisma:seed`.

## Schema changes

After editing `backend/prisma/schema.prisma`:

```bash
cd backend
npx prisma migrate dev --name describe_your_change
```

That creates a new migration under `prisma/migrations/` and applies it locally.
