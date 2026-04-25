# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files (Context is root)
COPY backend/package*.json ./
RUN npm install

# Copy backend source
COPY backend/ .

# Copy mock data from frontend for seeding
COPY frontend/src/mock/data-product-mock.json ./prisma/seed-data/

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy built application and prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4000

# CMD to push DB schema, seed, and start
# Note: We keep all node_modules to ensure ts-node is available for seeding
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx prisma db seed && node dist/main"]
