# ════════════════════════════════════════════════
# Stage 1: Install dependencies & Build native modules
# ════════════════════════════════════════════════
FROM node:20-alpine AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ════════════════════════════════════════════════
# Stage 2: Build NestJS
# ════════════════════════════════════════════════
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
# Remove devDependencies to keep production node_modules slim
RUN npm prune --production

# ════════════════════════════════════════════════
# Stage 3: Production runner
# ════════════════════════════════════════════════
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

# Create data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 4000
CMD ["./docker-entrypoint.sh"]
