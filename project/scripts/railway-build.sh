#!/bin/bash

# Railway build script for CheckResumeAI
# This script handles the build process for both frontend and backend

set -e  # Exit on any error

echo "🚀 Starting Railway build process..."

# Function to print colored output
print_status() {
    echo "✅ $1"
}

print_error() {
    echo "❌ $1"
}

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install

# Build frontend
print_status "Building frontend..."
npm run build:frontend

# Navigate to backend directory and build
print_status "Building backend..."
cd backend

# Install backend dependencies
print_status "Installing backend dependencies..."
npm install

# Build backend
print_status "Compiling TypeScript..."
npm run build

print_status "Build completed successfully!"

# Return to root directory
cd ..

print_status "✨ Railway build process complete!"
