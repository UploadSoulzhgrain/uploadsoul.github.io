#!/bin/bash

echo "===== Deployment Configuration Verification ====="

echo "\n----- Checking Critical Files -----"

# Check Vercel configuration
if [ -f "vercel.json" ]; then
  echo "✅ vercel.json exists"
  echo "Content:"
  cat vercel.json
else
  echo "❌ vercel.json is missing!"
fi

# Check build script
if [ -f "vercel-build.sh" ]; then
  echo "✅ vercel-build.sh exists"
  if [ -x "vercel-build.sh" ]; then
    echo "✅ vercel-build.sh is executable"
  else
    echo "❌ vercel-build.sh is not executable!"
    chmod +x vercel-build.sh
    echo "  → Made executable"
  fi
else
  echo "❌ vercel-build.sh is missing!"
fi

# Check SPA routing files
echo "\n----- Checking SPA Routing Files -----"

if [ -f "public/_redirects" ]; then
  echo "✅ _redirects exists"
else
  echo "❌ _redirects is missing!"
fi

if [ -f "public/vercel.json" ]; then
  echo "✅ public/vercel.json exists"
else
  echo "❌ public/vercel.json is missing!"
fi

# Check npm configuration
echo "\n----- Checking NPM Configuration -----"

if [ -f ".npmrc" ]; then
  echo "✅ .npmrc exists"
  echo "Content:"
  cat .npmrc
else
  echo "❌ .npmrc is missing!"
fi

# Check package.json
echo "\n----- Checking package.json -----"
if grep -q "deploy" package.json; then
  echo "✅ deploy script exists in package.json"
else
  echo "❌ deploy script is missing in package.json!"
fi

echo "\n===== Verification Complete ====="
