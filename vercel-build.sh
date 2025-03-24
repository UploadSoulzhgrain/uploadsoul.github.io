#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status
# Make sure the script is executable
chmod +x "$(dirname "$0")/vercel-build.sh"

# Create log directory
mkdir -p logs

# Function to log both to console and file
log() {
  echo "$1"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> logs/build.log
}

# Echo environment diagnostics
log "========== ENVIRONMENT DIAGNOSTICS =========="
log "Node version: $(node -v)"
log "NPM version: $(npm -v)"
log "Checking for pnpm..."

if command -v pnpm &> /dev/null; then
    log "PNPM version: $(pnpm -v)"
else
    log "PNPM not found, installing..."
    npm install -g pnpm@8.10.2 || { log "Failed to install pnpm"; exit 1; }
    log "PNPM installed: $(pnpm -v)"
fi

# Show directory content
log "\n========== DIRECTORY CONTENTS =========="
ls -la | tee -a logs/build.log

# Check package.json
log "\n========== PACKAGE.JSON CONTENTS =========="
cat package.json | tee -a logs/build.log

# Check .npmrc
log "\n========== NPMRC CONTENTS =========="
cat .npmrc | tee -a logs/build.log || log "No .npmrc file found"

# Install dependencies
log "\n========== INSTALLING DEPENDENCIES =========="
NODE_OPTIONS="--max-old-space-size=4096" pnpm install --no-frozen-lockfile || { log "Failed to install dependencies"; exit 1; }

# Use locally installed Vite
log "\n========== USING PROJECT VITE =========="
log "Vite version: $(./node_modules/.bin/vite --version || echo 'Not found')"

# Run lint
log "\n========== RUNNING LINT =========="
pnpm run lint || log "Lint failed but continuing build process"

# Run the build with verbose logging
log "\n========== STARTING BUILD PROCESS =========="
NODE_OPTIONS="--max-old-space-size=4096" pnpm run build || { log "Build failed"; exit 1; }

# Copy SPA routing files to dist
log "\n========== COPYING SPA ROUTING FILES =========="
cp -f public/_redirects dist/ || log "No _redirects file to copy"
cp -f public/vercel.json dist/ || log "No vercel.json file to copy"

# Check build output
log "\n========== BUILD OUTPUT =========="
ls -la dist | tee -a logs/build.log

log "\n========== BUILD PROCESS COMPLETED SUCCESSFULLY! =========="
