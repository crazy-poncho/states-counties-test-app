#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding database if empty..."
npx tsx prisma/seed.ts

echo "Starting backend..."
exec "$@"
