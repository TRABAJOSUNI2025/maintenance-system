#!/bin/sh
set -e

# Establecer DATABASE_URL por defecto si no está configurada
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL not set. Using default PostgreSQL connection."
  export DATABASE_URL="postgresql://user:password@postgres:5432/maintenance_db"
fi

echo "Generating Prisma client..."
npx prisma generate

echo "Attempting to run database migrations..."
# Intentar migraciones, pero no fallar si la BD no está disponible
npx prisma migrate deploy || echo "WARNING: Could not run migrations. Database may not be available yet."

echo "Starting application..."
npm start
