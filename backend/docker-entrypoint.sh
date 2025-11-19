#!/bin/sh
set -e

# Establecer DATABASE_URL por defecto si no está configurada
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL not set. Using default PostgreSQL connection."
  export DATABASE_URL="postgresql://user:password@localhost:5432/maintenance_db"
fi

echo "Generating Prisma client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
npm start
