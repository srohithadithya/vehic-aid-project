#!/bin/bash

# VehicAid Expo App Fix Script
# Fixes TurboModuleRegistry errors and ensures all screens are functional

echo "🚀 Starting VehicAid Expo App Fix..."

# Navigate to booker app
cd mobile/apps/booker

# Step 1: Clear cache and dependencies
echo "📦 Clearing cache and reinstalling dependencies..."
rm -rf node_modules
rm -rf .expo
npm cache clean --force

# Step 2: Install dependencies fresh
echo "📥 Installing fresh dependencies..."
npm install

# Step 3: Prebuild for Android
echo "🔨 Prebuilding Android..."
npx expo prebuild --clean

# Step 4: Start Expo server with cache cleared
echo "✨ Starting Expo dev server..."
npx expo start --clear

# After development, to build:
# npx eas build --platform android
# npx eas build --platform ios

echo "✅ Setup complete! App should now run without TurboModuleRegistry errors."
