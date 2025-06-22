#!/bin/bash

# CheckResumeAI Backend Deployment Script
# This script helps deploy the backend API server

set -e

echo "🚀 CheckResumeAI Backend Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        print_status "Node.js found: $NODE_VERSION"
        
        # Check if version is 18 or higher
        NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -c2- | cut -d. -f1)
        if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
            print_error "Node.js version 18+ required. Current version: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js not found. Please install Node.js 18+ first."
        exit 1
    fi
}

# Check if npm is available
check_npm() {
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        print_status "npm found: $NPM_VERSION"
    else
        print_error "npm not found. Please install npm first."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    if npm ci; then
        print_status "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Check environment variables
check_environment() {
    print_status "Checking environment configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            print_warning ".env file not found. Copying from .env.example"
            cp .env.example .env
            print_warning "Please update .env with your actual values before continuing"
            return 1
        else
            print_error ".env.example file not found"
            exit 1
        fi
    fi
    
    # Check required environment variables
    required_vars=("SUPABASE_URL" "SUPABASE_ANON_KEY" "JWT_SECRET" "OPENAI_API_KEY" "GROQ_API_KEY")
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" .env || grep -q "^$var=$" .env || grep -q "^$var=your-" .env; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing or incomplete environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_warning "Please update .env file with actual values"
        return 1
    fi
    
    print_status "Environment configuration looks good"
    return 0
}

# Build the project
build_project() {
    print_status "Building TypeScript project..."
    if npm run build; then
        print_status "Project built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p logs
    mkdir -p uploads
    print_status "Directories created"
}

# Start the server
start_server() {
    local mode=$1
    
    if [ "$mode" = "development" ]; then
        print_status "Starting development server..."
        npm run start:dev
    elif [ "$mode" = "production" ]; then
        print_status "Starting production server..."
        npm start
    else
        print_status "Starting server..."
        npm start
    fi
}

# Health check
health_check() {
    local port=${PORT:-5000}
    local max_attempts=30
    local attempt=1
    
    print_status "Performing health check..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://localhost:$port/api/v1/health" >/dev/null 2>&1; then
            print_status "Server is healthy and responding"
            return 0
        fi
        
        echo "Attempt $attempt/$max_attempts - waiting for server..."
        sleep 2
        ((attempt++))
    done
    
    print_error "Health check failed - server not responding"
    return 1
}

# Main deployment function
deploy() {
    local environment=${1:-production}
    
    echo "Environment: $environment"
    echo ""
    
    # Pre-deployment checks
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Check environment
    if ! check_environment; then
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled"
            exit 1
        fi
    fi
    
    # Build project
    build_project
    
    # Create directories
    create_directories
    
    print_status "Deployment preparation complete!"
    echo ""
    
    # Ask if user wants to start the server
    if [ "$environment" = "production" ]; then
        read -p "Start the production server now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            start_server production
        fi
    else
        read -p "Start the development server now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            start_server development
        fi
    fi
}

# Setup for development
setup_dev() {
    echo "🔧 Setting up development environment"
    echo "==================================="
    
    check_node
    check_npm
    install_dependencies
    
    if ! check_environment; then
        print_warning "Please update your .env file before starting development"
    fi
    
    create_directories
    
    print_status "Development setup complete!"
    print_status "Run 'npm run start:dev' to start the development server"
}

# Deployment functions

# Show usage
usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy [production|development]  Deploy the application (default: production)"
    echo "  dev                             Setup development environment"
    echo "  build                           Build the project only"
    echo "  health                          Check if server is running"
    echo "  help                            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy production            Deploy for production"
    echo "  $0 deploy development           Deploy for development"
    echo "  $0 dev                          Setup development environment"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        deploy "${2:-production}"
        ;;
    "dev")
        setup_dev
        ;;
    "build")
        check_node
        check_npm
        install_dependencies
        build_project
        ;;
    "health")
        health_check
        ;;
    "help"|"-h"|"--help")
        usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        usage
        exit 1
        ;;
esac
