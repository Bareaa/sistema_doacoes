#!/bin/bash
set -e

echo "Using Node version:"
node -v
npm -v

echo "Installing backend dependencies..."
cd /var/app/staging/backend
npm ci --omit=dev

echo "Installing frontend dependencies (including build tools)..."
cd /var/app/staging/frontend
npm ci

echo "Building frontend with Vite..."
npx vite build

cd /var/app/staging

echo "✅ Dependencies installed and frontend built successfully!"