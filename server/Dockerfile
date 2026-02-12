# -------- BUILD STAGE --------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy Prisma files first to generate the client
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npx prisma generate

COPY . .
RUN npm run build

# -------- RUNTIME STAGE --------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production


# Copy production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy build artifacts and Prisma configuration
COPY --from=builder /app/dist ./dist

COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npx prisma generate

# Ensure the 'node' user owns the app directory
RUN chown -R node:node /app
USER node

EXPOSE 3000


CMD ["node", "dist/index.js"]

