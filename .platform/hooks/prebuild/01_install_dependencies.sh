#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd /var/app/staging/backend
npm install --omit=dev

echo "Installing frontend dependencies..."
cd /var/app/staging/frontend
npm install --production=false

echo "Building frontend..."
npm run build

echo "Dependencies installed and frontend built successfully!"
