#!/bin/sh
set -e

echo "⏳ Waiting for database..."
until nc -z db 5432; do
  sleep 1
done

echo "✅ Database available. Applying `prisma db push`..."
npx prisma db push

echo "🚀 Starting application"
exec npm run serve