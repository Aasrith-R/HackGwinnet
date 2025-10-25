#!/bin/bash

echo "🌙 Starting SomnoAI with tunnel mode..."
echo "📱 This will create a QR code for testing on your phone"
echo ""

# Install ngrok globally if not already installed
echo "🔧 Installing required dependencies..."
npm install -g @expo/ngrok@4.1.0

echo ""
echo "🚀 Starting Expo with tunnel..."
echo "📱 Once started, scan the QR code with Expo Go app on your phone"
echo ""

# Start Expo with tunnel mode
npx expo start --tunnel
