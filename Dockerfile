# --- Builder Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for build
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build
RUN npm prune --production

# --- Production Stage ---
FROM alpine:latest

WORKDIR /app

# Install Node.js runtime (no npm, no yarn)
RUN apk add --no-cache nodejs && \
    addgroup -S nodejs && adduser -S nodejs -G nodejs && \
    chown nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Copy built app and dependencies
COPY --chown=nodejs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist

# Copy env file
COPY --chown=nodejs:nodejs .env ./

# Expose app port
EXPOSE 3000

# Start app
CMD ["node", "dist/server.js"]

