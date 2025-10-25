#!/bin/bash

echo "🌙 Starting SomnoAI with tunnel mode..."
echo "📱 This will create a QR code for testing on your phone"
echo ""

# Kill any existing processes
pkill -f "expo start" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true

# Clear any existing cache
rm -rf .expo
rm -rf node_modules/.cache

echo "🔧 Installing required dependencies..."
npm install -g @expo/ngrok@4.1.0

echo ""
echo "🚀 Starting Expo with tunnel..."
echo "📱 Once started, scan the QR code with Expo Go app on your phone"
echo ""

# Start Expo with tunnel mode
npx expo start --tunnel --no-dev --minify
