#!/bin/sh
set -e

echo "🚀 Starting K.Kits Application..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until node -e "require('net').createConnection({host:'postgres',port:5432}).on('connect',()=>process.exit(0)).on('error',()=>process.exit(1))" 2>/dev/null; do
  sleep 1
done
echo "✅ Database is ready!"

# Run Prisma migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed!"

# Start the application
echo "🎉 Starting Next.js server..."
exec "$@"
