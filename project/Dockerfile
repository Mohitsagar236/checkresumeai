# CheckResumeAI - Node.js Multi-stage Build
# WARNING: This project is configured to use Nixpacks for Railway deployment
# This Dockerfile is provided as an alternative for Docker-based deployments

# Use Node.js 20 LTS for better compatibility
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Stage 1: Frontend Build
FROM base AS frontend-build

# Copy frontend package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Install ALL dependencies (including devDependencies for build)
RUN npm install --legacy-peer-deps

# Copy frontend source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build frontend
RUN npm run build:frontend

# Stage 2: Backend Build  
FROM base AS backend-build

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
COPY backend/tsconfig.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm install --legacy-peer-deps

# Copy backend source code
COPY backend/src/ ./src/

# Build backend TypeScript
RUN npm run build

# Stage 3: Production Runtime
FROM node:20-alpine AS production

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy backend package.json and install production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Copy built applications
COPY --from=backend-build --chown=nextjs:nodejs /app/backend/dist ./backend/dist
COPY --from=frontend-build --chown=nextjs:nodejs /app/frontend-build ./dist

# Create backend directory and copy env files if they exist
RUN mkdir -p ./backend/
# Create logs directory and set permissions
RUN mkdir -p ./logs && chown nextjs:nodejs ./logs

# Create required test directories for pdf-parse
RUN mkdir -p ./test/data && touch ./test/data/05-versions-space.pdf && chown -R nextjs:nodejs ./test

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const options = { hostname: 'localhost', port: 5000, path: '/api/health', timeout: 5000 }; const req = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); req.on('error', () => { process.exit(1); }); req.end();"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "backend/dist/server.js"]