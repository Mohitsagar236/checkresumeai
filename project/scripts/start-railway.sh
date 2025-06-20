#!/bin/bash

# Simple start script for Railway
echo "🚀 Starting CheckResumeAI backend..."

# Change to backend directory
cd backend

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Backend dist directory not found!"
    echo "📦 Installing dependencies and building..."
    npm install --legacy-peer-deps
    npm run build
fi

# Start the server
echo "✅ Starting Node.js server..."
node dist/server.js
