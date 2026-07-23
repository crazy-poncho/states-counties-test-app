-- Replace SERIAL integer PKs/FKs with PostgreSQL-native UUIDv7.
-- Requires PostgreSQL 18+ (uuidv7()).

DROP TABLE IF EXISTS "counties";
DROP TABLE IF EXISTS "states";

CREATE TABLE "states" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "name" TEXT NOT NULL,
    "population" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "counties" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "name" TEXT NOT NULL,
    "population" INTEGER NOT NULL,
    "state_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "counties_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "states_name_key" ON "states"("name");

CREATE INDEX "counties_state_id_idx" ON "counties"("state_id");

CREATE UNIQUE INDEX "counties_state_id_name_key" ON "counties"("state_id", "name");

ALTER TABLE "counties" ADD CONSTRAINT "counties_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;
