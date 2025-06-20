#!/bin/bash

# Automated Docker Build Fix Script
# This script resolves the persistent "deno cache" error by clearing the cache and rebuilding.

echo "🚀 Starting Automated Docker Build Fix..."
echo "========================================"

# Step 1: Forcefully remove all unused Docker data (images, containers, build cache)
# This is the most critical step to remove the bad cached layers.
echo "🔥 Step 1/2: Purging all Docker build cache and images..."
docker system prune -a -f

if [ $? -ne 0 ]; then
    echo "❌ Error: Docker prune command failed. Is Docker running?"
    exit 1
fi

echo "✅ Docker cache purged successfully."

# Step 2: Rebuild the Docker image from scratch using the correct Dockerfile
# The --no-cache flag is an extra guarantee that we use fresh layers.
echo "
🏗️ Step 2/2: Rebuilding the Docker image with a clean slate..."
docker build --no-cache -t checkresumeai:latest .

# Step 3: Final result
if [ $? -eq 0 ]; then
    echo "
🎉 SUCCESS! The Docker image has been rebuilt successfully."
    echo "The 'deno cache' error is now resolved."
    echo "
🚀 To run your application:"
    echo "   docker run -p 5000:5000 checkresumeai:latest"
else
    echo "
❌ FAILURE: The Docker build failed again."
    echo "Please check the output above for errors."
    echo "If the problem persists, consider using the recommended Nixpacks deployment for Railway."
    exit 1
fi
