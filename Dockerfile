# AI Responsibility Checker - Frontend Dockerfile
#
# Multi-stage build for optimal production image size
# Development: Uses npm run dev with hot reloading
# Production: Uses npm run build && npm start

# ============================================
# Base stage - shared dependencies
# ============================================
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ============================================
# Development stage
# ============================================
FROM base AS development

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Run development server with hot reloading
CMD ["npm", "run", "dev"]

# ============================================
# Dependencies stage for production
# ============================================
FROM base AS deps

COPY package*.json ./
RUN npm ci --only=production

# ============================================
# Builder stage for production
# ============================================
FROM base AS builder

COPY package*.json ./
RUN npm ci

COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# ============================================
# Production runner stage
# ============================================
FROM base AS production

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public

# Set correct permissions for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build (requires output: 'standalone' in next.config.js)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
