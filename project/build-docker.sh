#!/bin/bash

# Docker Build Script for CheckResumeAI
# This script builds the Docker image with proper cache management

echo "🧹 Cleaning Docker build cache..."
docker builder prune -f

echo "🔨 Building CheckResumeAI Docker image..."
docker build --no-cache -t checkresumeai:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker build completed successfully!"
    echo "🚀 To run the container:"
    echo "   docker run -p 5000:5000 checkresumeai:latest"
    echo ""
    echo "🔍 To test the health endpoint:"
    echo "   curl http://localhost:5000/api/health"
else
    echo "❌ Docker build failed!"
    exit 1
fi
