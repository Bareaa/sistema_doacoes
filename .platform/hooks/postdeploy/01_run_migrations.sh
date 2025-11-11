#!/bin/bash
set -e

echo "Running sequelize migrations..."
cd /var/app/current/backend

# Garante que as dependências estão instaladas
npm install --omit=dev

# Roda migrations
npx sequelize-cli db:migrate --env production || {
  echo "Migration failed, but continuing deployment..."
  exit 0
}

echo "Migrations completed successfully!"
