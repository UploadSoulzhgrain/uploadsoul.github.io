#!/bin/bash

# Echo environment diagnostics
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Checking for pnpm..."
if command -v pnpm &> /dev/null; then
    echo "PNPM version: $(pnpm -v)"
else
    echo "PNPM not found, installing..."
    npm install -g pnpm@8.10.2
    echo "PNPM installed: $(pnpm -v)"
fi

# Show directory content
echo "\nDirectory contents:"
ls -la

# Check package.json
echo "\nPackage.json contents:"
cat package.json

# Run the build with verbose logging
echo "\nStarting build process..."
NODE_OPTIONS="--max-old-space-size=4096" pnpm install --no-frozen-lockfile
pnpm run build

# Check build output
echo "\nBuild complete, checking dist folder:"
ls -la dist

echo "\nBuild process completed successfully!"
