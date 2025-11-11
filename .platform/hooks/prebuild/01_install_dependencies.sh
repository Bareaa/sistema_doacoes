#!/bin/bash
set -e

echo "Using Node version:"
node -v
npm -v

echo "Installing backend dependencies..."
cd /var/app/staging/backend
npm ci --omit=dev

echo "Installing frontend dependencies..."
cd /var/app/staging/frontend
npm install

echo "Building frontend..."
npm run build

echo "✅ Dependencies installed and frontend built successfully!"
