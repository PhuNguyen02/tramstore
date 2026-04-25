# ════════════════════════════════════════════════
# Stage 1: Install dependencies
# ════════════════════════════════════════════════
FROM node:20-alpine AS deps
WORKDIR /app

# Install build deps for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --only=production

# Separate install for devDeps (needed for build)
COPY package*.json ./
RUN npm ci

# ════════════════════════════════════════════════
# Stage 2: Build
# ════════════════════════════════════════════════
FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS
RUN npm run build

# ════════════════════════════════════════════════
# Stage 3: Production runner
# ════════════════════════════════════════════════
FROM node:20-alpine AS runner
RUN apk add --no-cache python3 make g++

WORKDIR /app

ENV NODE_ENV=production

# Copy build output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

# Create data directory for SQLite (persistent volume mount point)
RUN mkdir -p /app/data

# Entrypoint script to run migrations + seed + start
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 4000

CMD ["./docker-entrypoint.sh"]
